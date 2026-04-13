# Performance Reference: Fast Jekyll Like 11ty

How to achieve 11ty-level page speed from Jekyll + Bootstrap + Netlify.
Target: <200KB first load, Lighthouse 90+ on all four categories.

---

## Build Pipeline Overview

```
jekyll build → PurgeCSS → Pagefind → HTML minify → Deploy to Netlify CDN
```

### netlify.toml (complete)

```toml
[build]
  command = """
    npm ci && \
    JEKYLL_ENV=production bundle exec jekyll build && \
    npx pagefind --source _site && \
    npm run postbuild
  """
  publish = "_site/"

[build.environment]
  RUBY_VERSION = "3.3.0"
  NODE_VERSION = "20"
  JEKYLL_ENV = "production"

# Cache Jekyll build artifacts between deploys
[[plugins]]
  package = "netlify-plugin-jekyll-cache"

# HTML files: always revalidate (CDN edge cache is separate)
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    X-Content-Type-Options = "nosniff"

# Static assets: immutable, cache forever
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Fonts: also immutable
[[headers]]
  for = "/assets/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Access-Control-Allow-Origin = "*"

# Pagefind assets
[[headers]]
  for = "/pagefind/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

### package.json

```json
{
  "name": "editorial-magazine",
  "scripts": {
    "postbuild": "npx purgecss --config purgecss.config.js && npx html-minifier-terser --input-dir _site --output-dir _site --file-ext html --collapse-whitespace --remove-comments --minify-css true --minify-js true"
  },
  "devDependencies": {
    "pagefind": "^1.1.0",
    "purgecss": "^6.0.0",
    "html-minifier-terser": "^7.2.0"
  }
}
```

---

## PurgeCSS: The Biggest Win

Bootstrap 5 full CSS: ~499KB. After PurgeCSS: ~20-30KB (95% reduction).

### purgecss.config.js

```javascript
module.exports = {
  content: ['_site/**/*.html'],
  css: ['_site/assets/css/*.css'],
  output: '_site/assets/css/',
  // CRITICAL: safelist Bootstrap's dynamic classes
  safelist: {
    standard: [
      /^nav/,
      /^navbar/,
      /^collapse/,
      /^collapsing/,
      /^show$/,
      /^active$/,
      /^fade/,
      /^modal/,
      /^offcanvas/,
      /^btn/,
      /^page-item/,
      /^page-link/,
      /^visually-hidden/,
    ],
    // Safelist data-theme attribute for dark mode
    greedy: [/data-theme/]
  }
};
```

### Alternative: Import Only Needed Bootstrap Modules

Even better than PurgeCSS is importing only what you need:

```scss
// _sass/_bootstrap-custom.scss

// Required core
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/root";
@import "bootstrap/scss/utilities";

// Only the components an editorial site actually needs
@import "bootstrap/scss/reboot";
@import "bootstrap/scss/type";
@import "bootstrap/scss/containers";
@import "bootstrap/scss/grid";
@import "bootstrap/scss/nav";
@import "bootstrap/scss/navbar";
@import "bootstrap/scss/card";        // if using Bootstrap cards
@import "bootstrap/scss/buttons";
@import "bootstrap/scss/pagination";
@import "bootstrap/scss/collapse";    // for mobile nav
@import "bootstrap/scss/transitions"; // for collapse animation

// Generate only needed utilities
@import "bootstrap/scss/utilities/api";
```

This approach produces ~40-60KB CSS before PurgeCSS, ~15-20KB after.

---

## Critical CSS Inline

Extract above-the-fold CSS and inline it in `<head>` to eliminate render-blocking.

### Method: Jekyll Sass inline compilation

```html
<!-- _layouts/default.html -->
<head>
  <!-- Critical CSS: inline for instant FCP -->
  <style>
    {% capture critical %}{% include critical.scss %}{% endcapture %}
    {{ critical | scssify }}
  </style>

  <!-- Full CSS: load async -->
  <link rel="preload" href="/assets/css/main.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'">
  <noscript>
    <link rel="stylesheet" href="/assets/css/main.css">
  </noscript>
</head>
```

### _includes/critical.scss

Only include styles needed to render above-the-fold content:

```scss
// Reset basics
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: var(--font-sans); background: var(--color-bg); color: var(--color-text); }

// CSS custom properties (full set)
@import "variables";

// Header/nav styles
@import "header-critical";

// Hero section styles
@import "hero-critical";

// Typography basics
h1, h2, h3 { font-family: var(--font-serif); }
p { line-height: 1.65; }
a { color: var(--color-brand-dark); }

// Container (simplified Bootstrap)
.container-xl { width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 1rem; }
```

---

## Image Optimization

### Netlify Image CDN

Netlify provides on-the-fly image transformation at no extra cost:

```html
<!-- Instead of: -->
<img src="/assets/images/post.jpg">

