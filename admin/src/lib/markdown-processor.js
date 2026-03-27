/**
 * Pre/post-processing for Jekyll-specific Liquid syntax in Markdown.
 *
 * TipTap can't handle {{ site.baseurl }} or {% tweet %} tags.
 * We convert them to standard values on load and restore on save.
 *
 * Images use the full GitHub Pages URL so they display correctly
 * in the editor (hosted on Netlify, separate from the blog).
 */

const SITE_URL = 'https://mip.umh.es/blog';

/**
 * Pre-process markdown BEFORE feeding to TipTap editor.
 * Replaces Jekyll Liquid tags with full URLs.
 *
 * @param {string} raw - Raw markdown from post file
 * @returns {string} - Markdown safe for TipTap
 */
export function preprocessMarkdown(raw) {
  let processed = raw;

  // {{ site.baseurl }} → https://mip.umh.es/blog
  processed = processed.replace(
    /\{\{\s*site\.baseurl\s*\}\}/g,
    SITE_URL
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

  // Full URL → {{ site.baseurl }} in image markdown: ![alt](https://mip.umh.es/blog/images/...)
  processed = processed.replace(
    /(\!\[[^\]]*\]\()https:\/\/mip\.umh\.es\/blog\/(images\/)/g,
    '$1{{ site.baseurl }}/$2'
  );

  // Also handle HTML img tags that TipTap might produce
  processed = processed.replace(
    /(src=["'])https:\/\/mip\.umh\.es\/blog\/(images\/)/g,
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
