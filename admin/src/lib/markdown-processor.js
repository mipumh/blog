/**
 * Pre/post-processing for Jekyll-specific Liquid syntax in Markdown.
 *
 * TipTap can't handle {{ site.baseurl }} or {% tweet %} tags.
 * We convert them to standard values on load and restore on save.
 *
 * Images use raw.githubusercontent.com so they display instantly
 * in the editor without waiting for GitHub Pages to rebuild.
 */

const RAW_BASE = 'https://raw.githubusercontent.com/mipumh/blog/gh-pages';

/**
 * Pre-process markdown BEFORE feeding to TipTap editor.
 * Replaces Jekyll Liquid tags with raw GitHub URLs.
 *
 * @param {string} raw - Raw markdown from post file
 * @returns {string} - Markdown safe for TipTap
 */
export function preprocessMarkdown(raw) {
  let processed = raw;

  // {{ site.baseurl }}/images/ → raw GitHub URL for images
  processed = processed.replace(
    /\{\{\s*site\.baseurl\s*\}\}\/(images\/)/g,
    `${RAW_BASE}/$1`
  );

  // {{ site.baseurl }} in other contexts (links, etc) → /blog
  processed = processed.replace(
    /\{\{\s*site\.baseurl\s*\}\}/g,
    '/blog'
  );

  // {% tweet 1234567890 %} → <!--jekyll:tweet:1234567890-->
  processed = processed.replace(
    /\{%\s*tweet\s+(\d+)\s*%\}/g,
    '<!--jekyll:tweet:$1-->'
  );

  return processed;
}

/**
 * Post-process markdown AFTER getting from TipTap editor.
 * Restores Jekyll Liquid tags for Jekyll compatibility.
 *
 * @param {string} markdown - Markdown from TipTap
 * @returns {string} - Markdown with Jekyll Liquid tags restored
 */
export function postprocessMarkdown(markdown) {
  let processed = markdown;

  // Raw GitHub URL → {{ site.baseurl }} in markdown images
  processed = processed.replace(
    /(\!\[[^\]]*\]\()https:\/\/raw\.githubusercontent\.com\/mipumh\/blog\/gh-pages\/(images\/)/g,
    '$1{{ site.baseurl }}/$2'
  );

  // Also handle HTML img tags
  processed = processed.replace(
    /(src=["'])https:\/\/raw\.githubusercontent\.com\/mipumh\/blog\/gh-pages\/(images\/)/g,
    '$1{{ site.baseurl }}/$2'
  );

  // Restore {% tweet %} tags from HTML comments
  processed = processed.replace(
    /<!--jekyll:tweet:(\d+)-->/g,
    '{% tweet $1 %}'
  );

  // Ensure trailing newline
  if (!processed.endsWith('\n')) {
    processed += '\n';
  }

  return processed;
}
