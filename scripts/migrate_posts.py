#!/usr/bin/env python3
"""
Migra los posts del blog al nuevo formato editorial.

Cambios por post:
1. author: { name: "...", twitter: "...", ... } → author: carvajal (short_name)
2. Añade categories: [seccion] según clasificacion_posts.csv → nuevas secciones
3. Extrae primera imagen del body como campo `image` en front matter
4. Elimina campos obsoletos (gplus)
5. Mantiene todos los demás campos intactos
"""

import os
import re
import csv
import sys
import unicodedata

POSTS_DIR = os.path.join(os.path.dirname(__file__), '..', '_posts')
CSV_PATH = os.path.expanduser('~/dev/ctrl_reset/clasificacion_posts.csv')

# ── Author name → short_name ─────────────────────────────────────────────
AUTHOR_MAP = {
    "Miguel Carvajal": "carvajal",
    "Jose A. García Avilés": "garcia-aviles",
    "José Albero García Avilés y Miguel Carvajal": "garcia-aviles",
    "Félix Arias": "arias",
    "Enrique Ribera y Félix Arias": "arias",
    "Alicia de Lara": "de-lara",
    "Cristian R. Marín": "marin",
    "Alba García Ortega": "garcia-ortega",
    "Alba Ortega": "garcia-ortega",
    "Chema Valero": "valero",
    "Jose María Valero": "valero",
    "Jose María Valero ": "valero",
    "Jose María Valero y Alba Ortega": "valero",
    "Dámaso Mondéjar": "mondejar",
    "José Luis Rojas": "rojas",
    "Itziar Martínez": "martinez",
    # Autores antiguos/invitados: no están en authors.yml
    # Se les dejará el nombre completo como fallback
}

# ── Category mapping: categoría antigua → nueva sección ─────────────────
CATEGORY_MAP = {
    "narrativas_formatos": "narrativas",
    "innovacion_periodismo": "narrativas",
    "periodismo_datos": "narrativas",
    "libros_recursos": "narrativas",
    "modelos_negocio": "industria",
    "herramientas_ia": "tecnologia",
    "cultura_redaccion": "redaccion",
    "audiencias_distribucion": "audiencias",
    "casos_medios": "innovadores",
    "academico_master": "el-master",
    "otros": "narrativas",  # default; revisar manualmente después
}

# Posts recientes no incluidos en el CSV de clasificación (post-diciembre 2025)
MANUAL_CLASSIFICATION = {
    "2025-12-10-tiempos-incertidumbre-industria-periodismo-deportivo-respuestas.md": "industria",
    "2025-12-14-entrevista-eva-dominguez-experta-en-narrativas-periodismo-comprender-mejor-el-mundo.md": "innovadores",
    "2026-01-05-publicaciones-2025-innovacion-periodistica-inspirar-profesionales.md": "narrativas",
    "2026-01-09-bajando-la-barrera-del-codigo-en-la-redaccion-programacion-asistida-con-ia.md": "tecnologia",
    "2026-01-19-labs-de-medios-alternativa-transformacion-o-cierre.md": "redaccion",
    "2026-01-21-sexta-edicion-premio-vicente-verdu-periodismo-innovador.md": "el-master",
    "2026-01-27-entrevista-quim-miro-director-diferente-al-medio-generalista.md": "innovadores",
    "2026-02-02-innovar-es-cuidar-bienestar-emocional-periodistas.md": "redaccion",
    "2026-02-04-contenido-8-claves-experiencia-usuario-periodismo.md": "audiencias",
    "2026-02-16-usos-IA-periodismo.md": "tecnologia",
    "2026-02-24-salon5-el-despertar-de-la-generación-alfa-en-el-periodismo.md": "audiencias",
    "2026-03-02-jose-antonio-cortes-quesada-experto-en-audiencias-transicion-metricas-atencion-emocion.md": "innovadores",
    "2026-03-09-narrar-para-conectar-el-futuro-de-las-nuevas-narrativas.md": "narrativas",
    "2026-03-16-huesca-o-la-obstinacion-por-contar-el-mundo.md": "narrativas",
    "2026-03-25-ia-periodismo-datos-recursos-herramientas.md": "tecnologia",
}


