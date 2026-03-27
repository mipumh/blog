import { setState, getState } from './lib/store.js';

/**
 * Simple hash-based router.
 * Routes: #/posts, #/new, #/edit/{filename}
 */

const routes = [];

/**
 * Register a route handler
 * @param {string} pattern - Route pattern (e.g., '#/edit/:filename')
 * @param {Function} handler - Function(params) that renders the view
 */
export function route(pattern, handler) {
  // Convert pattern to regex: #/edit/:filename → #/edit/(.+)
  const regex = new RegExp(
    '^' + pattern.replace(/:([^/]+)/g, '([^/]+)') + '$'
  );
  const paramNames = [];
  pattern.replace(/:([^/]+)/g, (_, name) => {
    paramNames.push(name);
  });
  routes.push({ regex, paramNames, handler });
}

/**
 * Navigate to a hash route
 */
export function navigate(hash) {
  window.location.hash = hash;
}

/**
 * Resolve the current hash and call the matching handler
 */
export function resolve() {
  const hash = window.location.hash || '#/posts';
  setState({ route: hash });

  for (const r of routes) {
    const match = hash.match(r.regex);
    if (match) {
      const params = {};
      r.paramNames.forEach((name, i) => {
        params[name] = decodeURIComponent(match[i + 1]);
      });
      r.handler(params);
      return;
    }
  }

  // Default: redirect to post list
  navigate('#/posts');
}

/**
 * Start listening to hash changes
 */
export function startRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}
