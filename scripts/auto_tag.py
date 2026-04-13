#!/usr/bin/env python3
"""
Auto-tag posts based on keyword matching in title and content.
Adds semantic tags to post front matter without removing existing tags.

Usage:
  python scripts/auto_tag.py           # Dry run (shows changes)
  python scripts/auto_tag.py --apply   # Apply changes to files
"""

import os
import re
import sys
import yaml

POSTS_DIR = os.path.join(os.path.dirname(__file__), '..', '_posts')

# Tag taxonomy: tag_name -> { keywords (in title/content), weight_title, weight_content }
TAG_RULES = {
    # --- IA & Automatización ---
    'inteligencia-artificial': {
        'title': [r'\bIA\b', r'inteligencia artificial', r'ChatGPT', r'GPT', r'machine learning',
                  r'aprendizaje autom', r'generativa', r'\bLLM\b', r'Gemini', r'Claude', r'copilot'],
        'content': [r'inteligencia artificial', r'aprendizaje autom', r'redes neuronales',
                    r'modelo de lenguaje', r'generativa'],
        'min_content_hits': 3
    },
    'herramientas-ia': {
        'title': [r'herramienta', r'recurso.*IA', r'IA.*recurso', r'ChatGPT', r'Perplexity',
                  r'Midjourney', r'DALL-E', r'Whisper', r'herramientas.*inteligencia'],
        'content': [r'ChatGPT', r'Perplexity', r'Midjourney', r'DALL-E', r'Whisper', r'Copilot'],
        'min_content_hits': 2
    },
    'desinformacion': {
        'title': [r'desinformaci', r'fake.?news', r'bulo', r'verificaci', r'fact.?check',
                  r'deepfake', r'manipulaci', r'maldita', r'newtral'],
        'content': [r'desinformaci', r'verificaci', r'fact.?check', r'bulo'],
        'min_content_hits': 3
    },

    # --- Narrativas & Formatos ---
    'narrativas-interactivas': {
        'title': [r'narrativa.*interactiv', r'interactiv.*narrativ', r'inmersiv',
                  r'narrativas.*destacad', r'narrativas.*innovador'],
        'content': [r'interactiv', r'inmersiv', r'scroll.*telling', r'newsgame'],
        'min_content_hits': 3
    },
    'periodismo-datos': {
        'title': [r'periodismo.*dato', r'dato.*periodis', r'visualizaci', r'infograf',
                  r'data.*journalism', r'open.*data'],
        'content': [r'periodismo de datos', r'visualizaci', r'dataset'],
        'min_content_hits': 2
    },
    'video': {
        'title': [r'\bvideo\b', r'\bvídeo\b', r'audiovisual', r'televisiv', r'informativ.*tv',
                  r'televisión', r'\bTV\b', r'streaming'],
        'content': [r'vídeo', r'video', r'audiovisual', r'televisión'],
        'min_content_hits': 4
    },
    'podcast-audio': {
        'title': [r'podcast', r'\baudio\b', r'radio', r'sonor', r'Spotify'],
        'content': [r'podcast', r'audio', r'radiofón'],
        'min_content_hits': 3
    },
    'storytelling': {
        'title': [r'storytelling', r'contar.*historia', r'historia.*contar', r'narrativa',
                  r'relato', r'cómic', r'periodismo.*cómic'],
        'content': [r'storytelling', r'narrativa', r'relato'],
        'min_content_hits': 4
    },

    # --- Modelos de negocio ---
    'modelo-negocio': {
        'title': [r'modelo.*negocio', r'negocio.*model', r'monetiz', r'ingresos',
                  r'rentabil', r'viabilidad'],
        'content': [r'modelo de negocio', r'monetiz', r'ingresos'],
        'min_content_hits': 3
    },
    'suscripciones': {
        'title': [r'suscripci', r'paywall', r'muro.*pago', r'pago.*contenido',
                  r'membresía', r'membership'],
        'content': [r'suscripci', r'paywall', r'muro de pago', r'suscriptor'],
        'min_content_hits': 3
    },
    'newsletters': {
        'title': [r'newsletter', r'boletín', r'email.*periodis', r'correo.*electrón'],
        'content': [r'newsletter', r'boletín', r'correo electrónico'],
        'min_content_hits': 3
    },
    'emprendimiento': {
        'title': [r'emprend', r'startup', r'lanzar.*medio', r'proyecto.*periodís',
                  r'nativo.*digital'],
        'content': [r'emprend', r'startup', r'nativo digital'],
        'min_content_hits': 3
    },

    # --- Audiencias & Distribución ---
    'redes-sociales': {
        'title': [r'redes.*social', r'social.*media', r'Twitter', r'Instagram',
                  r'Facebook', r'LinkedIn', r'WhatsApp'],
        'content': [r'redes sociales', r'Twitter', r'Instagram', r'Facebook'],
        'min_content_hits': 4
    },
    'tiktok-twitch': {
        'title': [r'TikTok', r'Twitch', r'streamer', r'jóvenes.*medio'],
        'content': [r'TikTok', r'Twitch', r'streamer'],
        'min_content_hits': 2
    },
    'engagement': {
        'title': [r'engagement', r'audiencia', r'comunidad', r'conectar.*lector',
                  r'fideliz', r'participaci'],
        'content': [r'engagement', r'fidelización', r'comunidad'],
        'min_content_hits': 3
    },

    # --- Redacción & Organización ---
    'organizacion-redacciones': {
        'title': [r'redacci[oó]n', r'organiz.*redacci', r'media.*lab', r'laboratorio',
                  r'flujo.*trabajo', r'cultura.*organiz'],
        'content': [r'redacción', r'organización', r'media lab', r'laboratorio'],
        'min_content_hits': 3
    },
    'perfiles-profesionales': {
        'title': [r'perfil.*profesional', r'nuevo.*perfil', r'periodista.*digital',
                  r'competencia', r'habilidad'],
        'content': [r'perfil profesional', r'competencia', r'habilidades'],
        'min_content_hits': 3
    },
    'liderazgo': {
        'title': [r'liderazgo', r'líder', r'gestión.*equipo', r'transformación.*digital',
                  r'innovación.*organiz'],
        'content': [r'liderazgo', r'líder', r'gestión'],
        'min_content_hits': 3
    },

    # --- Periodismo especializado ---
    'periodismo-deportivo': {
        'title': [r'deport', r'fútbol', r'The Athletic', r'Relevo', r'Marca'],
        'content': [r'periodismo deportivo', r'deporte', r'fútbol'],
        'min_content_hits': 3
    },
    'periodismo-local': {
        'title': [r'\blocal\b', r'proximidad', r'hiperlocal', r'comunidad.*local'],
        'content': [r'periodismo local', r'hiperlocal', r'proximidad'],
        'min_content_hits': 3
    },
    'divulgacion-cientifica': {
        'title': [r'divulgaci.*cient', r'ciencia', r'científic'],
        'content': [r'divulgación', r'ciencia', r'científic'],
        'min_content_hits': 3
    },

    # --- Temáticas transversales ---
    'innovacion-periodistica': {
        'title': [r'innovaci[oó]n.*periodis', r'periodis.*innovaci', r'innovador',
                  r'disruptiv', r'transformaci'],
        'content': [r'innovación periodística', r'innovación en periodismo'],
        'min_content_hits': 3
    },
    'tendencias': {
        'title': [r'tendencia', r'futuro.*periodis', r'predicci', r'panorama',
                  r'claves.*202', r'resumen.*202'],
        'content': [r'tendencia', r'futuro', r'predicción'],
        'min_content_hits': 3
    },
    'entrevista': {
        'title': [r'entrevista', r'"[^"]{5,}"'],  # Quoted speech in title
        'content': [],
        'min_content_hits': 999  # Only match on title
    },
    'latinoamerica': {
        'title': [r'latinoam[eé]rica', r'latino', r'Argentina', r'Colombia', r'M[eé]xico',
                  r'Chile', r'Uruguay', r'Brasil'],
        'content': [r'Latinoamérica', r'latinoamericano'],
        'min_content_hits': 3
    },
    'libros-recursos': {
        'title': [r'libro', r'recurso', r'publicacion', r'guía', r'manual',
                  r'recomendable', r'imprescindible'],
        'content': [],
        'min_content_hits': 999
    },

    # --- Académico ---
    'premio-vicente-verdu': {
        'title': [r'Vicente Verd[uú]', r'premio.*periodis.*innovador'],
        'content': [r'Vicente Verdú'],
        'min_content_hits': 1
    },
}

