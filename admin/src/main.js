import './styles/main.css';
import { currentUser } from './lib/auth.js';
import { setState } from './lib/store.js';
import { gitClient } from './lib/git-gateway.js';
import { route, startRouter } from './router.js';
import { renderLogin } from './components/login.js';
import { renderApp } from './components/app.js';
import { renderPostList } from './components/post-list.js';
import { renderPostEditor, destroyEditor } from './components/post-editor.js';
import yaml from 'js-yaml';

/**
 * App initialization
 */
async function init() {
  const user = currentUser();

  if (!user) {
    renderLogin();
    return;
  }

  // User is authenticated
  setState({ user });
  renderApp();

  // Load author presets from _data/authors.yml
  try {
    const file = await gitClient.getFile('_data/authors.yml');
    const content = new TextDecoder().decode(Uint8Array.from(atob(file.content), c => c.charCodeAt(0)));
    const authors = yaml.load(content) || {};
    setState({ authors });
  } catch (err) {
    console.warn('No se pudo cargar authors.yml:', err.message);
  }

  // Setup routes
  route('#/posts', () => {
    destroyEditor();
    renderPostList();
  });

  route('#/new', () => {
    destroyEditor();
    renderPostEditor({});
  });

  route('#/edit/:filename', (params) => {
    destroyEditor();
    renderPostEditor(params);
  });

  // Start routing
  startRouter();
}

// Boot
init().catch(err => {
  console.error('Error al iniciar la aplicación:', err);
  document.getElementById('app').innerHTML = `
    <div class="login-page">
      <div class="login-card">
        <h1>Error</h1>
        <p>${err.message}</p>
        <button class="btn btn--primary btn--block" onclick="location.reload()">Reintentar</button>
      </div>
    </div>
  `;
});
