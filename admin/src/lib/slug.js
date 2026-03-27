/**
 * Generate a URL-safe slug from a Spanish title.
 *
 * "La IA al servicio del periodismo" → "la-ia-al-servicio-del-periodismo"
 * "Salon5: el despertar de la Generación Alfa" → "salon5-el-despertar-de-la-generacion-alfa"
 *
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (á→a, ñ→n, etc.)
    .replace(/[^a-z0-9\s-]/g, '')    // Remove non-alphanumeric (except spaces and hyphens)
    .replace(/\s+/g, '-')            // Spaces to hyphens
    .replace(/-+/g, '-')             // Collapse multiple hyphens
    .replace(/^-|-$/g, '');          // Trim leading/trailing hyphens
}

/**
 * Generate a Jekyll post filename from date and title.
 *
 * @param {Date} date
 * @param {string} title
 * @returns {string} e.g. "2026-03-26-mi-nuevo-articulo.md"
 */
export function postFilename(date, title) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const slug = slugify(title);
  return `${y}-${m}-${d}-${slug}.md`;
}

/**
 * Parse a Jekyll post filename into date and slug parts.
 *
 * @param {string} filename e.g. "2026-03-26-mi-articulo.md"
 * @returns {{ date: string, slug: string } | null}
 */
export function parseFilename(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
  if (!match) return null;
  return { date: match[1], slug: match[2] };
}
