import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';

import { gitClient } from '../lib/git-gateway.js';
import { getState, showStatus } from '../lib/store.js';
import { parseFrontmatter, buildFileContent } from '../lib/frontmatter.js';
import { preprocessMarkdown, postprocessMarkdown } from '../lib/markdown-processor.js';
import { postFilename, slugify, parseFilename } from '../lib/slug.js';
import { navigate } from '../router.js';
import { getContentEl } from './app.js';
import { renderToolbar, attachToolbar } from './toolbar.js';
import { renderAuthorSelect, attachAuthorSelect, getAuthorFromForm } from './author-select.js';
import { uploadImage, createImagePicker, setupDragDrop, setupPasteHandler } from './image-upload.js';

let editor = null;
let currentFile = null; // { name, path, sha, branch }
let cmsBranch = null;   // e.g. 'cms/mi-nuevo-articulo'

const PROD_BRANCH = 'gh-pages';

/**
 * Render the post editor view.
 * @param {{ filename?: string }} params - If filename is set, edit existing post
 */
export async function renderPostEditor(params = {}) {
  const el = getContentEl();
  const isNew = !params.filename;
  let metadata = { author: {} };
  let body = '';

  el.innerHTML = '<div class="loading">Cargando editor</div>';

  // Load existing post (always read from gh-pages)
  if (!isNew) {
    try {
      const file = await gitClient.getFile(`_posts/${params.filename}`);
      const content = new TextDecoder().decode(Uint8Array.from(atob(file.content), c => c.charCodeAt(0)));
      const parsed = parseFrontmatter(content);
      metadata = parsed.metadata;
      body = parsed.body;
      currentFile = {
        name: params.filename,
        path: file.path,
        sha: file.sha,
        branch: PROD_BRANCH,
      };
    } catch (err) {
      el.innerHTML = `<div class="empty-state"><p>Error al cargar: ${err.message}</p></div>`;
      return;
    }
  } else {
    currentFile = null;
  }

  // Reset branch for this editing session
  cmsBranch = null;

  // Render editor layout
  el.innerHTML = `
    <div class="editor-page">
      <div class="editor-header">
        <a class="editor-header__back" id="btn-back">← Volver a artículos</a>
        <div class="editor-header__actions">
          <button class="btn btn--secondary" id="btn-save-draft">Guardar borrador</button>
          <button class="btn btn--primary" id="btn-publish">Enviar a revisión</button>
        </div>
      </div>

      <input class="editor-title" id="post-title" type="text"
        placeholder="Título del artículo" value="${escapeAttr(metadata.title || '')}">
      <input class="editor-subtitle" id="post-subtitle" type="text"
        placeholder="Subtítulo (opcional)" value="${escapeAttr(metadata.subtitle || '')}">

      <div class="metadata-panel">
        <button class="metadata-toggle" id="metadata-toggle">
          <span>Metadatos</span>
          <span class="metadata-toggle__arrow" id="metadata-arrow">▼</span>
        </button>
        <div class="metadata-content${isNew ? '' : ' metadata-content--hidden'}" id="metadata-content">
          ${renderAuthorSelect(metadata.author)}
          <div class="form-group">
            <label class="form-label">Imagen de portada</label>
            <input class="form-input" id="post-cover" placeholder="nombre-imagen.webp"
              value="${escapeAttr(metadata.cover_image || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Opciones</label>
            <label class="form-check">
              <input type="checkbox" id="flag-periscopio" ${metadata.periscopio === 'si' ? 'checked' : ''}>
              Firma invitada (periscopio)
            </label>
            <label class="form-check">
              <input type="checkbox" id="flag-iberifier" ${metadata.iberifier === 'si' ? 'checked' : ''}>
              Informe Iberifier
            </label>
          </div>
        </div>
      </div>

      ${renderToolbar()}

      <div class="tiptap-wrapper" id="tiptap-wrapper">
        <div id="editor-content"></div>
      </div>
    </div>
  `;

  // Toggle metadata panel
  document.getElementById('metadata-toggle').addEventListener('click', () => {
    const content = document.getElementById('metadata-content');
    const arrow = document.getElementById('metadata-arrow');
    content.classList.toggle('metadata-content--hidden');
    arrow.classList.toggle('metadata-toggle__arrow--open');
  });

  // Back button
  document.getElementById('btn-back').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('#/posts');
  });

  // Initialize author select
  attachAuthorSelect();

  // Initialize TipTap editor
  const processedBody = preprocessMarkdown(body);

  editor = new Editor({
    element: document.getElementById('editor-content'),
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: '_blank' },
      }),
      Placeholder.configure({
        placeholder: 'Escribe aquí el contenido del artículo...',
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: '-',
        linkify: false,
        breaks: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: processedBody,
  });

  // Image upload handlers — images always go to the cms branch
  const imageBranch = () => cmsBranch || PROD_BRANCH;

  const handleImageFile = (file) => {
    uploadImage(file, imageBranch(), (imagePath) => {
      editor.chain().focus().setImage({ src: imagePath }).run();
    });
  };

  const triggerImagePicker = createImagePicker(handleImageFile);

  // Attach toolbar (with image button handler)
  attachToolbar(editor, triggerImagePicker);

  // Drag-drop and paste on editor wrapper
  const wrapper = document.getElementById('tiptap-wrapper');
  setupDragDrop(wrapper, handleImageFile);
  setupPasteHandler(wrapper, handleImageFile);

  // Save handlers
  document.getElementById('btn-save-draft').addEventListener('click', () => {
    saveDraft();
  });

  document.getElementById('btn-publish').addEventListener('click', () => {
    submitForReview();
  });

  // Keyboard shortcut: Ctrl+S to save draft
  document.addEventListener('keydown', handleKeyboard);
}

