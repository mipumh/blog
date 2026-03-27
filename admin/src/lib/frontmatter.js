import yaml from 'js-yaml';

/**
 * Parse a Jekyll post file into metadata and body.
 * @param {string} content - Raw file content with YAML frontmatter
 * @returns {{ metadata: Object, body: string }}
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Frontmatter no válido: no se encontraron delimitadores ---');
  }
  const metadata = yaml.load(match[1]) || {};
  const body = match[2];
  return { metadata, body };
}

/**
 * Build YAML frontmatter string from metadata object.
 * Critical: author must be an OBJECT with 5 fields, never a string.
 *
 * @param {Object} metadata
 * @returns {string} - Complete file content (frontmatter + body)
 */
export function buildFileContent(metadata, body) {
  const fm = {
    layout: 'post',
    title: metadata.title,
  };

  // Optional subtitle
  if (metadata.subtitle && metadata.subtitle.trim()) {
    fm.subtitle = metadata.subtitle.trim();
  }

  // Author as OBJECT — CRITICAL for templates
  if (metadata.author) {
    fm.author = {};
    if (metadata.author.name) fm.author.name = metadata.author.name;
    if (metadata.author.twitter) fm.author.twitter = metadata.author.twitter;
    if (metadata.author.bio) fm.author.bio = metadata.author.bio;
    if (metadata.author.image) fm.author.image = metadata.author.image;
    if (metadata.author.link) fm.author.link = metadata.author.link;
    // Note: intentionally omit 'gplus' — deprecated field
  }

  // Optional cover image (filename only, not full path)
  if (metadata.cover_image && metadata.cover_image.trim()) {
    fm.cover_image = metadata.cover_image.trim();
  }

  // Optional flags
  if (metadata.periscopio) fm.periscopio = 'si';
  if (metadata.iberifier) fm.iberifier = 'si';
  if (metadata.draft) fm.draft = true;

  const yamlStr = yaml.dump(fm, {
    lineWidth: -1,       // Don't wrap long lines
    quotingType: '"',    // Use double quotes when quoting
    forceQuotes: false,  // Only quote when necessary
    noRefs: true,        // No YAML anchors/refs
    sortKeys: false,     // Preserve insertion order
  });

  // Ensure body has leading newline and trailing newline
  const cleanBody = body.startsWith('\n') ? body : '\n' + body;
  const finalBody = cleanBody.endsWith('\n') ? cleanBody : cleanBody + '\n';

  return `---\n${yamlStr}---${finalBody}`;
}
