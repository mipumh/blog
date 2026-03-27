# Prompt para Claude Code: CMS custom con TipTap para mip.umh.es/blog

> Copia y pega en Claude Code desde el directorio del repo `blog/`.

---

## Prompt

```
## Contexto del proyecto

Blog Jekyll de periodismo académico: "Revista de Innovación en Periodismo" del Máster en Innovación en Periodismo (Universidad Miguel Hernández). ~520 posts. Producción en https://mip.umh.es/blog (GitHub Pages). Existe un CMS separado en otro repo (mipumh/cms) desplegado en Netlify con Netlify Identity, que quiero eliminar integrando todo en este repo (mipumh/blog).

### Infraestructura actual del blog (NO tocar)
- Jekyll 4.3.3, baseurl: "/blog", url: https://mip.umh.es/blog
- GitHub Pages, rama principal
- Plugins: jekyll-paginate, kramdown
- Plugin custom: _plugins/lazy_images.rb (lazy loading automático)
- Plugin custom: _plugins/tweet.rb (embed tweets)
- GitHub Action existente: schedule_commit.yml (commit diario vacío)
- Script existente: scripts/optimize_images.sh (ImageMagick, calidad 85%)
- Colección adicional: _conferencias/ (no gestionar desde CMS por ahora)

### Infraestructura del CMS a reutilizar
- Netlify Identity para autenticar editores (ya configurado, mantener)
- Git Gateway como proxy autenticado a GitHub API (ya configurado, mantener)
- Editorial workflow (ramas draft + PRs)

### Frontmatter REAL de los posts — ESTO ES LO QUE MANDA

El layout post.html usa estos campos. El CMS debe generar EXACTAMENTE este formato:

    ---
    layout: post
    title: "Título del artículo"
    subtitle: "Subtítulo opcional"
    author:
      name: "José Alberto García Avilés"
      twitter: jaikibiur
      bio: "Catedrático de Periodismo en la UMH"
      image: jaga.webp
      link: https://twitter.com/jaikibiur
    cover_image: nombre-imagen.webp
    periscopio: si
    iberifier: si
    draft: true
    ---

CRÍTICO: "author" es un OBJETO YAML con 5 subcampos (name, twitter, bio, image, link), NO un string. Los templates acceden a page.author.name, page.author.twitter, page.author.bio, page.author.image, page.author.link. Si author se serializa como string, los posts se rompen.

Campos opcionales: subtitle, cover_image, periscopio, iberifier, draft. Solo incluirlos si tienen valor.

### Autores — _data/authors.yml como fuente de presets

El archivo _data/authors.yml es la fuente centralizada de autores. El CMS lo lee vía Git Gateway al cargar y lo usa como presets para el author picker. PERO el frontmatter de cada post sigue conteniendo el objeto author completo (NO una referencia por key) — esto es para no modificar los layouts existentes ni los 520 posts anteriores.

PRIMERA TAREA: actualizar _data/authors.yml para que contenga los autores reales con TODOS los campos que necesita el frontmatter. El formato debe ser:

    miguel_carvajal:
      name: Miguel Carvajal
      twitter: miguelcarvajal
      bio: "Director del Máster en Innovación en Periodismo"
      image: miguel_carvajal.webp
      link: https://twitter.com/miguelcarvajal
    felix_arias:
      name: Félix Arias
      twitter: flxarias
      bio: "Coordinador del Máster en Innovación en Periodismo"
      image: felix_arias.webp
      link: https://twitter.com/flxarias
    jaga:
      name: José Alberto García Avilés
      twitter: jaikibiur
      bio: "Catedrático de Periodismo en la UMH"
      image: jaga.webp
      link: https://twitter.com/jaikibiur
    alicia_delara:
      name: Alicia de Lara
      twitter: porqueeeyo
      bio: "Coordinadora de Diseño Web"
      image: alicia.webp
      link: https://twitter.com/porqueeeyo

NOTA: Confirma y completa estos datos revisando posts recientes (grep author en _posts/*.md). Puede haber más autores o datos incorrectos. Elimina los autores de plantilla (dan_urbanowicz, john_doe) que hay actualmente.

El flujo es:
1. CMS carga _data/authors.yml → muestra dropdown con presets
2. Usuario selecciona preset → rellena los 5 campos automáticamente
3. Campos editables individualmente (para corregir bio o para invitados)
4. Opción "Autor manual" para firmas invitadas (periscopio) que no están en el YAML
5. Al guardar, el post escribe el objeto author COMPLETO en el frontmatter (no la key)
6. Si alguien añade un nuevo autor habitual, edita authors.yml — aparece en el dropdown automáticamente

### Rutas de imágenes — CRÍTICO

El blog usa {{ site.baseurl }}/images/ en todos los templates. En producción: /blog/images/.

- Imágenes en contenido de posts: INVESTIGA cómo están escritas en los .md existentes (¿ruta relativa? ¿variable Liquid? ¿ruta absoluta?). Usa el MISMO formato. Revisa al menos 3-5 posts reales.
- Imagen de portada (cover_image): SOLO el filename en frontmatter, ej: portada.webp — el template concatena site.baseurl + /images/ + filename
- Imagen del autor (author.image): SOLO el filename, ej: jaga.webp — mismo patrón
- Carpeta de imágenes de posts: confirma revisando ls images/ qué subcarpetas existen y cuál usan los posts
- El index.html extrae la PRIMERA <img> del contenido del post como thumbnail del listado. La primera imagen importa editorialmente.

El CMS debe:
1. Subir imágenes a la carpeta correcta dentro de images/ vía Git Gateway
2. Insertar en Markdown con el MISMO formato de ruta que usan los posts existentes
3. Para cover_image y author.image, guardar solo el filename en frontmatter

## Fase 0 — Investigación

Antes de escribir código:

1. Busca e instala skills relevantes del registry de Claude Code:
   - Diseño frontend moderno / UI
   - Optimización de imágenes web
   - TipTap editor
   - Netlify (Identity, Functions, Git Gateway)
   - Jekyll / sitios estáticos

2. Analiza este repo en profundidad:
   - find . -maxdepth 3 -type f | grep -v node_modules | grep -v .jekyll-cache | head -80
   - cat _config.yml
   - ls _posts/ | tail -10
   - Lee el frontmatter COMPLETO de 3-5 posts recientes — confirma formato real del author
   - Busca cómo referencian las imágenes en el body de esos posts (grep -n "images" en los .md)
   - ls images/ para ver estructura de carpetas
   - cat _layouts/post.html completo
   - cat _layouts/basepost.html | head -60
   - cat index.html — ver cómo extrae thumbnail del post
   - cat _data/authors.yml

3. Lee documentación clave:
   - Git Gateway API: https://github.com/netlify/git-gateway — confirma qué endpoints soporta
   - TipTap Markdown: https://tiptap.dev/docs/editor/markdown
   - gotrue-js: https://github.com/netlify/gotrue-js
   - GitHub Contents API: https://docs.github.com/en/rest/repos/contents

4. Muéstrame un plan detallado antes de implementar:
   - Estructura de archivos propuesta
   - Cómo resolverás la comunicación con Git Gateway (y qué endpoints necesitas)
   - Cómo serializarás el frontmatter con author como objeto YAML
   - Ruta completa de las imágenes: upload → optimización → Git Gateway → archivo en repo → URL en producción
   - Limitaciones de Git Gateway encontradas y plan de fallback

## Fase 1 — Estructura y configuración

En rama feature/custom-cms:

1. Crea directorio admin/ para la SPA
2. Crea netlify.toml:
   [build]
     publish = "admin/dist"
     command = "cd admin && npm install && npm run build"
   [build.environment]
     NODE_VERSION = "18"
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
3. Actualiza _config.yml — añade al exclude:
   admin, netlify.toml, node_modules, package.json
4. Actualiza .gitignore: admin/node_modules, admin/dist

## Fase 2 — Admin panel con TipTap

### Arquitectura
La SPA habla con Git Gateway usando JWT de Netlify Identity.
Git Gateway endpoint: https://{site}.netlify.app/.netlify/git/github/
NO necesitas Netlify Functions como proxy — Git Gateway ya lo es.
Si Git Gateway no soporta alguna ruta (PRs, merges), ENTONCES usa Netlify Functions como fallback solo para esas rutas.

### Stack
- Vite como bundler
- TipTap: @tiptap/core + @tiptap/starter-kit + @tiptap/markdown
- gotrue-js para auth con Netlify Identity
- js-yaml para parse/serialize frontmatter YAML
- CSS custom, sin frameworks UI

### Estructura
admin/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js          # Entry: init auth, router
│   ├── auth.js          # gotrue-js wrapper, login/logout
│   ├── api.js           # Git Gateway client (CRUD archivos, ramas, PRs)
│   ├── editor.js        # TipTap con Markdown bidireccional
│   ├── frontmatter.js   # Parse/serialize YAML — author como OBJETO
│   ├── authors.js       # Presets de autores + picker UI
│   ├── posts.js         # Listar, crear, editar, borrar posts
│   ├── workflow.js      # Draft (rama) → Review (PR) → Publish (merge)
│   ├── images.js        # Upload + redimensionado + compresión client-side
│   └── router.js        # Hash router (#/posts, #/edit/slug, #/new)
└── styles/
    └── main.css

### Vistas

Login: Netlify Identity Widget → redirige a #/posts

Lista de posts (#/posts):
- Lista: título, author.name, fecha, estado (draft/review/published)
- Badge visual de estado
- Botón "Nuevo post"
- Click → editor

Editor (#/edit/:slug o #/new):
- Título editable inline (h1 grande)
- Panel de metadatos (colapsable):
  - Subtítulo (text)
  - Author picker: carga presets desde _data/authors.yml vía Git Gateway al iniciar. Dropdown → al seleccionar, rellena los 5 campos. Campos editables individualmente. Botón "Autor manual" para invitados no registrados. Si el usuario quiere añadir autores nuevos al dropdown, edita _data/authors.yml.
  - Categorías (text, separadas por coma)
  - Cover image: selector o filename manual
  - Flags: checkboxes para periscopio, iberifier, draft
- Editor TipTap:
  - Entrada: parsea Markdown del post existente
  - Salida: Markdown limpio compatible con kramdown
  - Toolbar flotante al seleccionar texto: bold, italic, link, heading, blockquote, code
  - Inserción de imágenes: drag&drop, paste, botón
  - Al insertar: optimiza client-side → sube → inserta con ruta correcta
  - Atajos: Cmd+B, Cmd+I, Cmd+K, Markdown shortcuts (#, **, etc.)
- Botones según workflow:
  "Guardar borrador" → commit a rama draft/slug
  "Enviar a revisión" → crear PR de draft/slug a main
  "Publicar" → merge PR (solo editor/admin)

### Naming de archivos
Posts: YYYY-MM-DD-slug.md en _posts/
Slug: lowercase, sin acentos, guiones. Ej: "Más que un producto" → mas-que-un-producto

### Diseño
Principios:
- Interfaz de ESCRITURA, no de administración
- Inspiración: Notion, Bear, iA Writer, Ghost editor
- Serif para contenido del editor (Georgia, Lora o similar), sans-serif para UI
- Paleta sobria, color acento verde (#5cb85c del blog) o teal
- Modo claro por defecto
- Responsive (funcional en tablet)

NO: gradientes genéricos, Inter/Roboto, dashboards con cards

## Fase 3 — Optimización de imágenes

### Capa 1: Client-side (en el editor)
Al subir imagen (drag&drop, paste, botón):
1. Rechazar si > 2MB (mensaje claro al usuario)
2. Redimensionar: max 1200px ancho, mantener ratio (Canvas API)
3. Convertir a WebP quality 0.8 (fallback JPEG 0.85)
4. Nombrar: slug-del-post-timestamp.webp
5. Subir a la carpeta correcta de images/ vía Git Gateway
6. Insertar en editor con ruta correcta
7. Mostrar: preview, tamaño original vs optimizado, progreso de subida

### Capa 2: GitHub Action (red de seguridad)
.github/workflows/optimize-images.yml:
- Trigger: push/PR que toque images/**
- Si ancho > 1200px → redimensionar
- Si no es WebP → convertir
- Comprimir quality 80
- Commitear versiones optimizadas
- Comentar en PR el ahorro de tamaño
NOTA: Ya existe scripts/optimize_images.sh con ImageMagick. Decide si el Action lo reutiliza o usa sharp. Justifica.

## Fase 4 — Documentación

EDITORIAL-WORKFLOW.md:
1. URL del admin panel
2. Cómo invitar editores (Netlify Identity)
3. Roles y permisos
4. Flujo completo: draft → review → publish
5. Guía de imágenes: formatos aceptados, tamaños, carpeta destino, cómo aparecen en el blog
6. Author picker: presets + modo manual para invitados (periscopio)
7. Arquitectura técnica resumida

## Reglas de ejecución

- NO push sin mi confirmación
- Rama feature/custom-cms
- Muéstrame plan antes de cada fase, espera mi OK
- Diffs antes de commits
- Commits atómicos, mensajes en español
- Si Git Gateway tiene limitaciones, dímelo ANTES de buscar alternativas
- Prioriza: funcional > bonito > perfecto
- Si algo es demasiado complejo, simplifica y pregunta
- Todo el UI del admin en español

## Resultado esperado

1. Rama feature/custom-cms con:
   - Admin panel funcional con TipTap
   - Frontmatter correcto: author como OBJETO yaml con 5 subcampos
   - Imágenes en la carpeta correcta con rutas correctas
   - Login con Netlify Identity
   - Editorial workflow vía Git Gateway
   - Optimización client-side de imágenes
2. GitHub Action de optimización de imágenes
3. EDITORIAL-WORKFLOW.md
4. netlify.toml
5. _config.yml actualizado
6. Instrucciones para reconectar Netlify de mipumh/cms a mipumh/blog
```

---

## Notas post-prompt

### Reconectar Netlify
1. En Netlify dashboard: cambiar repo de `mipumh/cms` a `mipumh/blog`
2. Verificar Identity + Git Gateway siguen activos
3. Build: publish `admin/dist`, command `cd admin && npm install && npm run build`

### Si Git Gateway da problemas
Opciones de fallback:
- **Opción A**: Netlify Functions solo para rutas que fallen (PRs, merges)
- **Opción B**: GitHub OAuth directo (más setup, acceso API completo)
Mantener Netlify Identity para auth en cualquier caso.

### Evolución futura
- Vista preview del post renderizado con estilos del blog
- Historial de versiones / diffs visual
- Programación de publicación (scheduled posts)
- Soporte para colección `_conferencias/`
- Media library: explorar y reutilizar imágenes ya subidas
