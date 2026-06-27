/* toast.js — Sistema global de notificações flutuantes
   Use window.toast('mensagem') ou window.toast('mensagem', 'success'|'error'|'info') */

(function() {
  if (window.toast) return; // Não duplicar

  // Container
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.innerHTML = `
    <style>
      #toast-container {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        pointer-events: none;
      }
      .toast {
        background: var(--navy, #1A1A2E);
        color: #fff;
        padding: 12px 22px;
        border-radius: 12px;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: -.1px;
        box-shadow: 0 8px 28px rgba(26,26,46,.35);
        display: inline-flex;
        align-items: center;
        gap: 10px;
        animation: toastIn .35s cubic-bezier(.4,0,.2,1);
        pointer-events: auto;
        max-width: 480px;
        border: 1px solid rgba(255,230,0,.18);
      }
      .toast.success { background: linear-gradient(135deg, #0A8F4A 0%, #00A650 100%); border-color: rgba(255,255,255,.2); }
      .toast.error { background: linear-gradient(135deg, #B91C1C 0%, #E3262F 100%); border-color: rgba(255,255,255,.2); }
      .toast.info { background: linear-gradient(135deg, var(--navy, #1A1A2E) 0%, #2A2D44 100%); }
      .toast-icon { font-size: 16px; line-height: 1; }
      .toast-text { line-height: 1.3; }
      .toast.leaving { animation: toastOut .25s cubic-bezier(.4,0,.2,1) forwards; }
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(20px) scale(.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to { opacity: 0; transform: translateY(20px) scale(.95); }
      }
      @media (max-width: 600px) {
        #toast-container { bottom: 16px; left: 16px; right: 16px; transform: none; }
        .toast { width: 100%; max-width: 100%; font-size: 12px; padding: 11px 18px; }
      }
    </style>
  `;

  function init() {
    if (!document.body) {
      setTimeout(init, 50);
      return;
    }
    document.body.appendChild(container);
  }
  init();

  const ICONS = { success: '✓', error: '✕', info: '💡', copy: '📋' };

  window.toast = function(message, type = 'success') {
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    const icon = ICONS[type] || ICONS.success;
    el.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${message}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 280);
    }, 3200);
  };
})();
