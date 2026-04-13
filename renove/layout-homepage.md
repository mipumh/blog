# Layout: Homepage + Section Pages

Inspired by Rest of World (curated blocks, beats nav), Politico (sidebar playbook),
Axios (smart brevity, whitespace), 404 Media (breathing room between pieces).

Core principle: **hierarchy + aire** — generous spacing between blocks, no clutter.

---

## HOMEPAGE (PORTADA)

### Architecture: Main Column + Sticky Sidebar

The homepage uses a **col-lg-8 / col-lg-4 split** (Politico model):
- Left: Editorial flow (hero → latest → newsletter → section rivers)
- Right: Sticky sidebar with breves, novedades, newsletter, popular posts

### Visual Map (Desktop ≥992px)

```
┌─────────────────────────────────────────────────────────────┐
│ STICKY NAV: Logo [Eje1] [Eje2] [Eje3] [Eje4] [Eje5]  🔍 ☀ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MAIN (col-lg-8)                  │  SIDEBAR (col-lg-4)    │
│                                    │  sticky, scrollable    │
│  ┌──────────────────────────────┐  │                        │
│  │ HERO ARTICLE                 │  │  ┌──────────────────┐  │
│  │ Image (16:9, rounded)        │  │  │ BREVES           │  │
│  │ [CATEGORÍA]                  │  │  │ · Titular 1      │  │
│  │ Gran Titular Destacado       │  │  │ · Titular 2      │  │
│  │ Subtítulo/deck               │  │  │ · Titular 3      │  │
│  │ ○ Autor · Fecha              │  │  │ · Titular 4      │  │
│  └──────────────────────────────┘  │  ├──────────────────┤  │
│                                    │  │ NOVEDADES        │  │
│  ~~~~~~~~~ 64px aire ~~~~~~~~~~~   │  │ Bloque libre     │  │
│                                    │  │ editable por el  │  │
│  ÚLTIMOS ARTÍCULOS                 │  │ equipo editorial  │  │
│  ┌─────────────┐ ┌─────────────┐  │  ├──────────────────┤  │
│  │ Card 1      │ │ Card 2      │  │  │ NEWSLETTER       │  │
│  └─────────────┘ └─────────────┘  │  │ [email] [Enviar] │  │
│  ┌─────────────┐ ┌─────────────┐  │  ├──────────────────┤  │
│  │ Card 3      │ │ Card 4      │  │  │ LO MÁS LEÍDO    │  │
│  └─────────────┘ └─────────────┘  │  │ 1. Post title    │  │
│                                    │  │ 2. Post title    │  │
│  ~~~~~~~~~ 64px aire ~~~~~~~~~~~   │  │ 3. Post title    │  │
│                                    │  │ 4. Post title    │  │
│  📧 NEWSLETTER BANNER              │  │ 5. Post title    │  │
│  (full main-col width, green bg)   │  └──────────────────┘  │
│                                    │                        │
│  ~~~~~~~~~ 64px aire ~~~~~~~~~~~   │                        │
│                                    │                        │
│  ── EJE 1: INNOVACIÓN ── [→]      │                        │
│  ┌─────────────┐ ┌─────────────┐  │                        │
│  │ Card        │ │ Card        │  │                        │
│  └─────────────┘ └─────────────┘  │                        │
│  ┌─────────────┐                   │                        │
│  │ Card        │                   │                        │
│  └─────────────┘                   │                        │
│                                    │                        │
│  ~~~~~~~~~ 64px aire ~~~~~~~~~~~   │                        │
│                                    │                        │
│  ── EJE 2: TECNOLOGÍA ── [→]      │                        │
│  (same pattern: 2+1 cards)         │                        │
│                                    │                        │
│  (repeat for each thematic axis)   │                        │
│                                    │                        │
├─────────────────────────────────────────────────────────────┤
│ FOOTER: Marca │ Secciones │ Newsletter │ RRSS/Legal        │
└─────────────────────────────────────────────────────────────┘
```

### Mobile (< 992px): Sidebar goes inline

Sidebar blocks are inserted BETWEEN content sections on mobile:
Hero → **Breves (inline)** → Latest posts → **Newsletter** → Section rivers → Footer

### Homepage Template: `_layouts/home.html`

