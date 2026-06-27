/* presentation.js — Modo apresentação (telão da operação)
   Toggle via F11 ou window.__presentToggle()
   Atalhos: F11 ativa/desativa · setas ↑↓ navegam páginas · Esc sai */

(function() {
  if (window.__presentInit) return;
  window.__presentInit = true;

  // Páginas no modo apresentação (com loop)
  const PAGES = [
    { url: 'dit-report.html', label: 'DIT Report', duration: 25000 },
    { url: 'analise-ops.html', label: 'Descontainerizados', duration: 25000 },
    { url: 'orh.html', label: 'ORH', duration: 25000 },
    { url: 'madrugadao.html', label: 'Organograma', duration: 20000 },
    { url: 'cidades.html', label: 'Cidades por Rota', duration: 20000 },
  ];

  const STATE_KEY = 'present_mode_state';

  // Injeta estilos
  const style = document.createElement('style');
  style.textContent = `
    body.present-mode .topbar,
    body.present-mode .hub-footer,
    body.present-mode .perf-card,
    body.present-mode .theme-btn,
    body.present-mode .online-cluster,
    body.present-mode #toast-container { display: none !important; }
    body.present-mode { background: #06080F !important; color: #fff !important; }
    body.present-mode .header { background: #0A0D17 !important; }
    body.present-mode .wrapper,
    body.present-mode .hub { padding-top: 70px !important; max-width: 1600px !important; }

    /* Scale up content */
    body.present-mode { font-size: 18px; }
    body.present-mode .header-title { font-size: 62px !important; }
    body.present-mode .header-eyebrow { font-size: 13px !important; }
    body.present-mode .header-sub { font-size: 16px !important; }
    body.present-mode .org-kpi-val,
    body.present-mode .kpi-num { font-size: 52px !important; }
    body.present-mode .org-kpi-lbl,
    body.present-mode .kpi-lbl { font-size: 14px !important; }
    body.present-mode .member-card-name-new { font-size: 17px !important; }
    body.present-mode .hub-title { font-size: 144px !important; }
    body.present-mode .trivia-text { font-size: 28px !important; }
    body.present-mode .hub-card-title { font-size: 22px !important; }
    body.present-mode .hub-card-icon { font-size: 44px !important; }

    /* Pill flutuante mostrando modo ativo + próxima página */
    #present-bar {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, #FFE600 0%, #F5C800 100%);
      color: #1A1A2E;
      padding: 12px 20px;
      border-radius: 14px;
      font-family: 'Inter', sans-serif;
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: -.1px;
      box-shadow: 0 14px 32px rgba(255,230,0,.4);
      animation: presBarIn .35s cubic-bezier(.4,0,.2,1);
    }
    @keyframes presBarIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
    #present-bar .pres-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: #1A1A2E;
      animation: presDotBlink 1.2s infinite;
    }
    @keyframes presDotBlink { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
    #present-bar .pres-progress {
      position: absolute;
      bottom: 0; left: 0;
      height: 2px;
      background: #1A1A2E;
      border-radius: 0 0 14px 14px;
      transition: width .3s linear;
    }
    #present-bar .pres-hint {
      font-size: 10.5px;
      letter-spacing: .12em;
      text-transform: uppercase;
      opacity: .65;
      margin-left: 6px;
    }
    #present-bar kbd {
      background: rgba(26,26,46,.12);
      border: 1px solid rgba(26,26,46,.2);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      font-weight: 700;
    }
  `;
  document.head.appendChild(style);

  function getState() {
    try { return JSON.parse(sessionStorage.getItem(STATE_KEY)) || null; }
    catch { return null; }
  }

  function setState(state) {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function clearState() {
    sessionStorage.removeItem(STATE_KEY);
  }

  function findCurrentPageIdx() {
    const url = window.location.pathname.split('/').pop() || 'index.html';
    return PAGES.findIndex(p => p.url === url);
  }

  function injectBar(state) {
    const existing = document.getElementById('present-bar');
    if (existing) existing.remove();

    const bar = document.createElement('div');
    bar.id = 'present-bar';
    const curr = PAGES[state.idx];
    const next = PAGES[(state.idx + 1) % PAGES.length];
    bar.innerHTML = `
      <span class="pres-dot"></span>
      <span>MODO APRESENTAÇÃO</span>
      <span class="pres-hint">PRÓXIMA: ${next.label}</span>
      <span class="pres-hint"><kbd>F11</kbd> SAIR</span>
      <div class="pres-progress" id="pres-progress"></div>
    `;
    document.body.appendChild(bar);
  }

  function start(fromIdx) {
    const idx = fromIdx !== undefined ? fromIdx : Math.max(0, findCurrentPageIdx());
    const state = { active: true, idx, startedAt: Date.now() };
    setState(state);
    enable(state);
  }

  function stop() {
    clearState();
    disable();
  }

  function enable(state) {
    document.body.classList.add('present-mode');
    injectBar(state);
    
    // Schedule next page
    const duration = PAGES[state.idx].duration;
    let elapsed = 0;
    const tick = 200;
    const progressEl = document.getElementById('pres-progress');
    const progressTimer = setInterval(() => {
      elapsed += tick;
      const pct = Math.min(100, (elapsed / duration) * 100);
      if (progressEl) progressEl.style.width = pct + '%';
      if (elapsed >= duration) {
        clearInterval(progressTimer);
        const nextIdx = (state.idx + 1) % PAGES.length;
        setState({ active: true, idx: nextIdx, startedAt: Date.now() });
        window.location.href = PAGES[nextIdx].url;
      }
    }, tick);

    window.__presentTimer = progressTimer;
  }

  function disable() {
    document.body.classList.remove('present-mode');
    const bar = document.getElementById('present-bar');
    if (bar) bar.remove();
    if (window.__presentTimer) clearInterval(window.__presentTimer);
  }

  // Auto-resume se chegou aqui via redirect do modo apresentação
  function init() {
    if (!document.body) {
      setTimeout(init, 50);
      return;
    }
    const state = getState();
    if (state && state.active) {
      // Atualizar idx se a página atual corresponde
      const curr = findCurrentPageIdx();
      if (curr >= 0) {
        state.idx = curr;
        setState(state);
      }
      enable(state);
    }
  }
  init();

  // Atalho F11
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'F11') {
      e.preventDefault();
      const state = getState();
      if (state && state.active) stop();
      else start();
      return;
    }
    if (e.key === 'Escape') {
      const state = getState();
      if (state && state.active) {
        e.preventDefault();
        stop();
      }
    }
    // Navegar manualmente entre páginas no modo apresentação
    const state = getState();
    if (state && state.active && (e.key === 'ArrowDown' || e.key === 'PageDown')) {
      e.preventDefault();
      const nextIdx = (state.idx + 1) % PAGES.length;
      setState({ active: true, idx: nextIdx, startedAt: Date.now() });
      window.location.href = PAGES[nextIdx].url;
    }
    if (state && state.active && (e.key === 'ArrowUp' || e.key === 'PageUp')) {
      e.preventDefault();
      const prevIdx = (state.idx - 1 + PAGES.length) % PAGES.length;
      setState({ active: true, idx: prevIdx, startedAt: Date.now() });
      window.location.href = PAGES[prevIdx].url;
    }
  });

  window.__presentToggle = function() {
    const state = getState();
    if (state && state.active) stop();
    else start();
  };
})();
