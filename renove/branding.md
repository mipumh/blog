# Branding Reference: Editorial Green Palette

Color system, typography, spacing, and dark mode for editorial journalism sites
with a green primary color.

---

## Color Palette

### The Accessibility Challenge

Pure bright green (#7FFF7F) has a contrast ratio of only 1.3:1 against white —
far below the WCAG AA minimum of 4.5:1. The solution: use a slightly deeper
green (#00C853) as primary, reserve bright green for dark backgrounds only,
and build a complete scale with accessible variants.

### Core Palette

```css
:root {
  /* Brand */
  --color-brand:        #00C853;  /* Primary green */
  --color-brand-dark:   #00701A;  /* Text-safe on light bg (7.3:1 contrast) */
  --color-brand-tint:   #E8F5E9;  /* Backgrounds, highlights */
  --color-brand-subtle: #C8E6C9;  /* Borders, dividers with green hint */
  --color-on-brand:     #000000;  /* Text on brand green */

  /* Neutrals */
  --color-text:         #0A0A0A;  /* Primary text */
  --color-text-muted:   #616161;  /* Secondary text, dates, captions */
  --color-text-on-dark: #E0E0E0;  /* Text on dark backgrounds */
  --color-bg:           #FAFAFA;  /* Page background */
  --color-bg-rgb:       250, 250, 250; /* For rgba() usage */
  --color-surface-alt:  #F5F5F5;  /* Card backgrounds, alternating sections */
  --color-surface-dark: #1A1A1A;  /* Footer, dark sections */
  --color-border:       #E0E0E0;  /* Borders, dividers */

  /* Accent */
  --color-accent:       #FF6D00;  /* Orange — CTAs, breaking, urgent */
  --color-accent-tint:  #FFF3E0;  /* Orange background tint */

  /* Semantic */
  --color-error:        #D32F2F;
  --color-success:      #2E7D32;
  --color-warning:      #F57F17;
  --color-info:         #1565C0;

  /* Section Colors (one per thematic axis) */
  --color-section-1:    #00C853;  /* e.g., Innovación */
  --color-section-2:    #2979FF;  /* e.g., Tecnología */
  --color-section-3:    #FF6D00;  /* e.g., Audiencias */
  --color-section-4:    #AA00FF;  /* e.g., Modelos de negocio */
  --color-section-5:    #00B8D4;  /* e.g., Narrativas */
}
```

### Dark Mode

```css
[data-theme="dark"] {
  --color-brand:        #69F0AE;  /* Lighter, mint-tinted green */
  --color-brand-dark:   #00E676;
  --color-brand-tint:   rgba(105, 240, 174, 0.08);
  --color-brand-subtle: rgba(105, 240, 174, 0.12);
  --color-on-brand:     #000000;

  --color-text:         #E0E0E0;
  --color-text-muted:   #9E9E9E;
  --color-text-on-dark: #E0E0E0;
  --color-bg:           #121212;
  --color-bg-rgb:       18, 18, 18;
  --color-surface-alt:  #1E1E1E;
  --color-surface-dark: #0A0A0A;
  --color-border:       #333333;

  --color-accent:       #FFAB40;
  --color-accent-tint:  rgba(255, 171, 64, 0.08);
}
```

### Dark Mode Detection Script

Place this inline in the `<head>` BEFORE any CSS loads to prevent flash:

```html
<script>
(function() {
  var theme = localStorage.getItem('theme');
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();
</script>
```

Toggle button handler:
```javascript
document.getElementById('theme-toggle').addEventListener('click', function() {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});
```

### Color Usage Rules (60-30-10)

- **60% neutral**: `--color-bg` (white/off-white) for page background
- **30% structure**: `--color-text` (near-black) for body text, headings
- **10% brand**: `--color-brand` (green) for accents, buttons, category pills,
  links, borders, hover states

**Never** use bright green as text color on light backgrounds.
**Always** use `--color-brand-dark` (#00701A) when green text is needed on light.

---

## Typography

### Font Stack

```css
:root {
  --font-serif:  'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-sans:   'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono:   'JetBrains Mono', 'Fira Code', monospace;
}
```

### Loading Google Fonts

Self-host for performance. Download from Google Fonts, place in `/assets/fonts/`:

```css
/* assets/css/_fonts.scss */
@font-face {
  font-family: 'Playfair Display';
  src: url('/assets/fonts/PlayfairDisplay-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Playfair Display';
  src: url('/assets/fonts/PlayfairDisplay-Black.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Source Sans 3';
  src: url('/assets/fonts/SourceSans3-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Source Sans 3';
  src: url('/assets/fonts/SourceSans3-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Source Sans 3';
  src: url('/assets/fonts/SourceSans3-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Alternative Font Pair: Tech-Forward

If the publication emphasizes technology over traditional editorial:

```css
:root {
  --font-serif:  'Merriweather', Georgia, serif;      /* Body text */
  --font-sans:   'Montserrat', 'Helvetica Neue', sans-serif;  /* Headlines */
}
```

(Swap roles: sans for headlines, serif for body — more modern/tech feel)

### Type Scale (Major Third — ratio 1.25)

```css
:root {
  --text-xs:    0.75rem;   /* 12px — captions, footnotes */
  --text-sm:    0.875rem;  /* 14px — meta, dates, small labels */
  --text-base:  1rem;      /* 16px — UI text, nav */
  --text-md:    1.125rem;  /* 18px — article body */
  --text-lg:    1.25rem;   /* 20px — article subtitle, card titles */
  --text-xl:    1.5rem;    /* 24px — section headings */
  --text-2xl:   2rem;      /* 32px — page titles */
  --text-3xl:   2.5rem;    /* 40px — hero headlines (min) */
  --text-4xl:   3.0625rem; /* 49px — hero headlines (max) */
}
```

### Line Heights

- Headlines (display): `1.12`
- Subheadings: `1.3`
- Article body: `1.65`
- UI text: `1.5`
- Captions: `1.4`

### Article Body Typography

```css
.article__body {
  font-family: var(--font-serif);
  font-size: var(--text-md);    /* 18px */
  line-height: 1.65;
  max-width: 70ch;             /* ~65-75 chars per line */
  margin: 0 auto;
  color: var(--color-text);
}
```

The 70ch max-width creates the optimal reading measure of 65-75 characters per
line, matching the standard used by The Atlantic, ProPublica, and The Economist.

---

## Spacing System

```css
:root {
  --space-2xs:  4px;
  --space-xs:   8px;
  --space-sm:   12px;
  --space-md:   16px;
  --space-lg:   24px;
  --space-xl:   32px;
  --space-2xl:  48px;
  --space-3xl:  64px;
}
```

### Border Radius

```css
:root {
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;
  --radius-full: 9999px;
}
```

---

## Section-Specific Colors

Each thematic axis gets a distinct color used for:
- Category pill backgrounds on cards
- Section header accent bar
- Active nav item underline
- Related content borders

Configure in `_data/sections.yml`:

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
