# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jekyll 4.3.3 blog for "Revista de Innovacin en Periodismo" (Master en Innovacin en Periodismo, Universidad Miguel Hernndez). All content and UI is in Spanish. Hosted on GitHub Pages at `mip.umh.es/blog`.

## Build & Development Commands

```bash
bundle install          # Install Ruby dependencies
bundle exec jekyll serve  # Local dev server (localhost:4000/blog/)
bundle exec jekyll build  # Build static site to _site/
```

The site is served under `/blog` subpath (configured via `baseurl` in `_config.yml`).

## Architecture

- **Static site generator:** Jekyll with kramdown markdown and `jekyll-paginate` plugin
- **Styling:** SCSS partials in `_sass/`, compiled via `css/main.scss`. Based on Bootstrap grid (Incorporated Theme by Kippt Inc)
- **JavaScript:** Minimal jQuery (CDN-loaded) in `js/main.js` (image zoom only)
- **Deployment:** GitHub Pages on `gh-pages` branch. Daily auto-commit via `.github/workflows/schedule_commit.yml`

## Content Structure

### Blog Posts (`_posts/`)
- ~520 posts, naming: `YYYY-MM-DD-slug.md`
- Front matter fields:
  - `layout: post` (required)
  - `title` (required)
  - `author` block: `name`, `twitter`, `bio`, `image` (webp in `images/`), `link`
  - Optional: `subtitle`, `cover_image`, `draft: true` (hides post), `periscopio: si` (guest contributor variant), `iberifier: si` (Iberifier report styling)

### Conferences (`_conferencias/`)
- Separate Jekyll collection with `conferencias` layout, each in its own folder

### Data (`_data/`)
- `authors.yml` for author profiles
- CSV datasets for research data

## Templates

- **Layouts** (`_layouts/`): `base.html` > `basepost.html` > `post.html`. Separate `page.html` and `conferencias.html`
- **Includes** (`_includes/`): `header.html`, `footer.html`, `_social.html`, `_google-analytics.html`, `_disqus.html`, cover image variants (`_newcover.html`, `_oldcover.html`)

## Custom Plugin

`_plugins/tweet.rb` provides a Liquid tag `{% tweet TWEET_ID %}` for embedding tweets.

## Image References in Posts

Images use Jekyll's `site.baseurl` variable:
```markdown
![]({{ site.baseurl }}/images/path/to/image.webp)
```

## Key URLs

- Production: https://mip.umh.es/blog
- RSS feeds: `/feed.xml` (main), `/feed-substack.xml` (Substack export)
