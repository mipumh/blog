---
# Esta carpeta NO la construye Jekyll (está excluida en _config.yml).
# Aquí vive el copy semanal del newsletter: un fichero Markdown por envío.
---

# Boletines

Cada semana, antes de generar el borrador, crea un fichero nuevo:
`_newsletters/YYYY-MM-DD.md`.

## Formato

```markdown
---
date: 2026-04-14
subject: "Asunto del email que verán los suscriptores"
news:
  - title: "Titular de la noticia 1"
    url: "https://..."
    blurb: "Una línea de contexto."
  - title: "Titular de la noticia 2"
    url: "https://..."
    blurb: "Otra línea."
---
Hola,

Esta es la **presentación** del boletín. Puedes escribir en Markdown normal
(negritas, enlaces, listas). Dos o tres líneas son suficientes.

===

Un saludo,
Miguel

P.D. Escríbeme si te apetece responder.
```

## Cómo se usa

1. El bloque YAML de arriba (`date`, `subject`, `news`) son metadatos.
2. El bloque de abajo es texto libre en Markdown.
3. El separador `===` en una línea propia divide **presentación** (arriba)
   y **cierre** (abajo).
4. El `news` es opcional. Si no hay noticias esa semana, déjalo vacío o bórralo.
5. `subject` es el asunto del email en la bandeja del suscriptor.

## Cómo se genera el borrador

Cuando el fichero esté listo, dispara el workflow:

```bash
gh workflow run weekly-newsletter.yml --ref redesign
```

O pulsa el botón "Run workflow" en la pestaña Actions de GitHub.
El workflow creará un PR con `_drafts/newsletters/YYYY-MM-DD.html` listo
para revisar.
