/**
 * content.js —— 在 odds.500.com 页面上注入「获取基本面」按钮 + 结果面板
 */
(() => {
  if (window.__fk500Injected) return;
  window.__fk500Injected = true;
  const API_BASE = 'http://117.72.172.8:10008';
  const DEFAULT_OPTIONS = {
    europe_companies: [],
    asia_companies: [],
    size_companies: [],
    asia_compose_size: 0,
    size_compose_asia: 0,
    asia_nonMainstream: 1,
    size_nonMainstream: 1,
    no_friend_match: 1,
    asia_filter_odds: 1,
    size_filter_odds: 1,
    only_main_match: 0,
  };
  const OPTION_DEFS = [
    ['asia_nonMainstream', '剔除亚盘非主流公司'],
    ['size_nonMainstream', '剔除大小球非主流公司'],
    ['no_friend_match', '不匹配友谊赛'],
    ['asia_filter_odds', '亚盘剔除不正常水位'],
    ['size_filter_odds', '大小球剔除不正常水位'],
    ['asia_compose_size', '亚盘 & 大小球取交集'],
    ['size_compose_asia', '大小球 & 亚盘取交集'],
    ['only_main_match', '只匹配主流联赛'],
  ];

  // 工具栏勾选项的默认值（fna/fns 对应抓取时的走势剔除，auto = 获取后自动分析）
  const TOOLBAR_FLAGS = { fna: 0, fns: 0, autoAnalyze: 1 };

  /* ------------------------------------------------------------------ *
   * 持久化：localStorage
   * key 统一加 fk500: 前缀，避免和 odds.500.com 自身的存储打架；
   * 所有读写都包 try/catch（隐私模式 / 禁用存储时 localStorage 会抛异常）。
   * ------------------------------------------------------------------ */
  const LS_OPTS = 'fk500:analyzeOptions:v1';
  const LS_TOOL = 'fk500:toolbarFlags:v1';

  function lsGet(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function lsSet(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
      return true;
    } catch (e) {
      return false;
    }
  }

  function lsDel(key) {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }

  // 用 defs 的键做白名单 + 0/1 归一化：未知键丢弃，缺失键回落默认值
  // （后续给 DEFAULT_OPTIONS / TOOLBAR_FLAGS 新增选项时，老数据不会把它冲掉）
  function normalizeFlags(saved, defs) {
    const out = { ...defs };
    const src = saved || {};
    for (const key of Object.keys(defs)) {
      if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
      out[key] = src[key] ? 1 : 0;
    }
    return out;
  }

  // 只持久化 OPTION_DEFS 里的布尔项；companies 数组始终取 DEFAULT_OPTIONS
  function normalizeOptions(saved) {
    const out = { ...DEFAULT_OPTIONS };
    const src = saved || {};
    for (const [key] of OPTION_DEFS) {
      if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
      out[key] = src[key] ? 1 : 0;
    }
    return out;
  }

  let currentData = null;      // 前端抓取出的 match 对象
  let analysisData = null;     // 后端 /analysis/all 返回的分析结果
  let activeTab = 'overview';
  let busy = false;
  let analyzing = false;

  // 分析参数 / 自动分析：从 localStorage 恢复，改动即落盘
  let toolbarFlags = normalizeFlags(lsGet(LS_TOOL), TOOLBAR_FLAGS);
  let autoAnalyze = !!toolbarFlags.autoAnalyze;
  let analyzeOptions = normalizeOptions(lsGet(LS_OPTS));

  function setToolbarFlag(key, checked) {
    toolbarFlags[key] = checked ? 1 : 0;
    if (key === 'autoAnalyze') autoAnalyze = !!checked;
    return lsSet(LS_TOOL, toolbarFlags);
  }

  /* ------------------------------------------------------------------ *
   * fid 识别
   * ------------------------------------------------------------------ */
  function detectFid() {
    const links = Array.from(document.querySelectorAll('a[href*="shuju-"], a[href*="youliao-"]'));
    for (const a of links) {
      const m = (a.getAttribute('href') || '').match(/shuju-(\d+)\.shtml/);
      if (m) return { fid: m[1], source: '页面内「数据分析」链接' };
    }
    const m = location.pathname.match(/(?:youliao|shuju|ouzhi|yazhi|daxiao|zoushi)-(\d+)\.shtml/);
    if (m) return { fid: m[1], source: '当前网址' };
    return { fid: '', source: '' };
  }

  /* ------------------------------------------------------------------ *
   * 小工具
   * ------------------------------------------------------------------ */
  const H = (s) => String(s === null || s === undefined ? '' : s)
    .replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const V = (x) => (x === null || x === undefined || x === '' ? '-' : x);

  function table(headers, rows, emptyText) {
    if (!rows.length) return `<div class="fk500-empty">${H(emptyText || '暂无数据')}</div>`;
    return `<div class="fk500-scroll"><table class="fk500-table">
      <thead><tr>${headers.map((h) => `<th>${H(h)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c === null || c === undefined || c === '' ? '-' : H(c)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
  }

  function kv(label, value) {
    return `<div class="fk500-kv"><span class="fk500-k">${H(label)}</span><span class="fk500-v">${H(V(value))}</span></div>`;
  }

  function statRow(label, value) {
    return `<tr><td class="fk500-stat-label">${H(label)}</td><td>${H(V(value))}</td></tr>`;
  }

  function mapSummary(m) {
    const entries = Object.entries(m || {});
    if (!entries.length) return '-';
    return entries
      .sort((a, b) => (b[1].length || 0) - (a[1].length || 0))
      .slice(0, 6)
      .map(([k, v]) => `${k}盘×${v.length}`)
      .join('，');
  }

  /* ------------------------------------------------------------------ *
   * 页签渲染
   * ------------------------------------------------------------------ */
  function renderOverview(d) {
    const score = d.field_score || 'VS';
    return `
      <div class="fk500-teams">
        <div class="fk500-team">
          <div class="fk500-team-name">${H(V(d.home_team))}</div>
          <div class="fk500-team-sub">排名 ${H(V(d.home_team_rank))} · 积分 ${H(V(d.home_score))}</div>
        </div>
        <div class="fk500-score">${H(score)}</div>
        <div class="fk500-team">
          <div class="fk500-team-name">${H(V(d.visit_team))}</div>
          <div class="fk500-team-sub">排名 ${H(V(d.visit_team_rank))} · 积分 ${H(V(d.visit_score))}</div>
        </div>
      </div>
      <div class="fk500-grid">
        ${kv('比赛时间', d.match_time)}
        ${kv('赛事', d.match_group)}
        ${kv('赛事类型', d.match_type)}
        ${kv('赛事简称', d.match_category)}
        ${kv('轮次', d.match_round)}
        ${kv('参赛队伍数', d.team_count)}
        ${kv('fid', d.fid)}
        ${kv('比赛状态', d.match_status)}
        ${kv('欧赔公司数', (d.europe_odds_items || []).length)}
        ${kv('亚盘公司数', (d.asia_odds_items || []).length)}
        ${kv('大小球公司数', (d.size_odds_items || []).length)}
        ${kv('亚盘剔除无走势', d.filter_no_asia_trend)}
        ${kv('大小球剔除无走势', d.filter_no_size_trend)}
      </div>`;
  }

  function renderEurope(d) {
    const rows = (d.europe_odds_items || []).map((it) => [
      it.company_zh || it.company_en || it.cid,
      it.origin_win_odds, it.origin_even_odds, it.origin_lose_odds,
      it.instant_win_odds, it.instant_even_odds, it.instant_lose_odds,
      it.origin_return_rate, it.instant_return_rate,
    ]);
    return table(['公司', '初胜', '初平', '初负', '即胜', '即平', '即负', '初返还率', '即返还率'], rows, '未取到欧赔数据');
  }

  function renderAsia(d) {
    const rows = (d.asia_odds_items || []).map((it) => [
      it.company_zh || it.company_en || it.cid,
      it.origin_odds_home, it.origin_odds, it.origin_odds_visit,
      it.instant_odds_home, it.instant_odds, it.instant_odds_visit,
      it.instant_odds_home_state, it.instant_odds_visit_state,
    ]);
    return table(['公司', '初主', '初盘', '初客', '即主', '即盘', '即客', '主状态', '客状态'], rows, '未取到亚盘数据');
  }

  function renderSize(d) {
    const rows = (d.size_odds_items || []).map((it) => [
      it.company_zh || it.company_en || it.cid,
      it.origin_odds_big, it.origin_size, it.origin_odds_small,
      it.instant_odds_big, it.instant_size, it.instant_odds_small,
      it.instant_size_odds_big_state, it.instant_size_odds_small_state,
    ]);
    return table(['公司', '初大', '初盘', '初小', '即大', '即盘', '即小', '大状态', '小状态'], rows, '未取到大小球数据');
  }

  function renderStats(d) {
    const trendCount = (m) => Object.entries(m || {})
      .sort((a, b) => b[1].length - a[1].length)
      .map(([k, v]) => `${k}:${v.length}`)
      .join('，') || '-';
    const rows = [
      statRow('初始盘口(亚盘众数)', d.origin_pan_most),
      statRow('即时盘口(亚盘众数)', d.instant_pan_most),
      statRow('初始盘口(大小众数)', d.origin_size_most),
      statRow('即时盘口(大小众数)', d.instant_size_most),
      statRow('初始亚盘分布', mapSummary(d.origin_pan_home_map)),
      statRow('即时亚盘分布', mapSummary(d.instant_pan_home_map)),
      statRow('初始大小分布', mapSummary(d.origin_size_big_map)),
      statRow('即时大小分布', mapSummary(d.instant_size_big_map)),
      statRow('亚盘走势公司', trendCount(d.asia_odds_trend)),
      statRow('大小球走势公司', trendCount(d.size_odds_trend)),
      statRow('剔除无亚盘走势', d.filter_no_asia_trend),
      statRow('剔除无大小球走势', d.filter_no_size_trend),
    ].join('');
    return `<table class="fk500-table fk500-stat"><tbody>${rows}</tbody></table>`;
  }

  function jsonBar(prefix, data) {
    return `
      <div class="fk500-json-bar">
        <button class="fk500-mini" id="${prefix}-copy">复制 JSON</button>
        <button class="fk500-mini" id="${prefix}-download">下载 .json</button>
        <span class="fk500-muted">共 ${JSON.stringify(data, null, 2).length} 字符</span>
      </div>`;
  }

  function renderJson(d) {
    return `${jsonBar('fk500', d)}<pre class="fk500-pre">${H(JSON.stringify(d, null, 2))}</pre>`;
  }

  function renderReport() {
    const cfgHtml = `
      <div class="fk500-cfg">
        <div class="fk500-cfg-row">
          <label class="fk500-label">后端地址</label>
          <code class="fk500-api-fixed">${H(API_BASE)}</code>
          <button class="fk500-btn" id="fk500-analyze">${analysisData ? '重新分析' : '发送到后端分析'}</button>
        </div>
        <div class="fk500-cfg-row fk500-cfg-opts">
          ${OPTION_DEFS.map(([key, label]) => `
            <label class="fk500-check"><input type="checkbox" data-opt="${key}" ${analyzeOptions[key] ? 'checked' : ''} /> ${H(label)}</label>`).join('')}
          <button class="fk500-mini" id="fk500-opt-reset" title="清除本地保存的勾选，恢复默认">恢复默认</button>
        </div>
        <div class="fk500-muted">勾选会自动保存到浏览器 localStorage（同源长期有效，下次打开自动恢复）；公司筛选（europe / asia / size_companies）默认不筛选。</div>
      </div>`;

    if (!analysisData) {
      return `${cfgHtml}<div class="fk500-empty">还没有分析结果。先「开始获取」抓基本面，再点上面的「发送到后端分析」。</div>`;
    }
    return `
      ${cfgHtml}
      <div class="fk500-muted" style="margin-bottom:6px">分析完成 · 后端 ${H(API_BASE)} · ${H(new Date(analysisData.__time).toLocaleTimeString())}</div>
      ${jsonBar('fk500-analysis', analysisData)}
      ${window.FK500_REPORT.render(analysisData)}`;
  }

  const TABS = [
    { key: 'overview', label: '概览', render: renderOverview },
    { key: 'europe', label: '欧赔', render: renderEurope },
    { key: 'asia', label: '亚盘', render: renderAsia },
    { key: 'size', label: '大小球', render: renderSize },
    // { key: 'stats', label: '统计', render: renderStats },
    { key: 'report', label: '分析结果', render: renderReport },
    { key: 'json', label: 'JSON', render: renderJson },
  ];

  function bindJsonButtons(prefix, data) {
    const copyBtn = document.getElementById(`${prefix}-copy`);
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
          copyBtn.textContent = '已复制 ✓';
          setTimeout(() => { copyBtn.textContent = '复制 JSON'; }, 1500);
        } catch (e) {
          copyBtn.textContent = '复制失败';
        }
      });
    }
    const dlBtn = document.getElementById(`${prefix}-download`);
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        const isAnalysis = prefix === 'fk500-analysis';
        const name = isAnalysis
          ? `analysis_${currentData ? currentData.fid : 'match'}.json`
          : `match_${data.fid}.json`;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }
  }

  function bindReportEvents() {
    document.querySelectorAll('#fk500-body input[data-opt]').forEach((el) => {
      el.addEventListener('change', () => {
        analyzeOptions[el.dataset.opt] = el.checked ? 1 : 0;
        if (!lsSet(LS_OPTS, analyzeOptions)) {
          setStatus('选项本地保存失败（浏览器可能禁用了 localStorage），本次仍生效', 'error');
        }
      });
    });
    const resetBtn = document.getElementById('fk500-opt-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        analyzeOptions = { ...DEFAULT_OPTIONS };
        lsDel(LS_OPTS);
        renderBody();
        setStatus('已清除本地保存，分析参数恢复默认', 'ok');
      });
    }
    const analyzeBtn = document.getElementById('fk500-analyze');
    if (analyzeBtn) analyzeBtn.addEventListener('click', () => runAnalyze());
  }

  function renderBody() {
    const body = document.getElementById('fk500-body');
    if (!body) return;
    const tab = TABS.find((t) => t.key === activeTab) || TABS[0];

    if (tab.key === 'report') {
      body.innerHTML = renderReport();
      bindReportEvents();
      if (analysisData) bindJsonButtons('fk500-analysis', analysisData);
    } else {
      if (!currentData) {
        body.innerHTML = '<div class="fk500-empty">还没有数据。确认 fid 后点「开始获取」。</div>';
      } else {
        body.innerHTML = tab.render(currentData);
        bindJsonButtons('fk500', currentData);
      }
    }
    document.querySelectorAll('#fk500-tabs .fk500-tab').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === activeTab));
    const autoEl = document.getElementById('fk500-auto');
    if (autoEl) autoEl.checked = autoAnalyze;
  }

  function setStatus(text, type) {
    const el = document.getElementById('fk500-status');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'fk500-status' + (type ? ' is-' + type : '');
  }

  /* ------------------------------------------------------------------ *
   * 第一步：前端抓取 get_fundamentals
   * ------------------------------------------------------------------ */
  async function fetchData() {
    if (busy) return;
    const fidInput = document.getElementById('fk500-fid');
    const fid = (fidInput && fidInput.value.trim()) || detectFid().fid;
    if (!fid) {
      setStatus('没识别到 fid，请手动填写', 'error');
      return;
    }
    busy = true;
    const btn = document.getElementById('fk500-go');
    if (btn) { btn.disabled = true; btn.textContent = '获取中…'; }
    setStatus('开始抓取（纯前端，复用你当前页面的登录态）…', 'loading');

    const opts = {
      filter_no_asia_trend: toolbarFlags.fna ? 1 : 0,
      filter_no_size_trend: toolbarFlags.fns ? 1 : 0,
      sleep_ms: 400,
    };

    const t0 = Date.now();
    try {
      const match = await window.FK500.getFundamentals(fid, opts, (msg) => setStatus(msg, 'loading'));
      currentData = match;
      analysisData = null;
      renderBody();
      const secs = ((Date.now() - t0) / 1000).toFixed(1);
      setStatus(`抓取完成 ${secs}s · 欧赔${match.europe_odds_items.length} 亚盘${match.asia_odds_items.length} 大小${match.size_odds_items.length}`, 'ok');
      if (autoAnalyze) await runAnalyze();
    } catch (e) {
      currentData = null;
      renderBody();
      setStatus(String(e.message || e), 'error');
    } finally {
      busy = false;
      if (btn) { btn.disabled = false; btn.textContent = '开始获取'; }
    }
  }

  /* ------------------------------------------------------------------ *
   * 第二步：把 match 发给后端 /analysis/all
   * ------------------------------------------------------------------ */
  async function runAnalyze() {
    if (analyzing) return;
    if (!currentData) {
      activeTab = 'report';
      renderBody();
      setStatus('先「开始获取」拿到基本面数据，再发后端分析', 'error');
      return;
    }
    analyzing = true;
    const btn = document.getElementById('fk500-analyze');
    if (btn) { btn.disabled = true; btn.textContent = '分析中…'; }

    const targetUrl = `${API_BASE}/analysis/all`;
    setStatus(`正在请求后端分析 ${targetUrl} …（首次可能十几秒）`, 'loading');

    const t0 = Date.now();
    try {
      const resp = await chrome.runtime.sendMessage({
        type: 'fk-analyze',
        payload: { apiBase: API_BASE, match: currentData, options: analyzeOptions },
      });
      if (!resp) throw new Error('扩展后台无响应，试试重新加载扩展');
      if (!resp.ok) throw new Error(resp.error);

      analysisData = resp.result.data;
      analysisData.__time = resp.result.time;
      activeTab = 'report';
      renderBody();
      const secs = ((Date.now() - t0) / 1000).toFixed(1);
      setStatus(`分析完成 ${secs}s · 匹配 ${(analysisData.infer_data || []).length} 场`, 'ok');
    } catch (e) {
      analysisData = null;
      activeTab = 'report';
      renderBody();
      setStatus(`${String(e.message || e)}\n目标地址：${targetUrl}`, 'error');
    } finally {
      analyzing = false;
      const b = document.getElementById('fk500-analyze');
      if (b) { b.disabled = false; b.textContent = analysisData ? '重新分析' : '发送到后端分析'; }
    }
  }

  /* ------------------------------------------------------------------ *
   * 面板 DOM
   * ------------------------------------------------------------------ */
  function buildLauncher() {
    const wrap = document.createElement('div');
    wrap.id = 'fk500-launcher';
    wrap.innerHTML = `
      <button id="fk500-open" title="前端抓取数据，后端出分析结果">比赛分析</button>`;
    document.body.appendChild(wrap);
    wrap.querySelector('#fk500-open').addEventListener('click', () => togglePanel(true));
  }

  function buildPanel() {
    if (document.getElementById('fk500-panel')) return;
    const info = detectFid();

    const panel = document.createElement('div');
    panel.id = 'fk500-panel';
    panel.innerHTML = `
      <div class="fk500-head" id="fk500-drag">
        <span class="fk500-title">赛事分析</span>
        <span class="fk500-head-btns">
          <button class="fk500-icon" id="fk500-min" title="收起/展开">—</button>
          <button class="fk500-icon" id="fk500-close" title="关闭">×</button>
        </span>
      </div>
      <div class="fk500-toolbar">
        <label class="fk500-label">fid</label>
        <input id="fk500-fid" class="fk500-input" value="${H(info.fid)}" placeholder="比赛 id" />
        <span class="fk500-muted" id="fk500-fid-src">${H(info.source ? '来自：' + info.source : '未自动识别')}</span>
      </div>
      <div class="fk500-toolbar" id="fk500-toolbar">
        <label class="fk500-check"><input type="checkbox" id="fk500-fna" ${toolbarFlags.fna ? 'checked' : ''} /> 剔除无亚盘走势</label>
        <label class="fk500-check"><input type="checkbox" id="fk500-fns" ${toolbarFlags.fns ? 'checked' : ''} /> 剔除无大小球走势</label>
        <label class="fk500-check"><input type="checkbox" id="fk500-auto" ${autoAnalyze ? 'checked' : ''} /> 获取后自动分析</label>
        <button class="fk500-btn" id="fk500-go">开始获取</button>
      </div>
      <div id="fk500-tabs">
        ${TABS.map((t) => `<button class="fk500-tab${t.key === activeTab ? ' is-active' : ''}" data-tab="${t.key}">${t.label}</button>`).join('')}
      </div>
      <div id="fk500-body" class="fk500-body"></div>
      <div class="fk500-foot">
        <span id="fk500-status" class="fk500-status"></span>
        <span class="fk500-muted">抓取：页面内 · 分析：后端</span>
      </div>`;
    document.body.appendChild(panel);

    panel.querySelector('#fk500-close').addEventListener('click', () => togglePanel(false));
    panel.querySelector('#fk500-min').addEventListener('click', () => panel.classList.toggle('is-min'));
    panel.querySelector('#fk500-go').addEventListener('click', () => fetchData());
    [['fk500-fna', 'fna'], ['fk500-fns', 'fns'], ['fk500-auto', 'autoAnalyze']].forEach(([id, key]) => {
      const el = panel.querySelector('#' + id);
      if (!el) return;
      el.addEventListener('change', () => {
        if (!setToolbarFlag(key, el.checked)) {
          setStatus('勾选本地保存失败（浏览器可能禁用了 localStorage）', 'error');
        }
      });
    });
    panel.querySelectorAll('#fk500-tabs .fk500-tab').forEach((b) => {
      b.addEventListener('click', () => { activeTab = b.dataset.tab; renderBody(); });
    });
    panel.querySelector('#fk500-drag').addEventListener('mousedown', startDrag);
    renderBody();
  }

  function startDrag(e) {
    if (e.target.closest('.fk500-icon')) return;
    const panel = document.getElementById('fk500-panel');
    const rect = panel.getBoundingClientRect();
    const offX = e.clientX - rect.left;
    const offY = e.clientY - rect.top;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    panel.style.left = rect.left + 'px';
    panel.style.top = rect.top + 'px';

    const move = (ev) => {
      panel.style.left = Math.max(0, Math.min(window.innerWidth - rect.width, ev.clientX - offX)) + 'px';
      panel.style.top = Math.max(0, Math.min(window.innerHeight - 40, ev.clientY - offY)) + 'px';
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  function togglePanel(show) {
    const exists = document.getElementById('fk500-panel');
    if (!show && exists) { exists.remove(); return; }
    if (!exists) buildPanel();
    const panel = document.getElementById('fk500-panel');
    panel.classList.remove('is-min');
    renderBody();
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === 'fk-toggle-panel') togglePanel(true);
  });

  buildLauncher();
})();
