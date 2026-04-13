#!/usr/bin/env python3
"""
Generate wordcloud cover images for posts that don't have a cover image.
Uses post content to create a wordcloud with green brand background (#a6fb91)
and black/white text.

Usage:
  python3 scripts/generate_wordclouds.py          # dry run
  python3 scripts/generate_wordclouds.py --apply   # generate images and update front matter
"""

import os
import sys
import re
import glob
import yaml
from wordcloud import WordCloud
import numpy as np

# Brand colors
BG_COLOR = "#a6fb91"

# Spanish stopwords
STOPWORDS_ES = {
    "de", "la", "el", "en", "y", "a", "los", "del", "las", "un", "por",
    "con", "no", "una", "su", "para", "es", "al", "lo", "como", "más",
    "pero", "sus", "le", "ya", "o", "este", "sí", "porque", "esta",
    "entre", "cuando", "muy", "sin", "sobre", "también", "me", "hasta",
    "hay", "donde", "quien", "desde", "todo", "nos", "durante", "todos",
    "uno", "les", "ni", "contra", "otros", "ese", "eso", "ante", "ellos",
    "e", "esto", "mí", "antes", "algunos", "qué", "unos", "yo", "otro",
    "otras", "otra", "él", "tanto", "esa", "estos", "mucho", "quienes",
    "nada", "muchos", "cual", "poco", "ella", "estar", "estas", "algunas",
    "algo", "nosotros", "mi", "mis", "tú", "te", "ti", "tu", "tus",
    "ellas", "nosotras", "vosotros", "vosotras", "os", "mío", "mía",
    "míos", "mías", "tuyo", "tuya", "tuyos", "tuyas", "suyo", "suya",
    "suyos", "suyas", "nuestro", "nuestra", "nuestros", "nuestras",
    "vuestro", "vuestra", "vuestros", "vuestras", "esos", "esas",
    "estoy", "estás", "está", "estamos", "estáis", "están", "esté",
    "estés", "estemos", "estéis", "estén", "estaré", "estarás", "estará",
    "ha", "han", "has", "he", "ser", "sido", "que", "se", "fue", "son",
    "era", "si", "puede", "dos", "así", "cada", "bien", "hacer",
    "tiene", "tienen", "puede", "ser", "hay", "están", "cómo", "cuáles",
    "nueva", "nuevo", "nuevos", "nuevas", "tras", "ese", "según", "sino",
    "parte", "forma", "manera", "tipo", "hace", "hecho", "sido", "ver",
    "dan", "da", "dar", "sólo", "solo", "demás", "además", "ahora",
    "aún", "aquí", "allí", "entonces", "luego", "mientras", "vez",
    "gran", "grandes", "mejor", "peor", "mayor", "menor", "apenas",
    "través", "mismo", "misma", "mismos", "mismas",
}

# Common non-content words to exclude
EXTRA_STOP = {
    "image", "images", "img", "jpg", "png", "webp", "gif", "http", "https",
    "www", "com", "html", "site", "baseurl", "layout", "post", "title",
    "author", "true", "false", "null", "amp", "nbsp",
}

ALL_STOPS = STOPWORDS_ES | EXTRA_STOP


def extract_text(filepath):
    """Extract clean text from a markdown post."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Split front matter
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            fm = yaml.safe_load(parts[1]) or {}
            body = parts[2]
            title = fm.get("title", "")
        else:
            body = content
            title = ""
    else:
        body = content
        title = ""

    # Remove HTML tags
    body = re.sub(r"<[^>]+>", " ", body)
    # Remove markdown images
    body = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", body)
    # Remove markdown links but keep text
    body = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", body)
    # Remove liquid tags
    body = re.sub(r"\{%.*?%\}", " ", body)
    body = re.sub(r"\{\{.*?\}\}", " ", body)
    # Remove URLs
    body = re.sub(r"https?://\S+", " ", body)

    # Combine title (weighted) and body
    text = (title + " ") * 5 + body

    return text


def generate_wordcloud(text, output_path):
    """Generate a wordcloud image with brand colors."""

    def color_func(word, font_size, position, orientation, **kwargs):
        # Mix of black and white words
        if hash(word) % 3 == 0:
            return "rgb(255, 255, 255)"
        else:
            return "rgb(0, 0, 0)"

    wc = WordCloud(
        width=1600,
        height=900,
        background_color=BG_COLOR,
        color_func=color_func,
        max_words=80,
        min_font_size=14,
        max_font_size=120,
        stopwords=ALL_STOPS,
        prefer_horizontal=0.7,
        margin=20,
        collocations=False,
    )

    wc.generate(text)
    wc.to_file(output_path)


def main():
    apply = "--apply" in sys.argv
    os.makedirs("images/wordclouds", exist_ok=True)

    posts = glob.glob("_posts/*.md")
    count = 0

    for filepath in sorted(posts):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        if not content.startswith("---"):
            continue

        parts = content.split("---", 2)
        if len(parts) < 3:
            continue

        try:
            fm = yaml.safe_load(parts[1])
        except Exception:
            continue

        if fm is None:
            fm = {}

        if fm.get("image"):
            continue

        basename = os.path.basename(filepath).replace(".md", "")
        img_name = f"wordclouds/{basename}.png"
        img_path = f"images/{img_name}"
        fm_image = f"/images/{img_name}"

        text = extract_text(filepath)

        if not text.strip():
            print(f"  SKIP (no text): {basename}")
            continue

        count += 1
        print(f"  [{count}] {basename}")

        if apply:
            generate_wordcloud(text, img_path)

            # Update front matter with image
            fm["image"] = fm_image
            new_front = yaml.dump(
                fm, default_flow_style=False, allow_unicode=True, sort_keys=False
            )
            new_content = f"---\n{new_front}---{parts[2]}"
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)

            print(f"    -> {img_path}")

    print(f"\nTotal: {count} posts without cover image")
    if not apply:
        print("Run with --apply to generate wordclouds and update front matter")


if __name__ == "__main__":
    main()
