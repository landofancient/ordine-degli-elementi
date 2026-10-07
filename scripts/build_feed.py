"""Genera feed.xml (RSS) da data/events.json. Uso: python3 scripts/build_feed.py"""
import json, datetime as dt
from email.utils import format_datetime
from xml.sax.saxutils import escape as x

SITE_URL = "https://landofancient.github.io/NOME-REPOSITORY"   # <-- modifica

ev = json.load(open("data/events.json", encoding="utf-8"))["events"]
ev.sort(key=lambda e: e["date"], reverse=True)
items = ""
for e in ev:
    d = dt.datetime.fromisoformat(e["date"]).replace(tzinfo=dt.timezone.utc)
    link = f'{SITE_URL}/iscrizioni.html?evento={e["id"]}'
    items += (f'<item><title>{x(e["title"])}</title><link>{x(link)}</link>'
              f'<guid>{x(link)}</guid><pubDate>{format_datetime(d)}</pubDate>'
              f'<description>{x(" - ".join(v for v in (e["summary"], e["place"]) if v) or e["title"])}</description></item>\n')
open("feed.xml", "w", encoding="utf-8").write(
    '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>'
    f'<title>Ordine degli Elementi: eventi</title><link>{SITE_URL}</link>'
    '<description>Eventi di gioco di ruolo dal vivo</description><language>it</language>\n'
    f'{items}</channel></rss>')
print("feed.xml aggiornato:", len(ev), "eventi")
