# Sito dell'Ordine degli Elementi APS

Sito statico (solo HTML, CSS e JavaScript, nessun database) con tre pagine:

| Pagina | File | Cosa fa |
|---|---|---|
| Presentazione | `index.html` | Chi siamo, i quattro elementi, come partecipare |
| Eventi | `eventi.html` | Elenco automatico degli eventi, letto da `data/events.json` |
| Foto | `foto.html` | Galleria divisa per evento, generata dalle cartelle in `assets/foto/` |
| Iscrizioni | `iscrizioni.html` | Menu degli eventi e Google Form incorporato |

Gli eventi si modificano **solo** in `data/events.json`. Le pagine si aggiornano da sole.

## 1. Pubblicare su GitHub Pages

1. Crea un account su github.com e un nuovo repository (es. `ordine-degli-elementi`), pubblico.
2. Carica tutti i file di questa cartella (anche `.github`, che è nascosta). Dal sito: *Add file, Upload files*.
3. Vai in *Settings, Pages*. In *Source* scegli *Deploy from a branch*, branch `main`, cartella `/ (root)`. Salva.
4. Dopo un minuto il sito è su `https://NOMEUTENTE.github.io/NOME-REPOSITORY/`.
5. Dominio proprio (opzionale): sempre in *Settings, Pages*, campo *Custom domain*.

## 2. Provarlo sul tuo computer

Aprire `index.html` con doppio clic **non carica gli eventi** (il browser blocca la lettura del file JSON). Serve un piccolo server locale:

```bash
python3 -m http.server 8000
```

poi apri http://localhost:8000.

## 3. Aggiungere o modificare un evento

