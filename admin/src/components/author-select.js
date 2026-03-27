import { getState } from '../lib/store.js';

/**
 * Render author select component.
 * Loads presets from _data/authors.yml (cached in store).
 *
 * @param {Object|null} currentAuthor - Current author object from post frontmatter
 * @returns {string} HTML string
 */
export function renderAuthorSelect(currentAuthor) {
  const { authors } = getState();
  const authorKeys = Object.keys(authors);

  // Find matching preset key (if any)
  let selectedKey = '';
  if (currentAuthor && currentAuthor.name) {
    selectedKey = authorKeys.find(key => authors[key].name === currentAuthor.name) || '';
  }

  return `
    <div class="form-group form-group--full author-select-group">
      <label class="form-label">Autor</label>
      <select class="form-select" id="author-preset">
        <option value="">— Seleccionar autor —</option>
        ${authorKeys.map(key => `
          <option value="${key}" ${key === selectedKey ? 'selected' : ''}>
            ${escapeHtml(authors[key].name)}
          </option>
        `).join('')}
        <option value="__manual__" ${currentAuthor && !selectedKey && currentAuthor.name ? 'selected' : ''}>
          ✏️ Autor manual (invitado)
        </option>
      </select>
      <div class="author-fields" id="author-fields">
        <input class="form-input" id="author-name" placeholder="Nombre" value="${escapeAttr(currentAuthor?.name || '')}">
        <input class="form-input" id="author-twitter" placeholder="Twitter (sin @)" value="${escapeAttr(currentAuthor?.twitter || '')}">
        <input class="form-input" id="author-bio" placeholder="Bio" value="${escapeAttr(currentAuthor?.bio || '')}">
        <input class="form-input" id="author-image" placeholder="Imagen (ej: yo.webp)" value="${escapeAttr(currentAuthor?.image || '')}">
        <input class="form-input" id="author-link" placeholder="Enlace" value="${escapeAttr(currentAuthor?.link || '')}" style="grid-column: 1 / -1;">
      </div>
    </div>
  `;
}

/**
 * Attach event handlers for author select.
 * When a preset is selected, fill in all fields.
 */
export function attachAuthorSelect() {
  const select = document.getElementById('author-preset');
  if (!select) return;

  select.addEventListener('change', () => {
    const key = select.value;
    const { authors } = getState();

    if (key && key !== '__manual__' && authors[key]) {
      const a = authors[key];
      document.getElementById('author-name').value = a.name || '';
      document.getElementById('author-twitter').value = a.twitter || '';
      document.getElementById('author-bio').value = a.bio || '';
      document.getElementById('author-image').value = a.image || '';
      document.getElementById('author-link').value = a.link || '';
    } else if (key === '__manual__') {
      // Clear fields for manual entry
      document.getElementById('author-name').value = '';
      document.getElementById('author-twitter').value = '';
      document.getElementById('author-bio').value = '';
      document.getElementById('author-image').value = '';
      document.getElementById('author-link').value = '';
      document.getElementById('author-name').focus();
    }
  });
}

/**
 * Read the current author values from the form fields.
 * @returns {Object} author object
 */
export function getAuthorFromForm() {
  return {
    name: document.getElementById('author-name')?.value.trim() || '',
    twitter: document.getElementById('author-twitter')?.value.trim() || '',
    bio: document.getElementById('author-bio')?.value.trim() || '',
    image: document.getElementById('author-image')?.value.trim() || '',
    link: document.getElementById('author-link')?.value.trim() || '',
  };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function escapeAttr(text) {
  return (text || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