function handleKeyboard(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveDraft();
  }
}

/**
 * Ensure a cms/ branch exists for this post.
 * Creates one from gh-pages HEAD if needed.
 */
async function ensureCmsBranch(title) {
  if (cmsBranch) return cmsBranch;

  const slug = slugify(title);
  const branchName = `cms/${slug}`;

  try {
    // Check if branch already exists
    await gitClient.getBranch(branchName);
    cmsBranch = branchName;
    return cmsBranch;
  } catch (_) {
    // Branch doesn't exist, create it
  }

  const ghPages = await gitClient.getBranch(PROD_BRANCH);
  await gitClient.createBranch(branchName, ghPages.commit.sha);
  cmsBranch = branchName;
  return cmsBranch;
}

/**
 * Collect metadata and markdown from the editor form.
 */
function collectPostData() {
  const title = document.getElementById('post-title').value.trim();
  if (!title) return null;

  const metadata = {
    title,
    subtitle: document.getElementById('post-subtitle').value.trim(),
    author: getAuthorFromForm(),
    cover_image: document.getElementById('post-cover').value.trim(),
    periscopio: document.getElementById('flag-periscopio').checked,
    iberifier: document.getElementById('flag-iberifier').checked,
    draft: false,
  };

  const rawMarkdown = editor.storage.markdown.getMarkdown();
  const jekyllMarkdown = postprocessMarkdown(rawMarkdown);
  const fileContent = buildFileContent(metadata, jekyllMarkdown);
  const contentBase64 = btoa(unescape(encodeURIComponent(fileContent)));

  let filename;
  if (currentFile) {
    filename = currentFile.name;
  } else {
    filename = postFilename(new Date(), title);
  }

  return { title, metadata, contentBase64, filename };
}

/**
 * Save draft to a cms/ branch (never to gh-pages).
 */
async function saveDraft() {
  if (!editor) return;

  const data = collectPostData();
  if (!data) {
    showStatus('El título es obligatorio', 'error');
    return;
  }

  showStatus('Guardando borrador...', 'saving');

  try {
    const branch = await ensureCmsBranch(data.title);

    // Get the sha of the file on the cms branch (may differ from gh-pages)
    let sha = null;
    try {
      const existing = await gitClient.getFile(`_posts/${data.filename}`, branch);
      sha = existing.sha;
    } catch (_) {
      // File doesn't exist on this branch yet — that's fine
      // For existing posts, try to get sha from gh-pages
      if (currentFile?.sha) {
        sha = currentFile.sha;
      }
    }

    const message = currentFile
      ? `Actualizar: ${data.title}`
      : `Nuevo artículo: ${data.title}`;

    const result = await gitClient.createOrUpdateFile(
      `_posts/${data.filename}`,
      data.contentBase64,
      message,
      sha,
      branch
    );

    // Update current file reference
    currentFile = {
      name: data.filename,
      path: `_posts/${data.filename}`,
      sha: result.content.sha,
      branch,
    };

    showStatus(`Borrador guardado en ${branch}`, 'saved');

    // Update URL
    if (!window.location.hash.includes(data.filename)) {
      history.replaceState(null, '', `#/edit/${encodeURIComponent(data.filename)}`);
    }
  } catch (err) {
    showStatus(`Error al guardar: ${err.message}`, 'error');
  }
}

/**
 * Save to cms/ branch and create a PR to gh-pages for review.
 */
async function submitForReview() {
  if (!editor) return;

  const data = collectPostData();
  if (!data) {
    showStatus('El título es obligatorio', 'error');
    return;
  }

  if (!confirm(`¿Enviar "${data.title}" a revisión? Se creará una solicitud de publicación.`)) {
    return;
  }

  showStatus('Guardando y creando solicitud...', 'saving');

  try {
    // First save the latest version to the cms branch
    const branch = await ensureCmsBranch(data.title);

    let sha = null;
    try {
      const existing = await gitClient.getFile(`_posts/${data.filename}`, branch);
      sha = existing.sha;
    } catch (_) {
      if (currentFile?.sha) sha = currentFile.sha;
    }

    const message = currentFile
      ? `Actualizar: ${data.title}`
      : `Nuevo artículo: ${data.title}`;

    await gitClient.createOrUpdateFile(
      `_posts/${data.filename}`,
      data.contentBase64,
      message,
      sha,
      branch
    );

    // Create PR from cms/ branch to gh-pages
    const prTitle = currentFile
      ? `Actualizar: ${data.title}`
      : `Nuevo: ${data.title}`;

    const author = getAuthorFromForm();
    const prBody = `Artículo enviado desde el editor.\n\nAutor: ${author.name || 'Sin definir'}\nArchivo: \`_posts/${data.filename}\``;

    const pr = await gitClient.createPR(prTitle, branch, PROD_BRANCH, prBody);

    showStatus(`PR #${pr.number} creado — pendiente de revisión`, 'saved');

    // Update button to show it's been submitted
    const btnPublish = document.getElementById('btn-publish');
    if (btnPublish) {
      btnPublish.textContent = `PR #${pr.number} enviado`;
      btnPublish.disabled = true;
    }
  } catch (err) {
    // If PR already exists, that's ok
    if (err.message.includes('already exists') || err.message.includes('A pull request already exists')) {
      showStatus('Ya existe una solicitud de revisión para este artículo', 'saved');
    } else {
      showStatus(`Error: ${err.message}`, 'error');
    }
  }
}

/**
 * Cleanup editor when leaving the view
 */
export function destroyEditor() {
  if (editor) {
    editor.destroy();
    editor = null;
  }
  currentFile = null;
  cmsBranch = null;
  document.removeEventListener('keydown', handleKeyboard);
}

function escapeAttr(text) {
  return (text || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
