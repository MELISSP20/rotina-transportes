/* ssp-city.js — Substituição dinâmica de cidade conforme SSP atual
   Quando o SSP·51 estiver selecionado, troca "Sorocaba" → "Porto Feliz" em todo o DOM.
   Preserva case (Sorocaba/SOROCABA/sorocaba).
   Inclua em todas as páginas que mostrem nome de cidade.
   Para forçar reavaliação após mudanças dinâmicas:
   window.dispatchEvent(new Event('sspChanged')) */

(function() {
  if (window.__sspCityInit) return;
  window.__sspCityInit = true;

  const REPLACEMENTS = {
    'Sorocaba': 'Porto Feliz',
    'SOROCABA': 'PORTO FELIZ',
    'sorocaba': 'porto feliz',
  };

  function getSSP() {
    try {
      const v = parseInt(localStorage.getItem('ssp'), 10);
      return Number.isFinite(v) ? v : 20;
    } catch { return 20; }
  }

  // Cache do DOM original pra reverter quando volta pro SSP·20
  // Estrutura: Map<TextNode, originalText>
  const originalTexts = new WeakMap();
  // Tags que não devem ser percorridas
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'CODE', 'PRE']);

  function shouldReplace() {
    return getSSP() === 51;
  }

  function transform(text) {
    if (!text) return text;
    let out = text;
    for (const [from, to] of Object.entries(REPLACEMENTS)) {
      // Word-boundary safe (mas pt-BR friendly): regex case-sensitive
      out = out.split(from).join(to);
    }
    return out;
  }

  function revertText(node) {
    if (originalTexts.has(node)) {
      node.nodeValue = originalTexts.get(node);
    }
  }

  function processNode(node) {
    if (!node) return;

    // Text node
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (!text || !text.length) return;

      // Procurar Sorocaba (case-sensitive)
      const hasMatch = Object.keys(REPLACEMENTS).some(k => text.includes(k));
      if (!hasMatch) return;

      // Salvar texto original (apenas na primeira vez)
      if (!originalTexts.has(node)) {
        originalTexts.set(node, text);
      }

      if (shouldReplace()) {
        node.nodeValue = transform(text);
      } else {
        node.nodeValue = originalTexts.get(node);
      }
      return;
    }

    // Element node
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (SKIP_TAGS.has(node.tagName)) return;

    // Recursão pelos filhos
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      processNode(children[i]);
    }
  }

  // ── Trocar título da aba também ──
  let originalTitle = null;
  function processTitle() {
    if (originalTitle === null) originalTitle = document.title;
    if (shouldReplace()) {
      document.title = transform(originalTitle);
    } else {
      document.title = originalTitle;
    }
  }

  // ── Aplicar troca em todo o DOM ──
  function apply() {
    processNode(document.body);
    processTitle();
  }

  // ── Observer pra novos elementos adicionados dinamicamente ──
  function setupObserver() {
    const observer = new MutationObserver(mutations => {
      if (!shouldReplace()) return; // sem trabalho se SSP·20
      for (const m of mutations) {
        m.addedNodes.forEach(node => processNode(node));
        // Mudanças de texto direto
        if (m.type === 'characterData') {
          processNode(m.target);
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  // ── Init ──
  function init() {
    if (!document.body) { setTimeout(init, 50); return; }
    apply();
    setupObserver();
  }
  init();

  // ── Listeners pra mudanças no SSP ──
  // 1) Mudança em outra aba (storage event)
  window.addEventListener('storage', (e) => {
    if (e.key === 'ssp') apply();
  });

  // 2) Mudança na mesma aba — quem mudou dispara evento custom
  window.addEventListener('sspChanged', apply);

  // ── API pública ──
  window.__sspCityRefresh = apply;
})();
