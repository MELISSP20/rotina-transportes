/* presentation.js — Modo TV/Telão (auto-cycling com painel de config)
   Toggle via F11 ou botão. Configuração persistente em localStorage. */

(function() {
  if (window.__presentInit) return;
  window.__presentInit = true;

  // ── Páginas DISPONÍVEIS no modo TV (com defaults) ──
  const ALL_PAGES = [
    { url: 'dit-report.html',    label: 'DIT Report',          icon: '📊', defaultSec: 30, defaultOn: true  },
    { url: 'orh.html',           label: 'ORH',                 icon: '⏱',  defaultSec: 30, defaultOn: true  },
    { url: 'comparativo.html',   label: 'Comparativo SSPs',    icon: '⚖️', defaultSec: 30, defaultOn: true  },
    { url: 'volumosos.html',     label: 'Volumosos por Ciclo', icon: '📦', defaultSec: 30, defaultOn: true  },
    { url: 'analise-ops.html',   label: 'Descontainerizados',  icon: '📦', defaultSec: 25, defaultOn: false },
    { url: 'cidades.html',       label: 'Cidades por Rota',    icon: '📍', defaultSec: 20, defaultOn: false },
    { url: 'madrugadao.html',    label: 'Organograma',         icon: '👥', defaultSec: 20, defaultOn: false },
    { url: 'index.html',         label: 'Hub (curiosidades)',  icon: '🏠', defaultSec: 20, defaultOn: false },
  ];

  const CFG_KEY    = 'tv_mode_config_v1';
  const STATE_KEY  = 'tv_mode_state';

  // ── Carrega configuração ou padrão ──
  function loadConfig() {
    try {
      const stored = JSON.parse(localStorage.getItem(CFG_KEY));
      if (stored && Array.isArray(stored.pages)) return stored;
    } catch {}
    return {
      pages: ALL_PAGES.map(p => ({ url: p.url, on: p.defaultOn, sec: p.defaultSec }))
    };
  }
  function saveConfig(cfg) {
    localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
  }

  // Resolve config → lista de páginas ativas
  function activePages() {
    const cfg = loadConfig();
    const result = [];
    cfg.pages.forEach(p => {
      if (!p.on) return;
      const meta = ALL_PAGES.find(a => a.url === p.url);
      if (meta) result.push({ ...meta, sec: p.sec });
    });
    return result.length ? result : ALL_PAGES.filter(p => p.defaultOn).map(p => ({ ...p, sec: p.defaultSec }));
  }

  // ── Injeta estilos (modo + painel) ──
  const style = document.createElement('style');
  style.textContent = `
    /* MODO TV — esconde topbar/footer/elementos não essenciais */
    body.present-mode .topbar,
    body.present-mode .hub-footer,
    body.present-mode .perf-card,
    body.present-mode .theme-btn,
    body.present-mode .online-cluster,
    body.present-mode .bottom-nav,
    body.present-mode #toast-container,
    body.present-mode #feedback-btn,
    body.present-mode .topbar-vsep { display: none !important; }
    body.present-mode { background: #06080F !important; color: #fff !important; }
    body.present-mode .header { background: #0A0D17 !important; }
    body.present-mode .wrapper,
    body.present-mode .hub { padding-top: 80px !important; max-width: 1600px !important; }

    /* Tipografia ampliada */
    body.present-mode { font-size: 18px; }
    body.present-mode .header-title { font-size: 62px !important; }
    body.present-mode .header-eyebrow { font-size: 13px !important; }
    body.present-mode .header-sub { font-size: 16px !important; }
    body.present-mode .org-kpi-val,
    body.present-mode .kpi-num,
    body.present-mode .kpi-card-pct { font-size: 52px !important; }
    body.present-mode .org-kpi-lbl,
    body.present-mode .kpi-lbl,
    body.present-mode .kpi-card-label { font-size: 14px !important; }
    body.present-mode .member-card-name-new { font-size: 17px !important; }
    body.present-mode .hub-title { font-size: 144px !important; }
    body.present-mode .trivia-text { font-size: 28px !important; }
    body.present-mode .hub-card-title { font-size: 22px !important; }
    body.present-mode .hub-card-icon { font-size: 44px !important; }

    /* Barra superior do modo TV */
    #tv-bar {
      position: fixed;
      top: 14px; left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 14px;
      background: linear-gradient(135deg, #FFE600 0%, #F5C800 100%);
      color: #1A1A2E;
      padding: 11px 22px;
      border-radius: 14px;
      font-family: 'Inter', sans-serif;
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: -.1px;
      box-shadow: 0 14px 32px rgba(255,230,0,.42);
      animation: tvBarIn .35s cubic-bezier(.4,0,.2,1);
      overflow: hidden;
    }
    @keyframes tvBarIn { from { opacity: 0; transform: translate(-50%,-12px); } to { opacity: 1; transform: translate(-50%,0); } }
    #tv-bar .tv-dot {
      width: 9px; height: 9px; border-radius: 50%;
      background: #E3262F;
      animation: tvDotBlink 1.4s infinite;
    }
    @keyframes tvDotBlink { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .55; transform: scale(.85); } }
    #tv-bar .tv-label-on-air {
      font-size: 9.5px;
      letter-spacing: .18em;
      text-transform: uppercase;
      opacity: .65;
    }
    #tv-bar .tv-counter {
      font-variant-numeric: tabular-nums;
      font-size: 11.5px;
      letter-spacing: .04em;
      background: rgba(26,26,46,.1);
      padding: 4px 8px;
      border-radius: 5px;
    }
    #tv-bar .tv-next {
      font-size: 10.5px;
      letter-spacing: .14em;
      text-transform: uppercase;
      opacity: .7;
    }
    #tv-bar .tv-next b { font-weight: 800; letter-spacing: -.1px; text-transform: none; opacity: 1; }
    #tv-bar .tv-progress {
      position: absolute;
      bottom: 0; left: 0;
      height: 3px;
      background: rgba(26,26,46,.85);
      transition: width .25s linear;
    }
    #tv-bar .tv-controls { display: flex; gap: 5px; margin-left: 6px; }
    #tv-bar button {
      background: rgba(26,26,46,.1);
      border: 1px solid rgba(26,26,46,.18);
      color: #1A1A2E;
      width: 30px; height: 30px;
      border-radius: 7px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 800;
      transition: all .15s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    #tv-bar button:hover { background: rgba(26,26,46,.2); transform: translateY(-1px); }
    #tv-bar.paused .tv-dot { background: #F59E0B; animation: none; }

    /* MODAL DE CONFIGURAÇÃO */
    #tv-modal {
      position: fixed; inset: 0; z-index: 10001;
      display: none;
      align-items: center; justify-content: center;
      padding: 20px;
      background: rgba(6,8,15,.72);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      font-family: 'Inter', sans-serif;
      animation: tvFadeIn .2s ease-out;
    }
    #tv-modal.open { display: flex; }
    @keyframes tvFadeIn { from { opacity: 0; } to { opacity: 1; } }
    #tv-modal .tv-box {
      background: var(--surface, #fff);
      color: var(--text, #333);
      max-width: 580px;
      width: 100%;
      border-radius: 18px;
      box-shadow: 0 24px 64px rgba(0,0,0,.4);
      overflow: hidden;
      animation: tvSlideUp .28s cubic-bezier(.4,0,.2,1);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    [data-theme="dark"] #tv-modal .tv-box { background: #1A1D27; color: #E8EAF2; }
    @keyframes tvSlideUp { from { opacity: 0; transform: translateY(18px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .tv-box-head {
      padding: 22px 26px 18px;
      border-bottom: 1px solid var(--border, #E0E0E0);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    [data-theme="dark"] .tv-box-head { border-color: #2A2E3F; }
    .tv-box-head-icon { font-size: 26px; }
    .tv-box-head-text { flex: 1; }
    .tv-box-title {
      font-size: 18px; font-weight: 900;
      color: var(--text, #1A1A2E);
      letter-spacing: -.4px;
      line-height: 1.2;
    }
    [data-theme="dark"] .tv-box-title { color: #E8EAF2; }
    .tv-box-sub {
      font-size: 12px; color: var(--muted, #666);
      font-weight: 500;
      margin-top: 4px;
    }
    .tv-box-close {
      background: transparent;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: var(--muted, #666);
      padding: 4px 10px;
      border-radius: 8px;
      transition: all .15s;
      line-height: 1;
    }
    .tv-box-close:hover { background: rgba(227,38,47,.1); color: var(--red, #E3262F); }
    .tv-box-body { padding: 18px 26px; overflow-y: auto; flex: 1; }
    .tv-pages-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tv-page-item {
      display: grid;
      grid-template-columns: 30px 1fr auto;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 9px;
      transition: background .15s;
      border: 1px solid transparent;
    }
    .tv-page-item:hover { background: rgba(0,0,0,.03); }
    [data-theme="dark"] .tv-page-item:hover { background: rgba(255,255,255,.03); }
    .tv-page-item.disabled { opacity: .5; }
    .tv-page-checkbox {
      width: 22px; height: 22px;
      border-radius: 6px;
      border: 2px solid var(--border, #E0E0E0);
      cursor: pointer;
      transition: all .15s;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface, #fff);
    }
    [data-theme="dark"] .tv-page-checkbox { background: rgba(255,255,255,.04); }
    .tv-page-checkbox.on { background: var(--yellow, #FFE600); border-color: var(--yellow, #FFE600); }
    .tv-page-checkbox.on::after { content: '✓'; color: #1A1A2E; font-weight: 900; font-size: 14px; line-height: 1; }
    .tv-page-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }
    .tv-page-name {
      font-size: 13.5px;
      font-weight: 800;
      color: var(--text, #333);
      letter-spacing: -.2px;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    [data-theme="dark"] .tv-page-name { color: #E8EAF2; }
    .tv-page-name-icon { font-size: 15px; }
    .tv-page-url {
      font-size: 10.5px;
      color: var(--muted, #999);
      font-weight: 600;
      font-family: ui-monospace, monospace;
    }
    .tv-page-time {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--bg, #F5F5F5);
      border: 1px solid var(--border, #E0E0E0);
      border-radius: 7px;
      padding: 4px 8px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text, #333);
      font-variant-numeric: tabular-nums;
    }
    [data-theme="dark"] .tv-page-time { background: rgba(255,255,255,.04); }
    .tv-page-time-btn {
      background: transparent;
      border: none;
      color: var(--muted, #666);
      cursor: pointer;
      font-size: 12px;
      font-weight: 800;
      padding: 0 5px;
      transition: color .15s;
      line-height: 1;
    }
    .tv-page-time-btn:hover { color: var(--text, #333); }
    .tv-page-time input {
      background: transparent;
      border: none;
      width: 32px;
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 700;
      color: inherit;
      text-align: center;
      padding: 0;
      outline: none;
      font-variant-numeric: tabular-nums;
    }
    .tv-summary {
      margin-top: 14px;
      padding: 12px 14px;
      background: var(--bg, #F8F9FB);
      border-radius: 10px;
      font-size: 12px;
      color: var(--muted, #666);
      font-weight: 600;
    }
    [data-theme="dark"] .tv-summary { background: rgba(255,255,255,.04); }
    .tv-summary b { color: var(--text, #333); font-weight: 800; }
    [data-theme="dark"] .tv-summary b { color: #E8EAF2; }

    .tv-box-foot {
      padding: 16px 26px;
      border-top: 1px solid var(--border, #E0E0E0);
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      flex-wrap: wrap;
    }
    [data-theme="dark"] .tv-box-foot { border-color: #2A2E3F; }
    .tv-btn {
      border: none;
      border-radius: 10px;
      padding: 10px 18px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      transition: all .15s;
      letter-spacing: -.1px;
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }
    .tv-btn-primary { background: var(--navy, #1A1A2E); color: var(--yellow, #FFE600); }
    .tv-btn-primary:hover { background: #2A2D44; transform: translateY(-1px); box-shadow: 0 6px 14px rgba(26,26,46,.2); }
    .tv-btn-primary:disabled { opacity: .4; cursor: not-allowed; }
    .tv-btn-secondary {
      background: var(--bg, #F5F5F5);
      color: var(--text, #333);
      border: 1px solid var(--border, #E0E0E0);
    }
    .tv-btn-secondary:hover { background: var(--surface, #fff); border-color: var(--text, #333); }
    [data-theme="dark"] .tv-btn-secondary { background: rgba(255,255,255,.05); color: #E8EAF2; }

    @media (max-width: 600px) {
      #tv-bar { padding: 9px 14px; gap: 8px; font-size: 11px; }
      #tv-bar .tv-label-on-air,
      #tv-bar .tv-next { display: none; }
      #tv-modal .tv-box { border-radius: 14px; }
      .tv-box-head { padding: 18px 18px 14px; }
      .tv-box-body { padding: 14px 18px; }
      .tv-page-item { grid-template-columns: 26px 1fr auto; gap: 8px; padding: 8px; }
    }
  `;
  document.head.appendChild(style);

  // ── ESTADO ──
  function getState() {
    try { return JSON.parse(sessionStorage.getItem(STATE_KEY)) || null; }
    catch { return null; }
  }
  function setState(s) { sessionStorage.setItem(STATE_KEY, JSON.stringify(s)); }
  function clearState() { sessionStorage.removeItem(STATE_KEY); }

  function currentPageUrl() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  // ── BARRA TOPO (durante o modo) ──
  function injectBar(state, pages) {
    const existing = document.getElementById('tv-bar');
    if (existing) existing.remove();

    const curr = pages[state.idx];
    const next = pages[(state.idx + 1) % pages.length];
    const bar = document.createElement('div');
    bar.id = 'tv-bar';
    if (state.paused) bar.classList.add('paused');
    bar.innerHTML = `
      <span class="tv-dot"></span>
      <span class="tv-label-on-air">MODO TV</span>
      <span class="tv-counter" id="tv-counter">${state.paused ? 'PAUSADO' : '0s'}</span>
      <span class="tv-next">Próxima: <b>${next.icon} ${next.label}</b></span>
      <div class="tv-controls">
        <button onclick="__tvPause()" title="Pausar/Retomar (Espaço)" id="tv-btn-pause">${state.paused ? '▶' : '⏸'}</button>
        <button onclick="__tvNext()" title="Próxima (→ ou ↓)">⏭</button>
        <button onclick="__tvOpenConfig()" title="Configurar">⚙</button>
        <button onclick="__tvStop()" title="Sair (Esc ou F11)">✕</button>
      </div>
      <div class="tv-progress" id="tv-progress" style="width:0%;"></div>
    `;
    document.body.appendChild(bar);
  }

  // ── INICIAR / PARAR ──
  let timer = null;

  function start(startFromIdx) {
    const pages = activePages();
    if (pages.length === 0) {
      openConfig();
      return;
    }

    // Tentar começar na página atual se ela estiver no ciclo
    let idx = startFromIdx !== undefined ? startFromIdx : pages.findIndex(p => p.url === currentPageUrl());
    if (idx < 0) idx = 0;

    const state = { active: true, idx, startedAt: Date.now(), paused: false };
    setState(state);

    // Navegar pra primeira página se não estamos nela
    if (pages[idx].url !== currentPageUrl()) {
      window.location.href = pages[idx].url;
      return;
    }
    enable(state, pages);
  }

  function stop() {
    clearState();
    document.body.classList.remove('present-mode');
    const bar = document.getElementById('tv-bar');
    if (bar) bar.remove();
    if (timer) { clearInterval(timer); timer = null; }
  }

  function enable(state, pages) {
    document.body.classList.add('present-mode');
    injectBar(state, pages);

    const currentPage = pages[state.idx];
    if (!currentPage) { stop(); return; }
    const durationMs = currentPage.sec * 1000;

    let elapsed = 0;
    const tick = 200;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      const st = getState();
      if (!st || !st.active) { clearInterval(timer); return; }
      if (st.paused) return; // pausado

      elapsed += tick;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      const progressEl = document.getElementById('tv-progress');
      const counterEl = document.getElementById('tv-counter');
      if (progressEl) progressEl.style.width = pct + '%';
      if (counterEl) counterEl.textContent = Math.ceil((durationMs - elapsed) / 1000) + 's';

      if (elapsed >= durationMs) {
        clearInterval(timer);
        const nextIdx = (state.idx + 1) % pages.length;
        setState({ ...state, idx: nextIdx, startedAt: Date.now() });
        window.location.href = pages[nextIdx].url;
      }
    }, tick);
  }

  // ── CONTROLES (expostos globalmente) ──
  window.__tvPause = function() {
    const st = getState();
    if (!st || !st.active) return;
    st.paused = !st.paused;
    setState(st);
    const bar = document.getElementById('tv-bar');
    const btn = document.getElementById('tv-btn-pause');
    const counterEl = document.getElementById('tv-counter');
    if (bar) bar.classList.toggle('paused', st.paused);
    if (btn) btn.textContent = st.paused ? '▶' : '⏸';
    if (counterEl && st.paused) counterEl.textContent = 'PAUSADO';
  };

  window.__tvNext = function() {
    const st = getState();
    if (!st || !st.active) return;
    const pages = activePages();
    if (pages.length === 0) return;
    const nextIdx = (st.idx + 1) % pages.length;
    setState({ ...st, idx: nextIdx, startedAt: Date.now(), paused: false });
    window.location.href = pages[nextIdx].url;
  };

  window.__tvPrev = function() {
    const st = getState();
    if (!st || !st.active) return;
    const pages = activePages();
    if (pages.length === 0) return;
    const prevIdx = (st.idx - 1 + pages.length) % pages.length;
    setState({ ...st, idx: prevIdx, startedAt: Date.now(), paused: false });
    window.location.href = pages[prevIdx].url;
  };

  window.__tvStop = stop;

  // ── PAINEL DE CONFIGURAÇÃO ──
  function buildConfigModal() {
    if (document.getElementById('tv-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'tv-modal';
    modal.innerHTML = `
      <div class="tv-box">
        <div class="tv-box-head">
          <span class="tv-box-head-icon">📺</span>
          <div class="tv-box-head-text">
            <div class="tv-box-title">Modo TV / Telão</div>
            <div class="tv-box-sub">Auto-rotação entre páginas. Útil pra deixar num monitor da operação.</div>
          </div>
          <button class="tv-box-close" onclick="__tvCloseConfig()">×</button>
        </div>
        <div class="tv-box-body">
          <div class="tv-pages-list" id="tv-pages-list"></div>
          <div class="tv-summary" id="tv-summary">—</div>
        </div>
        <div class="tv-box-foot">
          <button class="tv-btn tv-btn-secondary" onclick="__tvCloseConfig()">Cancelar</button>
          <button class="tv-btn tv-btn-primary" id="tv-btn-start" onclick="__tvStartFromConfig()">▶ Iniciar Modo TV</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Click fora fecha
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeConfig();
    });
  }

  function renderConfigList() {
    const cfg = loadConfig();
    const listEl = document.getElementById('tv-pages-list');
    if (!listEl) return;

    listEl.innerHTML = cfg.pages.map(p => {
      const meta = ALL_PAGES.find(a => a.url === p.url);
      if (!meta) return '';
      return `
        <div class="tv-page-item ${p.on ? '' : 'disabled'}" data-url="${p.url}">
          <div class="tv-page-checkbox ${p.on ? 'on' : ''}" onclick="__tvToggle('${p.url}')"></div>
          <div class="tv-page-info">
            <span class="tv-page-name"><span class="tv-page-name-icon">${meta.icon}</span>${meta.label}</span>
            <span class="tv-page-url">${meta.url}</span>
          </div>
          <div class="tv-page-time">
            <button class="tv-page-time-btn" onclick="__tvAdjustTime('${p.url}',-5)">−</button>
            <input type="number" min="5" max="300" step="5" value="${p.sec}" onchange="__tvSetTime('${p.url}', this.value)"/>
            <span style="font-size:10px;opacity:.6;">s</span>
            <button class="tv-page-time-btn" onclick="__tvAdjustTime('${p.url}',5)">+</button>
          </div>
        </div>
      `;
    }).join('');

    updateSummary();
  }

  function updateSummary() {
    const cfg = loadConfig();
    const active = cfg.pages.filter(p => p.on);
    const totalSec = active.reduce((sum, p) => sum + p.sec, 0);
    const totalMin = (totalSec / 60).toFixed(1);
    const sumEl = document.getElementById('tv-summary');
    const startBtn = document.getElementById('tv-btn-start');
    if (sumEl) {
      if (active.length === 0) {
        sumEl.innerHTML = '<b>Selecione pelo menos 1 página</b> para iniciar a rotação.';
      } else {
        sumEl.innerHTML = `Rotação com <b>${active.length} página${active.length>1?'s':''}</b> · ciclo total: <b>${totalMin} min</b> (${totalSec}s).`;
      }
    }
    if (startBtn) startBtn.disabled = active.length === 0;
  }

  window.__tvToggle = function(url) {
    const cfg = loadConfig();
    const page = cfg.pages.find(p => p.url === url);
    if (page) {
      page.on = !page.on;
      saveConfig(cfg);
      renderConfigList();
    }
  };

  window.__tvSetTime = function(url, val) {
    const n = Math.max(5, Math.min(300, parseInt(val) || 30));
    const cfg = loadConfig();
    const page = cfg.pages.find(p => p.url === url);
    if (page) {
      page.sec = n;
      saveConfig(cfg);
      updateSummary();
    }
  };

  window.__tvAdjustTime = function(url, delta) {
    const cfg = loadConfig();
    const page = cfg.pages.find(p => p.url === url);
    if (page) {
      page.sec = Math.max(5, Math.min(300, page.sec + delta));
      saveConfig(cfg);
      renderConfigList();
    }
  };

  function openConfig() {
    buildConfigModal();
    renderConfigList();
    document.getElementById('tv-modal').classList.add('open');
  }
  function closeConfig() {
    const m = document.getElementById('tv-modal');
    if (m) m.classList.remove('open');
  }

  window.__tvOpenConfig = openConfig;
  window.__tvCloseConfig = closeConfig;

  window.__tvStartFromConfig = function() {
    closeConfig();
    start();
  };

  // ── EXPOR API ──
  window.__presentToggle = function() {
    const st = getState();
    if (st && st.active) {
      stop();
    } else {
      openConfig();
    }
  };

  // ── BOOT: auto-resume se já estava ativo ──
  function init() {
    if (!document.body) { setTimeout(init, 50); return; }
    const st = getState();
    if (st && st.active) {
      const pages = activePages();
      if (pages.length === 0) { stop(); return; }
      // Sincronizar idx com a página atual
      const here = currentPageUrl();
      const hereIdx = pages.findIndex(p => p.url === here);
      if (hereIdx >= 0) {
        st.idx = hereIdx;
        setState(st);
      }
      enable(st, pages);
    }
  }
  init();

  // ── ATALHOS DE TECLADO ──
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    // F11 → toggle modo TV (abre painel se desligado, sai se ligado)
    if (e.key === 'F11') {
      e.preventDefault();
      window.__presentToggle();
      return;
    }

    const st = getState();

    // ESC → sair OU fechar modal config
    if (e.key === 'Escape') {
      const modalOpen = document.getElementById('tv-modal')?.classList.contains('open');
      if (modalOpen) { closeConfig(); e.preventDefault(); return; }
      if (st && st.active) { e.preventDefault(); stop(); return; }
    }

    if (!st || !st.active) return;

    // Modo TV ativo:
    // Espaço → pausar / retomar
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      window.__tvPause();
      return;
    }
    // Setas → navegar
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      window.__tvNext();
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      window.__tvPrev();
      return;
    }
  });
})();
