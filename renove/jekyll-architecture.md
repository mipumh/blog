# Jekyll Architecture Reference

Project structure, configuration, plugins, data files, collections, front matter,
and navigation for an editorial magazine on Jekyll + Bootstrap + Netlify.

---

## Project Structure

```
magazine-site/
├── _config.yml
├── Gemfile
├── netlify.toml
├── package.json
├── purgecss.config.js
├── _data/
│   ├── authors.yml          # Author profiles
│   ├── navigation.yml       # Nav structure + section list
│   ├── sections.yml         # Section metadata + colors
│   ├── breves.yml           # Sidebar: short items
│   ├── novedades.yml        # Sidebar: free-form blocks
│   └── newsletter.yml       # Newsletter config
├── _posts/
│   ├── innovacion/          # Subdirectory = auto-category
│   ├── tecnologia/
│   ├── audiencias/
│   ├── modelos-negocio/
│   ├── narrativas/
│   └── (optional 6th axis)/
├── _authors/                # Collection → generates /authors/name/
│   ├── garcia-aviles.md
│   └── carvajal.md
├── _layouts/
│   ├── default.html         # HTML shell
│   ├── home.html            # Homepage
│   ├── article.html         # Single article
│   ├── section.html         # Category landing
│   ├── author.html          # Author profile page
│   └── tag.html             # Tag archive
├── _includes/
│   ├── header.html
│   ├── footer.html
│   ├── hero.html
│   ├── card.html
│   ├── breves.html
│   ├── sidebar-novedades.html
│   ├── sidebar-popular.html
│   ├── newsletter-banner.html
│   ├── newsletter-compact.html
│   ├── newsletter-inline.html
│   ├── author-bio.html
│   ├── related-posts.html
│   └── pagination.html
├── _sass/
│   ├── _variables.scss      # CSS custom properties
│   ├── _fonts.scss           # @font-face declarations
│   ├── _bootstrap-custom.scss # Selective Bootstrap imports
│   ├── _base.scss            # Resets, typography
│   ├── _header.scss
│   ├── _hero.scss
│   ├── _cards.scss
│   ├── _sidebar.scss
│   ├── _article.scss
│   ├── _newsletter.scss
│   ├── _footer.scss
│   └── _dark-mode.scss
├── assets/
│   ├── css/main.scss         # Entry: imports all _sass files
│   ├── fonts/                # Self-hosted woff2 files
│   ├── images/
│   └── js/
│       ├── header-scroll.js  # Sticky nav behavior (~20 lines)
│       └── newsletter-inject.js  # CTA after p3 (~15 lines)
└── pages/
    ├── index.html            # Uses home layout
    ├── search.html           # Pagefind search page
    ├── about.md
    ├── authors.html          # Author index page
    └── archivo.html          # Full archive
```

---

## _config.yml

```yaml
title: "Revista de Innovación en Periodismo"
description: "Análisis, casos y entrevistas sobre innovación en periodismo"
url: "https://mip.umh.es"
baseurl: "/blog"
lang: "es"
issn: "3020-383X"
legal_entity: "Área de Periodismo, UMH"

# Markdown
markdown: kramdown
highlighter: rouge

# Permalink
permalink: /:year/:month/:day/:title/

# Collections
collections:
  authors:
    output: true
    permalink: /authors/:name/

# Defaults
defaults:
  - scope:
      path: ""
      type: "posts"
    values:
      layout: "article"
      featured: false
      popular: 0
  - scope:
      path: ""
      type: "authors"
    values:
      layout: "author"

# Pagination (jekyll-paginate-v2)
pagination:
  enabled: true
  per_page: 9
  permalink: "/page/:num/"
  sort_field: "date"
  sort_reverse: true

autopages:
  enabled: true
  categories:
    enabled: true
    layouts: ["section.html"]
    permalink: "/:cat/"
  tags:
    enabled: true
    layouts: ["tag.html"]
    permalink: "/tags/:tag/"

# Plugins
plugins:
  - jekyll-seo-tag
  - jekyll-sitemap
  - jekyll-feed
  - jekyll-paginate-v2
  - jekyll-include-cache

# Feed (one per category + main)
feed:
  categories:
    - innovacion
    - tecnologia
    - audiencias
    - modelos-negocio
    - narrativas

# SEO
twitter:
  username: maborjasg
  card: summary_large_image

# Exclude from build
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
```

---

## Data Files

### `_data/navigation.yml`

```yaml
main:
  - title: Inicio
    url: /

sections:
  - title: Innovación
    slug: innovacion
    url: /innovacion/
    color: "#00C853"

  - title: Tecnología
    slug: tecnologia
    url: /tecnologia/
    color: "#2979FF"

  - title: Audiencias
    slug: audiencias
    url: /audiencias/
    color: "#FF6D00"

  - title: Modelos de negocio
    slug: modelos-negocio
    url: /modelos-negocio/
    color: "#AA00FF"

  - title: Narrativas
    slug: narrativas
    url: /narrativas/
    color: "#00B8D4"

  # Optional 6th axis:
  # - title: Formación
  #   slug: formacion
  #   url: /formacion/
  #   color: "#F57F17"

secondary:
  - title: Quiénes somos
    url: /about/
  - title: Autores
    url: /authors/
  - title: Archivo
    url: /archivo/
  - title: Contacto
    url: /contacto/
```

### `_data/authors.yml`

