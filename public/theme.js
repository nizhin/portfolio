(() => {
  const key = 'portfolio-minimal-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch { /* The toggle still works when storage is unavailable. */ }

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#191a18' : '#fcfbf8';
    const button = document.querySelector('.theme-toggle');
    if (button) {
      const next = theme === 'dark' ? 'light' : 'dark';
      button.textContent = next;
      button.setAttribute('aria-label', `Switch to ${next} mode`);
      button.hidden = false;
    }
  }

  // Apply before the stylesheet paints to avoid a flash of the wrong theme.
  apply(preference || (system.matches ? 'dark' : 'light'));
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch { /* Optional persistence. */ }
      apply(preference);
    });
  });
  system.addEventListener('change', () => {
    if (!preference) apply(system.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== key && event.key !== null) return;
    preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : undefined;
    apply(preference || (system.matches ? 'dark' : 'light'));
  });
})();
