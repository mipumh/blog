module.exports = {
  content: ['_site/**/*.html'],
  css: ['_site/assets/css/*.css'],
  output: '_site/assets/css/',
  safelist: {
    standard: [
      /^nav/,
      /^navbar/,
      /^collapse/,
      /^collapsing/,
      /^show$/,
      /^active$/,
      /^fade/,
      /^offcanvas/,
      /^btn/,
      /^page-item/,
      /^page-link/,
      /^visually-hidden/,
    ],
    greedy: [/data-theme/]
  }
};
