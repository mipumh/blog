import { getToken } from './auth.js';

const GIT_GATEWAY_URL = 'https://mipumh.netlify.app/.netlify/git/github';

class GitGatewayClient {
  /**
   * Make an authenticated request to Git Gateway
   */
  async request(path, options = {}) {
    const token = await getToken();
    const url = `${GIT_GATEWAY_URL}${path}`;

    const resp = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (resp.status === 401) {
      // Token expired, get fresh one and retry once
      const freshToken = await getToken();
      const retry = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${freshToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      if (!retry.ok) {
        throw new Error(`Git Gateway error: ${retry.status} ${retry.statusText}`);
      }
      return retry.status === 204 ? null : retry.json();
    }

    if (!resp.ok) {
      let detail = '';
      try {
        const body = await resp.json();
        detail = body.message || JSON.stringify(body);
      } catch (_) { /* ignore parse error */ }
      throw new Error(`Git Gateway error: ${resp.status} ${detail}`);
    }

    return resp.status === 204 ? null : resp.json();
  }

  // ── Contents API ──────────────────────────────────────────────────

  /**
   * List files in a directory
   */
  async listDirectory(path, ref = 'gh-pages') {
    return this.request(`/contents/${path}?ref=${ref}`);
  }

  /**
   * Get a single file (returns content as base64 + sha)
   */
  async getFile(path, ref = 'gh-pages') {
    return this.request(`/contents/${path}?ref=${ref}`);
  }

  /**
   * Create or update a file.
   * For updates, pass the current sha of the file.
   * Content must be base64-encoded.
   */
  async createOrUpdateFile(path, contentBase64, message, sha = null, branch = 'gh-pages') {
    const body = {
      message,
      content: contentBase64,
      branch,
    };
    if (sha) body.sha = sha;

    return this.request(`/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * Delete a file
   */
  async deleteFile(path, sha, message, branch = 'gh-pages') {
    return this.request(`/contents/${path}`, {
      method: 'DELETE',
      body: JSON.stringify({ message, sha, branch }),
    });
  }

  // ── Branches API ──────────────────────────────────────────────────

  /**
   * Get branch info (includes latest commit sha)
   */
  async getBranch(name) {
    return this.request(`/branches/${name}`);
  }

  /**
   * Create a new branch from a given sha
   */
  async createBranch(name, fromSha) {
    return this.request('/git/refs', {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${name}`,
        sha: fromSha,
      }),
    });
  }

  /**
   * Delete a branch
   */
  async deleteBranch(name) {
    return this.request(`/git/refs/heads/${name}`, {
      method: 'DELETE',
    });
  }

  // ── Pull Requests API ─────────────────────────────────────────────

  /**
   * Create a pull request
   */
  async createPR(title, head, base = 'gh-pages', body = '') {
    return this.request('/pulls', {
      method: 'POST',
      body: JSON.stringify({ title, head, base, body }),
    });
  }

  /**
   * List open pull requests
   */
  async listPRs(state = 'open') {
    return this.request(`/pulls?state=${state}`);
  }

  /**
   * Get a specific PR
   */
  async getPR(number) {
    return this.request(`/pulls/${number}`);
  }

  // ── Merge API ─────────────────────────────────────────────────────

  /**
   * Merge a branch into another
   */
  async merge(base, head, commitMessage) {
    return this.request('/merges', {
      method: 'POST',
      body: JSON.stringify({
        base,
        head,
        commit_message: commitMessage,
      }),
    });
  }
}

export const gitClient = new GitGatewayClient();