<!-- Use: -->
<img src="/.netlify/images?url=/assets/images/post.jpg&w=800&q=75&fm=webp">
```

Create a Jekyll include for responsive images:

```html
<!-- _includes/responsive-image.html -->
{% assign img = include.src %}
{% assign alt = include.alt | default: "" %}
{% assign widths = "400,800,1200" | split: "," %}
<img
  srcset="{% for w in widths %}/.netlify/images?url={{ img }}&w={{ w }}&fm=webp {{ w }}w{% unless forloop.last %}, {% endunless %}{% endfor %}"
  sizes="{{ include.sizes | default: '(max-width: 768px) 100vw, 800px' }}"
  src="/.netlify/images?url={{ img }}&w=800&fm=webp&q=75"
  alt="{{ alt }}"
  loading="{{ include.loading | default: 'lazy' }}"
  decoding="async"
  width="{{ include.width | default: 800 }}"
  height="{{ include.height | default: 450 }}">
```

### Lazy Loading Rules

- Hero image: `loading="eager"` + `fetchpriority="high"` (it's above the fold)
- All other images: `loading="lazy"` + `decoding="async"`
- Card images in the viewport at load time: rely on browser heuristics

### Image Sizing

Always include `width` and `height` attributes to prevent Cumulative Layout Shift.
For cards using 16:9, use `width="800" height="450"`.

---

## Font Performance

### Self-Hosting > Google Fonts CDN

Self-hosting eliminates:
- DNS lookup to fonts.googleapis.com
- DNS lookup to fonts.gstatic.com
- Render-blocking CSS fetch
- Privacy concerns (GDPR)

Download woff2 files, place in `/assets/fonts/`.

### Preload Critical Fonts

```html
<head>
  <link rel="preload" href="/assets/fonts/SourceSans3-Regular.woff2"
        as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/PlayfairDisplay-Bold.woff2"
        as="font" type="font/woff2" crossorigin>
</head>
```

Only preload the 2 most critical font files (body regular, headline bold).
Other weights load on demand via `font-display: swap`.

---

## JavaScript Minimization

Editorial sites should ship minimal JS. Target: <20KB total.

### What Needs JS

1. **Header scroll behavior** (~0.5KB): Show/hide on scroll direction
2. **Dark mode toggle** (~0.3KB): Theme switching + localStorage
3. **Pagefind search** (~15KB loaded on demand): Only when search is opened
4. **Newsletter inject** (~0.3KB): Insert CTA after 3rd paragraph
5. **Bootstrap collapse** (~5KB): Only for mobile nav toggle

### Script Loading Strategy

```html
<!-- End of <body> -->

<!-- Critical: header + theme (tiny, inline) -->
<script>
  // Header scroll detection (from layouts.md)
  // Dark mode detection (from branding.md)
</script>

<!-- Deferred: Bootstrap collapse for mobile nav -->
<script src="/assets/js/bootstrap-collapse.min.js" defer></script>

<!-- On-demand: Pagefind (loaded only when search opens) -->
<script>
  document.getElementById('search-toggle').addEventListener('click', async function() {
    if (!window.__pagefind) {
      window.__pagefind = await import('/pagefind/pagefind.js');
      await window.__pagefind.init();
    }
    // Open search modal
  });
</script>
```

---

## Jekyll Build Speed

### _config.yml Optimizations

```yaml
# Incremental builds (dev only, Netlify does full builds)
incremental: true

# Exclude unnecessary files from processing
exclude:
  - node_modules
  - Gemfile
  - Gemfile.lock
  - package.json
  - package-lock.json
  - purgecss.config.js
  - netlify.toml
  - README.md
  - vendor

# Limit LSI (related posts) — expensive computation
lsi: false

# Use kramdown with Rouge (faster than alternatives)
markdown: kramdown
highlighter: rouge
```

### Gemfile

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-feed"
  gem "jekyll-paginate-v2"
  gem "jekyll-include-cache"  # Cache expensive includes
end
```

`jekyll-include-cache` can significantly speed up builds for sites with many
posts using the same includes (cards, author bios).

---

## Lighthouse Checklist

Run `lighthouse https://your-site.netlify.app --view` and target 90+ on all:

### Performance (90+)
- [ ] Critical CSS inlined
- [ ] Full CSS loaded async
- [ ] Images have width/height
- [ ] Hero image has fetchpriority="high"
- [ ] All other images lazy-loaded
- [ ] Fonts self-hosted with font-display: swap
- [ ] JS deferred or async
- [ ] Netlify CDN headers configured
- [ ] PurgeCSS removes unused Bootstrap

### Accessibility (90+)
- [ ] All images have alt text
- [ ] Color contrast ratios pass WCAG AA (4.5:1 text, 3:1 large text)
- [ ] Skip-to-content link
- [ ] Semantic HTML (article, nav, main, aside, footer)
- [ ] ARIA labels on interactive elements
- [ ] Focus styles visible
- [ ] Touch targets ≥44×44px on mobile

### Best Practices (90+)
- [ ] HTTPS everywhere
- [ ] No mixed content
- [ ] No console errors
- [ ] Images served in WebP/AVIF via Netlify Image CDN

### SEO (90+)
- [ ] jekyll-seo-tag configured (title, description, og:image)
- [ ] jekyll-sitemap generating /sitemap.xml
- [ ] jekyll-feed generating /feed.xml
- [ ] Structured data (Schema.org Article, BreadcrumbList)
- [ ] Canonical URLs
- [ ] Robots.txt
- [ ] Mobile-friendly (viewport meta)
