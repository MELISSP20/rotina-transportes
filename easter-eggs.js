/* easter-eggs.js — Coleção de surpresas escondidas no Assignments
   Carregado em todas as páginas. Não interfere na operação normal.
   Lista de eggs descobertos no localStorage[ee_found_v1] */

(function() {
  if (window.__eeInit) return;
  window.__eeInit = true;

  const STORAGE_KEY = 'ee_found_v1';
  const TOTAL_EGGS = 14;

  // ── Persistência de descobertas ──
  function getFound() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function markFound(name) {
    const f = getFound();
    if (f.includes(name)) return false;
    f.push(name);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(f)); } catch(_){}
    showEggToast(name, f.length);
    return true;
  }

  // ── CSS ──
  const style = document.createElement('style');
  style.textContent = `
    /* ── Egg toast ── */
    .ee-egg-toast {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 99999;
      background: linear-gradient(135deg, #1A1A2E 0%, #2A2D44 100%);
      color: #fff;
      padding: 13px 18px 13px 16px;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: -.1px;
      box-shadow: 0 14px 36px rgba(0,0,0,.32);
      border: 1px solid rgba(255,230,0,.32);
      display: flex;
      align-items: center;
      gap: 11px;
      max-width: 320px;
      animation: eeToastIn .35s cubic-bezier(.34,1.56,.64,1);
    }
    .ee-egg-toast.fading { animation: eeToastOut .3s ease-in forwards; }
    @keyframes eeToastIn { from { opacity: 0; transform: translateX(40px) scale(.92); } to { opacity: 1; transform: translateX(0) scale(1); } }
    @keyframes eeToastOut { to { opacity: 0; transform: translateX(40px) scale(.92); } }
    .ee-egg-emoji {
      font-size: 26px;
      line-height: 1;
      flex-shrink: 0;
    }
    .ee-egg-text { line-height: 1.3; }
    .ee-egg-title { color: #FFE600; font-weight: 800; font-size: 13px; margin-bottom: 1px; }
    .ee-egg-sub { color: rgba(255,255,255,.55); font-size: 10.5px; font-weight: 600; letter-spacing: .04em; }

    /* ── KONAMI rainbow ── */
    @keyframes eeRainbow {
      0% { filter: hue-rotate(0deg) saturate(1.6); }
      100% { filter: hue-rotate(360deg) saturate(1.6); }
    }
    body.ee-konami { animation: eeRainbow 3.5s linear infinite; }
    body.ee-konami::after {
      content: '🌈 KONAMI ATIVADO';
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      z-index: 99998;
      font-size: 30px;
      font-weight: 900;
      color: #FFE600;
      background: rgba(0,0,0,.78);
      padding: 18px 36px;
      border-radius: 14px;
      border: 2px solid #FFE600;
      letter-spacing: .04em;
      pointer-events: none;
      animation: eeKonamiPop 5s forwards;
      box-shadow: 0 18px 48px rgba(255,230,0,.4);
    }
    @keyframes eeKonamiPop {
      0%, 75% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(.9); }
    }

    /* ── MATRIX rain ── */
    .ee-matrix-canvas {
      position: fixed; inset: 0; z-index: 99996;
      pointer-events: auto; opacity: 0;
      transition: opacity .5s;
    }
    .ee-matrix-canvas.active { opacity: 1; }

    /* ── VAPORWAVE ── */
    body.ee-vapor { filter: hue-rotate(280deg) saturate(1.4); transition: filter 1s; }
    body.ee-vapor::before {
      content: '';
      position: fixed; inset: 0; z-index: 99990; pointer-events: none;
      background:
        repeating-linear-gradient(180deg, transparent 0, transparent 3px, rgba(255,0,200,.06) 3px, rgba(255,0,200,.06) 4px),
        radial-gradient(ellipse at top, rgba(255,0,200,.16) 0%, transparent 60%),
        radial-gradient(ellipse at bottom, rgba(0,200,255,.16) 0%, transparent 60%);
    }
    body.ee-vapor::after {
      content: 'A E S T H E T I C';
      position: fixed; top: 28px; left: 50%;
      transform: translateX(-50%);
      z-index: 99991;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .65em;
      color: #ffd1f5;
      text-shadow: 2px 2px 0 rgba(0,200,255,.7), -2px -2px 0 rgba(255,0,200,.7);
      pointer-events: none;
      background: rgba(0,0,0,.45);
      padding: 10px 22px;
      border-radius: 6px;
      backdrop-filter: blur(8px);
    }

    /* ── DISCO ── */
    body.ee-disco {
      animation: eeDisco .25s linear infinite !important;
    }
    @keyframes eeDisco {
      0%, 100% { background: #ff0080 !important; }
      25% { background: #00ff80 !important; }
      50% { background: #0080ff !important; }
      75% { background: #ff8000 !important; }
    }

    /* ── MOON · força modo escuro com lua flutuando ── */
    body.ee-moon::before {
      content: '🌙';
      position: fixed;
      font-size: 220px;
      top: 12vh; right: 8vw;
      opacity: .15;
      z-index: 99989;
      pointer-events: none;
      animation: eeMoonFloat 6s ease-in-out infinite;
      filter: drop-shadow(0 0 60px rgba(255,230,0,.4));
    }
    @keyframes eeMoonFloat {
      0%, 100% { transform: translateY(0) rotate(-4deg); }
      50% { transform: translateY(-22px) rotate(4deg); }
    }

    /* ── CONFETE amarelo (sai do canto superior) ── */
    .ee-confetti {
      position: fixed;
      top: -20px;
      width: 10px; height: 16px;
      z-index: 99995;
      pointer-events: none;
      animation: eeConfettiFall linear forwards;
    }
    @keyframes eeConfettiFall {
      0% { transform: translateY(0) rotate(0); opacity: 1; }
      100% { transform: translateY(105vh) rotate(720deg); opacity: 0.4; }
    }

    /* ── SPARKLE ao clicar ── */
    .ee-sparkle {
      position: fixed;
      pointer-events: none;
      font-size: 20px;
      z-index: 99997;
      animation: eeSparkleUp 1.2s ease-out forwards;
    }
    @keyframes eeSparkleUp {
      0% { opacity: 1; transform: translate(0,0) scale(.4) rotate(0); }
      50% { opacity: 1; transform: translate(var(--ee-dx,0), -60px) scale(1.3) rotate(180deg); }
      100% { opacity: 0; transform: translate(var(--ee-dx,0), -130px) scale(.3) rotate(360deg); }
    }

    /* ── ZEN MODE ── */
    body.ee-zen {
      filter: grayscale(.6) blur(.3px);
      transition: filter 1.2s;
    }
    body.ee-zen::after {
      content: '🧘 zen mode · respira fundo';
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99989;
      font-size: 13px;
      font-weight: 700;
      color: rgba(255,255,255,.92);
      background: rgba(0,0,0,.66);
      padding: 11px 22px;
      border-radius: 100px;
      letter-spacing: .04em;
      animation: eeZenBreath 4s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes eeZenBreath { 0%, 100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.04); } }

    /* ── CRÉDITOS modal (click 5x no título) ── */
    .ee-credits-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(8,10,20,.78);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: eeFadeIn .25s ease-out;
    }
    .ee-credits-overlay.open { display: flex; }
    @keyframes eeFadeIn { from { opacity: 0; } to { opacity: 1; } }
    .ee-credits-box {
      background: linear-gradient(135deg, #1A1A2E 0%, #14172B 100%);
      color: #fff;
      border-radius: 22px;
      max-width: 460px;
      width: 100%;
      padding: 38px 38px 30px;
      box-shadow: 0 28px 70px rgba(0,0,0,.55);
      border: 1px solid rgba(255,230,0,.22);
      text-align: center;
      position: relative;
      animation: eeCreditsIn .42s cubic-bezier(.34,1.56,.64,1);
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }
    @keyframes eeCreditsIn { from { opacity: 0; transform: scale(.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .ee-credits-box::before {
      content: '';
      position: absolute;
      top: -60%; right: -30%;
      width: 420px; height: 420px;
      background: radial-gradient(circle, rgba(255,230,0,.22) 0%, transparent 60%);
      pointer-events: none;
    }
    .ee-credits-emoji { font-size: 58px; line-height: 1; margin-bottom: 14px; animation: eeEmojiSpin 3s ease-in-out infinite; display: inline-block; }
    @keyframes eeEmojiSpin { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
    .ee-credits-title { font-size: 26px; font-weight: 900; color: #FFE600; letter-spacing: -.7px; margin-bottom: 8px; position: relative; }
    .ee-credits-sub { font-size: 13.5px; font-weight: 600; color: rgba(255,255,255,.62); margin-bottom: 24px; letter-spacing: -.1px; position: relative; }
    .ee-credits-name { font-size: 36px; font-weight: 900; color: #fff; letter-spacing: -1.1px; margin-bottom: 4px; position: relative; }
    .ee-credits-name span { color: #FFE600; }
    .ee-credits-role { font-size: 10.5px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,230,0,.62); margin-bottom: 22px; position: relative; }
    .ee-credits-stats { display: flex; justify-content: center; gap: 24px; padding: 18px 0; border-top: 1px solid rgba(255,255,255,.1); border-bottom: 1px solid rgba(255,255,255,.1); margin-bottom: 18px; position: relative; }
    .ee-credits-stat-val { font-size: 22px; font-weight: 900; color: #FFE600; line-height: 1; }
    .ee-credits-stat-lbl { font-size: 9.5px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.42); margin-top: 5px; }
    .ee-credits-hint { font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,.45); position: relative; line-height: 1.55; }
    .ee-credits-hint code { background: rgba(255,255,255,.07); padding: 1px 6px; border-radius: 3px; font-family: monospace; color: #FFE600; font-weight: 700; margin: 0 1px; }
    .ee-credits-close { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); color: rgba(255,255,255,.7); width: 30px; height: 30px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all .15s; }
    .ee-credits-close:hover { background: rgba(255,75,75,.22); color: #FF8B8B; border-color: rgba(255,75,75,.38); }

    /* ── PROGRESS modal (digite "eggs") ── */
    .ee-progress-overlay {
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(8,10,20,.78);
      backdrop-filter: blur(10px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: eeFadeIn .25s ease-out;
    }
    .ee-progress-overlay.open { display: flex; }
    .ee-progress-box {
      background: linear-gradient(135deg, #1A1A2E 0%, #14172B 100%);
      color: #fff;
      border-radius: 18px;
      max-width: 480px;
      width: 100%;
      padding: 28px 28px;
      border: 1px solid rgba(255,230,0,.22);
      box-shadow: 0 24px 60px rgba(0,0,0,.55);
      position: relative;
      font-family: 'Inter', sans-serif;
    }
    .ee-progress-head { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
    .ee-progress-icon { font-size: 28px; }
    .ee-progress-title { flex: 1; font-size: 17px; font-weight: 900; color: #FFE600; letter-spacing: -.4px; }
    .ee-progress-close { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); color: rgba(255,255,255,.7); width: 26px; height: 26px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .ee-progress-bar-wrap { background: rgba(255,255,255,.08); border-radius: 100px; height: 8px; overflow: hidden; margin-bottom: 14px; }
    .ee-progress-bar { background: linear-gradient(90deg, #FFE600, #F5C518); height: 100%; transition: width .8s cubic-bezier(.4,0,.2,1); border-radius: 100px; }
    .ee-progress-count { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; line-height: 1; margin-bottom: 4px; }
    .ee-progress-count span { color: rgba(255,255,255,.4); font-size: 18px; }
    .ee-progress-lbl { font-size: 10px; font-weight: 800; letter-spacing: .14em; color: rgba(255,255,255,.5); text-transform: uppercase; margin-bottom: 18px; }
    .ee-progress-list { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
    .ee-progress-item { display: flex; align-items: center; gap: 7px; font-size: 11.5px; font-weight: 600; padding: 5px 8px; border-radius: 7px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.05); }
    .ee-progress-item.found { color: #FFE600; background: rgba(255,230,0,.06); border-color: rgba(255,230,0,.2); }
    .ee-progress-item.locked { color: rgba(255,255,255,.32); }
    .ee-progress-item-emoji { font-size: 12px; }
  `;
  document.head.appendChild(style);

  // ── Toast de descoberta ──
  function showEggToast(name, total) {
    const toast = document.createElement('div');
    toast.className = 'ee-egg-toast';
    const meta = EGG_META[name] || { emoji: '🥚', title: name, sub: '' };
    toast.innerHTML = `
      <div class="ee-egg-emoji">${meta.emoji}</div>
      <div class="ee-egg-text">
        <div class="ee-egg-title">${meta.title}</div>
        <div class="ee-egg-sub">EGG ${total}/${TOTAL_EGGS} DESCOBERTO</div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fading');
      setTimeout(() => toast.remove(), 320);
    }, 3300);
  }

  const EGG_META = {
    'click5x':  { emoji: '🏆', title: 'Easter Egg #1' },
    'konami':   { emoji: '🌈', title: 'Konami Code' },
    'matrix':   { emoji: '🌧', title: 'Matrix Rain' },
    'vapor':    { emoji: '🌸', title: 'Vaporwave Mode' },
    'disco':    { emoji: '🪩', title: 'Disco Mode' },
    'claude':   { emoji: '🤝', title: 'Pair Programming' },
    'tapirai':  { emoji: '🧘', title: 'Zen Mode' },
    'moon':     { emoji: '🌙', title: 'Moon Mode' },
    'meli':     { emoji: '⭐', title: 'Meli Confetti' },
    'sql':      { emoji: '💎', title: 'SQL Secret' },
    'sorocaba': { emoji: '🏭', title: 'Manchester Paulista' },
    'sparkle':  { emoji: '✨', title: 'Sparkle Title' },
    'mee':      { emoji: '📦', title: 'MEE Decoded' },
    'eggs':     { emoji: '🔍', title: 'Egg Hunter' },
  };

  // ───────────────────────────────────────────────────────────────────────
  // ÁRBITRO DE TECLAS · escuta tudo, despacha pra cada egg
  // ───────────────────────────────────────────────────────────────────────
  let typedBuffer = '';
  let typedTimer = null;
  let konamiIdx = 0;
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];

  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    // KONAMI
    if (e.code === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) { konamiIdx = 0; eeKonami(); }
    } else { konamiIdx = 0; }

    // BUFFER de palavras
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    typedBuffer += e.key.toLowerCase();
    if (typedBuffer.length > 14) typedBuffer = typedBuffer.slice(-14);
    if (typedTimer) clearTimeout(typedTimer);
    typedTimer = setTimeout(() => { typedBuffer = ''; }, 2000);

    // Dispatch
    const endsWith = (s) => typedBuffer.endsWith(s);
    if (endsWith('matrix'))   { typedBuffer=''; eeMatrix(); }
    else if (endsWith('vapor'))    { typedBuffer=''; eeVapor(); }
    else if (endsWith('disco'))    { typedBuffer=''; eeDisco(); }
    else if (endsWith('claude'))   { typedBuffer=''; eeClaude(); }
    else if (endsWith('tapirai') || endsWith('zen')) { typedBuffer=''; eeZen(); }
    else if (endsWith('moon'))     { typedBuffer=''; eeMoon(); }
    else if (endsWith('meli'))     { typedBuffer=''; eeMeli(); }
    else if (endsWith('sql'))      { typedBuffer=''; eeSql(); }
    else if (endsWith('sorocaba')) { typedBuffer=''; eeSorocaba(); }
    else if (endsWith('mee'))      { typedBuffer=''; eeMEE(); }
    else if (endsWith('eggs'))     { typedBuffer=''; eeProgress(); }
  });

  // ── 1. KONAMI ──
  function eeKonami() {
    document.body.classList.add('ee-konami');
    markFound('konami');
    setTimeout(() => document.body.classList.remove('ee-konami'), 5500);
  }

  // ── 2. MATRIX ──
  function eeMatrix() {
    const existing = document.querySelector('.ee-matrix-canvas');
    if (existing) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'ee-matrix-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    requestAnimationFrame(() => canvas.classList.add('active'));
    const ctx = canvas.getContext('2d');
    const chars = 'アイウエオカキクケコサシスセソ0123456789ROTAOPSDITORHMEE';
    const fontSize = 16;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = new Array(cols).fill(1);
    let alive = true;
    let frame = 0;
    const interval = setInterval(() => {
      if (!alive) return;
      ctx.fillStyle = 'rgba(0,0,0,.08)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = frame % 32 < 5 ? '#FFE600' : '#00ff5a';
      ctx.font = fontSize + 'px JetBrains Mono, monospace';
      for (let i=0; i<drops.length; i++) {
        const ch = chars[Math.floor(Math.random()*chars.length)];
        ctx.fillText(ch, i*fontSize, drops[i]*fontSize);
        if (drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      frame++;
    }, 38);
    markFound('matrix');
    function close() {
      alive = false;
      canvas.classList.remove('active');
      setTimeout(() => { clearInterval(interval); canvas.remove(); }, 500);
    }
    canvas.onclick = close;
    setTimeout(close, 10000);
  }

  // ── 3. VAPORWAVE ──
  function eeVapor() {
    document.body.classList.add('ee-vapor');
    markFound('vapor');
    setTimeout(() => document.body.classList.remove('ee-vapor'), 7500);
  }

  // ── 4. DISCO ──
  function eeDisco() {
    document.body.classList.add('ee-disco');
    markFound('disco');
    setTimeout(() => document.body.classList.remove('ee-disco'), 3000);
  }

  // ── 5. CLAUDE (pair programming) ──
  function eeClaude() {
    markFound('claude');
    showCustomToast('🤝 PAIR PROGRAMMING', 'Esse site foi feito em duo: Matheus dirigindo, IA executando. A intenção é dele, o código sai daqui. Conversa por conversa.');
  }

  // ── 6. ZEN MODE (digite "tapirai" ou "zen") ──
  function eeZen() {
    document.body.classList.add('ee-zen');
    markFound('tapirai');
    setTimeout(() => document.body.classList.remove('ee-zen'), 8000);
  }

  // ── 7. MOON ──
  function eeMoon() {
    document.body.classList.add('ee-moon');
    // Força modo escuro também (se a página suporta)
    document.documentElement.setAttribute('data-theme', 'dark');
    markFound('moon');
    setTimeout(() => document.body.classList.remove('ee-moon'), 9000);
  }

  // ── 8. MELI (confete amarelo) ──
  function eeMeli() {
    markFound('meli');
    const colors = ['#FFE600','#F5C518','#FFFFFF','#1A1A2E','#3483FA'];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement('div');
      c.className = 'ee-confetti';
      c.style.left = (Math.random()*100) + 'vw';
      c.style.background = colors[Math.floor(Math.random()*colors.length)];
      c.style.borderRadius = Math.random() > .6 ? '50%' : '2px';
      c.style.animationDuration = (Math.random()*2 + 2.2) + 's';
      c.style.animationDelay = (Math.random()*1.5) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5500);
    }
  }

  // ── 9. SQL ──
  function eeSql() {
    markFound('sql');
    showCustomToast('💎 SELECT * FROM eggs', 'SELECT * FROM eggs WHERE awesome = TRUE ORDER BY discovery DESC');
  }

  // ── 10. SOROCABA ──
  function eeSorocaba() {
    markFound('sorocaba');
    showCustomToast('🏭 MANCHESTER PAULISTA', 'Sorocaba foi apelidada de Manchester Paulista no séc. XIX pela força das suas indústrias têxteis. Berço do interior.');
  }

  // ── 11. MEE ──
  function eeMEE() {
    markFound('mee');
    showCustomToast('📦 MEE = MERCADO ENVIOS EXTRA', 'Não confundir com Express! Modal de entrega especial pro 1CR.');
  }

  // ── 12. SPARKLES ao clicar no título ──
  // Esse depende do título estar visível — vou enganchar quando DOM tiver pronto
  function attachSparkleToTitle() {
    const titles = document.querySelectorAll('.hub-title, .header-title');
    titles.forEach(t => {
      if (t.__eeSparkled) return;
      t.__eeSparkled = true;
      let clickCount = 0;
      let clickTimer = null;
      t.addEventListener('click', (e) => {
        clickCount++;
        // Sparkles a cada click
        const emojis = ['✨','⭐','💫','🌟','⚡'];
        for (let i = 0; i < 4; i++) {
          const s = document.createElement('span');
          s.className = 'ee-sparkle';
          s.textContent = emojis[Math.floor(Math.random()*emojis.length)];
          s.style.left = (e.clientX + (Math.random()*40 - 20)) + 'px';
          s.style.top = (e.clientY + (Math.random()*20 - 10)) + 'px';
          s.style.setProperty('--ee-dx', ((Math.random()-.5)*100) + 'px');
          document.body.appendChild(s);
          setTimeout(() => s.remove(), 1300);
        }
        if (clickCount === 3) markFound('sparkle');
        if (clickCount >= 5) { clickCount = 0; eeCredits(); }
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 1500);
      });
    });
  }
  setTimeout(attachSparkleToTitle, 600);
  // Observer caso o DOM mude depois (SPA)
  setTimeout(() => {
    const obs = new MutationObserver(() => attachSparkleToTitle());
    obs.observe(document.body, { childList: true, subtree: true });
  }, 1200);

  // ── 13. CRÉDITOS (click 5x no título) ──
  function eeCredits() {
    markFound('click5x');
    if (document.getElementById('ee-credits-overlay')) {
      document.getElementById('ee-credits-overlay').classList.add('open');
      return;
    }
    const overlay = document.createElement('div');
    overlay.className = 'ee-credits-overlay open';
    overlay.id = 'ee-credits-overlay';
    overlay.innerHTML = `
      <div class="ee-credits-box">
        <button class="ee-credits-close" onclick="document.getElementById('ee-credits-overlay').classList.remove('open')">✕</button>
        <div class="ee-credits-emoji">⚡</div>
        <div class="ee-credits-title">Você descobriu!</div>
        <div class="ee-credits-sub">Easter egg #1 · Click 5x no título</div>
        <div class="ee-credits-name">Matheus<span>.</span></div>
        <div class="ee-credits-role">Logan · TL Madrugada · SSP·20</div>
        <div class="ee-credits-stats">
          <div><div class="ee-credits-stat-val">14</div><div class="ee-credits-stat-lbl">Páginas</div></div>
          <div><div class="ee-credits-stat-val">SSP·20</div><div class="ee-credits-stat-lbl">+ SSP·51</div></div>
          <div><div class="ee-credits-stat-val">🌙</div><div class="ee-credits-stat-lbl">Madrugada</div></div>
        </div>
        <div class="ee-credits-hint">
          Tenta também: <code>matrix</code> · <code>vapor</code> · <code>disco</code> · <code>claude</code> · <code>moon</code> · <code>meli</code> · <code>eggs</code> · ↑↑↓↓←→←→BA 👀
        </div>
      </div>`;
    overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('open'); };
    document.body.appendChild(overlay);
  }

  // ── 14. PROGRESS (digite "eggs") ──
  function eeProgress() {
    markFound('eggs');
    const found = getFound();
    const total = TOTAL_EGGS;
    const pct = (found.length / total * 100).toFixed(0);
    const order = ['click5x','konami','matrix','vapor','disco','claude','tapirai','moon','meli','sql','sorocaba','sparkle','mee','eggs'];
    const itemsHtml = order.map(k => {
      const meta = EGG_META[k];
      const isFound = found.includes(k);
      return `<div class="ee-progress-item ${isFound?'found':'locked'}">
        <span class="ee-progress-item-emoji">${isFound ? meta.emoji : '🔒'}</span>
        <span>${isFound ? meta.title : '???'}</span>
      </div>`;
    }).join('');
    if (document.getElementById('ee-progress-overlay')) document.getElementById('ee-progress-overlay').remove();
    const overlay = document.createElement('div');
    overlay.className = 'ee-progress-overlay open';
    overlay.id = 'ee-progress-overlay';
    overlay.innerHTML = `
      <div class="ee-progress-box">
        <div class="ee-progress-head">
          <span class="ee-progress-icon">🔍</span>
          <span class="ee-progress-title">Easter Egg Hunter</span>
          <button class="ee-progress-close" onclick="document.getElementById('ee-progress-overlay').remove()">✕</button>
        </div>
        <div class="ee-progress-count">${found.length}<span>/${total}</span></div>
        <div class="ee-progress-lbl">Eggs descobertos</div>
        <div class="ee-progress-bar-wrap"><div class="ee-progress-bar" style="width:0%"></div></div>
        <div class="ee-progress-list">${itemsHtml}</div>
      </div>`;
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    document.body.appendChild(overlay);
    // Anima a barra
    setTimeout(() => {
      const bar = overlay.querySelector('.ee-progress-bar');
      if (bar) bar.style.width = pct + '%';
    }, 80);
  }

  // ── Toast genérico pra eggs ──
  function showCustomToast(title, sub) {
    const toast = document.createElement('div');
    toast.className = 'ee-egg-toast';
    toast.innerHTML = `
      <div class="ee-egg-emoji">💡</div>
      <div class="ee-egg-text">
        <div class="ee-egg-title">${title}</div>
        <div class="ee-egg-sub" style="color: rgba(255,255,255,.85); font-weight: 600; letter-spacing: 0;">${sub}</div>
      </div>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fading');
      setTimeout(() => toast.remove(), 320);
    }, 5200);
  }

  // ── Esc fecha modais ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('ee-credits-overlay')?.classList.remove('open');
      document.getElementById('ee-progress-overlay')?.remove();
    }
  });

  // ── API global ──
  window.__eeOpenProgress = eeProgress;
})();
