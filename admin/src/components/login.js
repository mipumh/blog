import { login, recover, acceptInvite } from '../lib/auth.js';
import { setState } from '../lib/store.js';

/**
 * Render the login page.
 * Handles recovery_token and invite_token from URL hash.
 */
export function renderLogin() {
  const app = document.getElementById('app');
  const hash = window.location.hash;

  // Check for recovery or invite tokens
  if (hash.includes('recovery_token=')) {
    const token = hash.match(/recovery_token=([^&]+)/)?.[1];
    if (token) {
      renderPasswordReset(app, token, 'recovery');
      return;
    }
  }

  if (hash.includes('invite_token=')) {
    const token = hash.match(/invite_token=([^&]+)/)?.[1];
    if (token) {
      renderPasswordReset(app, token, 'invite');
      return;
    }
  }

  // Normal login form
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

/**
 * Render password reset form for recovery/invite tokens.
 */
function renderPasswordReset(app, token, type) {
  const title = type === 'invite' ? 'Crear contraseña' : 'Nueva contraseña';

  app.innerHTML = `
    <div class="login-page">
      <div class="login-card">
        <h1>${title}</h1>
        <p>Introduce tu nueva contraseña</p>
        <div id="reset-error" class="login-error" style="display:none;"></div>
        <div id="reset-success" style="display:none; color: #065f46; margin-bottom: 1rem;"></div>
        <form id="reset-form">
          <div class="form-group">
            <label class="form-label" for="new-password">Nueva contraseña</label>
            <input class="form-input" type="password" id="new-password" required minlength="6" autofocus>
          </div>
          <div class="form-group">
            <label class="form-label" for="confirm-password">Confirmar contraseña</label>
            <input class="form-input" type="password" id="confirm-password" required minlength="6">
          </div>
          <button type="submit" class="btn btn--primary btn--block" id="btn-reset">
            Guardar contraseña
          </button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('reset-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;
    const errorEl = document.getElementById('reset-error');
    const successEl = document.getElementById('reset-success');
    const btn = document.getElementById('btn-reset');

    errorEl.style.display = 'none';

    if (password !== confirm) {
      errorEl.textContent = 'Las contraseñas no coinciden.';
      errorEl.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
      let user;
      if (type === 'invite') {
        user = await acceptInvite(token);
      } else {
        user = await recover(token);
      }
      await user.update({ password });

      successEl.textContent = 'Contraseña actualizada. Redirigiendo...';
      successEl.style.display = 'block';
      document.getElementById('reset-form').style.display = 'none';

      // Clean hash and reload
      setTimeout(() => {
        window.location.hash = '';
        window.location.reload();
      }, 1500);
    } catch (err) {
      errorEl.textContent = `Error: ${err.message || 'Token inválido o expirado.'}`;
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Guardar contraseña';
    }
  });
}
