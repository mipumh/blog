# Layout: Article Page + Sidebar Components

---

## ARTICLE PAGE (ARTÍCULO)

Single column, centered, no sidebar. The **reading sanctuary**.
Maximum focus on text. Universal pattern from all reference media:
centered at 70ch, generous typography, zero distractions.

### Visual Map (Desktop)

```
┌─────────────────────────────────────────────────────┐
│ NAV BAR                                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│          [CATEGORÍA]                                │
│                                                     │
│          Titular del Artículo que                    │
│          Puede Ocupar Varias Líneas                 │
│                                                     │
│          Subtítulo que amplía contexto               │
│                                                     │
│          ○ Autor · 25 mar 2026 · 8 min              │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │      HERO IMAGE (900px max, rounded)        │    │
│  └─────────────────────────────────────────────┘    │
│  Pie de foto: Reuters                               │
│                                                     │
│         ┌──────────────────────────┐                │
│         │ Párrafo 1 (70ch, 18px)   │                │
│         │ Párrafo 2                │                │
│         │ Párrafo 3                │                │
│         │ ┌────────────────────┐   │                │
│         │ │ 📧 NEWSLETTER CTA │   │                │
│         │ └────────────────────┘   │                │
│         │ Párrafo 4...             │                │
│         │ (rest of body)           │                │
│         │ ── Tags ──               │                │
│         │ [tag1] [tag2] [tag3]     │                │
│         └──────────────────────────┘                │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ AUTHOR BIO CARD (70ch)                      │    │
│  │ ○ Nombre · Cargo · Bio · Links              │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── Artículos relacionados ──                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Card 1   │ │ Card 2   │ │ Card 3   │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

### Template: `_layouts/article.html`

```html
---
layout: default
---
{% assign author = site.data.authors[page.author] %}
<article class="article" itemscope itemtype="https://schema.org/Article">

  <header class="article-header">
    <div class="container-xl">
      <div class="article-header__inner">
        <a href="/{{ page.categories | first }}/" class="category-pill"
           style="--pill-color: {{ site.data.sections[page.categories.first].color }}">
          {{ page.categories | first | capitalize }}
        </a>
        <h1 class="article-header__title" itemprop="headline">
          {{ page.title }}
        </h1>
        {% if page.subtitle %}
        <p class="article-header__deck">{{ page.subtitle }}</p>
        {% endif %}
        <div class="article-header__meta">
          {% if author %}
          <a href="/authors/{{ page.author }}/" class="meta-author">
            {% if author.avatar %}
            <img src="{{ author.avatar }}" alt="" class="avatar avatar--md">
            {% endif %}
            <span itemprop="author">{{ author.name }}</span>
          </a>
          {% endif %}
          <time datetime="{{ page.date | date_to_xmlschema }}"
                itemprop="datePublished">
            {{ page.date | date: "%d %B %Y" }}
          </time>
          {% assign words = content | number_of_words %}
          {% assign mins = words | divided_by: 200 %}
          <span>· {{ mins }} min</span>
        </div>
      </div>
    </div>
  </header>

  {% if page.image %}
  <figure class="article-hero">
    <div class="container-xl">
      <img src="{{ page.image }}" alt="{{ page.title }}"
           loading="eager" fetchpriority="high" itemprop="image">
      {% if page.image_caption %}
      <figcaption>{{ page.image_caption }}</figcaption>
      {% endif %}
    </div>
  </figure>
  {% endif %}

  <div class="article-body" itemprop="articleBody">
    <div class="container-xl">
      <div class="article-body__inner">
        {{ content }}
      </div>
    </div>
  </div>

  {% if page.tags.size > 0 %}
  <div class="container-xl">
    <div class="article-tags">
      {% for tag in page.tags %}
      <a href="/tags/{{ tag | slugify }}/" class="tag-pill">{{ tag }}</a>
      {% endfor %}
    </div>
  </div>
  {% endif %}

  {% if author %}
  <div class="container-xl">
    {% include author-bio.html author=author %}
  </div>
  {% endif %}

  <div class="container-xl">
    {% include related-posts.html %}
  </div>
</article>
```

### Article CSS

```css
/* Header */
.article-header { padding: var(--space-2xl) 0 var(--space-lg); }
.article-header__inner { max-width: 70ch; }
.article-header__title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 900;
  line-height: 1.12;
  margin: var(--space-md) 0;
}
.article-header__deck {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  line-height: 1.5;
  color: var(--color-text-muted);
  max-width: 60ch;
  margin-bottom: var(--space-md);
}
.article-header__meta {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  flex-wrap: wrap;
}
.meta-author {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  text-decoration: none;
  color: var(--color-text);
  font-weight: 600;
}

