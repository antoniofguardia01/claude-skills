#!/usr/bin/env python3
"""Crea la carpeta del proyecto web lista para GitHub + Vercel.

Uso:
    python nuevo_proyecto.py <carpeta_extraccion> <carpeta_proyecto> "<Título>"

Copia el motor (engine/), las imágenes útiles (sin los iconitos decorativos del PPT),
y crea vercel.json, .gitignore y README.md. Después, Claude escribe index.html.
"""
import json
import shutil
import sys
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    ext = Path(sys.argv[1]).resolve()
    out = Path(sys.argv[2]).resolve()
    titulo = sys.argv[3]
    out.mkdir(parents=True, exist_ok=True)

    shutil.copytree(SKILL / "assets" / "engine", out / "engine", dirs_exist_ok=True)

    deck = json.loads((ext / "deck.json").read_text(encoding="utf-8"))
    usadas = {li["src"] for li in deck.get("layout_images", [])}
    for s in deck["slides"]:
        for it in s["items"]:
            if it.get("kind") == "image" and not it.get("decorative"):
                usadas.add(it["src"])
    (out / "img").mkdir(exist_ok=True)
    for src in sorted(usadas):
        p = ext / src
        if p.exists():
            shutil.copy2(p, out / src)
    print(f"Imágenes copiadas: {len(usadas)}")

    (out / "vercel.json").write_text(json.dumps({
        "cleanUrls": True,
        "headers": [
            {"source": "/(engine|img)/(.*)", "headers": [{"key": "Cache-Control", "value": "public, max-age=604800"}]}
        ]
    }, indent=2), encoding="utf-8")
    (out / ".gitignore").write_text(".DS_Store\nThumbs.db\n.vercel\nnode_modules\n", encoding="utf-8")
    readme = (SKILL / "references" / "README.plantilla.md").read_text(encoding="utf-8")
    (out / "README.md").write_text(readme.replace("{{TITULO}}", titulo), encoding="utf-8")
    print(f"Proyecto listo en {out}. Falta: index.html")


if __name__ == "__main__":
    main()
