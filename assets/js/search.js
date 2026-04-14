/**
 * Simple Jekyll Search — client-side substring matching
 *
 * Loads search.json and matches queries against title, author, tags, category, content.
 * No external dependencies — vanilla JS with a tiny fuzzy-free search engine.
 */
(function () {
  'use strict';

  var overlay = document.getElementById('search-overlay');
  var input   = document.getElementById('search-input');
  var results = document.getElementById('search-results');

  if (!overlay || !input || !results) return;

  var searchData = null;
  var loading    = false;
  var debounceTimer = null;

  // ---- Open / Close ---------------------------------------------------------

  function open() {
    overlay.hidden = false;
    document.body.classList.add('search-open');
    input.focus();
    loadData();
  }

  function close() {
    overlay.hidden = true;
    document.body.classList.remove('search-open');
    input.value = '';
    results.innerHTML = '';
  }

  var triggers = document.querySelectorAll('[data-search-open]');
  for (var i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('click', function (e) {
      e.preventDefault();
      open();
    });
  }

  var closeBtn = overlay.querySelector('.search-overlay__close');
  if (closeBtn) closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay.hidden ? open() : close();
    }
  });

  // ---- Load data ------------------------------------------------------------

  function loadData() {
    if (searchData || loading) return;
    loading = true;

    var base = overlay.getAttribute('data-baseurl');
    if (base == null) base = '/blog';

    fetch(base + '/search.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        // Pre-build a lowercase searchable string for each item
        searchData = data.map(function (item) {
          item._searchable = [
            item.title || '',
            item.author || '',
            item.category || '',
            item.tags || '',
            item.content || ''
          ].join(' ').toLowerCase();
          return item;
        });
        loading = false;
        if (input.value.trim()) search(input.value.trim());
      })
      .catch(function () {
        loading = false;
        results.innerHTML = '<p class="search-results__empty">Error al cargar el índice de búsqueda.</p>';
      });
  }

  // ---- Search & render ------------------------------------------------------

  function search(query) {
    if (!searchData) return;

    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) { results.innerHTML = ''; return; }

    // Score each item: all terms must be present (AND logic)
    var scored = [];
    for (var i = 0; i < searchData.length; i++) {
      var item = searchData[i];
      var allMatch = true;
      var score = 0;

      for (var t = 0; t < terms.length; t++) {
        var term = terms[t];
        if (item._searchable.indexOf(term) === -1) {
          allMatch = false;
          break;
        }
        // Boost: title match worth more
        var titleLower = (item.title || '').toLowerCase();
        if (titleLower.indexOf(term) !== -1) score += 10;
        // Boost: author match
        var authorLower = (item.author || '').toLowerCase();
        if (authorLower.indexOf(term) !== -1) score += 8;
        // Boost: tag match
        var tagsLower = (item.tags || '').toLowerCase();
        if (tagsLower.indexOf(term) !== -1) score += 5;
        // Boost: category match
        var catLower = (item.category || '').toLowerCase();
        if (catLower.indexOf(term) !== -1) score += 5;
        // Base content match
        score += 1;
      }

      if (allMatch) {
        scored.push({ item: item, score: score });
      }
    }

    // Sort by score descending
    scored.sort(function (a, b) { return b.score - a.score; });

    if (!scored.length) {
      results.innerHTML = '<p class="search-results__empty">Sin resultados para \u201c' +
        escapeHtml(query) + '\u201d</p>';
      return;
    }

    var html = '';
    var max = Math.min(scored.length, 12);
    for (var j = 0; j < max; j++) {
      var item = scored[j].item;
      html += '<a href="' + escapeHtml(item.url) + '" class="search-result">' +
        '<span class="search-result__title">' + escapeHtml(item.title) + '</span>' +
        '<span class="search-result__meta">' +
          escapeHtml(item.category || '') +
          (item.author ? ' &middot; ' + escapeHtml(item.author) : '') +
          (item.date ? ' &middot; ' + escapeHtml(item.date) : '') +
        '</span>' +
        '</a>';
    }
    results.innerHTML = html;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  input.addEventListener('input', function () {
    var query = input.value.trim();
    clearTimeout(debounceTimer);

    if (!query) {
      results.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(function () {
      search(query);
    }, 150);
  });
})();