```yaml
garcia-aviles:
  name: "Jose A. García Avilés"
  short_name: garcia-aviles
  role: "Catedrático de Periodismo, UMH"
  bio: "Investigador en innovación periodística y calidad informativa."
  avatar: /assets/images/authors/jga.webp
  twitter: jaikiaviles
  email: jose.garciaa@umh.es

carvajal:
  name: "Miguel Carvajal"
  short_name: carvajal
  role: "Profesor de Periodismo, UMH"
  bio: "Director del Máster en Innovación en Periodismo."
  avatar: /assets/images/authors/mc.webp
  twitter: mcaborja
  email: mcarvajal@umh.es

arias:
  name: "Félix Arias"
  short_name: arias
  role: "Profesor de Periodismo, UMH"
  bio: "Especialista en periodismo de datos y nuevas narrativas."
  avatar: /assets/images/authors/fa.webp
  twitter: flxarias

# Add more authors following this pattern
```

### `_data/sections.yml`

```yaml
innovacion:
  title: "Innovación"
  color: "#00C853"
  description: "Nuevos formatos, herramientas y enfoques en el periodismo"

tecnologia:
  title: "Tecnología"
  color: "#2979FF"
  description: "IA, datos, plataformas y herramientas digitales"

audiencias:
  title: "Audiencias"
  color: "#FF6D00"
  description: "Métricas, engagement, comunidades y distribución"

modelos-negocio:
  title: "Modelos de negocio"
  color: "#AA00FF"
  description: "Suscripciones, financiación y sostenibilidad"

narrativas:
  title: "Narrativas"
  color: "#00B8D4"
  description: "Nuevos lenguajes, formatos y experiencias informativas"
```

### `_data/newsletter.yml`

```yaml
title: "Recibe lo mejor cada semana"
description: "Análisis, casos y entrevistas sobre innovación en periodismo. Gratis."
action_url: "https://buttondown.email/api/emails/embed-subscribe/tu-newsletter"
# Or Mailchimp: "https://umh.us1.list-manage.com/subscribe/post?u=XXX&id=YYY"
```

---

## Post Front Matter

```yaml
---
title: "Sandbox Journalism: laboratorios como motores de innovación"
subtitle: "Los media labs experimentan con lenguajes y formatos"
author: garcia-aviles
date: 2026-03-27 09:00:00 +0100
categories: [innovacion]
tags: [media-labs, redacciones, europa]
image: /assets/images/posts/sandbox-journalism.jpg
image_caption: "Foto: Reuters"
featured: true        # Show in hero on homepage
popular: 85           # Numeric score for "lo más leído" sidebar
---
```

---

## Author Collection

Each author gets a file in `_authors/`:

```markdown
---
# _authors/garcia-aviles.md
short_name: garcia-aviles
layout: author
---
```

The `author.html` layout queries all posts by this author:

```html
---
layout: default
---
{% assign author = site.data.authors[page.short_name] %}
<main class="author-page">
  <div class="container-xl">
    <header class="author-page__header">
      <img src="{{ author.avatar }}" alt="" class="avatar avatar--lg">
      <div>
        <h1>{{ author.name }}</h1>
        <p class="author-page__role">{{ author.role }}</p>
        <p>{{ author.bio }}</p>
      </div>
    </header>

    <h2 class="block-label">Artículos de {{ author.name }}</h2>
    <div class="row g-4">
      {% assign author_posts = site.posts
        | where: "author", page.short_name %}
      {% for post in author_posts %}
      <div class="col-12 col-sm-6 col-lg-4">
        {% include card.html post=post %}
      </div>
      {% endfor %}
    </div>
  </div>
</main>
```

---

## Plugins

### Gemfile

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  gem "jekyll-seo-tag"        # Meta tags, OG, Twitter Cards, JSON-LD
  gem "jekyll-sitemap"        # /sitemap.xml
  gem "jekyll-feed"           # /feed.xml (configurable per category)
  gem "jekyll-paginate-v2"    # Pagination + autopages for categories/tags
  gem "jekyll-include-cache"  # Cache expensive includes (cards, bios)
end
```

### Why Netlify over GitHub Pages

GitHub Pages runs Jekyll in `--safe` mode with a restrictive plugin whitelist
(Jekyll 3.x only). This excludes `jekyll-paginate-v2`, custom plugins, and
post-build steps (Pagefind, PurgeCSS). **Netlify has no restrictions**, supports
Jekyll 4.x, allows any plugin, and provides Image CDN, deploy previews, and
custom headers.

---

## Navigation Data File

The `_data/navigation.yml` file drives the nav bar. The `sections` array
is used both for the nav links AND for generating the homepage section rivers.
Each section has a `slug` that matches the post subdirectory name (which Jekyll
auto-assigns as category) and a `color` used for the section accent.

---

## Search: Pagefind

Add `data-pagefind-body` to article content, `data-pagefind-filter` to
categories/tags for filtered search:

```html
<!-- In article layout -->
<div class="article-body" data-pagefind-body>
  {{ content }}
</div>

<!-- In article header -->
<span data-pagefind-filter="category">{{ page.categories | first }}</span>
```

Search page (`pages/search.html`):
```html
---
layout: default
title: Buscar
---
<div class="container-xl" style="padding: 3rem 0;">
  <div id="search"></div>
</div>
<link href="/pagefind/pagefind-ui.css" rel="stylesheet">
<script src="/pagefind/pagefind-ui.js"></script>
<script>
  new PagefindUI({
    element: "#search",
    showSubResults: true,
    translations: {
      placeholder: "Buscar artículos...",
      zero_results: "No se encontraron resultados para [SEARCH_TERM]"
    }
  });
</script>
```
