"""Genera data/photos.json leggendo le cartelle in assets/foto/. Uso: python3 scripts/build_photos.py
Una cartella = un album. Nome consigliato: AAAA-MM-GG-nome-evento (es. 2026-11-21-prova-del-fuoco)."""
import os, re, json
from urllib.parse import quote

R = "assets/foto"
albums = []
for d in sorted(os.listdir(R), reverse=True):
    p = os.path.join(R, d)
    if not os.path.isdir(p):
        continue
    fs = sorted(f for f in os.listdir(p) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))
    if not fs:
        continue
    m = re.match(r"(\d{4}-\d{2}-\d{2})-(.*)", d)
    date, name = (m.group(1), m.group(2)) if m else ("", d)
    albums.append({"title": name.replace("-", " ").capitalize(), "date": date,
                   "photos": [f"{R}/{quote(d)}/{quote(f)}" for f in fs]})
json.dump(albums, open("data/photos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("photos.json aggiornato:", len(albums), "album")
