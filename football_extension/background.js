const API_BASE = 'http://117.72.172.8:10008';
const ANALYZE_TIMEOUT = 240000; // 与前端 EAxios 对 /analysis/all 的 240s 超时一致

async function postAnalyze(payload) {
  const base = String(payload.apiBase || API_BASE).trim().replace(/\/+$/, '') || API_BASE;
  const url = `${base}/analysis/all`;
  const body = { ...payload.match, ...(payload.options || {}) };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ANALYZE_TIMEOUT);
  let resp;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch (e) {
    throw new Error(`请求失败，请稍后重试。`);
  } finally {
    clearTimeout(timer);
  }

  const text = await resp.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error(`后端返回的不是 JSON（HTTP ${resp.status}）：\n${text.slice(0, 500)}`);
  }
  if (!resp.ok || json.code !== 200 || !json.data) {
    throw new Error(`后端返回错误（HTTP ${resp.status} / code ${json.code}）：${json.msg || '未知错误'}`);
  }
  return { url, data: json.data, time: Date.now() };
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'fk-toggle-panel' }).catch(() => {});
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg) return;
  if (msg.type === 'fk-analyze') {
    postAnalyze(msg.payload || {})
      .then((result) => sendResponse({ ok: true, result }))
      .catch((err) => sendResponse({ ok: false, error: err.message || String(err) }));
    return true;
  }
  return undefined;
});
