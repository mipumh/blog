/**
 * Simple in-memory store for app state.
 * Avoids framework dependency — just a reactive object with listeners.
 */

const state = {
  /** @type {Object|null} - Current authenticated user */
  user: null,

  /** @type {Array} - Author presets from _data/authors.yml */
  authors: [],

  /** @type {Array} - Cached post list [{name, path, sha}] */
  posts: [],

  /** @type {boolean} - Whether posts have been loaded */
  postsLoaded: false,

  /** @type {string} - Current route hash */
  route: window.location.hash || '#/posts',

  /** @type {string|null} - Status message for status bar */
  statusMessage: null,

  /** @type {'saving'|'saved'|'error'|null} */
  statusType: null,
};

const listeners = new Set();

/**
 * Subscribe to state changes
 * @param {Function} fn - Callback that receives the full state
 * @returns {Function} unsubscribe function
 */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Update state and notify listeners
 * @param {Object} partial - Partial state to merge
 */
export function setState(partial) {
  Object.assign(state, partial);
  listeners.forEach(fn => fn(state));
}

/**
 * Get current state (read-only snapshot)
 */
export function getState() {
  return state;
}

/**
 * Show a status message (auto-hides after delay for 'saved')
 */
export function showStatus(message, type = 'saving') {
  setState({ statusMessage: message, statusType: type });
  if (type === 'saved') {
    setTimeout(() => {
      setState({ statusMessage: null, statusType: null });
    }, 2500);
  }
}
