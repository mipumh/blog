import { getState, subscribe } from '../lib/store.js';
import { logout } from '../lib/auth.js';
import { navigate } from '../router.js';

/**
 * Root app component. Renders header + main content area.
 */
export function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="app-header">
      <a href="#/posts" class="app-header__title">Editor MIP</a>
      <div class="app-header__actions">
        <span id="user-email" style="font-size: var(--text-xs); color: var(--color-text-muted);"></span>
        <button id="btn-logout" class="btn btn--ghost btn--sm">Salir</button>
      </div>
    </header>
    <div class="app-content" id="main-content"></div>
    <div id="status-bar" class="status-bar status-bar--hidden"></div>
  `;

  // User email display
  const user = getState().user;
  if (user) {
    document.getElementById('user-email').textContent = user.email;
  }

  // Logout handler
  document.getElementById('btn-logout').addEventListener('click', async () => {
    await logout();
    window.location.reload();
  });

  // Status bar reactivity
  subscribe((state) => {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    if (state.statusMessage) {
      bar.textContent = state.statusMessage;
      bar.className = `status-bar status-bar--${state.statusType}`;
    } else {
      bar.className = 'status-bar status-bar--hidden';
    }
  });
}

/**
 * Get the main content container for views to render into
 */
export function getContentEl() {
  return document.getElementById('main-content');
}
