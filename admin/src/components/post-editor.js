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
import { postFilename, parseFilename } from '../lib/slug.js';
import { navigate } from '../router.js';
import { getContentEl } from './app.js';
import { renderToolbar, attachToolbar } from './toolbar.js';
import { renderAuthorSelect, attachAuthorSelect, getAuthorFromForm } from './author-select.js';
import { uploadImage, createImagePicker, setupDragDrop, setupPasteHandler } from './image-upload.js';

let editor = null;
let currentFile = null; // { name, path, sha, metadata, branch }

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

  // Load existing post
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
        branch: 'gh-pages',
      };
    } catch (err) {
      el.innerHTML = `<div class="empty-state"><p>Error al cargar: ${err.message}</p></div>`;
      return;
    }
  } else {
    currentFile = null;
  }

  // Render editor layout
  el.innerHTML = `
    <div class="editor-page">
      <div class="editor-header">
        <a class="editor-header__back" id="btn-back">← Volver a artículos</a>
        <div class="editor-header__actions">
          <button class="btn btn--secondary" id="btn-save-draft">Guardar borrador</button>
          <button class="btn btn--primary" id="btn-publish">Publicar</button>
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
            <label class="form-check">
              <input type="checkbox" id="flag-draft" ${metadata.draft ? 'checked' : ''}>
              Borrador (no publicar)
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

  // Image upload handlers
  const currentBranch = () => currentFile?.branch || 'gh-pages';

  const handleImageFile = (file) => {
    uploadImage(file, currentBranch(), (imagePath) => {
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
    savePost(true);
  });

  document.getElementById('btn-publish').addEventListener('click', () => {
    savePost(false);
  });

  // Keyboard shortcut: Ctrl+S to save draft
  document.addEventListener('keydown', handleKeyboard);
}

function handleKeyboard(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    savePost(true);
  }
}

/**
 * Save the current post to the repository.
 */
async function savePost(asDraft) {
  if (!editor) return;

  const title = document.getElementById('post-title').value.trim();
  if (!title) {
    showStatus('El título es obligatorio', 'error');
    return;
  }

  showStatus('Guardando...', 'saving');

  try {
    // Collect metadata
    const metadata = {
      title,
      subtitle: document.getElementById('post-subtitle').value.trim(),
      author: getAuthorFromForm(),
      cover_image: document.getElementById('post-cover').value.trim(),
      periscopio: document.getElementById('flag-periscopio').checked,
      iberifier: document.getElementById('flag-iberifier').checked,
      draft: asDraft || document.getElementById('flag-draft').checked,
    };

    // Get markdown from TipTap and post-process for Jekyll
    const rawMarkdown = editor.storage.markdown.getMarkdown();
    const jekyllMarkdown = postprocessMarkdown(rawMarkdown);

    // Build file content
    const fileContent = buildFileContent(metadata, jekyllMarkdown);
    const contentBase64 = btoa(unescape(encodeURIComponent(fileContent)));

    // Determine filename
    let filename;
    if (currentFile) {
      filename = currentFile.name;
    } else {
      const date = new Date();
      filename = postFilename(date, title);
    }

    const branch = currentFile?.branch || 'gh-pages';
    const message = currentFile
      ? `Actualizar: ${title}`
      : `Nuevo artículo: ${title}`;

    // Save to repo
    const result = await gitClient.createOrUpdateFile(
      `_posts/${filename}`,
      contentBase64,
      message,
      currentFile?.sha || null,
      branch
    );

    // Update current file reference
    currentFile = {
      name: filename,
      path: `_posts/${filename}`,
      sha: result.content.sha,
      branch,
    };

    // Force refresh of post list cache
    const store = await import('../lib/store.js');
    store.setState({ postsLoaded: false });

    showStatus('Guardado', 'saved');

    // If new post, update URL without reloading
    if (!window.location.hash.includes(filename)) {
      history.replaceState(null, '', `#/edit/${encodeURIComponent(filename)}`);
    }
  } catch (err) {
    showStatus(`Error al guardar: ${err.message}`, 'error');
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
  document.removeEventListener('keydown', handleKeyboard);
}

function escapeAttr(text) {
  return (text || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
