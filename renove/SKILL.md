---
name: editorial-jekyll-frontend
description: >
  Design and build professional editorial front-ends for journalism/magazine sites
  on Jekyll + Bootstrap + Netlify. Use this skill when the user wants to create or
  redesign a digital magazine, newspaper, or editorial publication built on Jekyll.
  Triggers: editorial layouts (homepage, section, article, author pages), card-based
  grids, newsletter integration, Pagefind search, Jekyll performance optimization,
  editorial palettes, responsive magazine layouts, tag/category systems, sidebar with
  breves. Also trigger for page speed optimization, dark mode, author profiles, or
  section landing pages. Trigger when context involves a publication with articles,
  authors, categories, and readers — even without the word "editorial".
---

# Editorial Jekyll Front-End Design Skill

Build professional, fast, accessible editorial front-ends for digital magazines and
journalism websites on the Jekyll + Bootstrap + Netlify stack.

## When to Use This Skill

Read this file first, then consult the appropriate reference file based on the task:

| Task | Reference File |
|------|---------------|
| Homepage layout, section page, sidebar | `references/layout-homepage.md` |
| Article layout, card component, sidebar blocks | `references/layout-article.md` |
| Branding, colors, typography, dark mode | `references/branding.md` |
| Performance, build pipeline, Netlify config | `references/performance.md` |
| Jekyll project structure, plugins, templates | `references/jekyll-architecture.md` |

**Always read the relevant reference file before writing any code.**

## Design Philosophy

This skill produces editorial front-ends inspired by the best digital journalism outlets:
Axios (smart brevity, card layouts), The Atlantic (premium typography, white space),
The Economist (structured sections, informative density), Rest of World (clean beats
navigation, visual storytelling), 404 Media (indie/modern, newsletter-first),
Nieman Lab (innovation journalism hubs), ProPublica (investigation-focused, author
profiles), and The Verge (bold, modern, stream-based).

### Core Principles

1. **Content-first hierarchy**: The article is the atomic unit. Every layout decision
   serves readability and discoverability of articles.
2. **Editorial grid**: Use Bootstrap's 12-column grid as a 12-column editorial grid.
   Hero (span-12) + cards (span-4 desktop, span-6 tablet, span-12 mobile).
3. **Typographic authority**: Serif for headlines (Playfair Display), sans-serif for
   body (Source Sans 3). 18px body, 1.65 line-height, max-width 70ch for articles.
4. **Green editorial palette**: `#00C853` primary, `#0A0A0A` text, `#FAFAFA` background,
   `#FF6D00` accent. Full palette in `references/branding.md`.
5. **Performance parity with 11ty**: PurgeCSS, critical CSS inline, Netlify Image CDN,
   lazy loading, self-hosted fonts. Target: <200KB first load, Lighthouse 90+.
6. **Progressive enhancement**: Works without JavaScript. Search (Pagefind) and
   dark mode are enhancements, not requirements.

### The Three Page Types

Every editorial site has exactly three core page types. Each has a specific layout
pattern documented in `references/layouts.md`:

**PORTADA (Homepage)** — The front page of the magazine.
- Zone A: Sticky header with nav (5 sections + search icon)
- Zone B: Hero article (featured post, full-width image + overlay)
- Zone C: Section rivers (each section shows 3-4 latest cards)
- Zone D: Newsletter CTA (inline between sections)
- Zone E: Footer editorial (4-column grid)

**SECCIÓN (Section/Category page)** — Landing page for each thematic axis.
- Section header with name, description, icon/color
- Grid of article cards (3 columns desktop, paginated)
- Sidebar with related tags, popular articles, newsletter

**ARTÍCULO (Article/Post page)** — The reading experience.
- Single column, centered, 70ch max-width
- Sequence: category pill → headline → subtitle → author+date → hero image → body
- After paragraph 3: inline newsletter CTA
- After article: author bio card + related posts grid

### Navigation Architecture

```
┌─────────────────────────────────────────────────┐
│ Logo    │ Sec1 │ Sec2 │ Sec3 │ Sec4 │ Sec5 │ 🔍 │
└─────────────────────────────────────────────────┘
```

- **Desktop**: Horizontal nav bar, sticky (hides on scroll down, shows on scroll up)
- **Mobile**: Hamburger → full-screen overlay with accordion sections
- **5 sections max** in primary nav (user's thematic axes)
- **Search**: Pagefind, triggered by icon, opens modal overlay
- **Tags**: Secondary taxonomy, shown as pills on articles and in section sidebars

### Card Component Anatomy

```
┌──────────────────────────┐
│ ┌──────────────────────┐ │
│ │    IMAGE (16:9)       │ │
│ └──────────────────────┘ │
│ [CATEGORÍA]              │
│ Titular del artículo     │
│ en máximo tres líneas    │
│                          │
│ Excerpt de una o dos...  │
│ ○ Autor · 25 mar 2026   │
└──────────────────────────┘
```

- Image: `aspect-ratio: 16/9`, `object-fit: cover`, `loading="lazy"`
- Category: Uppercase pill, colored per-section
- Title: `<h3>`, font-weight 700, `line-clamp: 3`
- Excerpt: 1-2 lines, color `--color-text-muted`
- Meta: Author avatar (24px circle) + name + date
- Hover: `translateY(-4px)` + subtle shadow + image zoom 1.03

### Newsletter Integration

Use Buttondown or Mailchimp (naked form). Three placement points:
1. **Homepage**: Full-width band between section rivers (green tint background)
2. **Article**: Inline after paragraph 3 (contextual message)
3. **Footer**: Compact form in footer column

Single email field only. No name field. Clear value proposition in 1 sentence.

### Search with Pagefind

Post-build indexing, no server needed:
```bash
npx pagefind --source _site
```
Renders in a search modal triggered by nav icon. Supports `data-pagefind-filter`
attributes for category/tag/author filtering.

## Implementation Checklist

When building or redesigning an editorial Jekyll site, follow this order:

1. □ Read `references/jekyll-architecture.md` — set up project structure
2. □ Read `references/branding.md` — implement CSS variables, fonts, palette
3. □ Read `references/layouts.md` — build the three page types
4. □ Read `references/performance.md` — optimize build pipeline
5. □ Test with Lighthouse, fix until 90+ on all four categories
6. □ Deploy to Netlify, configure headers and Image CDN

## Quick Reference: Bootstrap Grid for Editorial

```html
<!-- Homepage hero + card grid -->
<div class="container-xl">
  <!-- Hero: full width -->
  <article class="row mb-4">
    <div class="col-12">{% include hero.html post=featured %}</div>
  </article>
  <!-- Section river: 3 cards -->
  <div class="row g-4">
    {% for post in section_posts limit:3 %}
    <div class="col-12 col-md-6 col-lg-4">
      {% include card.html post=post %}
    </div>
    {% endfor %}
  </div>
</div>
```

## Language Note

This skill supports both Spanish and English editorial sites. All component names,
variables, and class names use English for code consistency. User-facing labels
(navigation, dates, "Leer más", "Suscríbete") should match the site's language.
