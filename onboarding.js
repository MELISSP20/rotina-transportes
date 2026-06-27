/* onboarding.js — Tour guiado para novos usuários
   Roda automaticamente na primeira visita ao Hub.
   Conclusão salva em localStorage como 'onboarding_completed_v1'.
   Pode ser disparado manualmente via window.__startOnboarding() */

(function() {
  if (window.__onboardingInit) return;
  window.__onboardingInit = true;

  const STORAGE_KEY = 'onboarding_completed_v1';

  // ── PASSOS DO TOUR ──
  const STEPS = [
    {
      target: null,
      title: 'Bem-vindo ao Assignments',
      body: 'Vou te apresentar o site em <b>1 minuto</b>. Pode pular a qualquer momento.',
      icon: '👋',
    },
    {
      target: '.hub-title',
      title: 'Esta é a sua casa',
      body: 'O <b>Hub</b> é sua tela inicial. De aqui você acessa todas as ferramentas.',
      placement: 'bottom',
      icon: '🏠',
    },
    {
      target: '.hub-trivia',
      title: 'Carrossel de curiosidades',
      body: '<b>61 fatos</b> sobre operação, Mercado Livre e o próprio site, rotacionando a cada 8 segundos. Use as setas pra navegar.',
      placement: 'bottom',
      icon: '✨',
    },
    {
      target: '.hub-grid',
      title: '8 cards de acesso',
      body: 'Suas ferramentas principais: <b>Rotina, Organograma, DIT Report, ORH, Descontainerizados, Cidades, Produtos e Diário</b>. Clica em qualquer um.',
      placement: 'top',
      icon: '🎯',
    },
    {
      target: '.topbar-nav',
      title: 'Navegação pela topbar',
      body: 'A topbar fica visível em todas as páginas. Use <b>Reports</b> e <b>Recursos</b> pra acessar mais ferramentas.',
      placement: 'bottom',
      icon: '🧭',
    },
    {
      target: '#reports-btn',
      title: 'Reports operacionais',
      body: 'Aqui você encontra <b>DIT, ORH, Descontainerizados e Comparativo SSPs</b>. Importe um CSV e o site processa pra você.',
      placement: 'bottom',
      icon: '📊',
    },
    {
      target: '#resources-btn',
      title: 'Recursos auxiliares',
      body: '<b>Cidades por Rota</b>, <b>Resumo de Produtos</b> e <b>Volumosos por Ciclo</b>. Ferramentas pra resolver problemas pontuais.',
      placement: 'bottom',
      icon: '🔧',
    },
    {
      target: '.query-hub-link',
      title: 'Query Hub externo',
      body: 'Atalho pro <b>Query Hub</b> — dezenas de queries SQL prontas pro BigQuery.',
      placement: 'bottom',
      icon: '⚡',
    },
    {
      target: null,
      title: 'Atalhos de teclado',
      body: 'Aperte <kbd>?</kbd> em qualquer página pra ver todos os atalhos. <kbd>H</kbd> volta pro Hub, <kbd>R</kbd> vai pra Rotina, <kbd>O</kbd> Organograma...',
      icon: '⌨️',
    },
    {
      target: null,
      title: 'Pronto pra usar 🎉',
      body: 'O tour terminou. Se quiser refazer, vai até o rodapé e clica em <b>"Refazer tour"</b>. Bom turno!',
      icon: '✅',
    },
  ];

  // ── ESTILO ──
  const style = document.createElement('style');
  style.textContent = `
    /* Overlay escuro */
    #onb-overlay {
      position: fixed;
      inset: 0;
      z-index: 100000;
      pointer-events: auto;
      background: rgba(8, 10, 20, .68);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      transition: opacity .3s ease;
      opacity: 0;
    }
    #onb-overlay.visible { opacity: 1; }

    /* Spotlight (recorte do elemento destacado) */
    #onb-spotlight {
      position: absolute;
      border-radius: 12px;
      box-shadow: 0 0 0 9999px rgba(8, 10, 20, .72);
      transition: all .35s cubic-bezier(.4,0,.2,1);
      pointer-events: none;
      border: 2px solid var(--yellow, #FFE600);
      animation: onbPulse 2s infinite;
    }
    @keyframes onbPulse {
      0%, 100% { box-shadow: 0 0 0 9999px rgba(8, 10, 20, .72), 0 0 0 0 rgba(255,230,0,.5); }
      50% { box-shadow: 0 0 0 9999px rgba(8, 10, 20, .72), 0 0 0 8px rgba(255,230,0,0); }
    }

    /* Tooltip flutuante */
    #onb-tooltip {
      position: absolute;
      background: #FFFFFF;
      color: #1A1A2E;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,.4), 0 0 0 1px rgba(0,0,0,.06);
      padding: 22px 24px;
      max-width: 380px;
      min-width: 280px;
      font-family: 'Inter', sans-serif;
      z-index: 100001;
      transition: all .35s cubic-bezier(.4,0,.2,1);
      animation: onbFadeIn .35s cubic-bezier(.4,0,.2,1);
    }
    [data-theme="dark"] #onb-tooltip {
      background: #1A1D27;
      color: #E8EAF2;
      box-shadow: 0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.08);
    }
    @keyframes onbFadeIn { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }

    /* Quando centralizado (sem alvo) */
    #onb-tooltip.center {
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%);
      max-width: 440px;
    }
    @keyframes onbFadeInCenter {
      from { opacity: 0; transform: translate(-50%, -45%) scale(.96); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    #onb-tooltip.center { animation: onbFadeInCenter .35s cubic-bezier(.4,0,.2,1); }

    /* Header do tooltip */
    .onb-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .onb-icon {
      font-size: 26px;
      line-height: 1;
    }
    .onb-step-counter {
      margin-left: auto;
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: .14em;
      color: rgba(0,0,0,.45);
      text-transform: uppercase;
      font-variant-numeric: tabular-nums;
      background: rgba(0,0,0,.05);
      padding: 4px 9px;
      border-radius: 6px;
    }
    [data-theme="dark"] .onb-step-counter { color: rgba(255,255,255,.55); background: rgba(255,255,255,.06); }

    /* Título e corpo */
    .onb-title {
      font-size: 18px;
      font-weight: 900;
      color: #1A1A2E;
      letter-spacing: -.4px;
      line-height: 1.2;
      margin-bottom: 8px;
    }
    [data-theme="dark"] .onb-title { color: #E8EAF2; }
    .onb-body {
      font-size: 13.5px;
      font-weight: 500;
      color: #444;
      line-height: 1.55;
      letter-spacing: -.05px;
    }
    [data-theme="dark"] .onb-body { color: rgba(232, 234, 242, .85); }
    .onb-body b { color: #1A1A2E; font-weight: 800; }
    [data-theme="dark"] .onb-body b { color: #FFE600; }
    .onb-body kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      padding: 1px 6px;
      background: #F5F5F5;
      border: 1px solid #E0E0E0;
      border-bottom-width: 2px;
      border-radius: 4px;
      font-family: ui-monospace, monospace;
      font-size: 10.5px;
      font-weight: 700;
      color: #333;
    }
    [data-theme="dark"] .onb-body kbd {
      background: rgba(255,255,255,.06);
      border-color: rgba(255,255,255,.12);
      color: #E8EAF2;
    }

    /* Footer com botões */
    .onb-foot {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid rgba(0,0,0,.08);
    }
    [data-theme="dark"] .onb-foot { border-top-color: rgba(255,255,255,.08); }
    .onb-skip {
      background: transparent;
      border: none;
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 700;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      padding: 8px 6px;
      text-decoration: underline;
      transition: color .15s;
      letter-spacing: -.1px;
    }
    .onb-skip:hover { color: rgba(0,0,0,.7); }
    [data-theme="dark"] .onb-skip { color: rgba(255,255,255,.45); }
    [data-theme="dark"] .onb-skip:hover { color: rgba(255,255,255,.85); }

    .onb-actions {
      margin-left: auto;
      display: flex;
      gap: 6px;
    }
    .onb-btn {
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 800;
      cursor: pointer;
      transition: all .15s;
      letter-spacing: -.1px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .onb-btn-secondary {
      background: rgba(0,0,0,.06);
      color: #1A1A2E;
    }
    .onb-btn-secondary:hover { background: rgba(0,0,0,.1); }
    [data-theme="dark"] .onb-btn-secondary { background: rgba(255,255,255,.08); color: #E8EAF2; }
    [data-theme="dark"] .onb-btn-secondary:hover { background: rgba(255,255,255,.14); }

    .onb-btn-primary {
      background: #1A1A2E;
      color: #FFE600;
    }
    .onb-btn-primary:hover { background: #2A2D44; transform: translateY(-1px); box-shadow: 0 6px 14px rgba(26,26,46,.25); }

    /* Botão "Refazer tour" no footer da página */
    .onb-redo {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: transparent;
      border: none;
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: var(--muted, #666);
      cursor: pointer;
      letter-spacing: .14em;
      text-transform: uppercase;
      opacity: .55;
      transition: opacity .15s;
      padding: 4px 8px;
      margin-top: 6px;
    }
    .onb-redo:hover { opacity: 1; color: var(--text, #1A1A2E); }
    .onb-redo::before {
      content: '↻';
      font-size: 12px;
    }

    @media (max-width: 600px) {
      #onb-tooltip {
        max-width: calc(100vw - 24px);
        min-width: 0;
        padding: 18px 18px;
      }
      .onb-title { font-size: 16px; }
      .onb-body { font-size: 12.5px; }
      .onb-actions { gap: 4px; }
      .onb-btn { padding: 7px 12px; font-size: 11.5px; }
    }
  `;
  document.head.appendChild(style);

  let currentStep = 0;
  let overlay, spotlight, tooltip;

  // ── BOOT ──
  function shouldRun() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1';
    } catch { return false; }
  }

  function markCompleted() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  // ── DOM ──
  function ensureElements() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'onb-overlay';
    document.body.appendChild(overlay);

    spotlight = document.createElement('div');
    spotlight.id = 'onb-spotlight';
    spotlight.style.display = 'none';
    document.body.appendChild(spotlight);

    tooltip = document.createElement('div');
    tooltip.id = 'onb-tooltip';
    document.body.appendChild(tooltip);
  }

  function removeElements() {
    if (overlay) { overlay.remove(); overlay = null; }
    if (spotlight) { spotlight.remove(); spotlight = null; }
    if (tooltip) { tooltip.remove(); tooltip = null; }
  }

  // ── RENDER ──
  function renderStep(idx) {
    const step = STEPS[idx];
    if (!step) return finish();

    const isLast = idx === STEPS.length - 1;
    const isFirst = idx === 0;

    // Conteúdo do tooltip
    tooltip.innerHTML = `
      <div class="onb-head">
        <span class="onb-icon">${step.icon}</span>
        <span class="onb-step-counter">${idx + 1} / ${STEPS.length}</span>
      </div>
      <div class="onb-title">${step.title}</div>
      <div class="onb-body">${step.body}</div>
      <div class="onb-foot">
        <button class="onb-skip" onclick="window.__onbSkip()">Pular tour</button>
        <div class="onb-actions">
          ${isFirst ? '' : '<button class="onb-btn onb-btn-secondary" onclick="window.__onbPrev()">← Voltar</button>'}
          <button class="onb-btn onb-btn-primary" onclick="window.__onbNext()">
            ${isLast ? '🎉 Finalizar' : 'Próximo →'}
          </button>
        </div>
      </div>
    `;

    // Posicionar tooltip / spotlight
    if (step.target) {
      const el = document.querySelector(step.target);
      if (el) {
        positionOnElement(el, step.placement || 'bottom');
        return;
      }
    }

    // Sem alvo → centralizar
    tooltip.classList.add('center');
    spotlight.style.display = 'none';
  }

  function positionOnElement(el, placement) {
    // Garantir que o elemento esteja visível
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    // Aguarda scroll terminar
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const pad = 8;

      // Spotlight
      spotlight.style.display = 'block';
      spotlight.style.top = (rect.top - pad) + 'px';
      spotlight.style.left = (rect.left - pad) + 'px';
      spotlight.style.width = (rect.width + pad * 2) + 'px';
      spotlight.style.height = (rect.height + pad * 2) + 'px';

      // Tooltip
      tooltip.classList.remove('center');
      const tipRect = tooltip.getBoundingClientRect();
      const margin = 18;
      let top, left;

      if (placement === 'bottom') {
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
      } else if (placement === 'top') {
        top = rect.top - tipRect.height - margin;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
      } else if (placement === 'left') {
        top = rect.top + rect.height / 2 - tipRect.height / 2;
        left = rect.left - tipRect.width - margin;
      } else if (placement === 'right') {
        top = rect.top + rect.height / 2 - tipRect.height / 2;
        left = rect.right + margin;
      } else {
        // auto: prefere bottom, depois top
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
      }

      // Constrain dentro da viewport
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const minMargin = 12;
      if (left < minMargin) left = minMargin;
      if (left + tipRect.width > vw - minMargin) left = vw - tipRect.width - minMargin;
      if (top < minMargin) {
        // tenta inverter pra bottom
        top = rect.bottom + margin;
      }
      if (top + tipRect.height > vh - minMargin) {
        // tenta inverter pra top
        top = rect.top - tipRect.height - margin;
        if (top < minMargin) top = minMargin;
      }

      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
    }, 280);
  }

  // ── CONTROLE ──
  function start() {
    ensureElements();
    currentStep = 0;
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
      renderStep(currentStep);
    });
  }

  function next() {
    currentStep++;
    if (currentStep >= STEPS.length) return finish();
    renderStep(currentStep);
  }

  function prev() {
    if (currentStep === 0) return;
    currentStep--;
    renderStep(currentStep);
  }

  function skip() {
    markCompleted();
    cleanup();
  }

  function finish() {
    markCompleted();
    cleanup();
  }

  function cleanup() {
    if (overlay) overlay.classList.remove('visible');
    setTimeout(removeElements, 320);
  }

  // ── ATALHOS DE TECLADO ──
  document.addEventListener('keydown', (e) => {
    if (!overlay || !overlay.classList.contains('visible')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'Escape') { e.preventDefault(); skip(); }
    else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  // ── API ──
  window.__onbNext = next;
  window.__onbPrev = prev;
  window.__onbSkip = skip;
  window.__startOnboarding = function() {
    reset();
    start();
  };

  // ── BOOT AUTOMÁTICO no Hub ──
  function init() {
    if (!document.body) { setTimeout(init, 50); return; }

    // Verificar se está no Hub (index.html)
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const isHub = path === 'index.html' || path === '' || path.endsWith('/');

    if (!isHub) return;

    if (shouldRun()) {
      // Pequeno delay pra deixar a página carregar e animações entrarem
      setTimeout(start, 900);
    }
  }
  init();
})();
