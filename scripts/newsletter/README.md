# Newsletter MIP — Guía de despliegue

Sistema de newsletter 100% Google + GitHub, sin servicios de pago.
Plan completo en `~/.claude/plans/vectorized-popping-gem.md` (local).

## Componentes

- **`audit-csvs.rb`** — deduplica los CSVs antiguos de Google Forms y genera `subscribers-clean.csv`.
- **`apps-script/`** — copia versionada del proyecto Apps Script bound a la Google Sheet.
- **`build-draft.rb`** + **`template.mjml.erb`** — generador del borrador HTML semanal (ejecutado por GitHub Action).

## Orden de puesta en marcha

### 1. Auditoría CSVs (Fase 0)

```bash
mkdir -p /tmp/nl-csvs
# Copia ahí todos los exports antiguos de Google Forms
ruby scripts/newsletter/audit-csvs.rb /tmp/nl-csvs ./subscribers-clean.csv
```

Anota la cifra final de emails únicos: determinará cuántos días de envío necesita un ciclo completo (a 1500/día de cuota Gmail).

### 2. Google Sheet + Apps Script (Fase 1)

1. Crea una Google Sheet nueva: **"MIP Newsletter — Lista maestra"**.
2. Añade tres hojas:
   - `subscribers` — cabeceras: `email | suscrito_en | fuente | status | unsubscribe_token | last_sent`
   - `config` — cabeceras: `key | value`. Siembra con estas filas:
     ```
     daily_quota       1500
     batch_cursor      2
     last_send_date
     draft_subject
     draft_html_url
     draft_loaded_at
     ```
   - `log` — cabeceras: `timestamp | action | email | detail`
3. Importa `subscribers-clean.csv` a la hoja `subscribers` (File → Import → Append to current sheet).
4. **Extensiones → Apps Script**. Se abrirá un proyecto nuevo bound a la Sheet.
5. Copia el contenido de estos ficheros al editor de Apps Script (cada uno como fichero separado del mismo nombre):
   - `scripts/newsletter/apps-script/Code.gs`
   - `scripts/newsletter/apps-script/WebApp.gs`
   - `scripts/newsletter/apps-script/Template.gs`
6. En Apps Script: ⚙️ **Project Settings → "Show appsscript.json manifest file"**. Pega el contenido de `apps-script/appsscript.json`.
7. En `Template.gs`, ajusta `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH` si hace falta.
8. **Deploy → New deployment → Type: Web app**:
   - *Description*: `MIP Newsletter v1`
   - *Execute as*: **Me** (tu cuenta UMH)
   - *Who has access*: **Anyone**
   - Click Deploy → autoriza los scopes → copia la **Web app URL** (termina en `/exec`).
9. Guarda esa URL en `_data/newsletter.yml` como `action_url`.

### 3. Captación Jekyll (Fase 2)

Ya hecho por el repo:
- `_data/newsletter.yml` usa la URL del Web App.
- `assets/js/newsletter-submit.js` intercepta el submit y hace POST con `Content-Type: text/plain` (evita preflight CORS).
- Los cuatro `_includes/newsletter-*.html` tienen honeypot.
- `_layouts/base.html` carga el script con `defer`.

Prueba tras desplegar:
```bash
curl -X POST "https://script.google.com/macros/s/XXXXX/exec" \
  -H "Content-Type: text/plain" \
  -d '{"email":"prueba@example.com"}'
```
Debe devolver `{"ok":true}` y aparecer una fila en `subscribers`.

### 4. Preparar un boletín nuevo (Fase 3)

1. Crea `_newsletters/YYYY-MM-DD.md` con el copy de la semana (presentación, asunto, cierre, y opcionalmente noticias). Formato documentado en `_newsletters/README.md`.
2. Dispara el workflow manual:
   ```bash
   gh workflow run weekly-newsletter.yml --ref redesign
   ```
   O pulsa "Run workflow" en la pestaña Actions de GitHub.
3. GitHub genera `_drafts/newsletters/YYYY-MM-DD.html` y abre un PR contra `redesign`.
4. Revisas el PR, ajustas lo que haga falta, mergeas.

**Nada se dispara automáticamente por cron**. Tú decides cuándo generar un borrador.

### 5. Envío (Fase 4)

1. Abre la Google Sheet.
2. Menú **📧 Newsletter → Cargar último borrador** (lee el último `.html` del repo vía GitHub API).
3. **📧 Newsletter → Enviar email de prueba (a mí)** para validar el render.
4. Cuando estés conforme: **📧 Newsletter → Enviar tanda de hoy**.
5. El script envía `daily_quota` emails (default 1500), avanza el cursor y deja `last_send_date = hoy`.
6. Vuelve al día siguiente y repite hasta que el cursor llegue al final. Luego **Reiniciar cursor** para el próximo ciclo.

Si en algún momento Gmail devuelve "quota exceeded", el script se detiene automáticamente y deja el cursor donde estaba. Retomas al día siguiente.

## Versionado del Apps Script

El proyecto Apps Script vive en Google, no en el repo. La fuente de verdad es el proyecto online; las copias en `apps-script/` son backup manual.

**Procedimiento de rotación / actualización**:
1. Edita los `.gs` locales en el repo.
2. Copia-pega cada fichero al editor de Apps Script.
3. Deploy → **Manage deployments** → edita la versión activa → **New version** → Save.
4. Commit el cambio al repo.

Opcionalmente puedes usar [`clasp`](https://github.com/google/clasp) para automatizar el sync, pero añade una dependencia y credenciales Google Cloud que el plan actual evita.

## Secretos y seguridad

- **El proyecto Apps Script no usa service accounts**: corre como tu usuario Workspace UMH. Permisos implícitos sobre la Sheet bound.
- **GitHub Secrets** necesarios para la Action: ninguno adicional al `GITHUB_TOKEN` por defecto.
- **Rotación**: si alguna vez crees que la URL del Web App está comprometida (spam masivo, rate abuse), en Apps Script: Deploy → Manage deployments → **Archive** → New deployment. Actualiza `_data/newsletter.yml` con la nueva URL.

## Riesgos operativos

| Situación | Qué hacer |
|---|---|
| Lista > 14k (cuota 2000/día no cubre semanal) | Segmentar por engagement, o aceptar envío quincenal |
| Gmail bloquea envíos masivos (filtros internos UMH) | Arrancar con tandas de 200-500 los primeros días, monitorizar rebotes |
| URL del Web App cacheada en CDN | Impossible, Apps Script no la sirve por CDN |
| Token unsubscribe filtrado | Idempotente; la segunda baja es no-op |
| GitHub Action falla un lunes | Disparo manual vía `gh workflow run` |

## Contacto operacional

La Sheet y el proyecto Apps Script están bajo la cuenta Workspace del owner del máster. Pérdida de esa cuenta = pérdida del sistema. Compartir la Sheet como editor con al menos una segunda cuenta (no como owner) mitiga el riesgo parcialmente, aunque el despliegue del Web App sigue atado al owner.