def strip_accents(s):
    """Elimina acentos y diacríticos para comparación fuzzy."""
    nfkd = unicodedata.normalize('NFKD', s)
    return ''.join(c for c in nfkd if not unicodedata.combining(c))


def load_classification():
    """Carga el CSV de clasificación → dict {filename: old_category}.

    Construye dos índices:
    1. Exact match (NFC normalizado)
    2. Fuzzy match (sin acentos + por prefijo de fecha)
    """
    exact = {}
    fuzzy = {}  # stripped_key → (original_filename, category)
    by_date = {}  # YYYY-MM-DD → [(stripped_slug, category)]

    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            filename = unicodedata.normalize('NFC', row['post'].strip())
            cat = row['categoria'].strip()
            exact[filename] = cat

            # Fuzzy: strip all accents for matching
            stripped = strip_accents(filename).lower()
            fuzzy[stripped] = cat

            # By date prefix
            date_prefix = filename[:10]  # YYYY-MM-DD
            if date_prefix not in by_date:
                by_date[date_prefix] = []
            by_date[date_prefix].append((stripped, cat))

    return exact, fuzzy, by_date


def lookup_classification(filename, exact, fuzzy, by_date):
    """Busca la categoría de un post usando exact → fuzzy → date match."""
    # 1. Exact match
    if filename in exact:
        return exact[filename]

    # 2. Fuzzy match (accent-stripped)
    stripped = strip_accents(filename).lower()
    if stripped in fuzzy:
        return fuzzy[stripped]

    # 3. Date prefix match (if only one entry for that date)
    date_prefix = filename[:10]
    candidates = by_date.get(date_prefix, [])
    if len(candidates) == 1:
        return candidates[0][1]

    # 4. Date prefix + slug similarity
    if candidates:
        # Try matching the first ~30 chars of the slug (after date)
        slug_start = strip_accents(filename[11:41]).lower()
        for csv_stripped, cat in candidates:
            csv_slug_start = csv_stripped[11:41]
            if slug_start == csv_slug_start:
                return cat

    return None


