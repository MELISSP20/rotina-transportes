/* easter-eggs.js — Coleção de surpresas escondidas no Assignments
   Carregado em todas as páginas. Não interfere na operação normal.
   Lista de eggs descobertos no localStorage[ee_found_v1] */

(function() {
  if (window.__eeInit) return;
  window.__eeInit = true;

  const STORAGE_KEY = 'ee_found_v1';
  const TOTAL_EGGS = 13;

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

    /* ── BOOST (substitui DISCO) — speedlines + velocímetro ── */
    .ee-boost-stage {
      position: fixed;
      inset: 0;
      z-index: 99996;
      pointer-events: none;
      overflow: hidden;
      background: radial-gradient(ellipse at center, rgba(26,26,46,.4) 0%, rgba(8,10,20,.85) 100%);
      animation: eeFadeIn .25s ease-out;
    }
    .ee-boost-stage.fading { animation: eeFadeOut .45s ease-in forwards; }
    .ee-boost-line {
      position: absolute;
      left: -250px;
      height: 4px;
      background: linear-gradient(90deg, transparent 0%, #FFE600 50%, transparent 100%);
      border-radius: 4px;
      animation: eeBoostLine linear infinite;
      box-shadow: 0 0 10px rgba(255,230,0,.5);
    }
    @keyframes eeBoostLine {
      0%   { transform: translateX(0); }
      100% { transform: translateX(calc(100vw + 250px)); }
    }
    .ee-boost-speedo {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #1A1A2E 0%, #14172B 100%);
      border: 2px solid #FFE600;
      border-radius: 22px;
      padding: 26px 38px 22px;
      color: #fff;
      font-family: 'Inter', sans-serif;
      text-align: center;
      min-width: 280px;
      box-shadow: 0 0 60px rgba(255,230,0,.4), 0 24px 64px rgba(0,0,0,.5);
      animation: eeBoostSpeedoIn .4s cubic-bezier(.34,1.56,.64,1), eeBoostShake 0.08s linear .4s infinite;
    }
    @keyframes eeBoostSpeedoIn {
      from { opacity: 0; transform: translate(-50%, -50%) scale(.7); }
      to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    @keyframes eeBoostShake {
      0%, 100% { transform: translate(-50%, -50%); }
      25% { transform: translate(calc(-50% + 1px), calc(-50% - 1px)); }
      50% { transform: translate(calc(-50% - 1px), calc(-50% + 1px)); }
      75% { transform: translate(calc(-50% + 1px), calc(-50% + 1px)); }
    }
    .ee-boost-eyebrow {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .24em;
      color: #FFE600;
      margin-bottom: 14px;
      text-transform: uppercase;
    }
    .ee-boost-val {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 6px;
      margin-bottom: 16px;
    }
    .ee-boost-num {
      font-size: 84px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -3.5px;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      text-shadow: 0 0 20px rgba(255,230,0,.6);
    }
    .ee-boost-unit {
      font-size: 18px;
      font-weight: 800;
      color: rgba(255,255,255,.5);
      letter-spacing: -.3px;
    }
    .ee-boost-bar-wrap {
      width: 240px;
      height: 8px;
      background: rgba(255,255,255,.08);
      border-radius: 100px;
      overflow: hidden;
      margin: 0 auto 12px;
    }
    .ee-boost-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #FFE600, #F5C518);
      box-shadow: 0 0 12px rgba(255,230,0,.7);
      border-radius: 100px;
      transition: width .04s linear;
    }
    .ee-boost-lbl {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: .18em;
      color: rgba(255,230,0,.7);
      text-transform: uppercase;
    }

    /* ── MADRUGADA (substitui ZEN) — noite estrelada ── */
    .ee-mad-stage {
      position: fixed;
      inset: 0;
      z-index: 99996;
      pointer-events: none;
      overflow: hidden;
      background: radial-gradient(ellipse at top, #1A1F3D 0%, #06080F 70%);
      animation: eeFadeIn .55s ease-out;
    }
    .ee-mad-stage.fading { animation: eeFadeOut .7s ease-in forwards; }
    .ee-mad-star {
      position: absolute;
      color: #FFE600;
      animation: eeStarTwinkle ease-in-out infinite;
      text-shadow: 0 0 8px rgba(255,230,0,.5);
    }
    @keyframes eeStarTwinkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.2; transform: scale(0.7); }
    }
    .ee-mad-moon {
      position: absolute;
      top: 8vh; right: 10vw;
      font-size: 160px;
      line-height: 1;
      animation: eeMadMoonFloat 8s ease-in-out infinite;
      filter: drop-shadow(0 0 40px rgba(255,230,0,.45));
    }
    @keyframes eeMadMoonFloat {
      0%, 100% { transform: translateY(0) rotate(-3deg); }
      50%      { transform: translateY(-18px) rotate(3deg); }
    }
    .ee-mad-shoot {
      position: absolute;
      top: 12%;
      left: -50px;
      font-size: 28px;
      filter: drop-shadow(0 0 12px rgba(255,230,0,.8));
      animation: eeShoot 1.4s ease-out forwards;
    }
    .ee-mad-shoot::after {
      content: '';
      position: absolute;
      right: 100%; top: 50%;
      width: 140px; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255,230,0,.8));
      transform: translateY(-50%);
    }
    .ee-mad-shoot-2 {
      top: 30%;
      animation: eeShoot2 1.4s ease-out forwards;
    }
    @keyframes eeShoot {
      0%   { left: -50px; top: 12%; opacity: 1; }
      100% { left: calc(100vw + 50px); top: 38%; opacity: 0; }
    }
    @keyframes eeShoot2 {
      0%   { left: -50px; top: 30%; opacity: 1; }
      100% { left: calc(100vw + 50px); top: 55%; opacity: 0; }
    }
    .ee-mad-card {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(26,26,46,.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,230,0,.22);
      border-radius: 22px;
      padding: 28px 38px 30px;
      color: #fff;
      text-align: center;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 24px 68px rgba(0,0,0,.5);
      animation: eeMadCardIn .65s cubic-bezier(.34,1.56,.64,1) .25s both;
      max-width: 88vw;
    }
    @keyframes eeMadCardIn {
      from { opacity: 0; transform: translate(-50%, -45%) scale(.85); }
      to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    .ee-mad-card-emoji {
      font-size: 50px;
      line-height: 1;
      margin-bottom: 12px;
      animation: eeMadMoonFloat 4s ease-in-out infinite;
      display: inline-block;
    }
    .ee-mad-card-title {
      font-size: 32px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -1px;
      line-height: 1;
      margin-bottom: 6px;
    }
    .ee-mad-card-title span {
      color: #FFE600;
    }
    .ee-mad-card-sub {
      font-size: 12px;
      font-weight: 700;
      color: rgba(255,255,255,.55);
      letter-spacing: .04em;
      margin-bottom: 16px;
    }
    .ee-mad-card-sub b {
      color: #FFE600;
      font-weight: 800;
    }
    .ee-mad-card-quote {
      font-size: 13.5px;
      font-style: italic;
      color: rgba(255,255,255,.78);
      line-height: 1.5;
      padding-top: 14px;
      border-top: 1px solid rgba(255,255,255,.1);
      font-weight: 500;
    }
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

    /* ━━━ MEE · DELIVERY RUSH ━━━ */
    .ee-mee-stage {
      position: fixed;
      inset: 0;
      z-index: 99996;
      pointer-events: none;
      overflow: hidden;
      animation: eeFadeIn .35s ease-out;
    }
    .ee-mee-stage.fading {
      animation: eeFadeOut .55s ease-in forwards;
    }
    @keyframes eeFadeOut { to { opacity: 0; } }

    /* CAMINHÃO atravessando a tela */
    .ee-mee-truck {
      position: absolute;
      bottom: 36px;
      left: -360px;
      display: flex;
      align-items: flex-end;
      gap: 4px;
      animation: eeTruckCross 5.5s cubic-bezier(.22, .61, .36, 1) forwards;
      filter: drop-shadow(0 18px 32px rgba(0,0,0,.32));
    }
    @keyframes eeTruckCross {
      0%   { left: -360px; transform: translateY(0); }
      8%   { transform: translateY(-2px); }
      12%  { transform: translateY(0); }
      24%  { transform: translateY(-2px); }
      28%  { transform: translateY(0); }
      100% { left: calc(100vw + 80px); transform: translateY(0); }
    }
    .ee-mee-truck-cab {
      font-size: 86px;
      line-height: 1;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,.25));
      order: 2;
    }
    .ee-mee-truck-cargo {
      background: linear-gradient(135deg, #1A1A2E 0%, #2A2D44 100%);
      color: #FFE600;
      border-radius: 10px 10px 12px 12px;
      padding: 8px 14px 14px;
      box-shadow: 0 8px 24px rgba(0,0,0,.4), inset 0 -3px 8px rgba(0,0,0,.2);
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      order: 1;
      height: 72px;
      border-bottom: 6px solid #14172B;
    }
    .ee-mee-truck-cargo::after {
      content: '';
      position: absolute;
      bottom: -16px;
      left: 12px;
      right: 12px;
      height: 12px;
      background:
        radial-gradient(circle 7px at 14px 6px, #1A1A2E 50%, transparent 51%),
        radial-gradient(circle 7px at calc(100% - 14px) 6px, #1A1A2E 50%, transparent 51%);
    }
    .ee-mee-cargo-label {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .22em;
      margin-bottom: 1px;
      background: #FFE600;
      color: #1A1A2E;
      padding: 1px 7px;
      border-radius: 3px;
    }
    .ee-mee-cargo-pack {
      font-size: 14px;
      line-height: 1;
      animation: eeCargoShake 0.35s ease-in-out infinite alternate;
    }
    .ee-mee-cargo-pack:nth-child(3) { animation-delay: .12s; }
    .ee-mee-cargo-pack:nth-child(4) { animation-delay: .24s; }
    @keyframes eeCargoShake {
      from { transform: translateY(0) rotate(-1deg); }
      to   { transform: translateY(-1px) rotate(1deg); }
    }

    /* PACOTES caindo */
    .ee-mee-falling-pack {
      position: absolute;
      top: -50px;
      line-height: 1;
      animation: eeFallingPack 2s cubic-bezier(.55, .085, .68, .53) forwards;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,.2));
    }
    @keyframes eeFallingPack {
      0%   { top: -60px; transform: rotate(0deg) scale(.6); opacity: 0; }
      10%  { opacity: 1; }
      85%  { transform: rotate(var(--ee-rot, 360deg)) scale(1); opacity: 1; }
      90%  { transform: translateY(-12px) rotate(var(--ee-rot, 360deg)) scale(1.1); opacity: 1; }
      100% { top: calc(100vh - 80px); transform: rotate(var(--ee-rot, 360deg)) scale(1); opacity: .85; }
    }

    /* KPI no canto superior direito */
    .ee-mee-kpi {
      position: absolute;
      top: 32px;
      right: 32px;
      background: linear-gradient(135deg, #1A1A2E 0%, #14172B 100%);
      border: 1px solid rgba(255,230,0,.32);
      border-radius: 14px;
      padding: 14px 20px 16px;
      color: #fff;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 20px 48px rgba(0,0,0,.45);
      animation: eeKpiIn .55s cubic-bezier(.34, 1.56, .64, 1);
      min-width: 240px;
    }
    @keyframes eeKpiIn {
      from { opacity: 0; transform: translateY(-20px) scale(.85); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .ee-mee-kpi-eyebrow {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: .2em;
      color: #FFE600;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .ee-mee-kpi-grid {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .ee-mee-kpi-val {
      font-size: 36px;
      font-weight: 900;
      color: #fff;
      line-height: 1;
      letter-spacing: -1.5px;
      font-variant-numeric: tabular-nums;
    }
    .ee-mee-kpi-val-pct {
      color: #4DDD9A;
    }
    .ee-mee-kpi-lbl {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: .14em;
      color: rgba(255,255,255,.5);
      text-transform: uppercase;
      margin-top: 5px;
    }
    .ee-mee-kpi-sep {
      width: 1px;
      align-self: stretch;
      background: rgba(255,255,255,.12);
    }

    @media (max-width: 600px) {
      .ee-mee-kpi { right: 16px; top: 24px; padding: 10px 14px 12px; min-width: 0; }
      .ee-mee-kpi-val { font-size: 28px; }
      .ee-mee-truck-cab { font-size: 64px; }
      .ee-mee-truck-cargo { height: 56px; padding: 6px 10px 10px; }
      .ee-mee-cargo-label { font-size: 9px; }
    }
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
    'click5x':   { emoji: '🏆', title: 'Easter Egg #1' },
    'konami':    { emoji: '🌈', title: 'Konami Code' },
    'matrix':    { emoji: '🌧', title: 'Matrix Rain' },
    'vapor':     { emoji: '🌸', title: 'Vaporwave Mode' },
    'boost':     { emoji: '🚀', title: 'Turbo Boost' },
    'claude':    { emoji: '🤝', title: 'Pair Programming' },
    'madrugada': { emoji: '🌙', title: 'Boa Madrugada' },
    'moon':      { emoji: '🌙', title: 'Moon Mode' },
    'meli':      { emoji: '⭐', title: 'Meli Confetti' },
    'sql':       { emoji: '💎', title: 'SQL Secret' },
    'sorocaba':  { emoji: '🏭', title: 'Manchester Paulista' },
    'mee':       { emoji: '📦', title: 'Delivery Rush' },
    'eggs':      { emoji: '🔍', title: 'Egg Hunter' },
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
    else if (endsWith('vapor'))     { typedBuffer=''; eeVapor(); }
    else if (endsWith('boost'))     { typedBuffer=''; eeBoost(); }
    else if (endsWith('claude'))    { typedBuffer=''; eeClaude(); }
    else if (endsWith('madrugada')) { typedBuffer=''; eeMadrugada(); }
    else if (endsWith('moon'))      { typedBuffer=''; eeMoon(); }
    else if (endsWith('meli'))      { typedBuffer=''; eeMeli(); }
    else if (endsWith('sql'))       { typedBuffer=''; eeSql(); }
    else if (endsWith('sorocaba'))  { typedBuffer=''; eeSorocaba(); }
    else if (endsWith('mee'))       { typedBuffer=''; eeMEE(); }
    else if (endsWith('eggs'))      { typedBuffer=''; eeProgress(); }
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

  // ── 4. BOOST (substitui disco) — turbo com speedlines + velocímetro ──
  function eeBoost() {
    markFound('boost');

    const stage = document.createElement('div');
    stage.className = 'ee-boost-stage';
    document.body.appendChild(stage);

    // Speedlines (32 linhas amarelas atravessando)
    for (let i = 0; i < 32; i++) {
      const line = document.createElement('div');
      line.className = 'ee-boost-line';
      line.style.top = (Math.random() * 100) + 'vh';
      line.style.animationDelay = (Math.random() * 0.6) + 's';
      line.style.animationDuration = (0.45 + Math.random() * 0.4) + 's';
      line.style.width = (60 + Math.random() * 180) + 'px';
      line.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
      stage.appendChild(line);
    }

    // Velocímetro central
    const speedo = document.createElement('div');
    speedo.className = 'ee-boost-speedo';
    speedo.innerHTML = `
      <div class="ee-boost-eyebrow">🚀 TURBO BOOST</div>
      <div class="ee-boost-val">
        <span class="ee-boost-num" id="ee-boost-num">0</span>
        <span class="ee-boost-unit">km/h</span>
      </div>
      <div class="ee-boost-bar-wrap">
        <div class="ee-boost-bar" id="ee-boost-bar"></div>
      </div>
      <div class="ee-boost-lbl">ROTAS ACELERADAS</div>
    `;
    stage.appendChild(speedo);

    // Anima velocímetro 0 → 287
    setTimeout(() => {
      const numEl = document.getElementById('ee-boost-num');
      const barEl = document.getElementById('ee-boost-bar');
      const target = 287;
      let cur = 0;
      const step = setInterval(() => {
        cur += Math.ceil((target - cur) / 8) + 1;
        if (cur >= target) { cur = target; clearInterval(step); }
        if (numEl) numEl.textContent = cur;
        if (barEl) barEl.style.width = (cur / target * 100) + '%';
      }, 30);
    }, 100);

    // Cleanup
    setTimeout(() => {
      stage.classList.add('fading');
      setTimeout(() => stage.remove(), 500);
    }, 3800);
  }

  // ── 5. CLAUDE (pair programming) ──
  function eeClaude() {
    markFound('claude');
    showCustomToast('🤝 PAIR PROGRAMMING', 'Esse site foi feito em duo: Matheus dirigindo, IA executando. A intenção é dele, o código sai daqui. Conversa por conversa.');
  }

  // ── 6. MADRUGADA (substitui zen) — noite estrelada com lua e estrela cadente ──
  function eeMadrugada() {
    markFound('madrugada');

    const stage = document.createElement('div');
    stage.className = 'ee-mad-stage';
    document.body.appendChild(stage);

    // Estrelas (40)
    for (let i = 0; i < 40; i++) {
      const star = document.createElement('div');
      star.className = 'ee-mad-star';
      star.textContent = ['✦','✧','⋆','✨'][Math.floor(Math.random() * 4)];
      star.style.left = (Math.random() * 100) + 'vw';
      star.style.top = (Math.random() * 80) + 'vh';
      star.style.fontSize = (8 + Math.random() * 14) + 'px';
      star.style.animationDelay = (Math.random() * 3) + 's';
      star.style.animationDuration = (1.5 + Math.random() * 2.5) + 's';
      star.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
      stage.appendChild(star);
    }

    // Lua grande
    const moon = document.createElement('div');
    moon.className = 'ee-mad-moon';
    moon.textContent = '🌙';
    stage.appendChild(moon);

    // Estrela cadente (atravessa diagonal)
    setTimeout(() => {
      const shoot = document.createElement('div');
      shoot.className = 'ee-mad-shoot';
      shoot.innerHTML = '✨';
      stage.appendChild(shoot);
      setTimeout(() => shoot.remove(), 1400);
    }, 1500);
    setTimeout(() => {
      const shoot = document.createElement('div');
      shoot.className = 'ee-mad-shoot ee-mad-shoot-2';
      shoot.innerHTML = '⭐';
      stage.appendChild(shoot);
      setTimeout(() => shoot.remove(), 1400);
    }, 3200);

    // Card central com mensagem
    const card = document.createElement('div');
    card.className = 'ee-mad-card';
    card.innerHTML = `
      <div class="ee-mad-card-emoji">🌙</div>
      <div class="ee-mad-card-title">Boa madrugada<span>.</span></div>
      <div class="ee-mad-card-sub">Turno <b>02:30 — 10:30</b> · SSP·20</div>
      <div class="ee-mad-card-quote">"Enquanto a cidade dorme,<br>a operação corre."</div>
    `;
    stage.appendChild(card);

    setTimeout(() => {
      stage.classList.add('fading');
      setTimeout(() => stage.remove(), 700);
    }, 6500);
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

  // ── 11. MEE · DELIVERY RUSH (caminhão + pacotes caindo) ──
  function eeMEE() {
    markFound('mee');

    // Container do show
    const stage = document.createElement('div');
    stage.className = 'ee-mee-stage';
    document.body.appendChild(stage);

    // Caminhão
    const truck = document.createElement('div');
    truck.className = 'ee-mee-truck';
    truck.innerHTML = `
      <div class="ee-mee-truck-cargo">
        <div class="ee-mee-cargo-label">MEE</div>
        <div class="ee-mee-cargo-pack">📦</div>
        <div class="ee-mee-cargo-pack">📦</div>
        <div class="ee-mee-cargo-pack">📦</div>
      </div>
      <div class="ee-mee-truck-cab">🚚</div>
    `;
    stage.appendChild(truck);

    // Pacotes caindo (10 com posições e atrasos aleatórios)
    const packEmojis = ['📦','📦','📦','📦','📦','✉️','📮'];
    for (let i = 0; i < 14; i++) {
      const pack = document.createElement('div');
      pack.className = 'ee-mee-falling-pack';
      pack.textContent = packEmojis[Math.floor(Math.random() * packEmojis.length)];
      pack.style.left = (5 + Math.random() * 90) + 'vw';
      pack.style.animationDelay = (Math.random() * 3) + 's';
      pack.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      pack.style.fontSize = (24 + Math.random() * 16) + 'px';
      pack.style.setProperty('--ee-rot', (Math.random() * 720 - 360) + 'deg');
      stage.appendChild(pack);
    }

    // KPI flutuante no canto
    const kpi = document.createElement('div');
    kpi.className = 'ee-mee-kpi';
    const count = 37 + Math.floor(Math.random() * 22);
    kpi.innerHTML = `
      <div class="ee-mee-kpi-eyebrow">📦 MEE · MERCADO ENVIOS EXTRA</div>
      <div class="ee-mee-kpi-grid">
        <div>
          <div class="ee-mee-kpi-val" data-target="${count}">0</div>
          <div class="ee-mee-kpi-lbl">Unidades</div>
        </div>
        <div class="ee-mee-kpi-sep"></div>
        <div>
          <div class="ee-mee-kpi-val ee-mee-kpi-val-pct">100%</div>
          <div class="ee-mee-kpi-lbl">Em rota</div>
        </div>
      </div>
    `;
    stage.appendChild(kpi);

    // Animar contador
    setTimeout(() => {
      const valEl = kpi.querySelector('[data-target]');
      const target = parseInt(valEl.dataset.target);
      let cur = 0;
      const step = setInterval(() => {
        cur += Math.ceil(target / 22);
        if (cur >= target) { cur = target; clearInterval(step); }
        valEl.textContent = cur;
      }, 40);
    }, 500);

    // Cleanup
    setTimeout(() => {
      stage.classList.add('fading');
      setTimeout(() => stage.remove(), 600);
    }, 5800);
  }

  // ── 12. CLICK 5x no título → modal de créditos (sem sparkles) ──
  function attachClickToTitle() {
    const titles = document.querySelectorAll('.hub-title, .header-title');
    titles.forEach(t => {
      if (t.__eeAttached) return;
      t.__eeAttached = true;
      t.style.userSelect = 'none';
      let clickCount = 0;
      let clickTimer = null;
      t.addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 5) { clickCount = 0; eeCredits(); }
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 1500);
      });
    });
  }
  setTimeout(attachClickToTitle, 600);
  setTimeout(() => {
    const obs = new MutationObserver(() => attachClickToTitle());
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
    const order = ['click5x','konami','matrix','vapor','boost','claude','madrugada','moon','meli','sql','sorocaba','mee','eggs'];
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
