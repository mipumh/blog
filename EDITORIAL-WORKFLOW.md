# Flujo editorial — CMS del blog MIP

## URL del panel de administración

**https://mipumh.netlify.app**

## Acceso

El CMS usa Netlify Identity para autenticación. Solo los usuarios invitados pueden acceder.

### Invitar editores

1. Ve a **Netlify Dashboard** → mipumh → **Identity**
2. Pulsa **Invite users**
3. Introduce el correo electrónico del nuevo editor
4. El editor recibirá un email con enlace de activación

## Flujo de trabajo

### 1. Crear un nuevo artículo

1. Accede a https://mipumh.netlify.app
2. Inicia sesión con tu correo y contraseña
3. Pulsa **+ Nuevo artículo**
4. Rellena el título (obligatorio) y subtítulo (opcional)
5. Abre el panel **Metadatos** para configurar:
   - **Autor**: selecciona del dropdown o elige "Autor manual" para invitados
   - **Imagen de portada**: nombre del archivo (ej: `mi-portada.webp`)
   - **Opciones**: marca si es firma invitada (periscopio) o informe Iberifier
6. Escribe el contenido en el editor
7. Usa **Guardar borrador** para guardar sin publicar (`draft: true`)
8. Usa **Publicar** para publicar directamente

### 2. Editar un artículo existente

1. En la lista de artículos, busca y haz clic en el que quieras editar
2. Modifica lo que necesites
3. Guarda con **Guardar borrador** o **Publicar**

### 3. Atajos de teclado

| Atajo | Acción |
|-------|--------|
| Ctrl/Cmd + B | Negrita |
| Ctrl/Cmd + I | Cursiva |
| Ctrl/Cmd + K | Insertar enlace |
| Ctrl/Cmd + S | Guardar borrador |
| # + espacio | Título H2 |
| ## + espacio | Título H3 |
| - + espacio | Lista |
| > + espacio | Cita |

## Imágenes

### Formatos aceptados
- JPG, PNG, WebP, GIF
- Máximo 5 MB por imagen

### Cómo insertar imágenes
- **Arrastrar y soltar** directamente en el editor
- **Pegar** desde el portapapeles (Ctrl/Cmd + V)
- **Botón 🖼** en la barra de herramientas

### Optimización automática
- Las imágenes se redimensionan a máximo 1400px de ancho
- Se convierten a WebP con calidad 85%
- Se suben a `images/001/` automáticamente
- Un GitHub Action reoptimiza como red de seguridad

### Imagen de portada
En el panel de Metadatos, escribe solo el nombre del archivo (ej: `portada.webp`). La ruta completa la genera el template automáticamente.

### Imagen del autor
Cada autor tiene una imagen de perfil definida en `_data/authors.yml`. Se muestra automáticamente. Si cambias la imagen de un autor, actualiza el campo `image` en ese archivo.

## Selector de autor

### Autores habituales
El dropdown muestra los autores definidos en `_data/authors.yml`. Al seleccionar uno, se rellenan automáticamente los 5 campos: nombre, twitter, bio, imagen y enlace.

### Autores invitados (periscopio)
1. Selecciona **"Autor manual (invitado)"** en el dropdown
2. Rellena los campos manualmente
3. Marca la casilla **"Firma invitada (periscopio)"** en Opciones
4. El post mostrará la sección especial de "Firma invitada" en el blog

### Añadir un nuevo autor habitual
Edita el archivo `_data/authors.yml` en el repositorio y añade una nueva entrada con el formato:

```yaml
clave_del_autor:
  name: Nombre Completo
  twitter: handle_sin_arroba
  bio: Cargo o descripción
  image: nombre.webp
  link: https://twitter.com/handle
```

## Arquitectura técnica

- **Blog**: Jekyll en GitHub Pages (`mip.umh.es/blog`)
- **CMS**: SPA con Vite + TipTap, desplegado en Netlify (`mipumh.netlify.app`)
- **Autenticación**: Netlify Identity
- **API**: Git Gateway (proxy autenticado a GitHub API)
- **Repositorio**: `mipumh/blog` (rama `gh-pages`)

## Reconectar Netlify (desde el CMS viejo)

Si vienes del CMS anterior (`mipumh/cms`):

1. Ve a **Netlify Dashboard** → mipumh → **Site configuration** → **Build & deploy**
2. En **Repository**, pulsa **Link to a different repository**
3. Selecciona `mipumh/blog`
4. Configura:
   - **Base directory**: `admin`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `admin/dist`
5. Ve a **Site configuration** → **Identity** → verifica que sigue activo
6. Ve a **Site configuration** → **Identity** → **Services** → **Git Gateway** → verifica que sigue conectado al repo
7. **Desactiva "Prerendering"**: ve a **Site configuration** → **Post processing** → **Pre-rendering** → desactivar (es legacy y ya no se necesita)
8. Despliega: **Deploys** → **Trigger deploy** → **Deploy site**
