# Revista de Innovación en Periodismo

Publicación del Máster Universitario en Innovación en Periodismo (UMH), ISSN 3020-383X. Jekyll servido por GitHub Pages en <https://mip.umh.es/blog/> (`baseurl: /blog`).

## Cómo funciona

- **Se publica desde la rama `gh-pages`.** GitHub Pages la construye en cada push.
- **Decap CMS** (`admin/`) es el gestor de contenidos: crea una rama `cms/posts/...` por entrada y la fusiona en `gh-pages` con un pull request. Antes de tocar nada en local: `git pull --rebase origin gh-pages`.
- El workflow `.github/workflows/optimize-images.yml` optimiza las imágenes subidas.
- `search.json` lo lee la portada de mip.umh.es («Lo último en la revista»): mantener sus campos `title`, `url`, `date`, `excerpt`, `author`, `image` y `author_image`.
- Las fotos de autores están en `_data/authors.yml` y se resuelven con `_includes/_author-resolve.html`.
- Toda entrada nueva lleva `slug` (campo «URL corta» de Decap). No se cambia la URL de nada ya publicado.

## Compilar en local

```sh
bundle install
LC_ALL=en_US.UTF-8 bundle exec jekyll serve --port 4012   # http://localhost:4012/blog/
LC_ALL=en_US.UTF-8 bundle exec jekyll build
```

Sin `LC_ALL` falla la compilación de Sass por las tildes.
