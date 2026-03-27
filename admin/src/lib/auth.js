import GoTrue from 'gotrue-js';

const IDENTITY_URL = 'https://mipumh.netlify.app/.netlify/identity';

const auth = new GoTrue({
  APIUrl: IDENTITY_URL,
  audience: '',
  setCookie: true,
});

/**
 * Login with email/password
 */
export function login(email, password) {
  return auth.login(email, password, true);
}

/**
 * Get current logged-in user (or null)
 */
export function currentUser() {
  return auth.currentUser();
}

/**
 * Logout current user
 */
export function logout() {
  const user = auth.currentUser();
  if (!user) return Promise.resolve();
  return user.logout();
}

/**
 * Get a fresh JWT token for Git Gateway requests.
 * Automatically refreshes if expired.
 */
export async function getToken() {
  const user = auth.currentUser();
  if (!user) throw new Error('No autenticado');
  return user.jwt(true);
}
