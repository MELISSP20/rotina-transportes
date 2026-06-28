/* keyboard.js — Atalhos globais do Assignments
   Inclua via <script src="keyboard.js" defer></script> em todas as páginas
   ATALHOS: Shift + Letra (não conflita com palavras de easter eggs) */

(function() {
  const SHORTCUTS = [
    { key: 'H', label: 'Hub', url: 'index.html', icon: '🏠' },
    { key: 'R', label: 'Rotina do turno', url: 'rotina.html', icon: '📋' },
    { key: 'O', label: 'Organograma', url: 'madrugadao.html', icon: '👥' },
    { key: 'D', label: 'DIT Report', url: 'dit-report.html', icon: '📊' },
    { key: 'A', label: 'Análise OPS (Descont.)', url: 'analise-ops.html', icon: '📦' },
    { key: 'Q', label: 'ORH', url: 'orh.html', icon: '⏱' },
    { key: 'C', label: 'Cidades por Rota', url: 'cidades.html', icon: '📍' },
    { key: 'P', label: 'Resumo de Produtos', url: 'produtos.html', icon: '🏷️' },
    { key: 'V', label: 'Volumosos por Ciclo', url: 'volumosos.html', icon: '📦' },
    { key: 'B', label: 'Diário de Bordo', url: 'diario.html', icon: '📒' },
  ];

  const SPECIAL = [
    { keys: '?', desc: 'Abre esta lista de atalhos' },
    { keys: 'Esc', desc: 'Fecha o modal de atalhos' },
    { keys: 'Cmd/Ctrl + K', desc: 'Abre esta lista de atalhos' },
    { keys: '← / →', desc: 'Navega curiosidades no Hub' },
  ];

  // ── Modal HTML ──
  const modal = document.createElement('div');
  modal.id = 'kbd-modal';
  modal.innerHTML = `
    <style>
      #kbd-modal { position: fixed; inset: 0; z-index: 9999; display: none; align-items: center; justify-content: center; padding: 1rem; background: rgba(0,0,0,.55); backdrop-filter: blur(6px); animation: kbdFadeIn .2s ease-out; }
      #kbd-modal.open { display: flex; }
      @keyframes kbdFadeIn { from { opacity: 0; } to { opacity: 1; } }
      .kbd-box { background: var(--surface, #fff); border: 1px solid var(--border, #E0E0E0); border-radius: 16px; padding: 28px 32px; max-width: 580px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,.3); animation: kbdSlideIn .25s cubic-bezier(.4,0,.2,1); max-height: 90vh; overflow-y: auto; }
      [data-theme="dark"] .kbd-box { background: #1A1D27; border-color: #2A2E3F; box-shadow: 0 24px 64px rgba(0,0,0,.6); }
      @keyframes kbdSlideIn { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .kbd-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; gap: 12px; }
      .kbd-title { font-size: 20px; font-weight: 900; color: var(--text, #333); letter-spacing: -.5px; display: inline-flex; align-items: center; gap: 10px; }
      .kbd-title-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--yellow, #FFE600); box-shadow: 0 0 0 0 rgba(255,230,0,.4); animation: kbdPulse 2s infinite; }
      @keyframes kbdPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,230,0,.6); } 50% { box-shadow: 0 0 0 6px rgba(255,230,0,0); } }
      .kbd-sub { font-size: 12px; color: var(--muted, #666); font-weight: 600; margin-bottom: 22px; }
      .kbd-sub b { color: var(--text, #333); font-weight: 800; }
      [data-theme="dark"] .kbd-sub b { color: var(--yellow, #FFE600); }
      .kbd-close { width: 30px; height: 30px; border-radius: 50%; background: var(--bg, #F5F5F5); border: 1px solid var(--border, #E0E0E0); cursor: pointer; color: var(--muted, #666); font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all .15s; }
      .kbd-close:hover { background: #E3262F; color: #fff; border-color: #E3262F; }
      [data-theme="dark"] .kbd-close { background: rgba(255,255,255,.06); }
      .kbd-section-title { font-size: 10px; font-weight: 800; letter-spacing: .18em; color: var(--muted, #666); text-transform: uppercase; margin: 18px 0 10px; padding-bottom: 6px; border-bottom: 1px solid var(--border, #E0E0E0); }
      .kbd-section-title:first-of-type { margin-top: 0; }
      .kbd-list { display: flex; flex-direction: column; gap: 4px; }
      .kbd-item { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 8px; transition: background .15s; cursor: pointer; text-decoration: none; color: var(--text, #333); }
      .kbd-item:hover { background: rgba(255,230,0,.1); }
      .kbd-item-icon { font-size: 16px; width: 24px; text-align: center; flex-shrink: 0; }
      .kbd-item-label { flex: 1; font-size: 13px; font-weight: 600; color: var(--text, #333); }
      .kbd-keys { display: flex; gap: 4px; align-items: center; }
      .kbd-key { background: var(--bg, #F5F5F5); border: 1px solid var(--border, #E0E0E0); border-bottom-width: 2px; border-radius: 5px; padding: 3px 8px; font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 11px; font-weight: 700; color: var(--text, #333); min-width: 22px; text-align: center; }
      .kbd-plus { font-size: 10px; font-weight: 700; color: var(--muted, #999); }
      [data-theme="dark"] .kbd-key { background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.1); }
      .kbd-foot { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border, #E0E0E0); font-size: 10.5px; color: var(--muted, #666); text-align: center; letter-spacing: .04em; }
      .kbd-foot b { color: var(--text, #333); font-weight: 800; }
      .kbd-tip { margin-top: 12px; padding: 11px 13px; background: rgba(255,230,0,.08); border: 1px solid rgba(255,230,0,.3); border-radius: 9px; font-size: 11.5px; color: var(--text, #333); font-weight: 600; letter-spacing: -.05px; line-height: 1.5; }
      [data-theme="dark"] .kbd-tip { background: rgba(255,230,0,.06); color: rgba(255, 240, 150, .92); border-color: rgba(255,230,0,.25); }
      .kbd-tip b { color: #1A1A2E; font-weight: 900; background: var(--yellow, #FFE600); padding: 1px 5px; border-radius: 3px; margin: 0 1px; }
      [data-theme="dark"] .kbd-tip b { color: #1A1A2E; }
    </style>
    <div class="kbd-box" onclick="event.stopPropagation()">
      <div class="kbd-head">
        <div class="kbd-title"><span class="kbd-title-dot"></span> Atalhos do Assignments</div>
        <button class="kbd-close" onclick="window.__kbdHide()" aria-label="Fechar">✕</button>
      </div>
      <div class="kbd-sub">Segura <b>Shift</b> e aperta a letra pra navegar entre páginas</div>

      <div class="kbd-section-title">Navegação</div>
      <div class="kbd-list">
        ${SHORTCUTS.map(s => `
          <a class="kbd-item" href="${s.url}">
            <span class="kbd-item-icon">${s.icon}</span>
            <span class="kbd-item-label">${s.label}</span>
            <div class="kbd-keys">
              <span class="kbd-key">⇧</span>
              <span class="kbd-plus">+</span>
              <span class="kbd-key">${s.key}</span>
            </div>
          </a>
        `).join('')}
      </div>

      <div class="kbd-section-title">Geral</div>
      <div class="kbd-list">
        ${SPECIAL.map(s => {
          const parts = s.keys.split(' + ');
          return `
            <div class="kbd-item" style="cursor:default;">
              <span class="kbd-item-icon">⌨️</span>
              <span class="kbd-item-label">${s.desc}</span>
              <div class="kbd-keys">
                ${parts.map((p, i) => {
                  const orParts = p.split(' / ');
                  const html = orParts.map((k, j) => `<span class="kbd-key">${k}</span>${j < orParts.length - 1 ? '<span class="kbd-plus">/</span>' : ''}`).join('');
                  return (i > 0 ? '<span class="kbd-plus">+</span>' : '') + html;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="kbd-tip">💡 Letras simples (sem Shift) ficam livres pra digitar palavras secretas. Tenta digitar <b>matrix</b>, <b>vapor</b>, <b>claude</b> ou <b>eggs</b> em qualquer página 👀</div>

      <div class="kbd-foot">Aperte <b>?</b> a qualquer momento pra reabrir esta janela</div>
    </div>
  `;
  modal.addEventListener('click', () => window.__kbdHide());

  function init() {
    if (!document.body) { setTimeout(init, 50); return; }
    document.body.appendChild(modal);
  }
  init();

  window.__kbdShow = function() { modal.classList.add('open'); };
  window.__kbdHide = function() { modal.classList.remove('open'); };

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

    // Cmd/Ctrl+K abre o modal
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      window.__kbdShow();
      return;
    }

    // ? abre o modal
    if (e.key === '?') {
      e.preventDefault();
      window.__kbdShow();
      return;
    }

    // Esc fecha
    if (e.key === 'Escape') {
      window.__kbdHide();
      return;
    }

    // Atalhos de navegação SÓ com Shift segurado
    if (!e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;

    const shortcut = SHORTCUTS.find(s => e.key.toUpperCase() === s.key);
    if (shortcut) {
      e.preventDefault();
      window.location.href = shortcut.url;
    }
  });
})();
