/**
 * Newsletter CTA injection for article pages
 *
 * Looks for a <template id="newsletter-tpl"> (rendered by article.html)
 * and clones it after the 3rd paragraph inside `.article-body__inner`.
 * If the article has fewer than 4 paragraphs, or the template is missing,
 * the script does nothing.
 *
 * Load with `defer` so the DOM is ready when this executes.
 * ~0.3 KB unminified
 */
(function () {
  'use strict';

  var body = document.querySelector('.article-body__inner');
  if (!body) return;

  var tpl = document.getElementById('newsletter-tpl');
  if (!tpl) return;

  // Collect only direct-child <p> elements (skip nested blockquote/list paragraphs)
  var paragraphs = body.querySelectorAll(':scope > p');
  if (paragraphs.length < 4) return;

  // Insert after the 3rd paragraph (index 2)
  var target = paragraphs[2];
  var clone = tpl.content.cloneNode(true);
  target.parentNode.insertBefore(clone, target.nextSibling);
})();