Apri `data/events.json` (su GitHub: clic sul file, poi l'icona matita) e aggiungi un blocco dentro `"events"`, separato dagli altri da una virgola:

```json
{
  "id": "notte-di-ottobre",
  "title": "La Notte dei Sigilli",
  "date": "2026-10-31T21:00",
  "place": "Castello di Esempio, Via Roma 1",
  "element": "aria",
  "summary": "Due righe su ambientazione e cosa portare.",
  "price": "12 euro",
  "formUrl": "https://docs.google.com/forms/d/e/XXXXXXXX/viewform"
}
```

| Campo | Note |
|---|---|
| `id` | Breve, unico, senza spazi né accenti. Compare nel link `iscrizioni.html?evento=ID` |
| `date` | Formato `AAAA-MM-GGTHH:MM`. Dopo questa data l'evento passa in *Già svolti* |
| `element` | `fuoco`, `acqua`, `terra` o `aria`: sceglie il colore del bordo |
| `dateLabel` | Facoltativo. Testo mostrato al posto della data, es. `"Aprile 2026"` quando non serve il giorno preciso. `date` resta usato per l'ordine |
| `link` | Facoltativo. Se presente compare il pulsante "Pagina Facebook" (utile per gli eventi già svolti) |
| `price` | Lascia `""` se gratuito: la riga non appare |
| `formUrl` | Link del Google Form di quell'evento (vedi sotto) |

Per **togliere** un evento cancella il suo blocco (e la virgola in eccesso). Se il file ha un errore di virgole o virgolette le pagine mostrano "Impossibile caricare i dati": controlla con https://jsonlint.com.

Il campo `generalFormUrl` in cima al file è il modulo per "Altro / informazioni generali".

## 4. Raccogliere le iscrizioni con Google Form

1. Su forms.google.com crea un modulo per l'evento. Campi consigliati: nome e cognome, email, telefono, età, personaggio o elemento preferito, allergie, consenso privacy. Per i minorenni aggiungi i dati di un genitore.
2. Scheda *Risposte*, icona verde: *Collega a Fogli*. Le iscrizioni arrivano in un foglio Google. Per avere una mail a ogni iscrizione: nel foglio, *Strumenti, Regole di notifica*.
3. Per limitare i posti: componente aggiuntivo *Form Limiter* o simile.
4. Clic su *Invia*, icona del collegamento, copia il link e incollalo in `formUrl`.
5. Opzione alternativa: **un solo form per tutti gli eventi**, con una domanda a scelta "Quale evento?". Incolla lo stesso link in ogni `formUrl`.

Il sito aggiunge da solo `?embedded=true` per mostrare il modulo dentro la pagina. Finché `formUrl` contiene il testo `INCOLLA`, il visitatore vede un messaggio al posto del modulo.

## 5. Feed RSS degli eventi

Il file `feed.xml` è un feed RSS: chi lo segue in un lettore di notizie, o chi usa strumenti come Zapier/IFTTT, riceve i nuovi eventi.

1. Apri `scripts/build_feed.py` e cambia la riga `SITE_URL` con l'indirizzo reale del sito.
2. **Automatico:** a ogni modifica di `data/events.json` su GitHub, l'azione `.github/workflows/feed.yml` rigenera `feed.xml`. Alla prima volta vai in *Settings, Actions, General, Workflow permissions* e scegli *Read and write permissions*.
3. **Manuale:** `python3 scripts/build_feed.py`, poi carica il nuovo `feed.xml`.

Il feed è collegato alle pagine tramite `<link rel="alternate">`, quindi i lettori RSS lo trovano da soli.

## 6. Pubblicare le foto

Le foto stanno in `assets/foto/`, **una cartella per evento**. Il nome della cartella diventa il titolo dell'album e la data iniziale ne decide l'ordine (le più recenti in alto):

```
assets/foto/2026-11-21-prova-del-fuoco/foto-01.jpg
assets/foto/2026-11-21-prova-del-fuoco/foto-02.jpg
assets/foto/2026-09-19-veglia-della-terra/...
```

Per aggiungere un album:
1. Su GitHub apri `assets/foto`, poi *Add file, Upload files*.
2. Per creare la cartella nuova scrivi il suo nome nel campo del nome file seguito da `/` (es. `2026-11-21-prova-del-fuoco/`) e carica le immagini. Oppure trascina da Esplora file/Finder la cartella già pronta.
3. Salva con *Commit changes*. L'azione automatica aggiorna `data/photos.json` e la galleria si aggiorna dopo circa un minuto.

Consigli:
- Formati: `.jpg`, `.png`, `.webp`. Nomi di file **senza spazi né accenti**.
- Ridimensiona le foto a circa **1600 px** sul lato lungo (peso sotto 500 KB ciascuna). Foto da 5 MB rendono il sito lento e il repository pesante (GitHub consiglia di restare sotto 1 GB in totale).
- Per cancellare una foto o un album, eliminali da GitHub.
- Dentro `assets/foto/2026-09-19-esempio-da-cancellare/` ci sono tre immagini di prova: cancella la cartella.
- Senza l'azione automatica (o se lavori in locale) esegui `python3 scripts/build_photos.py` e carica il nuovo `data/photos.json`.
- **Privacy:** pubblica foto di persone solo con il loro consenso, e per i minorenni con quello di un genitore. Meglio inserire una clausola nel modulo di iscrizione.

## 7. Feed Instagram (facoltativo)

Instagram non permette di incorporare liberamente il profilo. Il sito rimanda al profilo con link. Per mostrare le ultime foto servono servizi esterni (es. Behold, Elfsight, SnapWidget): crei il widget collegando l'account, copi il codice che ti danno e lo incolli in `index.html` dentro una nuova `<section>`.

## 8. Cambiare testi, colori, font

- **Testi:** `index.html` (apri e modifica le frasi tra i tag). Le descrizioni dei quattro regni sono dentro i `<div class="porta">`: sono riassunte dal manuale (v. 2.5), aggiornale quando la storia cambia.
- **Colori:** `assets/style.css`, primo blocco `:root`. Cambia gli esadecimali (`--fuoco`, `--acqua`, `--terra`, `--aria`, `--ground`).
- **Font:** Uncial Antiqua per i titoli (richiama il logo) e Alegreya per il testo. Il link Google Fonts in `<head>` di ogni pagina e le variabili `--serif` e `--sans` in `style.css`.
- **Immagine di copertina:** `assets/copertina.jpg` (estratta dal manuale, include già il logo). Per cambiarla sostituisci il file mantenendo il nome.
- **Logo nell'intestazione:** non ho un file pulito (PNG con sfondo trasparente o SVG): se lo hai, salva l'immagine in `assets/logo.png` e in ogni pagina sostituisci il testo di `<a class="brand">` con `<a class="brand" href="index.html"><img src="assets/logo.png" alt="Ordine degli Elementi" height="40"></a>`.
- **Contatti e Instagram:** il link al profilo compare in `index.html`, nel footer di ogni pagina e in `assets/app.js`. Cerca `land_of_ancient`.

## Struttura

```
index.html  eventi.html  foto.html  iscrizioni.html  feed.xml
assets/     style.css  app.js
data/       events.json          <- qui si gestiscono gli eventi
            photos.json          <- generato da solo, non toccarlo
assets/foto/ <- una cartella per evento
scripts/    build_feed.py  build_photos.py
.github/workflows/feed.yml
```

## Privacy

Le iscrizioni contengono dati personali: tenete il foglio Google privato, condividetelo solo con chi organizza e aggiungete nel form il link all'informativa privacy dell'associazione.
