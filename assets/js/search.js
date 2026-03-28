/**
 * Pagefind search overlay
 *
 * On-demand: Pagefind JS is loaded only when the user opens the search
 * overlay for the first time. Subsequent opens reuse the cached instance.
 *
 * Expected HTML structure (add to your layout):
 *
 *   <div id="search-overlay" class="search-overlay" hidden>
 *     <div class="search-overlay__inner">
 *       <button class="search-overlay__close" aria-label="Cerrar busqueda">&times;</button>
 *       <input type="search" id="search-input" class="search-input"
 *              placeholder="Buscar articulos..." autocomplete="off">
 *       <div id="search-results" class="search-results" role="listbox"></div>
 *     </div>
 *   </div>
 *
 * Any element with [data-search-open] will trigger the overlay open.
 * ~0.5 KB unminified (plus Pagefind is loaded lazily)
 */
(function () {
  'use strict';

  var overlay   = document.getElementById('search-overlay');
  var input     = document.getElementById('search-input');
  var results   = document.getElementById('search-results');

  // If the overlay markup is not present, bail silently.
  if (!overlay || !input || !results) return;

  var pagefind  = null;       // Pagefind instance, loaded once
  var loading   = false;
  var debounceTimer = null;

  // ---- Open / Close -------------------------------------------------------

  function open() {
    overlay.hidden = false;
    document.body.classList.add('search-open');
    input.focus();
    loadPagefind();
  }

  function close() {
    overlay.hidden = true;
    document.body.classList.remove('search-open');
    input.value = '';
    results.innerHTML = '';
  }

  // Bind every [data-search-open] trigger (buttons, links, etc.)
  var triggers = document.querySelectorAll('[data-search-open]');
  for (var i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('click', function (e) {
      e.preventDefault();
      open();
    });
  }

  // Close button inside the overlay
  var closeBtn = overlay.querySelector('.search-overlay__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  // Close on backdrop click (click on the overlay itself, not its children)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });

  // Open on Ctrl/Cmd + K (common convention)
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (overlay.hidden) {
        open();
      } else {
        close();
      }
    }
  });

  // ---- Pagefind lazy load --------------------------------------------------

  function loadPagefind() {
    if (pagefind || loading) return;
    loading = true;

    var basePath = document.querySelector('meta[name="pagefind-base"]');
    var base = basePath ? basePath.content : '/pagefind/';

    import(base + 'pagefind.js')
      .then(function (pf) {
        pagefind = pf;
        return pagefind.init();
      })
      .then(function () {
        loading = false;
        // If the user already typed while loading, run the query now
        if (input.value.trim()) search(input.value.trim());
      })
      .catch(function (err) {
        loading = false;
        results.innerHTML = '<p class="search-results__empty">Error al cargar la busqueda.</p>';
        console.error('Pagefind load error:', err);
      });
  }

  // ---- Search & render -----------------------------------------------------

  function search(query) {
    if (!pagefind) return;

    pagefind.search(query).then(function (searchResult) {
      if (!searchResult.results.length) {
        results.innerHTML = '<p class="search-results__empty">Sin resultados para &ldquo;' +
          escapeHtml(query) + '&rdquo;</p>';
        return;
      }

      // Load the first 8 result details in parallel
      Promise.all(
        searchResult.results.slice(0, 8).map(function (r) { return r.data(); })
      ).then(renderResults);
    });
  }

  function renderResults(items) {
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      html += '<a href="' + escapeHtml(item.url) + '" class="search-result" role="option">' +
        '<span class="search-result__title">' + escapeHtml(item.meta.title || '') + '</span>' +
        '<span class="search-result__excerpt">' + (item.excerpt || '') + '</span>' +
        '</a>';
    }
    results.innerHTML = html;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Debounced input handler (250ms)
  input.addEventListener('input', function () {
    var query = input.value.trim();
    clearTimeout(debounceTimer);

    if (!query) {
      results.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(function () {
      search(query);
    }, 250);
  });
})();
