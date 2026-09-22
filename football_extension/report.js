/**
 * report.js —— 把后端 /analysis/all 返回的分析结果渲染成 HTML
 *
 * 严格对照参考页 frontend/src/pages/detail/index.vue 的**顺序与样式**：
 *   1) remark 提示条（红底）
 *   2) 欧赔全网匹配结果 / 欧赔本联赛匹配结果 + 比分概率前三
 *   3) 亚盘初盘·即时盘提示条
 *   4) 亚盘全网匹配结果 / 亚盘本联赛匹配结果 + 比分概率前三
 *   5) 球队状态 → 让球推导表 → 让球平均表(table2) → 让球深浅判断（红字）
 *   6) 大小球初盘·即时盘提示条
 *   7) 泊松（全联赛分主客场）/ 泊松（近5场）两张表
 *   8) 大小球全网 / 大小球本联赛 / 进球区间全网
 *   9) 大小球比分概率前三 / 进球数概率前三 / 上半场进球数概率前三
 *  10) 球队总进球
 *
 * 关键样式：一组「胜/平/负」是 **一行三项文字 + 同一条堆叠条**（对应 detail 的
 * .flex-horizontal-1 三项 + 一个 echarts 堆叠条形图），不是三条独立的条。
 *
 * 取色与 detail 一致：
 *   文字行 .win_count/.even_count/.lose_count → #ff3200 / #99cc33 / #1890ff
 *   堆叠条 defineChartOption colors        → #ff5252 / #99cc33 / #1890ff
 *   进球区间 colors                        → #B8D3F5 / #66A8ED / #2670CC / #073778
 *   球队 主/客                            → #8B4513 / #FF1493
 */