/* Hero image — wider than text, max 900px */
.article-hero { margin-bottom: var(--space-xl); }
.article-hero img {
  width: 100%;
  max-width: 900px;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: var(--radius-lg);
}
.article-hero figcaption {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-xs);
  max-width: 900px;
}

/* Body — the reading experience */
.article-body__inner {
  max-width: 70ch;
  font-family: var(--font-serif);
  font-size: var(--text-md);
  line-height: 1.65;
}
.article-body__inner p { margin-bottom: 1.5em; }
.article-body__inner h2 {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: 700;
  margin: 2em 0 0.75em;
}
.article-body__inner h3 {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: 700;
  margin: 1.5em 0 0.5em;
}
.article-body__inner blockquote {
  border-left: 4px solid var(--color-brand);
  padding-left: var(--space-lg);
  margin: 1.5em 0;
  font-style: italic;
  color: var(--color-text-muted);
}
.article-body__inner a {
  color: var(--color-brand-dark);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}
.article-body__inner img {
  max-width: 100%;
  border-radius: var(--radius-md);
  margin: 1.5em 0;
}

/* Tags */
.article-tags {
  max-width: 70ch;
  margin: var(--space-xl) 0;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

/* Author bio */
.author-bio {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background: var(--color-surface-alt);
  border-radius: var(--radius-lg);
  margin: var(--space-xl) 0;
  max-width: 70ch;
}
.author-bio__name a {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: var(--text-md);
  color: var(--color-text);
  text-decoration: none;
}
.author-bio__role {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Related posts */
.related-posts {
  margin: var(--space-2xl) 0;
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}

/* Mobile */
@media (max-width: 767.98px) {
  .article-body__inner { font-size: 1.0625rem; }
  .article-hero img {
    border-radius: 0;
    margin: 0 -1rem;
    width: calc(100% + 2rem);
    max-width: none;
  }
  .author-bio { flex-direction: column; }
}
```

### Newsletter Injection (after paragraph 3)

```javascript
// assets/js/newsletter-inject.js — only ~15 lines
document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('.article-body__inner');
  if (!body) return;
  const paras = body.querySelectorAll(':scope > p');
  if (paras.length < 4) return;
  const tpl = document.getElementById('newsletter-tpl');
  if (tpl) paras[2].after(tpl.content.cloneNode(true));
});
```

In article layout, add a hidden template:
```html
<template id="newsletter-tpl">
  {% include newsletter-inline.html %}
</template>
```

---

## SIDEBAR COMPONENTS

### Breves — `_data/breves.yml` + `_includes/breves.html`

Data source:
```yaml
# _data/breves.yml — updated by editorial team
- title: "Convocatoria VII Premio Vicente Verdú"
  url: "/2026/03/28/premio-vicente-verdu/"
  date: 2026-03-28
  highlight: true

- title: "Mesa redonda IA en redacciones, 5 de abril"
  url: "https://example.com/evento"
  date: 2026-03-27
  external: true

- title: "Informe: estado del periodismo local"
  url: "/2026/03/20/informe-periodismo-local/"
  date: 2026-03-20
```

Template:
```html
<div class="sidebar-block breves">
  <h3 class="sidebar-label">Breves</h3>
  <ul class="breves-list">
    {% for item in site.data.breves limit:6 %}
    <li class="breves-item{% if item.highlight %} breves-item--hl{% endif %}">
      <a href="{{ item.url }}"
         {% if item.external %}target="_blank" rel="noopener"{% endif %}>
        {{ item.title }}
        {% if item.external %}<span class="ext-icon">↗</span>{% endif %}
      </a>
      <time>{{ item.date | date: "%d %b" }}</time>
    </li>
    {% endfor %}
  </ul>
</div>
```

CSS:
```css
.sidebar-block {
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid var(--color-border);
}
.sidebar-label {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-brand);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 2px solid var(--color-brand);
  display: inline-block;
}
.breves-list { list-style: none; padding: 0; }
.breves-item {
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border);
}
.breves-item:last-child { border-bottom: none; }
.breves-item--hl {
  background: var(--color-brand-tint);
  margin: 0 calc(-1 * var(--space-sm));
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  border-bottom: none;
}
.breves-item a {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
  text-decoration: none;
}
.breves-item a:hover { color: var(--color-brand); }
.breves-item time {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}
.ext-icon { font-size: 0.75em; opacity: 0.4; }
```

### Novedades — `_data/novedades.yml`

Free-form blocks the editorial team can customize:

```yaml
# _data/novedades.yml
- title: "XVI Jornadas de Innovación"
  body: "15-16 mayo, campus de Elche. Inscripción gratuita."
  cta_text: "Inscríbete"
  cta_url: "https://example.com/jornadas"

