(() => {
  const root = new URL('./', document.currentScript.src);
  const cache = new Map();
  const key = (url) => url.origin + url.pathname + url.search;
  let current = key(new URL(location.href));
  let revision = 0;
  let scrollTimer;
  const debug = ['localhost', '127.0.0.1'].includes(location.hostname);

  // Keep the header and footer links correct when the URL changes depth.
  function resolveLinks(element, base) {
    for (const node of element.querySelectorAll('[href], [src]')) {
      for (const attr of ['href', 'src']) {
        if (node.hasAttribute(attr)) node.setAttribute(attr, new URL(node.getAttribute(attr), base).href);
      }
    }
  }
  resolveLinks(document.body, location.href);
  cache.set(current, { html: document.documentElement.outerHTML });
  history.scrollRestoration = 'manual';
  function saveScroll() {
    history.replaceState({ ...history.state, portfolioScroll: [scrollX, scrollY] }, '', location.href);
  }
  saveScroll();
  addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(saveScroll, 100);
  }, { passive: true });

  function destination(event) {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return null;
    const url = new URL(anchor.href);
    // Only directory-style pages belonging to this portfolio are intercepted.
    if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname) || !url.pathname.endsWith('/')) return null;
    if (key(url) === current && url.hash) return null;
    return url;
  }

  function load(url) {
    const id = key(url);
    if (cache.has(id)) return cache.get(id);
    const entry = {};
    cache.set(id, entry);
    if (cache.size > 24) cache.delete(cache.keys().next().value);
    entry.promise = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(id, { signal: controller.signal });
        if (!response.ok || !response.headers.get('content-type')?.includes('text/html') || key(new URL(response.url)) !== id) throw new Error('Not a portfolio page');
        entry.html = await response.text();
        return entry.html;
      } finally { clearTimeout(timeout); }
    })().catch((error) => {
      if (cache.get(id) === entry) cache.delete(id);
      throw error;
    });
    return entry;
  }

  function restorePosition(url, position) {
    const main = document.getElementById('main');
    main.focus({ preventScroll: true });
    if (position) window.scrollTo(...position);
    else if (url.hash) {
      let id;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { id = url.hash.slice(1); }
      const target = document.getElementById(id);
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    } else window.scrollTo(0, 0);
  }

  async function navigate(url, { historyNavigation = false, position } = {}) {
    const ticket = ++revision;
    const start = performance.now();
    const cached = !!cache.get(key(url))?.html;
    const main = document.getElementById('main');
    main.setAttribute('aria-busy', 'true');
    try {
      const entry = load(url);
      const html = entry.html || await entry.promise;
      if (ticket !== revision) return;
      const page = new DOMParser().parseFromString(html, 'text/html');
      const nextMain = page.getElementById('main');
      const nextNav = page.querySelector('nav[aria-label="Main navigation"]');
      if (!nextMain || !nextNav || !page.querySelector('script[src$="navigation.js"]')) throw new Error('Unsupported page');
      resolveLinks(nextMain, url.href);
      resolveLinks(nextNav, url.href);
      if (!historyNavigation) {
        clearTimeout(scrollTimer);
        saveScroll();
        history.pushState({ portfolioScroll: [0, 0] }, '', url.href);
      }
      main.replaceWith(nextMain);
      document.querySelector('nav[aria-label="Main navigation"]').replaceWith(nextNav);
      document.title = page.title;
      document.querySelector('meta[name="description"]').content = page.querySelector('meta[name="description"]').content;
      current = key(url);
      // The skip link follows the current page rather than the initial URL.
      document.querySelector('.skip-link').href = `${key(url)}#main`;
      restorePosition(url, position);
      const duration = performance.now() - start;
      performance.measure('portfolio:navigation', { start, end: performance.now(), detail: { path: url.pathname, cached } });
      if (debug) console.debug(`[portfolio] content updated: ${duration.toFixed(1)} ms; ${cached ? 'cached' : 'fetched'}; ${url.pathname}`);
    } catch {
      if (ticket !== revision) return;
      if (historyNavigation) location.replace(url.href);
      else location.assign(url.href);
    } finally {
      if (ticket === revision) document.getElementById('main').removeAttribute('aria-busy');
    }
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = destination(event);
    if (!url) return;
    event.preventDefault();
    if (key(url) === current) {
      ++revision;
      document.getElementById('main').removeAttribute('aria-busy');
      restorePosition(url);
      return;
    }
    navigate(url);
  });

  function prefetch(event) {
    if (navigator.connection?.saveData || /(^|-)2g$/.test(navigator.connection?.effectiveType || '')) return;
    const url = destination(event);
    if (url && key(url) !== current) load(url).promise?.catch(() => {});
  }
  document.addEventListener('pointerover', prefetch, { passive: true });
  document.addEventListener('focusin', prefetch);
  addEventListener('popstate', (event) => {
    clearTimeout(scrollTimer);
    const url = new URL(location.href);
    if (key(url) === current) {
      ++revision;
      document.getElementById('main').removeAttribute('aria-busy');
      restorePosition(url, event.state?.portfolioScroll);
    } else navigate(url, { historyNavigation: true, position: event.state?.portfolioScroll });
  });

  if (debug) addEventListener('load', () => {
    setTimeout(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      console.debug(`[portfolio] full document: DOM ready ${timing.domContentLoadedEventEnd.toFixed(1)} ms; load ${timing.loadEventEnd.toFixed(1)} ms; ${location.pathname}`);
    }, 0);
  });
})();