MAX_TAGS = 5  # Maximum tags per post


def parse_front_matter(filepath):
    """Parse YAML front matter from a Jekyll post."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
    if not match:
        return None, None, content

    try:
        fm = yaml.safe_load(match.group(1))
    except yaml.YAMLError:
        return None, None, content

    body = match.group(2)
    return fm, body, content


def score_tags(title, body_text):
    """Score each tag based on keyword matches in title and body."""
    scores = {}

    for tag, rules in TAG_RULES.items():
        score = 0

        # Title matches (high weight)
        for pattern in rules.get('title', []):
            if re.search(pattern, title, re.IGNORECASE):
                score += 10

        # Content matches
        min_hits = rules.get('min_content_hits', 3)
        content_hits = 0
        for pattern in rules.get('content', []):
            matches = re.findall(pattern, body_text[:3000], re.IGNORECASE)
            content_hits += len(matches)

        if content_hits >= min_hits:
            score += content_hits

        if score > 0:
            scores[tag] = score

    return scores


def assign_tags(filepath):
    """Determine tags for a post."""
    fm, body, raw = parse_front_matter(filepath)
    if fm is None:
        return None, []

    title = fm.get('title', '')
    existing_tags = fm.get('tags', []) or []

    scores = score_tags(title, body or '')

    # Sort by score, take top MAX_TAGS
    sorted_tags = sorted(scores.items(), key=lambda x: -x[1])
    new_tags = [t for t, s in sorted_tags[:MAX_TAGS] if s >= 5]

    # Merge with existing, preserving order
    merged = list(existing_tags)
    for t in new_tags:
        if t not in merged:
            merged.append(t)

    return fm, merged[:MAX_TAGS]


def apply_tags(filepath, tags):
    """Write tags to post front matter."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
    if not match:
        return

    fm_text = match.group(1)
    body = match.group(2)

    # Remove existing tags line(s)
    fm_text = re.sub(r'\ntags:.*?(?=\n\w|\n---|\Z)', '', fm_text, flags=re.DOTALL)
    fm_text = fm_text.rstrip()

    # Add tags
    if tags:
        tags_yaml = '\ntags:\n' + ''.join(f'  - {t}\n' for t in tags)
        fm_text += tags_yaml.rstrip('\n')

    new_content = f'---\n{fm_text}\n---\n{body}'

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)


def main():
    apply_mode = '--apply' in sys.argv

    posts = sorted([
        os.path.join(POSTS_DIR, f)
        for f in os.listdir(POSTS_DIR)
        if f.endswith('.md')
    ])

    tagged_count = 0
    tag_stats = {}

    for filepath in posts:
        fm, tags = assign_tags(filepath)
        if fm is None or not tags:
            continue

        existing = fm.get('tags', []) or []
        new_tags = [t for t in tags if t not in existing]

        if new_tags:
            tagged_count += 1
            filename = os.path.basename(filepath)

            if not apply_mode:
                print(f"  {filename}")
                print(f"    + {', '.join(new_tags)}")

            for t in tags:
                tag_stats[t] = tag_stats.get(t, 0) + 1

            if apply_mode:
                apply_tags(filepath, tags)

    print(f"\n{'Applied' if apply_mode else 'Would tag'}: {tagged_count} posts")
    print(f"\nTag distribution:")
    for tag, count in sorted(tag_stats.items(), key=lambda x: -x[1]):
        print(f"  {tag}: {count}")


if __name__ == '__main__':
    main()
