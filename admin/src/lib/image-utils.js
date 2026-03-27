/**
 * Client-side image optimization.
 * Resizes to max width, converts to WebP, returns a Blob.
 */

const MAX_WIDTH = 1400;
const WEBP_QUALITY = 0.85;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate and optimize an image file.
 *
 * @param {File} file - The image file from input/drop/paste
 * @returns {Promise<{ blob: Blob, filename: string, originalSize: number, optimizedSize: number }>}
 */
export async function optimizeImage(file) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`La imagen es demasiado grande (${formatBytes(file.size)}). Máximo: 5 MB.`);
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo no es una imagen válida.');
  }

  const originalSize = file.size;
  const img = await loadImage(file);

  // Calculate dimensions
  let { width, height } = img;
  if (width > MAX_WIDTH) {
    height = Math.round((height * MAX_WIDTH) / width);
    width = MAX_WIDTH;
  }

  // Draw to canvas and export as WebP
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY);
  });

  // Generate filename
  const baseName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const timestamp = Date.now();
  const filename = `${baseName}-${timestamp}.webp`;

  return {
    blob,
    filename,
    originalSize,
    optimizedSize: blob.size,
  };
}

/**
 * Convert a Blob to base64 string (without data: prefix)
 */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove "data:image/webp;base64," prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Load an image file into an HTMLImageElement
 */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