(() => {
  // 文字行取色（detail .win_count / .even_count / .lose_count）
  const TEXT = ['#ff3200', '#99cc33', '#1890ff'];
  // 堆叠条取色（detail defineChartOption 的 colors）
  const BAR = ['#ff5252', '#99cc33', '#1890ff'];
  // 进球区间取色（detail chart_range_all 的 colors）
  const RANGE_BAR = ['#B8D3F5', '#66A8ED', '#2670CC', '#073778'];
  // 球队状态/球队总进球取色（主队 / 客队）
  const HOME = '#8B4513';
  const VISIT = '#FF1493';

  const H = (s) => String(s === null || s === undefined ? '' : s)
    .replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const V = (x) => (x === null || x === undefined || x === '' ? '-' : x);
  const has = (x) => x !== null && x !== undefined && x !== '';
  const num = (x) => (typeof x === 'number' && isFinite(x) ? x : (isFinite(Number(x)) ? Number(x) : 0));
  // 对应 detail 的 getDecimalPoint(value, 2)：两位小数但去掉末尾 0
  const dp = (n) => parseFloat(Number(n).toFixed(2));
  const pct = (n, total) => (total > 0 ? dp(n / total * 100) + '%' : '-');

  /* ------------------------------------------------------------------ *
   * 一组「胜/平/负」「赢/走/输」「大/走/小」
   * 一行三项文字 + 同一条堆叠条（对应 detail 的 .flex-horizontal-1 三项 + 堆叠条形图）
   * ------------------------------------------------------------------ */
  function countsPanel(title, items, emptyText) {
    const total = items.reduce((s, it) => s + num(it[1]), 0);
    if (!total) {
      return `<div class="fk500-panel">
                <div class="fk500-panel-title">${H(title)}</div>
                <div class="fk500-panel">${H(emptyText)}</div>
               </div>`;
    }

    const row = items.map((it, i) => `
      <div class="fk500-triple-item" style="color:${TEXT[i]}">
        ${H(it[0])}：${num(it[1])}场 <small>(${pct(num(it[1]), total)})</small>
      </div>`).join('');

    const seg = items.map((it, i) => {
      const w = num(it[1]) / total * 100;
      return `<span style="width:${w.toFixed(3)}%;background:${BAR[i]}" title="${H(it[0])}：${num(it[1])}场 ${pct(num(it[1]), total)}"></span>`;
    }).join('');

    return `<div class="fk500-panel">
      <div class="fk500-panel-title">${H(title)}</div>
      <div class="fk500-triple">${row}</div>
      <div class="fk500-stackbar">${seg}</div>
    </div>`;
  }

  /* 比分/进球数概率前三（detail 里是 panel 内的多行，score 用 #895b8a） */
  function topList(title, list, total) {
    if (!Array.isArray(list) || !list.length) return '';
    const rows = list.slice(0, 3)
      .map((it) => `<div><span class="fk500-key">${H(it[0])}</span>：${num(it[1])}场(${pct(num(it[1]), total)})</div>`)
      .join('');
    return `<div class="fk500-panel"><div class="fk500-panel-title">${H(title)}</div><div>${rows}</div></div>`;
  }

  /* 提示条（detail 的 van-notice-bar：蓝字浅蓝底） */
  function notice(text) {
    if (!text) return '';
    return `<div class="fk500-notice">${H(text)}</div>`;
  }

  /* ------------------------------------------------------------------ *
   * 进球区间全网匹配结果：两行各两项（对应 detail 的 2×2 布局）+ 同一条堆叠条
   * ------------------------------------------------------------------ */
  // 对应 index.vue::formatGoalRange
  function goalRange(goalNumberList) {
    const b = { '0-1': 0, '2-3': 0, '4-6': 0, '7+': 0 };
    (goalNumberList || []).forEach((it) => {
      const goals = Number(it[0]);
      const count = Number(it[1]) || 0;
      if (isNaN(goals)) return;
      if (goals <= 1) b['0-1'] += count;
      else if (goals <= 3) b['2-3'] += count;
      else if (goals <= 6) b['4-6'] += count;
      else b['7+'] += count;
    });
    return b;
  }

  function goalRangePanel(goalNumberList) {
    const b = goalRange(goalNumberList);
    const total = b['0-1'] + b['2-3'] + b['4-6'] + b['7+'];
    if (!total) return '';
    const keys = ['0-1', '2-3', '4-6', '7+'];
    const cell = (k, i) => `
      <div class="fk500-triple-item" style="color:${RANGE_BAR[i]}">
        ${H(k)}球：${b[k]}场 <small>(${pct(b[k], total)})</small>
      </div>`;
    const seg = keys.map((k, i) =>
      `<span style="width:${(b[k] / total * 100).toFixed(3)}%;background:${RANGE_BAR[i]}" title="${H(k)}球：${b[k]}场 ${pct(b[k], total)}"></span>`
    ).join('');

    return `<div class="fk500-panel">
      <div class="fk500-panel-title">进球区间全网匹配结果：</div>
      <div class="fk500-triple">${cell('0-1', 0)}${cell('2-3', 1)}</div>
      <div class="fk500-triple">${cell('4-6', 2)}${cell('7+', 3)}</div>
      <div class="fk500-stackbar">${seg}</div>
    </div>`;
  }

  /* ------------------------------------------------------------------ *
   * 让球推导：明细表 + 平均表（detail 的 vxe-table + table2）+ 深浅判断红字
   * ------------------------------------------------------------------ */
  function inferTable(d) {
    const list = d.infer_data;
    if (!Array.isArray(list) || !list.length) return '';
    const rows = list.map((row) => `
      <tr>
        <td>
          ${H(row.home_match_group)}<br>
          <span class="fk500-home">${H(row.home)}</span>&nbsp;&nbsp;vs&nbsp;&nbsp;${H(row.infer)}<br>
          比分：${H(row.home_field_score)}<br>
          让初：${H(row.home_concede_origin)}<br>
          让终：${H(row.home_concede_terminus)}
        </td>
        <td>
          ${H(row.visit_match_group)}<br>
          ${H(row.infer)}&nbsp;&nbsp;vs&nbsp;&nbsp;<span class="fk500-visit">${H(row.visit)}</span><br>
          比分：${H(row.visit_field_score)}<br>
          让初：${H(row.visit_concede_origin)}<br>
          让终：${H(row.visit_concede_terminus)}
        </td>
        <td>${H(row.origin_infer)}</td>
        <td>${H(row.instant_infer)}</td>
        <td>${H(row.home_concede_result)}${H(row.visit_concede_result)}</td>
      </tr>`).join('');

    const avg = [
      ['让初平均', d.home_concede_origin_average, d.visit_concede_origin_average],
      ['让终平均', d.home_concede_terminus_average, d.visit_concede_terminus_average],
      ['进球平均', d.home_goal_average, d.visit_goal_average],
      ['失球平均', d.home_loss_average, d.visit_loss_average],
      ['净胜球平均', d.home_gd_average, d.visit_gd_average],
      ['赢盘率', has(d.home_pan_percent) ? d.home_pan_percent + '%' : '-', has(d.visit_pan_percent) ? d.visit_pan_percent + '%' : '-'],
    ].map((r) => `<tr><td>${H(r[0])}</td><td>${H(V(r[1]))}</td><td>${H(V(r[2]))}</td></tr>`).join('');

    return `
      <div class="fk500-panel">
        <div class="fk500-scroll">
          <table class="fk500-table fk500-infer">
            <thead><tr><th>主队</th><th>客队</th><th>让初推导</th><th>让终推导</th><th>结果</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <table class="fk500-table2">
          <thead><tr><th>让球推导</th><th>主队</th><th>客队</th></tr></thead>
          <tbody>${avg}</tbody>
        </table>
      </div>`;
  }

  /* 让球深浅判断（照搬 index.vue 里那段 Math.abs 比较 + 比分均值计算），红字 */
  function concedeBlock(d) {
    const lines = [];
    const mk = (inferAvg, panMost, label, panLabel) => {
      if (!has(inferAvg) || !has(panMost)) return;
      const a = Math.abs(num(inferAvg));
      const b = Math.abs(num(panMost));
      const cmp = a < b ? '&lt;' : '&gt;';
      const diff = a - b;
      const extra = (diff < -0.5 ? `${label}偏深。` : '') + (diff > 0.5 ? `${label}偏浅。` : '');
      lines.push(`${label}推导平均值：${H(inferAvg)} ${cmp} 本场${panLabel}让球：${H(panMost)}，${extra}`);
    };
    mk(d.origin_infer_average, d.origin_pan_most, '让初', '初始');
    mk(d.instant_infer_average, d.instant_pan_most, '让终', '最终');
    if (has(d.infer_score)) lines.push(`比分均值计算：${H(d.infer_score)}`);
    if (!lines.length) return '';
    return `<div class="fk500-panel fk500-concede">${lines.join('<br>')}</div>`;
  }

  /* 泊松两张表（detail 的 .size-title + .table-1） */
  function poissonTable(title, small, big, sizeMost) {
    if (!has(small) && !has(big)) return '';
    const s = has(sizeMost) ? sizeMost : 2.5;
    return `
      <div class="fk500-size-title">${H(title)}</div>
      <table class="fk500-table1">
        <thead><tr><th>泊松${H(s)}小球概率</th><th>泊松${H(s)}大球概率</th></tr></thead>
        <tbody><tr><td>${H(V(small))}%</td><td>${H(V(big))}%</td></tr></tbody>
      </table>`;
  }

  /* ------------------------------------------------------------------ *
   * 球队状态 / 球队总进球（detail 的 chart_team_status / chart_total_goal）
   * 没有 echarts，用等高柱形对齐呈现
   * ------------------------------------------------------------------ */
  function barsRow(arr, color, label) {
    const vals = arr.map((v) => num(v));
    const max = Math.max.apply(null, vals.concat([0.5]));
    const bars = vals.map((v, i) => {
      const h = Math.max(2, (v === 0 ? 0.2 : v) / max * 40);
      return `<span class="fk500-status-bar" title="第${i + 1}场：${H(v)}" style="height:${h.toFixed(1)}px;background:${color}"></span>`;
    }).join('');
    return `<div class="fk500-status-row">
      <span class="fk500-status-label">${H(label)}</span>
      <div class="fk500-status-bars">${bars}</div>
    </div>`;
  }

  function teamStatus(d) {
    const home = d.home_status;
    const visit = d.visit_status;
    if (!Array.isArray(home) || !home.length || !Array.isArray(visit) || !visit.length) return '';
    return `<div class="fk500-panel">
      <div class="fk500-panel-title">球队状态</div>
      ${barsRow(home, HOME, '主队')}
      ${barsRow(visit, VISIT, '客队')}
    </div>`;
  }

  function totalGoal(d) {
    const home = d.home_total_goal;
    const visit = d.visit_total_goal;
    if (!Array.isArray(home) || !home.length || !Array.isArray(visit) || !visit.length) return '';
    return `<div class="fk500-panel">
      <div class="fk500-panel-title">球队总进球</div>
      ${barsRow(home, HOME, '主队')}
      ${barsRow(visit, VISIT, '客队')}
      <div class="fk500-muted">本场开盘：${H(V(d.instant_size_most))}</div>
    </div>`;
  }

  /* ------------------------------------------------------------------ *
   * 主渲染：顺序严格对照 index.vue 的模板
   * ------------------------------------------------------------------ */
  function render(d) {
    if (!d) return '<div class="fk500-empty">还没有分析结果</div>';

    const euAll = num(d.europe_win_all) + num(d.europe_even_all) + num(d.europe_lose_all);
    const euLg = num(d.europe_win_league) + num(d.europe_even_league) + num(d.europe_lose_league);
    const asAll = num(d.asia_win_all) + num(d.asia_run_all) + num(d.asia_lose_all);
    const asLg = num(d.asia_win_league) + num(d.asia_run_league) + num(d.asia_lose_league);
    const szAll = num(d.size_big_all) + num(d.size_run_all) + num(d.size_small_all);
    const szLg = num(d.size_big_league) + num(d.size_run_league) + num(d.size_small_league);

    return [
      // 1) remark 提示条（detail 顶部那张红条）
      // d.remark ? `<div class="fk500-remark">${H(d.remark)}</div>` : '',

      // 2) 欧赔：全网 / 本联赛 / 比分概率前三
      countsPanel('欧赔全网匹配结果：', [['胜', d.europe_win_all], ['平', d.europe_even_all], ['负', d.europe_lose_all]], '欧赔暂无匹配场次'),
      countsPanel('欧赔本联赛匹配结果：', [['胜', d.europe_win_league], ['平', d.europe_even_league], ['负', d.europe_lose_league]], '欧赔暂无匹配场次'),
      euAll ? topList('欧赔比分概率前三：', d.europe_score_list, euAll) : '',

      // 3) 亚盘初盘 / 即时盘 提示条
      has(d.origin_pan_most) && has(d.instant_pan_most)
        ? notice(`亚盘初盘：${V(d.origin_pan_most)}，亚盘即时盘：${V(d.instant_pan_most)}`)
        : '',

      // 4) 亚盘：全网 / 本联赛 / 比分概率前三
      countsPanel('亚盘全网匹配结果：', [['赢', d.asia_win_all], ['走', d.asia_run_all], ['输', d.asia_lose_all]], '亚盘暂无匹配场次'),
      countsPanel('亚盘本联赛匹配结果：', [['赢', d.asia_win_league], ['走', d.asia_run_league], ['输', d.asia_lose_league]], '亚盘暂无匹配场次'),
      asAll ? topList('亚盘比分概率前三：', d.asia_score_list, asAll) : '',

      // 5) 球队状态 → 让球推导 → 平均表 → 深浅判断
      // teamStatus(d),
      // inferTable(d),
      // concedeBlock(d),

      // 6) 大小球初盘 / 即时盘 提示条
      has(d.origin_size_most) && has(d.instant_size_most)
        ? notice(`大小球初盘：${V(d.origin_size_most)}，大小球即时盘：${V(d.instant_size_most)}`)
        : '',

      // 7) 泊松两张表
      // poissonTable('泊松分布全联赛分主客场计算大小球', d.poisson_small, d.poisson_big, d.instant_size_most),
      // poissonTable('泊松分布全联赛不分主客场取近5场计算大小球', d.poisson_small_limit, d.poisson_big_limit, d.instant_size_most),

      // 8) 大小球：全网 / 本联赛 / 进球区间
      countsPanel('大小球全网匹配结果：', [['大', d.size_big_all], ['走', d.size_run_all], ['小', d.size_small_all]], '大小球暂无匹配场次'),
      countsPanel('大小球本联赛匹配结果：', [['大', d.size_big_league], ['走', d.size_run_league], ['小', d.size_small_league]], '大小球暂无匹配场次'),
      szAll ? goalRangePanel(d.goal_number_list) : '',

      // 9) 大小球比分 / 进球数 / 上半场进球数 概率前三
      szAll ? topList('大小球比分概率前三：', d.size_score_list, szAll) : '',
      szAll ? topList('进球数概率前三：', d.goal_number_list, szAll) : '',
      szAll ? topList('上半场进球数概率前三：', d.half_goal_number_list, szAll) : '',

      // 10) 球队总进球
      // totalGoal(d),
    ].filter(Boolean).join('');
  }

  window.FK500_REPORT = { render };
})();
