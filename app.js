const DEFAULT_THEME = 'aurora';
const DEFAULT_BUTTON_STYLE = 'solid';
const THEME_KEY = 'equinosx-theme';
const BUTTON_KEY = 'equinosx-button-style';
const LOCAL_PREVIEW_ITEMS = [
  { platform: 'Windows', name: 'ChamberOS para PC', version: 'Próximamente', description: 'Añade aquí la versión de escritorio cuando esté lista para publicarse.', fileType: 'EXE', buttonLabel: 'Próximamente', href: '', published: false },
  { platform: 'Android', name: 'ChamberOS móvil', version: 'Próximamente', description: 'Añade aquí el instalador de Android cuando esté listo para publicarse.', fileType: 'APK', buttonLabel: 'Próximamente', href: '', published: false }
];
const grid = document.querySelector('#download-grid');
const count = document.querySelector('#release-count');
const catalogStatus = document.querySelector('.catalog-status');

function readSetting(key, allowed, fallback) {
  try {
    const value = localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function saveSetting(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Private browsing can disable storage. */ }
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  document.querySelectorAll('[data-theme-choice]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
  });
  saveSetting(THEME_KEY, theme);
}

function applyButtonStyle(style) {
  document.body.dataset.buttonStyle = style;
  document.querySelectorAll('[data-button-choice]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.buttonChoice === style));
  });
  saveSetting(BUTTON_KEY, style);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function safeDownloadUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol !== 'https:' && url.origin !== window.location.origin) return null;
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.href;
  } catch {
    return null;
  }
}

function makeCard(item) {
  const platform = escapeHtml(item.platform || 'Aplicación');
  const fileType = escapeHtml(item.fileType || 'APP');
  const name = escapeHtml(item.name || 'Nueva aplicación');
  const version = escapeHtml(item.version || 'Próximamente');
  const description = escapeHtml(item.description || 'Información de la próxima versión.');
  const buttonLabel = escapeHtml(item.buttonLabel || 'Descargar');
  const url = item.published === true ? safeDownloadUrl(item.href) : null;
  const platformMark = platform.toLowerCase().includes('android') ? 'A' : platform.toLowerCase().includes('windows') ? 'W' : 'E';
  const status = url ? 'Versión disponible' : 'Próximamente';
  const button = url
    ? `<a class="download-button" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${buttonLabel}<span aria-hidden="true">↗</span></a>`
    : `<span class="download-button" aria-disabled="true">${buttonLabel}<span aria-hidden="true">· · ·</span></span>`;

  return `<article class="download-card">
    <div class="card-top"><span class="platform-label"><span class="platform-icon" aria-hidden="true">${platformMark}</span>${platform}</span><span class="file-pill">${fileType}</span></div>
    <div class="card-title-row"><h3 class="card-title">${name}</h3><span class="version-pill">${version}</span></div>
    <p class="card-description">${description}</p>
    <div class="card-meta"><span class="meta-item">${url ? 'Enlace oficial' : 'Enlace pendiente'}</span>${item.size ? `<span class="meta-item">${escapeHtml(item.size)}</span>` : ''}</div>
    <div class="card-bottom"><span class="card-status"><span class="status-dot"></span>${status}</span>${button}</div>
  </article>`;
}

async function loadCatalog() {
  try {
    const response = await fetch('./downloads.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No se pudo cargar el catálogo.');
    const items = await response.json();
    if (!Array.isArray(items)) throw new Error('El formato del catálogo no es válido.');
    const visibleItems = items.filter((item) => item && item.visible !== false);
    const publishedCount = visibleItems.filter((item) => item.published === true && safeDownloadUrl(item.href)).length;
    catalogStatus?.classList.toggle('is-empty', publishedCount === 0);
    count.textContent = publishedCount === 1 ? '1 versión disponible' : `${publishedCount} versiones disponibles`;
    grid.innerHTML = visibleItems.length
      ? visibleItems.map(makeCard).join('')
      : `<div class="empty-message"><span class="empty-symbol" aria-hidden="true">✳</span><div><strong>Próximamente, nuevas aplicaciones.</strong><p>El catálogo se actualizará cuando haya una versión lista para descargar.</p></div></div>`;
  } catch {
    if (window.location.protocol === 'file:') {
      count.textContent = 'Vista previa local';
      grid.innerHTML = LOCAL_PREVIEW_ITEMS.map(makeCard).join('');
      catalogStatus?.classList.add('is-empty');
      return;
    }
    count.textContent = 'Catálogo no disponible';
    catalogStatus?.classList.add('is-empty');
    grid.innerHTML = `<div class="empty-message"><span class="empty-symbol" aria-hidden="true">↻</span><div><strong>No pudimos cargar las descargas.</strong><p>Inténtalo de nuevo más tarde.</p></div></div>`;
  }
}

document.querySelectorAll('[data-theme-choice]').forEach((button) => {
  button.addEventListener('click', () => applyTheme(button.dataset.themeChoice));
});
document.querySelectorAll('[data-button-choice]').forEach((button) => {
  button.addEventListener('click', () => applyButtonStyle(button.dataset.buttonChoice));
});
document.querySelectorAll('.mobile-menu-panel a').forEach((link) => {
  link.addEventListener('click', () => link.closest('.mobile-menu')?.removeAttribute('open'));
});

applyTheme(readSetting(THEME_KEY, ['aurora', 'mono', 'glacier', 'ember'], DEFAULT_THEME));
applyButtonStyle(readSetting(BUTTON_KEY, ['solid', 'glass', 'outline'], DEFAULT_BUTTON_STYLE));
loadCatalog();
