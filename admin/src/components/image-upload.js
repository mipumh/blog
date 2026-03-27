import { optimizeImage, blobToBase64, formatBytes } from '../lib/image-utils.js';
import { gitClient } from '../lib/git-gateway.js';
import { showStatus } from '../lib/store.js';

/**
 * Handle image upload from file input, drag-drop, or paste.
 * Optimizes client-side, uploads to images/001/ via Git Gateway,
 * then calls the callback with the image path for insertion.
 *
 * @param {File} file - The image file
 * @param {string} branch - Git branch to upload to
 * @param {Function} onSuccess - Callback with (imagePath: string)
 */
export async function uploadImage(file, branch = 'gh-pages', onSuccess) {
  try {
    showStatus('Optimizando imagen...', 'saving');

    // 1. Client-side optimization
    const { blob, filename, originalSize, optimizedSize } = await optimizeImage(file);

    showStatus(
      `Subiendo ${filename} (${formatBytes(optimizedSize)}, antes: ${formatBytes(originalSize)})...`,
      'saving'
    );

    // 2. Convert to base64 for Git API
    const base64 = await blobToBase64(blob);

    // 3. Upload to images/001/ via Git Gateway
    const path = `images/001/${filename}`;
    await gitClient.createOrUpdateFile(
      path,
      base64,
      `Subir imagen: ${filename}`,
      null, // sha=null for new file
      branch
    );

    // 4. Return raw GitHub URL (available instantly, no rebuild needed)
    // postprocessMarkdown converts back to {{ site.baseurl }} on save
    const editorPath = `https://raw.githubusercontent.com/mipumh/blog/gh-pages/${path}`;

    showStatus('Imagen subida', 'saved');

    if (onSuccess) onSuccess(editorPath);
  } catch (err) {
    showStatus(`Error: ${err.message}`, 'error');
    throw err;
  }
}

/**
 * Create a hidden file input for image selection.
 * Returns a function that triggers the file picker.
 *
 * @param {Function} onFile - Callback with (File)
 * @returns {Function} trigger function
 */
export function createImagePicker(onFile) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  document.body.appendChild(input);

  input.addEventListener('change', () => {
    if (input.files && input.files[0]) {
      onFile(input.files[0]);
      input.value = ''; // Reset for next use
    }
  });

  return () => input.click();
}

/**
 * Setup drag-and-drop on the editor element.
 *
 * @param {HTMLElement} element - The editor container
 * @param {Function} onFile - Callback with (File)
 */
export function setupDragDrop(element, onFile) {
  element.addEventListener('dragover', (e) => {
    e.preventDefault();
    element.classList.add('image-drop-zone--active');
  });

  element.addEventListener('dragleave', () => {
    element.classList.remove('image-drop-zone--active');
  });

  element.addEventListener('drop', (e) => {
    e.preventDefault();
    element.classList.remove('image-drop-zone--active');
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFile(file);
    }
  });
}

/**
 * Setup paste handler for images.
 *
 * @param {HTMLElement} element - The editor container
 * @param {Function} onFile - Callback with (File)
 */
export function setupPasteHandler(element, onFile) {
  element.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) onFile(file);
        return;
      }
    }
  });
}
