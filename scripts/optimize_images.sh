#!/bin/bash
# Optimiza imágenes JPG/JPEG y PNG in-place usando ImageMagick.
# No cambia nombres de archivo — no rompe enlaces.
# Uso: bash scripts/optimize_images.sh

set -euo pipefail

IMAGES_DIR="$(cd "$(dirname "$0")/../images" && pwd)"

if ! command -v mogrify &> /dev/null; then
    echo "Error: ImageMagick (mogrify) no está instalado."
    echo "  macOS: brew install imagemagick"
    exit 1
fi

# Calcular tamaño total antes
size_before=$(find "$IMAGES_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -exec stat -f%z {} + | awk '{s+=$1} END {print s}')

echo "=== Optimización de imágenes ==="
echo "Directorio: $IMAGES_DIR"
echo "Tamaño antes: $(echo "$size_before" | awk '{printf "%.1f MB", $1/1048576}')"
echo ""

# Optimizar JPG/JPEG: strip metadata + calidad 85%
echo "Optimizando JPG/JPEG (calidad 85%, strip metadata)..."
jpg_count=$(find "$IMAGES_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' \) | wc -l | tr -d ' ')
echo "  Archivos encontrados: $jpg_count"
find "$IMAGES_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' \) -print0 | \
    xargs -0 -P 4 -I {} mogrify -strip -quality 85 -interlace Plane "{}"
echo "  Hecho."

# Optimizar PNG: strip metadata
echo "Optimizando PNG (strip metadata)..."
png_count=$(find "$IMAGES_DIR" -type f -iname '*.png' | wc -l | tr -d ' ')
echo "  Archivos encontrados: $png_count"
find "$IMAGES_DIR" -type f -iname '*.png' -print0 | \
    xargs -0 -P 4 -I {} mogrify -strip "{}"
echo "  Hecho."

# Calcular tamaño total después
size_after=$(find "$IMAGES_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -exec stat -f%z {} + | awk '{s+=$1} END {print s}')

echo ""
echo "=== Resultado ==="
echo "Tamaño antes:  $(echo "$size_before" | awk '{printf "%.1f MB", $1/1048576}')"
echo "Tamaño después: $(echo "$size_after" | awk '{printf "%.1f MB", $1/1048576}')"
saved=$(echo "$size_before $size_after" | awk '{printf "%.1f MB", ($1-$2)/1048576}')
pct=$(echo "$size_before $size_after" | awk '{if ($1>0) printf "%.1f%%", (($1-$2)/$1)*100; else print "0%"}')
echo "Ahorro: $saved ($pct)"
