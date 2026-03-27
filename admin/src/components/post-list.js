import { gitClient } from '../lib/git-gateway.js';
import { getState, setState } from '../lib/store.js';
import { getContentEl } from './app.js';
import { navigate } from '../router.js';
import { parseFilename } from '../lib/slug.js';

const POSTS_PER_PAGE = 25;

/**
 * Render the post list view
 */
export async function renderPostList() {
  const el = getContentEl();
  el.innerHTML = `
    <div class="post-list-header">
      <h1>Artículos</h1>
      <button id="btn-new-post" class="btn btn--primary">+ Nuevo artículo</button>
    </div>
    <div class="search-box">
      <input type="text" id="search-input" placeholder="Buscar por título..." autocomplete="off">
    </div>
    <div id="post-list-container" class="loading">Cargando artículos</div>
    <div id="pagination-container"></div>
  `;

  document.getElementById('btn-new-post').addEventListener('click', () => {
    navigate('#/new');
  });

  // Load posts
  try {
    await loadPosts();
    renderPosts(1, '');
  } catch (err) {
    document.getElementById('post-list-container').innerHTML =
      `<div class="empty-state"><p>Error al cargar artículos: ${err.message}</p></div>`;
  }

  // Search
  document.getElementById('search-input').addEventListener('input', (e) => {
    renderPosts(1, e.target.value.toLowerCase());
  });
}

/**
 * Fetch and cache the posts directory listing
 */
async function loadPosts() {
  if (getState().postsLoaded) return;

  const files = await gitClient.listDirectory('_posts');
  // Filter only .md files, parse filenames, sort by date descending
  const posts = files
    .filter(f => f.name.endsWith('.md'))
    .map(f => ({
      name: f.name,
      path: f.path,
      sha: f.sha,
      ...parseFilename(f.name),
    }))
    .filter(p => p.date) // Only valid filenames
    .sort((a, b) => b.date.localeCompare(a.date));

  setState({ posts, postsLoaded: true });
}

/**
 * Render filtered/paginated post list
 */
function renderPosts(page, query) {
  const container = document.getElementById('post-list-container');
  container.classList.remove('loading');
  const paginationEl = document.getElementById('pagination-container');
  const { posts } = getState();

  // Filter by search query
  const filtered = query
    ? posts.filter(p => {
        const title = p.slug.replace(/-/g, ' ');
        return title.includes(query) || p.name.includes(query);
      })
    : posts;

  // Paginate
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const pageItems = filtered.slice(start, start + POSTS_PER_PAGE);

  if (pageItems.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>${
      query ? 'No se encontraron artículos.' : 'No hay artículos todavía.'
    }</p></div>`;
    paginationEl.innerHTML = '';
    return;
  }

  container.innerHTML = pageItems.map(post => {
    const titleDisplay = post.slug
      .replace(/-/g, ' ')
      .replace(/^\w/, c => c.toUpperCase());

    return `
      <div class="post-item" data-filename="${post.name}">
        <div class="post-item__info">
          <div class="post-item__title">${escapeHtml(titleDisplay)}</div>
          <div class="post-item__meta">
            <span>${post.date}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Click handlers
  container.querySelectorAll('.post-item').forEach(item => {
    item.addEventListener('click', () => {
      const filename = item.dataset.filename;
      navigate(`#/edit/${encodeURIComponent(filename)}`);
    });
  });

  // Pagination
  if (totalPages > 1) {
    paginationEl.innerHTML = `
      <div class="pagination">
        <button class="btn btn--secondary btn--sm" ${page <= 1 ? 'disabled' : ''} id="btn-prev">← Anterior</button>
        <span class="pagination__info">${page} / ${totalPages}</span>
        <button class="btn btn--secondary btn--sm" ${page >= totalPages ? 'disabled' : ''} id="btn-next">Siguiente →</button>
      </div>
    `;
    document.getElementById('btn-prev')?.addEventListener('click', () => renderPosts(page - 1, query));
    document.getElementById('btn-next')?.addEventListener('click', () => renderPosts(page + 1, query));
  } else {
    paginationEl.innerHTML = '';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
