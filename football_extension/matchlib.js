/**
 * matchlib.js —— utils/arithmetic.py::get_fundamentals 的浏览器端等价实现
 *
 * 前提：用户已打开 odds.500.com 的分析页，Cookie / 反爬挑战均已通过，
 *       content script 的同源 fetch 会自动带上用户会话，无需后端中转。
 *
 * 对应关系（Python -> JS）：
 *   get_fundamentals(fid)              -> window.FK500.getFundamentals(fid, opts)
 *   get_europe_odds(match)             -> getEuropeOdds(match)
 *   get_asia_odds(match, filter)       -> getAsiaOdds(match, opts)
 *   get_size_odds(match, filter)       -> getSizeOdds(match, opts)
 *   analysis_trend(str)                -> analysisTrend(str)
 *   get_size_trend_tr(str)             -> sizeTrendTr(str)
 *   safe_to_decimal / Decimal          -> cleanNum / toNum
 *
 * 输出：与 models/match.py 的 MatchItem 同名字段的普通对象，
 *       可直接 JSON.parse 后 MatchItem(**data) 使用。
 */
(() => {
  const T = window.FK500_TABLES;
  const BASE = 'https://odds.500.com/fenxi/';

  /* ---------------- 基础工具 ---------------- */

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function parseHTML(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  // 等价于 lxml 的 xpath(...)，返回节点数组
  function xp(doc, expr, ctx) {
    const snap = doc.evaluate(expr, ctx || doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const out = [];
    for (let i = 0; i < snap.snapshotLength; i++) out.push(snap.snapshotItem(i));
    return out;
  }

  // 等价于 xpath("//x/text()")[0]（取第一个文本节点），没有则 null
  function xpText(doc, expr, ctx) {
    const nodes = xp(doc, expr, ctx);
    return nodes.length ? nodes[0].nodeValue : null;
  }

  // 等价于 xpath("//x/@attr")[0]
  function xpAttr(doc, expr, ctx) {
    const nodes = xp(doc, expr, ctx);
    return nodes.length ? nodes[0].nodeValue : null;
  }

  // 等价于 safe_to_decimal：清洗成数字，失败返回 ""
  function cleanNum(value) {
    if (value === null || value === undefined) return "";
    const cleaned = String(value).replace(/[^\d.]/g, "");
    if (!cleaned) return "";
    const n = parseFloat(cleaned);
    return isNaN(n) ? "" : n;
  }

  // 等价于 float(x.strip())，失败返回 null
  function toNum(value) {
    if (value === null || value === undefined) return null;
    const n = parseFloat(String(value).trim());
    return isNaN(n) ? null : n;
  }

  const pad2 = (n) => String(n).padStart(2, '0');
  const fmtDT = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

  // 等价于 datetime.strptime(s, "%Y-%m-%d %H:%M")
  function parseMatchTime(s) {
    const m = /(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{1,2})/.exec(String(s || ''));
    return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : null;
  }

  // 等价于 datetime.strptime(f"{year}-{td}", "%Y-%m-%d %H:%M")，td 形如 "09-15 23:10"
  function parseTrendTime(year, td) {
    const m = /^\s*(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2})/.exec(String(td || ''));
    return m ? new Date(year, +m[1] - 1, +m[2], +m[3], +m[4]) : null;
  }

  /* ---------------- 页面抓取 ---------------- */

  // 抓 GB2312 页面并解析为 document。Python 端是 response.encoding="gb2312"
  async function fetchPageDoc(page) {
    const res = await fetch(BASE + page, { credentials: 'include' });
    if (!res.ok) throw new Error(`抓取 ${page} 失败：HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    let text = new TextDecoder('gbk').decode(buf);
    if (text.indexOf('\uFFFD') >= 0) text = new TextDecoder('utf-8').decode(buf); // 兜底
    return parseHTML(text);
  }

  // 抓走势 ajax（fenxi1/inc/*.php），返回数组；两次失败返回 null
  async function fetchTrend(url) {
    for (let i = 0; i < 2; i++) {
      try {
        const res = await fetch(url, {
          credentials: 'include',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json, text/javascript, */*' },
        });
        const buf = await res.arrayBuffer();
        let text = new TextDecoder('utf-8').decode(buf);
        if (text.indexOf('\uFFFD') >= 0) text = new TextDecoder('gbk').decode(buf);
        const arr = JSON.parse(text);
        if (Array.isArray(arr)) return arr;
      } catch (e) { /* 对应 Python 的重试一次 */ }
    }
    return null;
  }

  /* ---------------- MatchItem 骨架 ---------------- */

  // 与 models/match.py::MatchItem 中 get_fundamentals 会赋值的字段一一对应
  function newMatchItem(fid) {
    return {
      fid: String(fid),
      match_url: BASE + `shuju-${fid}.shtml`,
      match_group: null,
      match_type: null,
      match_category: null,
      match_round: null,
      match_time: null,
      match_status: null,
      home_team: null,
      home_team_rank: null,
      home_score: null,
      visit_team: null,
      visit_team_rank: null,
      visit_score: null,
      team_count: null,
      field_score: null,
      europe_odds_items: [],
      asia_odds_items: [],
      size_odds_items: [],
      origin_pan_most: null,
      origin_pan_home_map: {},
      origin_pan_visit_map: {},
      instant_pan_most: null,
      instant_pan_home_map: {},
      instant_pan_visit_map: {},
      origin_size_most: null,
      origin_size_big_map: {},
      origin_size_small_map: {},
      instant_size_most: null,
      instant_size_big_map: {},
      instant_size_small_map: {},
      asia_odds_trend: {},
      size_odds_trend: {},
      filter_no_asia_trend: null,
      filter_no_size_trend: null
    };
  }

  /* ---------------- analysis_trend / get_size_trend_tr ---------------- */

  // arithmetic.py::analysis_trend（亚盘走势行）
  function analysisTrend(trendStr) {
    const doc = parseHTML('<table>' + String(trendStr) + '</table>');
    const first = xpText(doc, '//td[1]/text()');
    const firstStatus = (xpAttr(doc, '//td[1]/@class') || '').replace('tips_', '');
    let secondRaw = xpText(doc, '//td[2]/text()');
    const third = xpText(doc, '//td[3]/text()');
    const thirdStatus = (xpAttr(doc, '//td[3]/@class') || '').replace('tips_', '');
    const fourth = xpText(doc, '//td[4]/text()');

    let second = null;
    if (secondRaw !== null) {
      const isGive = secondRaw.indexOf('受') >= 0;
      secondRaw = secondRaw.replace(/受/g, '').replace(/[\x00-\x1F\x7F-\x9F\xA0]/g, '');
      const v = T.goal_lst[secondRaw];
      if (v !== undefined) second = isGive ? v : -v; // Python 未命中会 KeyError，这里宽松处理为 null
    }
    return { first, firstStatus, second, third, thirdStatus, fourth };
  }

  // arithmetic.py::get_size_trend_tr（大小球走势行）
  function sizeTrendTr(trendStr) {
    const doc = parseHTML('<table>' + String(trendStr) + '</table>');
    const first = xpText(doc, '//td[1]/text()');
    const firstStatus = ((xpAttr(doc, '//td[1]/@class') || '').trim()).replace('tips_', '');
    let secondRaw = xpText(doc, '//td[2]/text()');
    const third = xpText(doc, '//td[3]/text()');
    const thirdStatus = ((xpAttr(doc, '//td[3]/@class') || '').trim()).replace('tips_', '');
    const fourth = xpText(doc, '//td[4]/text()');

    let second = null;
    if (secondRaw !== null) {
      if (secondRaw.indexOf('/') >= 0) {
        const head = parseFloat(secondRaw.split('/')[0]);
        second = isNaN(head) ? null : head + 0.25;
      } else {
        second = toNum(secondRaw);
      }
    }
    return { first, firstStatus, second, third, thirdStatus, fourth };
  }

  /* ---------------- get_fundamentals 主体（数据 页） ---------------- */
  function parseFundamentals(doc, match) {
    const match_group = xpText(doc, "//div[@class='odds_header']//table//tr/td[3]//a[@class='hd_name']/text()");
    if (match_group) {
      match.match_group = match_group.trim();
      const typeRe = /(.*?)(第\d+轮|第.*?圈|分组赛|小组赛|资格赛|半.*?决赛|决赛|十六强|八强|季军赛|外.*?赛|排名|升|降|春|秋|16强|附加赛|欧会杯资格附加.*?赛|[A-F]联赛|1\/\d+决赛|中级锦标赛|\d+月赛程.*?|赛事|优选赛)/;
      const catRe = /\d+[/\-]?\d+(.*?)(第\d+轮|第.*?圈|分组赛|小组赛|资格赛|半.*?决赛|决赛|十六强|八强|季军赛|外.*?赛|排名|升|降|春|秋|16强|附加赛|欧会杯资格附加.*?赛|[A-F]联赛|1\/\d+决赛|中级锦标赛|\d+月赛程.*?|赛事|优选赛)/;
      const mt = typeRe.exec(match.match_group);
      const mc = catRe.exec(match.match_group);
      const mr = /第(\d+)轮/.exec(match.match_group);
      match.match_type = mt ? mt[1] : match.match_group;
      match.match_category = mc ? mc[1] : match.match_group.replace(/^\d+(?:\/\d+)?/, '');
      if (mr) match.match_round = parseInt(mr[1], 10);
    }

    const home_team = xpText(doc, "//div[@class='odds_header']//table//tr/td[1]/ul/li/a/text()");
    if (home_team) match.home_team = home_team;
    const visit_team = xpText(doc, "//div[@class='odds_header']//table//tr/td[5]/ul/li/a/text()");
    if (visit_team) match.visit_team = visit_team;

    const home_rank = xpText(doc, "//div[@class='odds_header']/div[@class='odds_hd_cont']/table/tbody/tr/td[1]/ul/li[2]/span[@class='red']/text()");
    match.home_team_rank = home_rank ? parseInt(home_rank, 10) || 0 : 0;
    const visit_rank = xpText(doc, "//div[@class='odds_header']/div[@class='odds_hd_cont']/table/tbody/tr/td[5]/ul/li[2]/span[@class='red']/text()");
    match.visit_team_rank = visit_rank ? parseInt(visit_rank, 10) || 0 : 0;

    const field_score = xpText(doc, "//div[@class='odds_header']/div[@class='odds_hd_cont']/table/tbody/tr/td[3]/div/p[@class='odds_hd_bf']/strong/text()");
    if (field_score) match.field_score = field_score;

    // 积分榜取两队积分（浏览器会把 table>tr 规整为 table>tbody>tr，故用 //tr）
    const scoreTable = xp(doc, "//div[@id='nav_jifen']//tr[position()<last()]");
    if (scoreTable.length > 0 && match.home_team_rank && match.visit_team_rank) {
      match.team_count = scoreTable.length;
      for (const tr of scoreTable) {
        const trClass = tr.getAttribute('class') || '';
        if (trClass.indexOf('jfb_this') < 0) continue;
        const rankTd = xpText(doc, './td[1]/text()', tr);
        const teamTd = xpText(doc, './td[2]/a/text()', tr);
        if (!rankTd || !teamTd) continue;
        const rank = parseInt(rankTd.trim(), 10);
        if (rank === match.home_team_rank || teamTd === match.home_team) {
          const s = xpText(doc, './td[3]/text()', tr);
          match.home_score = parseInt(s, 10);
        } else if (rank === match.visit_team_rank || teamTd === match.visit_team) {
          const s = xpText(doc, './td[3]/text()', tr);
          match.visit_score = parseInt(s, 10);
        }
        if (match.home_score !== null && match.visit_score !== null) break;
      }
    }

    const match_time = xpText(doc, "//div[@class='odds_header']/div[@class='odds_hd_cont']/table/tbody/tr/td[3]/div/p[1]/text()");
    if (match_time) match.match_time = match_time.replace('比赛时间', '').trim();
  }

  /* ---------------- get_europe_odds（欧赔 页） ---------------- */
  async function getEuropeOdds(match, onProgress) {
    onProgress && onProgress(`抓取欧赔页 ouzhi-${match.fid}.shtml …`);
    const doc = await fetchPageDoc(`ouzhi-${match.fid}.shtml`);
    const trs = xp(doc, "//table[@id='datatb']//tr[@ttl='zy']");
    const items = [];
    for (const tr of trs) {
      const cid = xpAttr(doc, './@id', tr);
      if (!cid) continue;
      const company = T.company_dict[cid];
      if (!company || !T.europe_map[company]) continue;

      const pick = (expr) => {
        const v = xpText(doc, expr, tr);
        return v === null ? null : toNum(v);
      };
      const pickRate = (expr) => {
        const v = xpText(doc, expr, tr);
        return v === null ? null : toNum(String(v).replace('%', ''));
      };

      items.push({
        cid,
        company_zh: company,
        company_en: T.europe_map[company],
        origin_win_odds: pick('./td[3]/table/tbody/tr[1]/td[1]/text()'),
        origin_even_odds: pick('./td[3]/table/tbody/tr[1]/td[2]/text()'),
        origin_lose_odds: pick('./td[3]/table/tbody/tr[1]/td[3]/text()'),
        origin_win_kelly: pick('./td[6]/table/tbody/tr[1]/td[1]/text()'),
        origin_even_kelly: pick('./td[6]/table/tbody/tr[1]/td[2]/text()'),
        origin_lose_kelly: pick('./td[6]/table/tbody/tr[1]/td[3]/text()'),
        origin_return_rate: pickRate('./td[5]/table/tbody/tr[1]/td/text()'),
        instant_win_odds: pick('./td[3]/table/tbody/tr[2]/td[1]/text()'),
        instant_even_odds: pick('./td[3]/table/tbody/tr[2]/td[2]/text()'),
        instant_lose_odds: pick('./td[3]/table/tbody/tr[2]/td[3]/text()'),
        instant_win_kelly: pick('./td[6]/table/tbody/tr[2]/td[1]/text()'),
        instant_even_kelly: pick('./td[6]/table/tbody/tr[2]/td[2]/text()'),
        instant_lose_kelly: pick('./td[6]/table/tbody/tr[2]/td[3]/text()'),
        instant_return_rate: pickRate('./td[5]/table/tbody/tr[2]/td/text()')
      });
    }
    match.europe_odds_items = items;
    return match;
  }

  /* ---------------- get_asia_odds（亚盘 页 + 走势） ---------------- */
  async function getAsiaOdds(match, opts, onProgress) {
    const filterNoTrend = opts.filter_no_asia_trend || 0;
    const sleepMs = opts.sleep_ms || 400;
    onProgress && onProgress(`抓取亚盘页 yazhi-${match.fid}.shtml …`);
    const doc = await fetchPageDoc(`yazhi-${match.fid}.shtml`);

    // Python: //div[@id='table_cont']/table/tr ；浏览器解析会自动补 tbody
    const trs = xp(doc, "//div[@id='table_cont']/table/tbody/tr");
    const items = [];
    const panMaps = {
      origin: {}, instant: {},
      originHome: {}, originVisit: {}, instantHome: {}, instantVisit: {}
    };
    const matchTime = parseMatchTime(match.match_time);
    const now = new Date();
    const year = now.getFullYear();

    const addCount = (m, k) => { m[k] = (m[k] || 0) + 1; };
    const addList = (m, k, v) => { if (m[k]) m[k].push(v); else m[k] = [v]; };
    const normKey = (k) => (Number.isInteger(k) ? k : k);

    let idx = 0;
    for (const tr of trs) {
      idx += 1;
      const cid = xpAttr(doc, './@id', tr);
      if (!cid) continue;
      const company = T.company_dict[cid];
      if (!company || !T.asia_map[company]) continue;

      let origin_odds = toNum(xpAttr(doc, "./td[position()=5]/table/tbody/tr/td[2]/@ref", tr));
      if (origin_odds !== null && origin_odds !== 0) {
        const panText = xpText(doc, "./td[5]/table//tr/td[2]/text()", tr);
        if (panText !== null && T.boll_map[panText] !== undefined && origin_odds !== T.boll_map[panText]) {
          origin_odds = T.boll_map[panText];
        }
      }
      const homeRaw = xpText(doc, "./td[position()=5]/table/tbody/tr/td[1]/text()", tr);
      if (homeRaw === null || homeRaw.trim() === '') continue;
      const origin_odds_home = cleanNum(homeRaw);
      const visitRaw = xpText(doc, "./td[position()=5]/table/tbody/tr/td[3]/text()", tr);
      if (visitRaw === null || visitRaw.trim() === '') continue;
      const origin_odds_visit = cleanNum(visitRaw);

      let instant_odds = toNum(xpAttr(doc, "./td[position()=3]/table/tbody/tr/td[2]/@ref", tr));
      if (instant_odds !== null && instant_odds !== 0) {
        const panText = xpText(doc, "./td[3]/table//tr/td[2]/text()", tr);
        if (panText !== null && T.boll_map[panText] !== undefined && instant_odds !== T.boll_map[panText]) {
          instant_odds = T.boll_map[panText];
        }
      }
      const iHomeRaw = xpText(doc, "./td[position()=3]/table/tbody/tr/td[1]/text()", tr);
      if (iHomeRaw === null || iHomeRaw.trim() === '') continue;
      let instant_odds_home_state = '';
      if (iHomeRaw.indexOf('↑') >= 0) instant_odds_home_state = 'up';
      else if (iHomeRaw.indexOf('↓') >= 0) instant_odds_home_state = 'down';
      const instant_odds_home = cleanNum(iHomeRaw);
      if (instant_odds_home === '') continue;

      const iVisitRaw = xpText(doc, "./td[position()=3]/table/tbody/tr/td[3]/text()", tr);
      if (iVisitRaw === null || iVisitRaw === '') continue;
      let instant_odds_visit_state = '';
      if (iVisitRaw.indexOf('↑') >= 0) instant_odds_visit_state = 'up';
      else if (iVisitRaw.indexOf('↓') >= 0) instant_odds_visit_state = 'down';
      const instant_odds_visit = cleanNum(iVisitRaw);
      if (instant_odds_visit === '') continue;

      // 统计（与 Python 一致：在走势判断 continue 之前就已更新）
      if (origin_odds !== null && origin_odds !== '') {
        addCount(panMaps.origin, origin_odds);
        addList(panMaps.originHome, origin_odds, origin_odds_home);
        addList(panMaps.originVisit, origin_odds, origin_odds_visit);
      }
      if (instant_odds !== null && instant_odds !== '') {
        addCount(panMaps.instant, instant_odds);
        addList(panMaps.instantHome, instant_odds, instant_odds_home);
        addList(panMaps.instantVisit, instant_odds, instant_odds_visit);
      }

      const item = {
        cid,
        company_zh: company,
        company_en: T.asia_map[company],
        origin_odds,
        origin_odds_home,
        origin_odds_visit,
        instant_odds,
        instant_odds_home,
        instant_odds_home_state,
        instant_odds_visit,
        instant_odds_visit_state
      };

      // 走势 ajax（对应 yazhiajax.php）
      onProgress && onProgress(`亚盘走势 ${idx}/${trs.length}：${company} …`);
      const trendUrl = `https://odds.500.com/fenxi1/inc/yazhiajax.php?fid=${match.fid}&id=${cid}&t=${Date.now()}&r=1`;
      const trendArr = await fetchTrend(trendUrl);

      if (!Array.isArray(trendArr) && filterNoTrend === 1) continue;
      if (Array.isArray(trendArr)) {
        if (trendArr.length < 3) continue;
        const t = analysisTrend(trendArr[0]);
        let timeObj = parseTrendTime(year, t.fourth);
        if (timeObj && matchTime) {
          if (matchTime.getMonth() === 0 && timeObj.getMonth() >= 10) {
            timeObj = new Date(timeObj.getFullYear() - 1, timeObj.getMonth(), timeObj.getDate(), timeObj.getHours(), timeObj.getMinutes());
          }
          const diffMin = (matchTime - timeObj) / 60000;
          const secondsToStart = (matchTime - new Date()) / 1000;
          if (diffMin > 180 && timeObj < matchTime && secondsToStart < 30) continue;
        }
      }

      items.push(item);

      const trendLst = [];
      if (Array.isArray(trendArr)) {
        for (const trendStr of trendArr.slice().reverse()) {
          const t = analysisTrend(trendStr);
          let timeObj = parseTrendTime(year, t.fourth);
          if (!timeObj || timeObj > new Date()) continue;
          const last = trendLst.length ? trendLst[trendLst.length - 1] : null;
          if (last && last.full_time && fmtDT(timeObj) < last.full_time) {
            timeObj = new Date(timeObj.getFullYear() + 1, timeObj.getMonth(), timeObj.getDate(), timeObj.getHours(), timeObj.getMinutes());
          }
          trendLst.push({
            cid,
            company_zh: company,
            company_en: T.asia_map[company],
            origin_odds: origin_odds === '' ? origin_odds : Number(origin_odds),
            origin_odds_home: origin_odds_home === '' ? origin_odds_home : Number(origin_odds_home),
            origin_odds_visit: origin_odds_visit === '' ? origin_odds_visit : Number(origin_odds_visit),
            current_odds: t.second,
            current_odds_home: toNum(t.first),
            current_odds_home_state: t.firstStatus,
            current_odds_visit: toNum(t.third),
            current_odds_visit_state: t.thirdStatus,
            current_time: t.fourth,
            full_time: fmtDT(timeObj)
          });
        }
      }
      match.asia_odds_trend[company] = trendLst;

      const found = items.find((o) => o.company_zh === company);
      if (found && trendLst.length > 0) {
        const lastOdds = trendLst[trendLst.length - 1];
        if (lastOdds.current_odds_home === found.instant_odds_home
          && lastOdds.current_odds_visit === found.instant_odds_visit
          && (lastOdds.current_odds_home_state !== found.instant_odds_home_state
            || lastOdds.current_odds_visit_state !== found.instant_odds_visit_state)) {
          found.instant_odds_home_state = lastOdds.current_odds_home_state;
          found.instant_odds_visit_state = lastOdds.current_odds_visit_state;
        }
      }

      await sleep(sleepMs); // 对应 time.sleep(SLEEP_TIME)
    }

    match.asia_odds_items = items;

    const most = (m) => {
      const arr = Object.entries(m).sort((a, b) => b[1] - a[1]);
      return arr.length ? Number(arr[0][0]) : null;
    };
    match.origin_pan_most = most(panMaps.origin);
    match.instant_pan_most = most(panMaps.instant);
    match.origin_pan_home_map = normMap(panMaps.originHome);
    match.origin_pan_visit_map = normMap(panMaps.originVisit);
    match.instant_pan_home_map = normMap(panMaps.instantHome);
    match.instant_pan_visit_map = normMap(panMaps.instantVisit);
    match.filter_no_asia_trend = filterNoTrend;
    return match;
  }

  /* ---------------- get_size_odds（大小球 页 + 走势） ---------------- */
  async function getSizeOdds(match, opts, onProgress) {
    const filterNoTrend = opts.filter_no_size_trend || 0;
    const sleepMs = opts.sleep_ms || 400;
    onProgress && onProgress(`抓取大小球页 daxiao-${match.fid}.shtml …`);
    const doc = await fetchPageDoc(`daxiao-${match.fid}.shtml`);

    const trs = xp(doc, "//table[@id='datatb']/tbody/tr");
    const items = [];
    const maps = {
      origin: {}, instant: {},
      originBig: {}, originSmall: {}, instantBig: {}, instantSmall: {}
    };
    const matchTime = parseMatchTime(match.match_time);
    const year = new Date().getFullYear();

    const addCount = (m, k) => { m[k] = (m[k] || 0) + 1; };
    const addList = (m, k, v) => { if (m[k]) m[k].push(v); else m[k] = [v]; };

    let idx = 0;
    for (const tr of trs) {
      idx += 1;
      const cid = xpAttr(doc, './@id', tr);
      if (!cid) continue;
      const company = T.company_dict[cid];
      if (!company || !T.asia_map[company]) continue;

      const originRef = toNum(xpAttr(doc, "./td[position()=5]/table/tbody/tr/td[2]/@ref", tr));
      const origin_size = originRef === null ? null : Math.abs(originRef);
      const oBigRaw = xpText(doc, "./td[position()=5]/table/tbody/tr/td[1]/text()", tr);
      if (oBigRaw === null || oBigRaw.trim() === '') continue;
      const origin_odds_big = cleanNum(oBigRaw);
      const oSmallRaw = xpText(doc, "./td[position()=5]/table/tbody/tr/td[3]/text()", tr);
      if (oSmallRaw === null || oSmallRaw.trim() === '') continue;
      const origin_odds_small = cleanNum(oSmallRaw);

      const instantRef = toNum(xpAttr(doc, "./td[position()=3]/table/tbody/tr/td[2]/@ref", tr));
      const instant_size = instantRef === null ? null : Math.abs(instantRef);
      const iBigRaw = xpText(doc, "./td[position()=3]/table/tbody/tr/td[1]/text()", tr);
      if (iBigRaw === null || iBigRaw.trim() === '') continue;
      let instant_odds_big_state = '';
      if (iBigRaw.indexOf('↑') >= 0) {
        instant_odds_big_state = 'up';
        if (iBigRaw.replace('↑', '').trim() === '') continue; // 纯箭头，与 Python 一致
      } else if (iBigRaw.indexOf('↓') >= 0) {
        instant_odds_big_state = 'down';
        if (iBigRaw.replace('↓', '').trim() === '') continue;
      }
      const instant_odds_big = cleanNum(iBigRaw);
      if (instant_odds_big === '') continue;
      const iSmallRaw = xpText(doc, "./td[position()=3]/table/tbody/tr/td[3]/text()", tr);
      if (iSmallRaw === null || iSmallRaw.trim() === '') continue;
      let instant_odds_small_state = '';
      if (iSmallRaw.indexOf('↑') >= 0) instant_odds_small_state = 'up';
      else if (iSmallRaw.indexOf('↓') >= 0) instant_odds_small_state = 'down';
      const instant_odds_small = cleanNum(iSmallRaw);

      if (origin_size !== null) {
        addCount(maps.origin, origin_size);
        addList(maps.originBig, origin_size, origin_odds_big);
        addList(maps.originSmall, origin_size, origin_odds_small);
      }
      if (instant_size !== null) {
        addCount(maps.instant, instant_size);
        addList(maps.instantBig, instant_size, instant_odds_big);
        addList(maps.instantSmall, instant_size, instant_odds_small);
      }

      const item = {
        cid,
        company_zh: company,
        company_en: T.asia_map[company],
        origin_size,
        origin_odds_big,
        origin_odds_small,
        instant_size,
        instant_odds_big,
        instant_odds_small,
        instant_size_odds_big_state: instant_odds_big_state,
        instant_size_odds_small_state: instant_odds_small_state
      };

      onProgress && onProgress(`大小球走势 ${idx}/${trs.length}：${company} …`);
      const trendUrl = `https://odds.500.com/fenxi1/inc/daxiaoajax.php?fid=${match.fid}&id=${cid}&t=${Date.now()}`;
      const trendArr = await fetchTrend(trendUrl);

      if (!Array.isArray(trendArr) && filterNoTrend === 1) continue;
      if (Array.isArray(trendArr)) {
        if (trendArr.length < 3) continue;
        const t = sizeTrendTr(trendArr[0]);
        let timeObj = parseTrendTime(year, t.fourth);
        if (timeObj && matchTime) {
          if (matchTime.getMonth() === 0 && matchTime.getDate() === 1 && timeObj.getMonth() === 11) {
            timeObj = new Date(timeObj.getFullYear() - 1, timeObj.getMonth(), timeObj.getDate(), timeObj.getHours(), timeObj.getMinutes());
          }
          const diffMin = (matchTime - timeObj) / 60000;
          const secondsToStart = (matchTime - new Date()) / 1000;
          if (diffMin > 180 && timeObj < matchTime && secondsToStart < 30) continue;
        }
      }

      items.push(item);

      const trendLst = [];
      if (Array.isArray(trendArr)) {
        for (const trendStr of trendArr.slice().reverse()) {
          const t = sizeTrendTr(trendStr);
          trendLst.push({
            cid,
            company_zh: company,
            company_en: T.asia_map[company],
            origin_size: origin_size === null ? null : Number(origin_size),
            origin_size_big: origin_odds_big === '' ? origin_odds_big : Number(origin_odds_big),
            origin_size_small: origin_odds_small === '' ? origin_odds_small : Number(origin_odds_small),
            current_size: t.second,
            current_size_big: toNum(t.first),
            current_size_big_state: t.firstStatus,
            current_size_small: toNum(t.third),
            current_size_small_state: t.thirdStatus,
            current_time: t.fourth
          });
        }
      }
      match.size_odds_trend[company] = trendLst;

      const found = items.find((o) => o.company_zh === company);
      if (found && trendLst.length > 0) {
        const lastOdds = trendLst[trendLst.length - 1];
        if (lastOdds.current_size_big === found.instant_odds_big
          && lastOdds.current_size_small === found.instant_odds_small
          && (lastOdds.current_size_big_state !== found.instant_size_odds_big_state
            || lastOdds.current_size_small_state !== found.instant_size_odds_small_state)) {
          found.instant_size_odds_big_state = lastOdds.current_size_big_state;
          found.instant_size_odds_small_state = lastOdds.current_size_small_state;
        }
      }

      await sleep(sleepMs);
    }

    match.size_odds_items = items;

    const most = (m) => {
      const arr = Object.entries(m).sort((a, b) => b[1] - a[1]);
      return arr.length ? Number(arr[0][0]) : null;
    };
    match.origin_size_most = most(maps.origin);
    match.instant_size_most = most(maps.instant);
    match.origin_size_big_map = normMap(maps.originBig);
    match.origin_size_small_map = normMap(maps.originSmall);
    match.instant_size_big_map = normMap(maps.instantBig);
    match.instant_size_small_map = normMap(maps.instantSmall);
    match.filter_no_size_trend = filterNoTrend;
    return match;
  }

  // Python: {int(key) if float(key).is_integer() else float(key): value}
  function normMap(m) {
    const out = {};
    for (const [k, v] of Object.entries(m)) out[String(Number(k))] = v;
    return out;
  }

  /* ---------------- 入口 ---------------- */
  async function getFundamentals(fid, opts = {}, onProgress) {
    const match = newMatchItem(fid);
    onProgress && onProgress(`抓取数据页 shuju-${fid}.shtml …`);
    const doc = await fetchPageDoc(`shuju-${fid}.shtml`);
    parseFundamentals(doc, match);
    await getEuropeOdds(match, onProgress);
    onProgress && onProgress(`欧赔完成：${match.europe_odds_items.length} 家`);
    await getAsiaOdds(match, opts, onProgress);
    onProgress && onProgress(`亚盘完成：${match.asia_odds_items.length} 家`);
    await getSizeOdds(match, opts, onProgress);
    onProgress && onProgress(`大小球完成：${match.size_odds_items.length} 家`);
    return match;
  }

  window.FK500 = { getFundamentals };
})();