def parse_post(filepath):
    """Separa front matter (texto raw) y body de un post."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(filepath, 'r', encoding='latin-1') as f:
            content = f.read()

    # Match front matter between --- delimiters
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
    if not match:
        return None, None, content
    return match.group(1), match.group(2), content


def extract_author_name(fm_text):
    """Extrae el nombre del autor del front matter raw text."""
    # Match "author:\n  name: Foo Bar" pattern
    match = re.search(r'author:\s*\n\s+name:\s*(.+)', fm_text)
    if match:
        name = match.group(1).strip().strip('"').strip("'")
        return name
    # Single-line author (already migrated or simple)
    match = re.search(r'^author:\s*(.+)$', fm_text, re.MULTILINE)
    if match:
        val = match.group(1).strip().strip('"').strip("'")
        # If it looks like a YAML object start, skip
        if val == '' or val.startswith('{'):
            return None
        return val
    return None


def extract_first_image(body):
    """Extrae la primera imagen del cuerpo markdown.

    Busca patrones como:
    ![...]({{ site.baseurl }}/images/shots/foo.jpg)
    ![...](/images/001/bar.jpg)
    """
    # Pattern: ![alt](url)
    match = re.search(r'!\[[^\]]*\]\(([^)]+)\)', body)
    if not match:
        return None

    img_url = match.group(1).strip()

    # Normalize: remove {{ site.baseurl }} or site.baseurl prefix
    img_url = re.sub(r'\{\{\s*site\.baseurl\s*\}\}', '', img_url).strip()

    # Must be a local image path
    if img_url.startswith('http') and 'mip.umh.es/blog' not in img_url:
        return None

    # Clean absolute URLs to relative
    if 'mip.umh.es/blog' in img_url:
        img_url = re.sub(r'https?://mip\.umh\.es/blog', '', img_url)

    # Ensure starts with /
    if not img_url.startswith('/'):
        img_url = '/' + img_url

    return img_url


def rewrite_front_matter(fm_text, author_short, new_category, image_path, has_existing_image):
    """Reescribe el front matter con los nuevos campos."""

    lines = fm_text.split('\n')
    new_lines = []
    skip_author_block = False
    skip_indent = 0
    author_handled = False
    categories_handled = False
    image_handled = False
    in_categories_block = False  # True while skipping old category entries

    for line in lines:
        stripped = line.lstrip()

        # Skip gplus field
        if stripped.startswith('gplus:'):
            continue

        # Skip old category entries after we've replaced categories:
        if in_categories_block:
            if stripped.startswith('- '):
                continue  # Skip old category entry
            else:
                in_categories_block = False
                # Fall through to process this line normally

        # Handle author block
        if stripped.startswith('author:'):
            rest = line.split('author:', 1)[1].strip()
            if rest == '' or rest == '|':
                # Multi-line author block → replace with simple key
                skip_author_block = True
                skip_indent = len(line) - len(line.lstrip())
                new_lines.append(f'author: {author_short}' if author_short else line)
            else:
                # Single-line author value
                new_lines.append(f'author: {author_short}' if author_short else line)
            author_handled = True
            continue

        # Skip indented lines of author block
        if skip_author_block:
            current_indent = len(line) - len(line.lstrip()) if stripped else 999
            if stripped and current_indent > skip_indent:
                continue  # Part of author block
            else:
                skip_author_block = False
                if not stripped:
                    # Empty line after author block — don't skip
                    pass
                # Fall through to process this line normally

        # Handle categories
        if stripped.startswith('categories:'):
            if new_category:
                new_lines.append('categories:')
                new_lines.append(f'  - {new_category}')
                in_categories_block = True  # Skip subsequent - entries
            else:
                new_lines.append(line)
            categories_handled = True
            continue

        # Handle image field
        if stripped.startswith('image:') and not stripped.startswith('image_caption:'):
            if image_path and not has_existing_image:
                new_lines.append(f'image: {image_path}')
            else:
                new_lines.append(line)
            image_handled = True
            continue

        new_lines.append(line)

    # Add fields that weren't present in original
    if not author_handled and author_short:
        new_lines.append(f'author: {author_short}')

    if not categories_handled and new_category:
        new_lines.append('categories:')
        new_lines.append(f'  - {new_category}')

    if not image_handled and image_path:
        new_lines.append(f'image: {image_path}')

    return '\n'.join(new_lines)


def migrate_post(filepath, exact, fuzzy, by_date, dry_run=False):
    """Migra un post individual. Retorna (changed, info_dict)."""
    filename = os.path.basename(filepath)
    fm_text, body, raw = parse_post(filepath)

    if fm_text is None:
        return False, {'file': filename, 'error': 'no front matter'}

    info = {'file': filename, 'changes': []}

    # 1. Author
    author_name = extract_author_name(fm_text)
    author_short = None
    if author_name:
        # Strip trailing/leading whitespace
        author_name_clean = author_name.strip()
        author_short = AUTHOR_MAP.get(author_name_clean)
        if not author_short:
            # Try without trailing space
            author_short = AUTHOR_MAP.get(author_name_clean.rstrip())
        if author_short:
            info['changes'].append(f'author: "{author_name}" → {author_short}')
        else:
            info['changes'].append(f'author: "{author_name}" (no mapping, kept as-is)')
            # For unmapped authors, keep the name as the author value
            author_short = author_name_clean

    # 2. Category
    # Check manual overrides first (recent posts not in CSV)
    new_category = MANUAL_CLASSIFICATION.get(filename, None)
    if new_category:
        info['changes'].append(f'category: manual → {new_category}')
    else:
        old_cat = lookup_classification(filename, exact, fuzzy, by_date)
        if old_cat:
            new_category = CATEGORY_MAP.get(old_cat, None)
            if new_category:
                info['changes'].append(f'category: {old_cat} → {new_category}')
            else:
                info['changes'].append(f'category: {old_cat} (no mapping)')
        else:
            info['changes'].append('category: NOT IN CSV')

    # 3. Image - extract from body if no image field exists
    has_existing_image = bool(re.search(r'^image:', fm_text, re.MULTILINE))
    has_cover_image = bool(re.search(r'^cover_image:', fm_text, re.MULTILINE))
    image_path = None

    if not has_existing_image and body:
        image_path = extract_first_image(body)
        if image_path:
            info['changes'].append(f'image: extracted "{image_path}"')
        elif has_cover_image:
            # Extract cover_image value and convert to image field
            cover_match = re.search(r'^cover_image:\s*(.+)$', fm_text, re.MULTILINE)
            if cover_match:
                cover_val = cover_match.group(1).strip().strip('"').strip("'")
                if not cover_val.startswith('/'):
                    image_path = f'/images/shots/{cover_val}'
                else:
                    image_path = cover_val
                info['changes'].append(f'image: from cover_image "{cover_val}"')
    elif has_existing_image:
        info['changes'].append('image: already has image field')

    # 4. Check for gplus
    if 'gplus:' in fm_text:
        info['changes'].append('removed gplus field')

    # Rewrite front matter
    new_fm = rewrite_front_matter(fm_text, author_short, new_category, image_path, has_existing_image)

    if new_fm == fm_text:
        info['changes'].append('NO CHANGES')
        return False, info

    if dry_run:
        return True, info

    # Write back
    new_content = f'---\n{new_fm}\n---\n{body}'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True, info


def main():
    dry_run = '--dry-run' in sys.argv
    verbose = '--verbose' in sys.argv or '-v' in sys.argv

    if dry_run:
        print("🔍 DRY RUN - no files will be modified\n")

    # Load classification
    exact, fuzzy, by_date = load_classification()
    print(f"Loaded {len(exact)} post classifications from CSV")

    # Get all posts
    posts = sorted([f for f in os.listdir(POSTS_DIR) if f.endswith('.md')])
    print(f"Found {len(posts)} posts in _posts/\n")

    changed = 0
    errors = 0
    unmapped_authors = {}
    no_csv = []

    for post_file in posts:
        filepath = os.path.join(POSTS_DIR, post_file)
        try:
            was_changed, info = migrate_post(filepath, exact, fuzzy, by_date, dry_run=dry_run)
            if was_changed:
                changed += 1
            if verbose or was_changed:
                changes_str = '; '.join(info.get('changes', []))
                status = '✏️' if was_changed else '  '
                print(f"  {status} {info['file']}: {changes_str}")

            # Track unmapped authors
            for c in info.get('changes', []):
                if 'no mapping, kept as-is' in c:
                    name = c.split('"')[1]
                    unmapped_authors[name] = unmapped_authors.get(name, 0) + 1
                if 'NOT IN CSV' in c:
                    no_csv.append(info['file'])

        except Exception as e:
            errors += 1
            print(f"  ❌ {post_file}: {e}")

    # Summary
    print(f"\n{'=' * 60}")
    print(f"{'DRY RUN ' if dry_run else ''}SUMMARY")
    print(f"{'=' * 60}")
    print(f"Total posts:    {len(posts)}")
    print(f"Modified:       {changed}")
    print(f"Errors:         {errors}")

    if unmapped_authors:
        print(f"\nUnmapped authors (guest/former, kept as name string):")
        for name, count in sorted(unmapped_authors.items(), key=lambda x: -x[1]):
            print(f"  {name}: {count} posts")

    if no_csv:
        print(f"\nPosts not in classification CSV ({len(no_csv)}):")
        for f in no_csv[:20]:
            print(f"  {f}")
        if len(no_csv) > 20:
            print(f"  ... and {len(no_csv) - 20} more")

    if dry_run:
        print(f"\nRe-run without --dry-run to apply changes.")


if __name__ == '__main__':
    main()
