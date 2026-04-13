/**
 * Popular carousel — prev/next scroll buttons
 * ~0.3 KB unminified
 */
(function () {
  'use strict';

  var track = document.querySelector('.popular-carousel__track');
  if (!track) return;

  var prev = document.querySelector('.popular-carousel__prev');
  var next = document.querySelector('.popular-carousel__next');
  var scrollAmount = 300;

  if (prev) {
    prev.addEventListener('click', function () {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }
})();