- title: "Local Data Lab"
  body: "Buscamos colaboradores para la próxima temporada."
  cta_text: "Conoce el proyecto"
  cta_url: "https://localdatalab.umh.es/"
```

```html
<!-- _includes/sidebar-novedades.html -->
<div class="sidebar-block">
  <h3 class="sidebar-label">Novedades</h3>
  {% for item in site.data.novedades limit:2 %}
  <div class="novedad">
    <h4 class="novedad__title">{{ item.title }}</h4>
    <p class="novedad__body">{{ item.body }}</p>
    {% if item.cta_url %}
    <a href="{{ item.cta_url }}" class="novedad__cta">{{ item.cta_text }} →</a>
    {% endif %}
  </div>
  {% endfor %}
</div>
```

### Lo más leído — `_includes/sidebar-popular.html`

```html
<div class="sidebar-block">
  <h3 class="sidebar-label">Lo más leído</h3>
  <ol class="popular-list">
    {% assign popular = site.posts | sort: "popular" | reverse | slice: 0, 5 %}
    {% for post in popular %}
    <li class="popular-item">
      <span class="popular-rank">{{ forloop.index }}</span>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
  </ol>
</div>
```

```css
.popular-list { list-style: none; padding: 0; }
.popular-item {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border);
  align-items: flex-start;
}
.popular-rank {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 900;
  color: var(--color-brand);
  line-height: 1;
  min-width: 1.5ch;
}
.popular-item a {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.35;
  color: var(--color-text);
  text-decoration: none;
}
.popular-item a:hover { color: var(--color-brand); }
```

---

## CARD COMPONENT — `_includes/card.html`

```html
{% assign author = site.data.authors[include.post.author] %}
<article class="card-ed">
  <a href="{{ include.post.url }}" class="card-ed__link">
    {% if include.post.image %}
    <div class="card-ed__img-wrap">
      <img src="{{ include.post.image }}" alt=""
           class="card-ed__img" loading="lazy">
    </div>
    {% endif %}
    <div class="card-ed__body">
      <span class="category-pill"
            style="--pill-color: {{ site.data.sections[include.post.categories.first].color }}">
        {{ include.post.categories | first | capitalize }}
      </span>
      <h3 class="card-ed__title">{{ include.post.title }}</h3>
      <p class="card-ed__excerpt">
        {{ include.post.excerpt | strip_html | truncatewords: 20 }}
      </p>
      <div class="card-ed__meta">
        {% if author.avatar %}
        <img src="{{ author.avatar }}" alt="" class="avatar avatar--xs">
        {% endif %}
        <span>{{ author.name }}</span>
        <time>{{ include.post.date | date: "%d %b %Y" }}</time>
      </div>
    </div>
  </a>
</article>
```

```css
.card-ed {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}
.card-ed:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.card-ed__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}
.card-ed__img-wrap {
  aspect-ratio: 16/9;
  overflow: hidden;
}
.card-ed__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.card-ed:hover .card-ed__img { transform: scale(1.03); }
.card-ed__body {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  flex: 1;
}
.card-ed__title {
  font-family: var(--font-serif);
  font-size: var(--text-md);
  font-weight: 700;
  line-height: 1.3;
  margin: var(--space-xs) 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-ed__excerpt {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: auto;
}
.card-ed__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border);
}

/* Shared pills */
.category-pill {
  display: inline-block;
  padding: 3px 10px;
  background: var(--pill-color, var(--color-brand));
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  text-decoration: none;
  width: fit-content;
}
.tag-pill {
  display: inline-flex;
  padding: 4px 12px;
  background: var(--color-surface-alt);
  border-radius: 100px;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.15s;
}
.tag-pill:hover {
  background: var(--color-brand-tint);
  color: var(--color-brand);
}

/* Avatars */
.avatar { border-radius: 50%; object-fit: cover; }
.avatar--xs { width: 24px; height: 24px; }
.avatar--sm { width: 32px; height: 32px; }
.avatar--md { width: 40px; height: 40px; }
.avatar--lg { width: 64px; height: 64px; }
```
