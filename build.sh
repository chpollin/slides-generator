#!/bin/bash
# Concat engine + presentation into a single .gs file for manual paste into Apps Script.
# Usage:  ./build.sh <presentation-name>
# Output: dist/<presentation-name>.gs

set -e
PRES="${1:-bibliotheksinformatik}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/dist/$PRES.gs"

if [ ! -d "$ROOT/presentations/$PRES" ]; then
  echo "presentation not found: $PRES" >&2
  exit 1
fi

mkdir -p "$ROOT/dist"

{
  echo "/**"
  echo " * slides-generator — combined build for presentation: $PRES"
  echo " * Generated $(date '+%Y-%m-%d %H:%M') from $(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo 'working tree')"
  echo " *"
  echo " * Paste this entire file into Google Apps Script (replaces existing code)."
  echo " * Requires: Slides API v1 service enabled."
  echo " */"
  echo
  cat "$ROOT/src/schemas/dhcraft.gs"
  echo
  cat "$ROOT/lib/slide-library.gs"
  echo
  cat "$ROOT/src/00_core.gs"
  echo
  cat "$ROOT/src/01_builders.gs"
  echo
  cat "$ROOT/src/02_richtext.gs"
  echo
  cat "$ROOT/src/03_shapes.gs"
  echo
  cat "$ROOT/src/04_copy.gs"
  echo
  for f in "$ROOT/presentations/$PRES"/*.gs; do
    cat "$f"
    echo
  done
} > "$OUT"

echo "built: $OUT ($(wc -l < "$OUT") lines)"