```html
---
layout: default
---
{% assign featured = site.posts | where: "featured", true | first %}
{% unless featured %}{% assign featured = site.posts | first %}{% endunless %}
{% assign latest = site.posts
  | where_exp: "p", "p.url != featured.url" | slice: 0, 4 %}

<main class="homepage">
  <div class="container-xl">
    <div class="row g-5">

      <!-- MAIN COLUMN -->
      <div class="col-12 col-lg-8">

        {% include hero.html post=featured %}

        <section class="hp-block" aria-label="Últimos artículos">
          <h2 class="block-label">Últimos artículos</h2>
          <div class="row g-4">
            {% for post in latest %}
            <div class="col-12 col-sm-6">
              {% include card.html post=post %}
            </div>
            {% endfor %}
          </div>
        </section>

        <!-- Mobile: breves inline -->
        <div class="d-lg-none">{% include breves.html %}</div>

        {% include newsletter-banner.html %}

        {% for section in site.data.navigation.sections %}
          {% assign sec_posts = site.posts
            | where_exp: "p", "p.categories contains section.slug"
            | where_exp: "p", "p.url != featured.url"
            | slice: 0, 3 %}
          {% if sec_posts.size > 0 %}
          <section class="hp-block section-river"
                   aria-labelledby="sec-{{ section.slug }}">
            <div class="river-header">
              <h2 class="block-label" id="sec-{{ section.slug }}"
                  style="--accent: {{ section.color }}">
                {{ section.title }}
              </h2>
              <a href="/{{ section.slug }}/" class="river-more">
                Ver todos →
              </a>
            </div>
            <div class="row g-4">
              {% for post in sec_posts %}
              <div class="col-12 col-sm-6{% if forloop.last and sec_posts.size == 3 %} col-sm-12 col-md-6{% endif %}">
                {% include card.html post=post %}
              </div>
              {% endfor %}
            </div>
          </section>
          {% endif %}
        {% endfor %}

      </div>

      <!-- SIDEBAR (desktop only) -->
      <aside class="col-lg-4 d-none d-lg-block">
        <div class="sidebar-sticky">
          {% include breves.html %}
          {% include sidebar-novedades.html %}
          {% include newsletter-compact.html %}
          {% include sidebar-popular.html %}
        </div>
      </aside>

    </div>
  </div>
</main>
```

### CSS: Spacing ("aire") System

```css
/* The breathing room between editorial blocks */
.hp-block {
  margin-bottom: var(--space-3xl);  /* 64px */
  padding-top: var(--space-md);
}

/* Column gutter — wider than Bootstrap default */
.homepage .row.g-5 { --bs-gutter-x: 3rem; }

/* Section river headers */
.river-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: var(--space-sm);
  margin-bottom: var(--space-lg);
  border-bottom: 3px solid var(--accent, var(--color-brand));
}
.block-label {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent, var(--color-text));
  margin: 0;
}
.river-more {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  text-decoration: none;
}
.river-more:hover { color: var(--color-brand); }
```

### Hero Article

Lives INSIDE the main column (not full-bleed). Image above, text below.
This creates asymmetry with the sidebar — editorial and intentional.

```css
.hero { margin-bottom: var(--space-3xl); }
.hero__link { display: block; text-decoration: none; color: inherit; }
.hero__img-wrap {
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-lg);
}
.hero__img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.hero__link:hover .hero__img { transform: scale(1.02); }
.hero__title {
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 3.5vw, 2.75rem);
  font-weight: 900;
  line-height: 1.15;
  margin: var(--space-sm) 0;
  max-width: 55ch;
}
.hero__subtitle {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  max-width: 50ch;
  line-height: 1.5;
  margin-bottom: var(--space-sm);
}
.hero__meta {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

@media (max-width: 767.98px) {
  .hero__img-wrap {
    border-radius: 0;
    margin: 0 -1rem var(--space-lg);
  }
}
```

### Sticky Sidebar

```css
.sidebar-sticky {
  position: sticky;
  top: calc(64px + 1.5rem);  /* header + gap */
  max-height: calc(100vh - 64px - 3rem);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}
```

### Newsletter Banner (inline in main column)

```css
.newsletter-banner {
  background: var(--color-brand-tint);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-3xl);
  text-align: center;
}
.newsletter-banner__form {
  display: flex;
  gap: var(--space-xs);
  max-width: 420px;
  margin: var(--space-md) auto 0;
}

@media (max-width: 575.98px) {
  .newsletter-banner__form { flex-direction: column; }
}
```

---

## SECTION PAGE (SECCIÓN)

Full-width card grid (no sidebar). Section header with accent bar + description.
3 columns on desktop, 2 on tablet, 1 on mobile. Paginated.

### Visual Map

```
┌────────────────────────────────────────────────────┐
│ NAV BAR                                            │
├────────────────────────────────────────────────────┤
│                                                    │
│  ▌ INNOVACIÓN                                      │
│  Nuevos formatos, herramientas y enfoques          │
│  en el periodismo contemporáneo.                   │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Card 1   │  │ Card 2   │  │ Card 3   │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Card 4   │  │ Card 5   │  │ Card 6   │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Card 7   │  │ Card 8   │  │ Card 9   │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                    │
│             [← 1  2  3  4  5 →]                    │
│                                                    │
├────────────────────────────────────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
```

### Section CSS

```css
.section-header {
  padding: var(--space-2xl) 0 var(--space-xl);
}
.section-header__bar {
  width: 48px;
  height: 4px;
  background: var(--section-accent, var(--color-brand));
  border-radius: 2px;
  margin-bottom: var(--space-md);
}
.section-header__title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1.12;
  margin-bottom: var(--space-xs);
}
.section-header__desc {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  max-width: 55ch;
}
```

### Pagination

```css
.pagination-wrapper {
  padding: var(--space-2xl) 0;
  display: flex;
  justify-content: center;
}
.pagination .page-link {
  font-family: var(--font-sans);
  font-weight: 600;
  color: var(--color-text);
  border-color: var(--color-border);
}
.pagination .page-item.active .page-link {
  background: var(--color-brand);
  border-color: var(--color-brand);
  color: var(--color-on-brand);
}
```
