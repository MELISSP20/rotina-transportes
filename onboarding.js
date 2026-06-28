/* onboarding.js — Tour cinematográfico do Assignments
   v2 · Capítulos, typewriter, spotlight com particles, confetti no final
   Roda automaticamente na primeira visita ao Hub.
   API: window.__startOnboarding() */

(function() {
  if (window.__onboardingInit) return;
  window.__onboardingInit = true;

  const STORAGE_KEY = 'onboarding_completed_v2';

  // ── ESTRUTURA DO TOUR ──
  const CHAPTERS = {
    intro:  { num: 0, label: 'Boas-vindas', color: '#FFE600' },
    cap1:   { num: 1, label: 'A Casa',       color: '#22C55E' },
    cap2:   { num: 2, label: 'As Ferramentas', color: '#3B82F6' },
    cap3:   { num: 3, label: 'Os Segredos',  color: '#A855F7' },
    finale: { num: 4, label: 'Pronto.',      color: '#FFE600' },
  };

  const STEPS = [
    // ─── INTRO ───
    {
      kind: 'welcome',
      chapter: 'intro',
      title: 'Olá.',
      subtitle: 'Vou te apresentar o Assignments em 60 segundos.',
      hint: 'Aperte <kbd>→</kbd> ou clique em começar',
      icon: '👋',
    },
    // ─── CAP 1 · A CASA ───
    {
      kind: 'step',
      chapter: 'cap1',
      target: '.hub-title',
      title: 'Esta é a sua casa.',
      body: 'O <b>Hub</b> é onde tudo começa. Aqui você acessa todas as ferramentas operacionais do turno.',
      placement: 'bottom',
      icon: '🏠',
      accent: 'Hub central',
    },
    {
      kind: 'step',
      chapter: 'cap1',
      target: '.hub-trivia',
      title: '112 curiosidades rotativas.',
      body: 'Setas pra navegar. Trocar a cada 8 segundos. Tem fato sobre operação, MELI, last mile e mais.',
      placement: 'bottom',
      icon: '✨',
      accent: 'Carrossel',
    },
    {
      kind: 'step',
      chapter: 'cap1',
      target: '.hub-grid',
      title: '8 ferramentas, 1 clique.',
      body: '<b>Rotina · Organograma · DIT Report · ORH · Descontainerizados · Cidades · Produtos · Diário</b>. Suas principais armas operacionais.',
      placement: 'top',
      icon: '🎯',
      accent: 'Grid de acesso',
    },
    // ─── CAP 2 · AS FERRAMENTAS ───
    {
      kind: 'chapter',
      chapter: 'cap2',
      title: 'Capítulo 2',
      subtitle: 'As ferramentas que ficam em qualquer lugar.',
      icon: '🧭',
    },
    {
      kind: 'step',
      chapter: 'cap2',
      target: '#reports-btn',
      title: 'Reports operacionais.',
      body: '<b>DIT · ORH · Descont.</b> — importe um CSV, o site processa.',
      placement: 'bottom',
      icon: '📊',
      accent: 'Reports',
    },
    {
      kind: 'step',
      chapter: 'cap2',
      target: '#resources-btn',
      title: 'Recursos auxiliares.',
      body: '<b>Cidades por Rota · Resumo de Produtos · Volumosos por Ciclo</b>. Ferramentas pontuais pro dia a dia.',
      placement: 'bottom',
      icon: '🔧',
      accent: 'Recursos',
    },
    {
      kind: 'step',
      chapter: 'cap2',
      target: '.query-hub-link',
      title: 'Query Hub.',
      body: 'Site irmão com queries SQL prontas pro <b>BigQuery</b>. Atalho rápido pra todas as queries da operação.',
      placement: 'bottom',
      icon: '⚡',
      accent: 'BigQuery',
    },
    // ─── CAP 3 · OS SEGREDOS ───
    {
      kind: 'chapter',
      chapter: 'cap3',
      title: 'Capítulo 3',
      subtitle: 'Tem coisa escondida aqui. Muita coisa.',
      icon: '🔮',
    },
    {
      kind: 'step',
      chapter: 'cap3',
      title: 'Atalhos de teclado.',
      body: 'Aperte <kbd>?</kbd> em qualquer página. <kbd>⇧</kbd>+<kbd>H</kbd> volta pro Hub, <kbd>⇧</kbd>+<kbd>R</kbd> Rotina, <kbd>⇧</kbd>+<kbd>O</kbd> Organograma, e por aí vai.',
      icon: '⌨️',
      accent: '10 atalhos',
    },
    {
      kind: 'step',
      chapter: 'cap3',
      title: '14 easter eggs escondidos.',
      body: 'Digite <code>matrix</code>, <code>vapor</code>, <code>claude</code>, <code>boost</code>, <code>madrugada</code>, <code>curiosidades</code>… ou click 5x no título. <b>Boa caça.</b>',
      icon: '🥚',
      accent: 'Surpresas',
    },
    // ─── FINALE ───
    {
      kind: 'finale',
      chapter: 'finale',
      title: 'Pronto.',
      subtitle: 'Você descobriu o Assignments.',
      icon: '🎉',
    },
  ];

  const TOTAL_STEPS = STEPS.length;

  // ── CSS ──
  const style = document.createElement('style');
  style.textContent = `
    /* ──────────────────────────────────────────────────────────────
       OVERLAY + spotlight + tooltip
       ────────────────────────────────────────────────────────────── */
    #onb-overlay {
      position: fixed;
      inset: 0;
      z-index: 100000;
      pointer-events: auto;
      background: rgba(8, 10, 20, .75);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      transition: opacity .4s ease, background .4s ease;
      opacity: 0;
    }
    #onb-overlay.visible { opacity: 1; }

    /* Confetti container */
    #onb-confetti {
      position: fixed;
      inset: 0;
      z-index: 100002;
      pointer-events: none;
      overflow: hidden;
    }
    .onb-confetti-piece {
      position: absolute;
      top: -20px;
      width: 8px; height: 14px;
      animation: onbConfettiFall linear forwards;
      border-radius: 1px;
    }
    @keyframes onbConfettiFall {
      0%   { transform: translateY(0) rotate(0); opacity: 1; }
      100% { transform: translateY(105vh) rotate(720deg); opacity: 0.5; }
    }

    /* ──────────────────────────────────────────────────────────────
       SPOTLIGHT com particles
       ────────────────────────────────────────────────────────────── */
    #onb-spotlight {
      position: absolute;
      border-radius: 14px;
      box-shadow: 0 0 0 9999px rgba(8, 10, 20, .82);
      transition: all .4s cubic-bezier(.4,0,.2,1);
      pointer-events: none;
      border: 3px solid var(--onb-color, #FFE600);
      animation: onbPulse 2.2s infinite;
    }
    @keyframes onbPulse {
      0%, 100% { box-shadow: 0 0 0 9999px rgba(8,10,20,.82), 0 0 0 0 rgba(255,230,0,.55), 0 0 30px rgba(255,230,0,.35); }
      50%      { box-shadow: 0 0 0 9999px rgba(8,10,20,.82), 0 0 0 14px rgba(255,230,0,0),   0 0 60px rgba(255,230,0,.5); }
    }
    /* Particles flutuando ao redor */
    .onb-particle {
      position: absolute;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--onb-color, #FFE600);
      pointer-events: none;
      box-shadow: 0 0 10px var(--onb-color, #FFE600);
      animation: onbParticleFloat 2.5s ease-in-out infinite;
      z-index: 100001;
    }
    @keyframes onbParticleFloat {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: .7; }
      33%      { transform: translate(8px, -10px) scale(1.3); opacity: 1; }
      66%      { transform: translate(-6px, 8px) scale(.8); opacity: .8; }
    }

    /* ──────────────────────────────────────────────────────────────
       TOOLTIP layout 2-col com header de capítulo
       ────────────────────────────────────────────────────────────── */
    #onb-tooltip {
      position: absolute;
      background: #FFFFFF;
      color: #1A1A2E;
      border-radius: 18px;
      box-shadow: 0 24px 64px rgba(0,0,0,.42), 0 0 0 1px rgba(0,0,0,.05);
      max-width: 420px;
      min-width: 320px;
      font-family: 'Inter', sans-serif;
      z-index: 100001;
      overflow: hidden;
      transition: top .4s cubic-bezier(.4,0,.2,1), left .4s cubic-bezier(.4,0,.2,1), opacity .25s;
      animation: onbTooltipIn .4s cubic-bezier(.34,1.56,.64,1);
    }
    [data-theme="dark"] #onb-tooltip {
      background: #1A1D27;
      color: #E8EAF2;
      box-shadow: 0 24px 64px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.08);
    }
    @keyframes onbTooltipIn {
      from { opacity: 0; transform: translateY(8px) scale(.94); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    #onb-tooltip.fading { opacity: 0; transform: scale(.96); }
    #onb-tooltip.center {
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      max-width: 520px;
      animation: onbTooltipInCenter .45s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes onbTooltipInCenter {
      from { opacity: 0; transform: translate(-50%, -45%) scale(.92); }
      to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    /* Progress bar no topo do tooltip */
    .onb-progress {
      height: 3px;
      background: rgba(0,0,0,.06);
      position: relative;
      overflow: hidden;
    }
    [data-theme="dark"] .onb-progress { background: rgba(255,255,255,.06); }
    .onb-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--onb-color, #FFE600), #F5C518);
      box-shadow: 0 0 8px var(--onb-color, #FFE600);
      transition: width .5s cubic-bezier(.4,0,.2,1);
      border-radius: 0 100px 100px 0;
    }

    /* Body com 2 colunas */
    .onb-content {
      padding: 22px 24px 6px;
      display: grid;
      grid-template-columns: 56px 1fr;
      gap: 16px;
      align-items: start;
    }
    .onb-icon-wrap {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: var(--onb-color-bg, rgba(255,230,0,.12));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      line-height: 1;
      flex-shrink: 0;
      border: 1px solid var(--onb-color, #FFE600);
      animation: onbIconBounce .5s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes onbIconBounce { from { transform: scale(.5); } to { transform: scale(1); } }
    .onb-text { min-width: 0; }
    .onb-chapter-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .onb-chapter-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 9.5px;
      font-weight: 900;
      letter-spacing: .16em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 5px;
      background: var(--onb-color-bg, rgba(255,230,0,.15));
      color: var(--onb-color-dark, #A07800);
    }
    [data-theme="dark"] .onb-chapter-badge {
      color: var(--onb-color, #FFE600);
      background: var(--onb-color-bg, rgba(255,230,0,.15));
    }
    .onb-accent {
      font-size: 10.5px;
      font-weight: 700;
      color: rgba(0,0,0,.4);
      letter-spacing: -.05px;
    }
    [data-theme="dark"] .onb-accent { color: rgba(255,255,255,.4); }
    .onb-title {
      font-size: 20px;
      font-weight: 900;
      color: inherit;
      letter-spacing: -.7px;
      line-height: 1.15;
      margin-bottom: 6px;
    }
    .onb-title-dot {
      color: var(--onb-color, #FFE600);
    }
    .onb-body {
      font-size: 13.5px;
      font-weight: 500;
      color: rgba(0,0,0,.65);
      line-height: 1.55;
      letter-spacing: -.05px;
    }
    [data-theme="dark"] .onb-body { color: rgba(232,234,242,.78); }
    .onb-body b { color: #1A1A2E; font-weight: 800; }
    [data-theme="dark"] .onb-body b { color: var(--onb-color, #FFE600); }
    .onb-body kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      padding: 2px 7px;
      background: #F5F5F5;
      border: 1px solid #E0E0E0;
      border-bottom-width: 2px;
      border-radius: 5px;
      font-family: ui-monospace, monospace;
      font-size: 10.5px;
      font-weight: 800;
      color: #333;
      margin: 0 1px;
    }
    [data-theme="dark"] .onb-body kbd {
      background: rgba(255,255,255,.06);
      border-color: rgba(255,255,255,.14);
      color: #E8EAF2;
    }
    .onb-body code {
      background: rgba(255,230,0,.16);
      color: #1A1A2E;
      padding: 1px 6px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      font-weight: 700;
      margin: 0 1px;
    }
    [data-theme="dark"] .onb-body code {
      background: rgba(255,230,0,.16);
      color: #FFE600;
    }

    /* Footer */
    .onb-foot {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px 18px;
      border-top: 1px solid rgba(0,0,0,.06);
      margin-top: 14px;
    }
    [data-theme="dark"] .onb-foot { border-top-color: rgba(255,255,255,.06); }
    .onb-counter {
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: .1em;
      color: rgba(0,0,0,.45);
      font-variant-numeric: tabular-nums;
      font-family: 'JetBrains Mono', monospace;
    }
    [data-theme="dark"] .onb-counter { color: rgba(255,255,255,.5); }
    .onb-counter-cur { color: var(--onb-color-dark, #1A1A2E); }
    [data-theme="dark"] .onb-counter-cur { color: var(--onb-color, #FFE600); }
    .onb-skip {
      background: transparent;
      border: none;
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 700;
      color: rgba(0,0,0,.42);
      cursor: pointer;
      padding: 6px 4px;
      transition: color .15s;
      letter-spacing: -.05px;
      text-decoration: underline;
      text-underline-offset: 3px;
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
      border-radius: 10px;
      padding: 9px 16px;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 800;
      cursor: pointer;
      transition: all .18s cubic-bezier(.34,1.56,.64,1);
      letter-spacing: -.1px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .onb-btn-secondary {
      background: rgba(0,0,0,.06);
      color: #1A1A2E;
    }
    .onb-btn-secondary:hover { background: rgba(0,0,0,.1); transform: translateY(-1px); }
    [data-theme="dark"] .onb-btn-secondary { background: rgba(255,255,255,.08); color: #E8EAF2; }
    [data-theme="dark"] .onb-btn-secondary:hover { background: rgba(255,255,255,.14); }
    .onb-btn-primary {
      background: #1A1A2E;
      color: #FFE600;
      box-shadow: 0 4px 12px rgba(26,26,46,.25);
    }
    .onb-btn-primary:hover {
      background: #2A2D44;
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(26,26,46,.32);
    }

    /* ──────────────────────────────────────────────────────────────
       WELCOME SCREEN (intro fullscreen)
       ────────────────────────────────────────────────────────────── */
    .onb-welcome {
      position: fixed;
      inset: 0;
      z-index: 100001;
      background: radial-gradient(ellipse at top, #1A1F3D 0%, #06080F 70%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      animation: onbFadeIn .4s ease-out;
    }
    .onb-welcome.fading { animation: onbFadeOut .35s ease-in forwards; }
    @keyframes onbFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes onbFadeOut { to { opacity: 0; } }

    /* Stars no fundo da welcome */
    .onb-welcome-star {
      position: absolute;
      color: #FFE600;
      pointer-events: none;
      animation: onbStarTwinkle ease-in-out infinite;
    }
    @keyframes onbStarTwinkle {
      0%, 100% { opacity: .8; transform: scale(1); }
      50%      { opacity: .2; transform: scale(.6); }
    }

    .onb-welcome-logo {
      width: 80px; height: 80px;
      background: #FFE600;
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 44px;
      margin-bottom: 28px;
      box-shadow: 0 0 60px rgba(255,230,0,.4), 0 14px 32px rgba(0,0,0,.4);
      animation: onbLogoIn .6s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes onbLogoIn {
      0%   { opacity: 0; transform: scale(.4) rotate(-10deg); }
      60%  { opacity: 1; transform: scale(1.1) rotate(5deg); }
      100% { opacity: 1; transform: scale(1) rotate(0); }
    }
    .onb-welcome-eyebrow {
      font-size: 10.5px;
      font-weight: 900;
      letter-spacing: .26em;
      color: #FFE600;
      text-transform: uppercase;
      margin-bottom: 14px;
      animation: onbFadeIn .8s ease-out .25s backwards;
    }
    .onb-welcome-title {
      font-size: 76px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -3px;
      line-height: 1;
      margin-bottom: 14px;
      text-align: center;
    }
    .onb-welcome-title-dot {
      color: #FFE600;
      animation: onbDotPulse 1.4s ease-in-out infinite;
    }
    @keyframes onbDotPulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: .5; }
    }
    /* Typewriter cursor */
    .onb-typewriter::after {
      content: '|';
      color: #FFE600;
      font-weight: 100;
      margin-left: 2px;
      animation: onbCursorBlink 1s steps(2) infinite;
    }
    .onb-typewriter.done::after { display: none; }
    @keyframes onbCursorBlink { 50% { opacity: 0; } }

    .onb-welcome-sub {
      font-size: 18px;
      font-weight: 500;
      color: rgba(255,255,255,.72);
      letter-spacing: -.3px;
      line-height: 1.45;
      max-width: 540px;
      text-align: center;
      margin-bottom: 38px;
      min-height: 1.5em;
    }
    .onb-welcome-actions {
      display: flex;
      gap: 12px;
      animation: onbFadeIn .8s ease-out 1.2s backwards;
    }
    .onb-welcome-btn {
      border: none;
      border-radius: 100px;
      padding: 14px 26px;
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 800;
      cursor: pointer;
      transition: all .2s cubic-bezier(.34,1.56,.64,1);
      letter-spacing: -.1px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .onb-welcome-btn-primary {
      background: #FFE600;
      color: #1A1A2E;
      box-shadow: 0 8px 24px rgba(255,230,0,.4);
    }
    .onb-welcome-btn-primary:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 16px 36px rgba(255,230,0,.55);
    }
    .onb-welcome-btn-ghost {
      background: rgba(255,255,255,.06);
      color: rgba(255,255,255,.8);
      border: 1px solid rgba(255,255,255,.14);
    }
    .onb-welcome-btn-ghost:hover {
      background: rgba(255,255,255,.1);
      color: #fff;
    }
    .onb-welcome-hint {
      margin-top: 24px;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,.4);
      letter-spacing: .04em;
      animation: onbFadeIn .8s ease-out 1.6s backwards;
    }
    .onb-welcome-hint kbd {
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.16);
      border-bottom-width: 2px;
      border-radius: 5px;
      padding: 2px 7px;
      font-family: monospace;
      font-size: 10.5px;
      font-weight: 800;
      color: #fff;
    }

    /* ──────────────────────────────────────────────────────────────
       CHAPTER intro (entre capítulos)
       ────────────────────────────────────────────────────────────── */
    .onb-chapter-intro {
      position: fixed;
      inset: 0;
      z-index: 100001;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      padding: 40px;
      text-align: center;
    }
    .onb-chapter-num {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: .4em;
      color: var(--onb-color, #FFE600);
      text-transform: uppercase;
      margin-bottom: 8px;
      animation: onbChapterNumIn .5s ease-out;
    }
    @keyframes onbChapterNumIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .onb-chapter-emoji {
      font-size: 56px;
      line-height: 1;
      margin-bottom: 18px;
      animation: onbChapterEmojiIn .6s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes onbChapterEmojiIn { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: scale(1); } }
    .onb-chapter-name {
      font-size: 58px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -2.5px;
      line-height: 1;
      margin-bottom: 12px;
      animation: onbChapterNumIn .6s ease-out .15s backwards;
    }
    .onb-chapter-name span {
      color: var(--onb-color, #FFE600);
    }
    .onb-chapter-tagline {
      font-size: 16px;
      font-weight: 500;
      color: rgba(255,255,255,.7);
      letter-spacing: -.2px;
      max-width: 480px;
      animation: onbChapterNumIn .6s ease-out .3s backwards;
    }

    /* ──────────────────────────────────────────────────────────────
       FINALE celebration screen
       ────────────────────────────────────────────────────────────── */
    .onb-finale {
      position: fixed;
      inset: 0;
      z-index: 100001;
      background: radial-gradient(ellipse at center, #1A1F3D 0%, #06080F 80%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      animation: onbFadeIn .4s ease-out;
    }
    .onb-finale.fading { animation: onbFadeOut .35s ease-in forwards; }
    .onb-finale-trophy {
      font-size: 90px;
      line-height: 1;
      margin-bottom: 18px;
      animation: onbTrophyBounce 1s cubic-bezier(.34,1.56,.64,1), onbTrophyFloat 3s ease-in-out infinite 1s;
      filter: drop-shadow(0 12px 32px rgba(255,230,0,.5));
      display: inline-block;
    }
    @keyframes onbTrophyBounce {
      0%   { opacity: 0; transform: scale(.3) translateY(-40px); }
      60%  { opacity: 1; transform: scale(1.15) translateY(8px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes onbTrophyFloat {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-10px); }
    }
    .onb-finale-eyebrow {
      font-size: 10.5px;
      font-weight: 900;
      letter-spacing: .3em;
      color: #FFE600;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .onb-finale-title {
      font-size: 86px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -3.5px;
      line-height: 1;
      margin-bottom: 14px;
      text-align: center;
    }
    .onb-finale-title span { color: #FFE600; }
    .onb-finale-sub {
      font-size: 18px;
      font-weight: 500;
      color: rgba(255,255,255,.72);
      letter-spacing: -.2px;
      max-width: 480px;
      text-align: center;
      margin-bottom: 36px;
    }
    .onb-finale-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 38px;
      width: 100%;
      max-width: 580px;
    }
    .onb-finale-stat {
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 14px;
      padding: 18px 14px;
      text-align: center;
      animation: onbStatIn .5s cubic-bezier(.34,1.56,.64,1) both;
    }
    .onb-finale-stat:nth-child(1) { animation-delay: .4s; }
    .onb-finale-stat:nth-child(2) { animation-delay: .55s; }
    .onb-finale-stat:nth-child(3) { animation-delay: .7s; }
    .onb-finale-stat:nth-child(4) { animation-delay: .85s; }
    @keyframes onbStatIn {
      from { opacity: 0; transform: translateY(20px) scale(.85); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .onb-finale-stat-val {
      font-size: 32px;
      font-weight: 900;
      color: #FFE600;
      letter-spacing: -1px;
      line-height: 1;
      margin-bottom: 5px;
      font-variant-numeric: tabular-nums;
    }
    .onb-finale-stat-lbl {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: .14em;
      color: rgba(255,255,255,.5);
      text-transform: uppercase;
    }
    .onb-finale-cta {
      background: #FFE600;
      color: #1A1A2E;
      border: none;
      border-radius: 100px;
      padding: 16px 32px;
      font-family: inherit;
      font-size: 14.5px;
      font-weight: 900;
      cursor: pointer;
      letter-spacing: -.1px;
      box-shadow: 0 10px 32px rgba(255,230,0,.4);
      transition: all .2s cubic-bezier(.34,1.56,.64,1);
      animation: onbStatIn .6s cubic-bezier(.34,1.56,.64,1) 1.1s both;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .onb-finale-cta:hover {
      transform: translateY(-3px) scale(1.04);
      box-shadow: 0 18px 44px rgba(255,230,0,.55);
    }

    /* ── REDO botão no footer ── */
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

    /* ── MOBILE ── */
    @media (max-width: 700px) {
      #onb-tooltip {
        max-width: calc(100vw - 24px);
        min-width: 0;
      }
      .onb-content { padding: 18px 18px 4px; grid-template-columns: 44px 1fr; gap: 12px; }
      .onb-icon-wrap { width: 44px; height: 44px; font-size: 22px; border-radius: 11px; }
      .onb-title { font-size: 17px; }
      .onb-body { font-size: 12.5px; }
      .onb-foot { padding: 12px 18px 14px; }
      .onb-actions { gap: 4px; }
      .onb-btn { padding: 8px 13px; font-size: 11.5px; }

      .onb-welcome-title { font-size: 54px; letter-spacing: -2px; }
      .onb-welcome-sub { font-size: 14px; }
      .onb-welcome-logo { width: 64px; height: 64px; font-size: 36px; }

      .onb-chapter-name { font-size: 38px; letter-spacing: -1.5px; }
      .onb-chapter-emoji { font-size: 44px; }
      .onb-chapter-tagline { font-size: 13.5px; }

      .onb-finale-title { font-size: 56px; letter-spacing: -2px; }
      .onb-finale-sub { font-size: 14.5px; }
      .onb-finale-trophy { font-size: 70px; }
      .onb-finale-stats { grid-template-columns: repeat(2, 1fr); }
      .onb-finale-stat-val { font-size: 24px; }
    }
  `;
  document.head.appendChild(style);

  let currentStep = 0;
  let overlay, spotlight, tooltip, particles = [];
  let typewriterTimer = null;

  // ── BOOT ──
  function shouldRun() {
    try { return localStorage.getItem(STORAGE_KEY) !== '1'; } catch { return false; }
  }
  function markCompleted() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  }
  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  // ── ELEMENTOS ──
  function ensureElements() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'onb-overlay';
    document.body.appendChild(overlay);
  }
  function removeElements() {
    document.getElementById('onb-overlay')?.remove();
    document.getElementById('onb-spotlight')?.remove();
    document.getElementById('onb-tooltip')?.remove();
    document.querySelector('.onb-welcome')?.remove();
    document.querySelector('.onb-finale')?.remove();
    document.getElementById('onb-confetti')?.remove();
    document.querySelector('.onb-chapter-intro')?.remove();
    particles.forEach(p => p.remove());
    particles = [];
    overlay = spotlight = tooltip = null;
  }

  function setColorVars(color) {
    const root = document.documentElement;
    root.style.setProperty('--onb-color', color);
    root.style.setProperty('--onb-color-bg', hexToBgAlpha(color, 0.13));
    root.style.setProperty('--onb-color-dark', hexToBgAlpha(color, 1, true));
  }
  function hexToBgAlpha(hex, alpha, dark) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    if (dark) {
      // versão mais escura pra texto
      const fr = Math.floor(r * 0.6), fg = Math.floor(g * 0.6), fb = Math.floor(b * 0.6);
      return `rgb(${fr}, ${fg}, ${fb})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // ── WELCOME SCREEN ──
  function renderWelcome(step) {
    const w = document.createElement('div');
    w.className = 'onb-welcome';

    // Stars no fundo
    for (let i = 0; i < 24; i++) {
      const s = document.createElement('span');
      s.className = 'onb-welcome-star';
      s.textContent = ['✦','✧','⋆','✨'][i % 4];
      s.style.left = (Math.random() * 100) + 'vw';
      s.style.top = (Math.random() * 100) + 'vh';
      s.style.fontSize = (8 + Math.random() * 16) + 'px';
      s.style.animationDelay = (Math.random() * 3) + 's';
      s.style.animationDuration = (2 + Math.random() * 2) + 's';
      w.appendChild(s);
    }

    w.innerHTML += `
      <div class="onb-welcome-logo">${step.icon}</div>
      <div class="onb-welcome-eyebrow">✦ ASSIGNMENTS · TOUR GUIADO</div>
      <h1 class="onb-welcome-title">${step.title}<span class="onb-welcome-title-dot">.</span></h1>
      <p class="onb-welcome-sub onb-typewriter" id="onb-welcome-sub"></p>
      <div class="onb-welcome-actions">
        <button class="onb-welcome-btn onb-welcome-btn-primary" onclick="window.__onbNext()">
          Começar tour
          <span>→</span>
        </button>
        <button class="onb-welcome-btn onb-welcome-btn-ghost" onclick="window.__onbSkip()">
          Pular
        </button>
      </div>
      <div class="onb-welcome-hint">${step.hint}</div>
    `;
    document.body.appendChild(w);

    // Typewriter effect no subtitle
    const target = w.querySelector('#onb-welcome-sub');
    const txt = step.subtitle;
    let i = 0;
    if (typewriterTimer) clearInterval(typewriterTimer);
    typewriterTimer = setInterval(() => {
      if (i >= txt.length) {
        clearInterval(typewriterTimer);
        target.classList.add('done');
        return;
      }
      target.textContent = txt.slice(0, ++i);
    }, 35);
  }

  // ── CHAPTER INTRO ──
  function renderChapterIntro(step) {
    const chap = CHAPTERS[step.chapter];
    setColorVars(chap.color);
    const intro = document.createElement('div');
    intro.className = 'onb-chapter-intro';
    intro.innerHTML = `
      <div class="onb-chapter-num">CAPÍTULO ${chap.num}</div>
      <div class="onb-chapter-emoji">${step.icon}</div>
      <h2 class="onb-chapter-name">${step.title}<span>.</span></h2>
      <p class="onb-chapter-tagline">${step.subtitle}</p>
    `;
    document.body.appendChild(intro);
    overlay.classList.add('visible');
    // Avança automaticamente em 2.2s
    setTimeout(() => {
      intro.style.animation = 'onbFadeOut .35s ease-in forwards';
      setTimeout(() => { intro.remove(); next(); }, 350);
    }, 2200);
  }

  // ── STEP (tooltip + spotlight) ──
  function renderStep(step) {
    const chap = CHAPTERS[step.chapter];
    setColorVars(chap.color);

    // Limpar particles antigos
    particles.forEach(p => p.remove());
    particles = [];

    // Criar/atualizar spotlight
    if (!spotlight) {
      spotlight = document.createElement('div');
      spotlight.id = 'onb-spotlight';
      spotlight.style.display = 'none';
      document.body.appendChild(spotlight);
    }
    // Criar/atualizar tooltip
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'onb-tooltip';
      document.body.appendChild(tooltip);
    }

    const progressPct = ((currentStep + 1) / TOTAL_STEPS * 100).toFixed(1);
    const isLast = currentStep === STEPS.length - 1;

    tooltip.innerHTML = `
      <div class="onb-progress">
        <div class="onb-progress-fill" style="width:${progressPct}%"></div>
      </div>
      <div class="onb-content">
        <div class="onb-icon-wrap">${step.icon}</div>
        <div class="onb-text">
          <div class="onb-chapter-row">
            <span class="onb-chapter-badge">${chap.label}</span>
            ${step.accent ? `<span class="onb-accent">· ${step.accent}</span>` : ''}
          </div>
          <div class="onb-title">${step.title.replace(/\.$/, '<span class="onb-title-dot">.</span>')}</div>
          <div class="onb-body">${step.body}</div>
        </div>
      </div>
      <div class="onb-foot">
        <span class="onb-counter"><span class="onb-counter-cur">${String(currentStep + 1).padStart(2,'0')}</span> / ${String(TOTAL_STEPS).padStart(2,'0')}</span>
        <button class="onb-skip" onclick="window.__onbSkip()">Pular</button>
        <div class="onb-actions">
          ${currentStep === 0 ? '' : '<button class="onb-btn onb-btn-secondary" onclick="window.__onbPrev()">← Voltar</button>'}
          <button class="onb-btn onb-btn-primary" onclick="window.__onbNext()">
            ${isLast ? 'Finalizar 🎉' : 'Próximo →'}
          </button>
        </div>
      </div>
    `;

    if (step.target) {
      const el = document.querySelector(step.target);
      if (el) {
        positionOnElement(el, step.placement || 'bottom');
        return;
      }
    }

    // Sem alvo → centralizar
    tooltip.classList.add('center');
    if (spotlight) spotlight.style.display = 'none';
  }

  function positionOnElement(el, placement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const pad = 10;

      spotlight.style.display = 'block';
      spotlight.style.top = (rect.top - pad) + 'px';
      spotlight.style.left = (rect.left - pad) + 'px';
      spotlight.style.width = (rect.width + pad * 2) + 'px';
      spotlight.style.height = (rect.height + pad * 2) + 'px';

      // Particles ao redor do spotlight
      const offsets = [
        { top: -15, left: -15 }, { top: -15, left: rect.width + 5 },
        { top: rect.height + 5, left: -15 }, { top: rect.height + 5, left: rect.width + 5 },
        { top: rect.height / 2, left: -22 }, { top: rect.height / 2, left: rect.width + 12 },
      ];
      offsets.forEach((o, i) => {
        const p = document.createElement('div');
        p.className = 'onb-particle';
        p.style.top = (rect.top + o.top) + 'px';
        p.style.left = (rect.left + o.left) + 'px';
        p.style.animationDelay = (i * 0.15) + 's';
        document.body.appendChild(p);
        particles.push(p);
      });

      // Tooltip
      tooltip.classList.remove('center');
      const tipRect = tooltip.getBoundingClientRect();
      const margin = 22;
      let top, left;

      if (placement === 'top') {
        top = rect.top - tipRect.height - margin;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
      } else if (placement === 'left') {
        top = rect.top + rect.height / 2 - tipRect.height / 2;
        left = rect.left - tipRect.width - margin;
      } else if (placement === 'right') {
        top = rect.top + rect.height / 2 - tipRect.height / 2;
        left = rect.right + margin;
      } else { // bottom (padrão)
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
      }

      const vw = window.innerWidth, vh = window.innerHeight, mm = 14;
      if (left < mm) left = mm;
      if (left + tipRect.width > vw - mm) left = vw - tipRect.width - mm;
      if (top < mm) top = rect.bottom + margin;
      if (top + tipRect.height > vh - mm) top = rect.top - tipRect.height - margin;
      if (top < mm) top = mm;

      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
    }, 320);
  }

  // ── FINALE ──
  function renderFinale() {
    setColorVars('#FFE600');
    const f = document.createElement('div');
    f.className = 'onb-finale';
    f.innerHTML = `
      <div class="onb-finale-trophy">🏆</div>
      <div class="onb-finale-eyebrow">✦ TOUR COMPLETO</div>
      <h1 class="onb-finale-title">Pronto<span>.</span></h1>
      <p class="onb-finale-sub">Você descobriu o Assignments. Agora é só operar.</p>
      <div class="onb-finale-stats">
        <div class="onb-finale-stat">
          <div class="onb-finale-stat-val">13</div>
          <div class="onb-finale-stat-lbl">Páginas</div>
        </div>
        <div class="onb-finale-stat">
          <div class="onb-finale-stat-val">10</div>
          <div class="onb-finale-stat-lbl">Atalhos</div>
        </div>
        <div class="onb-finale-stat">
          <div class="onb-finale-stat-val">14</div>
          <div class="onb-finale-stat-lbl">Easter Eggs</div>
        </div>
        <div class="onb-finale-stat">
          <div class="onb-finale-stat-val">112</div>
          <div class="onb-finale-stat-lbl">Curiosidades</div>
        </div>
      </div>
      <button class="onb-finale-cta" onclick="window.__onbFinish()">
        Bora operar
        <span>→</span>
      </button>
    `;
    document.body.appendChild(f);
    launchConfetti();
  }

  function launchConfetti() {
    let container = document.getElementById('onb-confetti');
    if (!container) {
      container = document.createElement('div');
      container.id = 'onb-confetti';
      document.body.appendChild(container);
    }
    const colors = ['#FFE600','#F5C518','#FFFFFF','#3B82F6','#22C55E','#A855F7'];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement('div');
      c.className = 'onb-confetti-piece';
      c.style.left = (Math.random() * 100) + 'vw';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
      c.style.animationDelay = (Math.random() * 1.5) + 's';
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      if (Math.random() > 0.6) c.style.borderRadius = '50%';
      c.style.width = (5 + Math.random() * 8) + 'px';
      c.style.height = (10 + Math.random() * 8) + 'px';
      container.appendChild(c);
    }
    setTimeout(() => container.remove(), 7000);
  }

  // ── CONTROLE ──
  function start() {
    ensureElements();
    currentStep = 0;
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
      renderCurrentStep();
    });
  }

  function renderCurrentStep() {
    // Remove a tela "fullscreen" do welcome/chapter/finale anterior
    document.querySelector('.onb-welcome')?.remove();
    document.querySelector('.onb-chapter-intro')?.remove();
    if (typewriterTimer) clearInterval(typewriterTimer);

    const step = STEPS[currentStep];
    if (!step) return finish();

    if (step.kind === 'welcome') {
      // Esconde tooltip se existir
      if (tooltip) tooltip.style.display = 'none';
      if (spotlight) spotlight.style.display = 'none';
      overlay.style.opacity = '0';
      renderWelcome(step);
      return;
    }

    if (step.kind === 'chapter') {
      if (tooltip) tooltip.style.display = 'none';
      if (spotlight) spotlight.style.display = 'none';
      renderChapterIntro(step);
      return;
    }

    if (step.kind === 'finale') {
      if (tooltip) tooltip.style.display = 'none';
      if (spotlight) spotlight.style.display = 'none';
      overlay.style.opacity = '0';
      renderFinale();
      return;
    }

    // step normal
    overlay.classList.add('visible');
    overlay.style.opacity = '';
    if (tooltip) tooltip.style.display = '';
    renderStep(step);
  }

  function next() {
    currentStep++;
    if (currentStep >= STEPS.length) return finish();
    renderCurrentStep();
  }
  function prev() {
    if (currentStep === 0) return;
    // Pular chapter intros pra trás
    let target = currentStep - 1;
    while (target > 0 && STEPS[target] && STEPS[target].kind === 'chapter') target--;
    currentStep = target;
    renderCurrentStep();
  }
  function skip() { markCompleted(); cleanup(); }
  function finish() { markCompleted(); cleanup(); }
  function cleanup() {
    if (overlay) overlay.classList.remove('visible');
    document.querySelector('.onb-welcome')?.classList.add('fading');
    document.querySelector('.onb-finale')?.classList.add('fading');
    setTimeout(removeElements, 380);
  }

  // ── TECLAS ──
  document.addEventListener('keydown', (e) => {
    if (!overlay && !document.querySelector('.onb-welcome') && !document.querySelector('.onb-finale')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'Escape') { e.preventDefault(); skip(); }
    else if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  // ── API ──
  window.__onbNext = next;
  window.__onbPrev = prev;
  window.__onbSkip = skip;
  window.__onbFinish = finish;
  window.__startOnboarding = function() {
    reset();
    start();
  };

  // ── BOOT AUTOMÁTICO no Hub ──
  function init() {
    if (!document.body) { setTimeout(init, 50); return; }
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const isHub = path === 'index.html' || path === '' || path.endsWith('/');
    if (!isHub) return;
    if (shouldRun()) setTimeout(start, 900);
  }
  init();
})();
