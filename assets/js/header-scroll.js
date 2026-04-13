/**
 * Header hide/show on scroll
 *
 * Adds class `site-header--hidden` to `.site-header` when the user
 * scrolls down past a threshold, and removes it on scroll up.
 * Uses a scroll-delta approach with requestAnimationFrame for performance.
 *
 * ~0.5 KB unminified
 */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  if (!header) return;

  var THRESHOLD = 60;        // px before hide kicks in
  var DELTA_MIN = 5;         // minimum scroll distance to trigger change
  var lastScrollY = 0;
  var ticking = false;

  function onScroll() {
    var currentY = window.pageYOffset;

    // Never hide header while mega menu is open
    if (document.body.classList.contains('menu-open')) {
      lastScrollY = currentY;
      ticking = false;
      return;
    }

    // Always show header near the top of the page
    if (currentY <= THRESHOLD) {
      header.classList.remove('site-header--hidden');
      lastScrollY = currentY;
      ticking = false;
      return;
    }

    var delta = currentY - lastScrollY;

    // Ignore tiny scrolls (jitter, elastic bounce, etc.)
    if (Math.abs(delta) < DELTA_MIN) {
      ticking = false;
      return;
    }

    if (delta > 0) {
      // Scrolling down — hide
      header.classList.add('site-header--hidden');
    } else {
      // Scrolling up — show
      header.classList.remove('site-header--hidden');
    }

    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();
