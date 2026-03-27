import { login } from '../lib/auth.js';
import { setState } from '../lib/store.js';

/**
 * Render the login page
 */
export function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-page">
      <div class="login-card">
        <h1>Editor</h1>
        <p>Revista de Innovación en Periodismo</p>
        <div id="login-error" class="login-error" style="display:none;"></div>
        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="email">Correo electrónico</label>
            <input class="form-input" type="email" id="email" required autocomplete="email" autofocus>
          </div>
          <div class="form-group">
            <label class="form-label" for="password">Contraseña</label>
            <input class="form-input" type="password" id="password" required autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn--primary btn--block" id="btn-login">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    const btnLogin = document.getElementById('btn-login');

    errorEl.style.display = 'none';
    btnLogin.disabled = true;
    btnLogin.textContent = 'Entrando...';

    try {
      const user = await login(email, password);
      setState({ user });
      window.location.reload();
    } catch (err) {
      errorEl.textContent = 'Credenciales incorrectas. Inténtalo de nuevo.';
      errorEl.style.display = 'block';
      btnLogin.disabled = false;
      btnLogin.textContent = 'Iniciar sesión';
    }
  });
}
