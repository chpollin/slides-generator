# slides-generator

Google Apps Script zur programmatischen Erzeugung von Google-Slides-Präsentationen. Trennt **Inhalt** (strukturierte Daten), **Layout** (Builder-Funktionen) und **Design** (wählbares Schema). Entwickelt im Rahmen von [DHCraft](https://dhcraft.org/) für akademische Lehrveranstaltungen, Workshops und Vorträge.

## Architektur

```
src/
├── 00_core.gs          — generate(), Slide-Loop, Dispatcher
├── 01_builders.gs      — BUILDERS.{title, section, content, learning, discussion,
│                         exercise, handson, image_placeholder, content_with_image}
├── 02_richtext.gs      — Inline-**fett** und *kursiv* Parser
├── 03_shapes.gs        — addSlideNumber, addPromptBox, addPlaceholderBox
├── 04_copy.gs          — Folien aus anderen Präsentationen kopieren
└── schemas/
    └── dhcraft.gs      — D-Objekt (Farben, Fonts, Größen, Layout)

lib/
└── slide-library.gs    — Registry wiederverwendbarer Quell-Folien (SOURCE_PRES, SLIDE_REGISTRY)

presentations/
└── bibliotheksinformatik/
    ├── 00_config.gs    — Ziel-IDs, COPY_SLIDES
    ├── 01_tag1.gs      — getTag1Content()
    ├── 02_tag2.gs      — getTag2Content()
    ├── 03_tag3.gs      — getTag3Content()
    └── 99_run.gs       — generateTag1/2/3(), generateAll()
```

Apps Script lädt alle `.gs`-Dateien im Projekt als flachen Namespace. Die Ordner sind Git-Konvention, kein Runtime-Konzept — Reihenfolge der Ladung ist per Dateiname alphabetisch, deshalb die Zahlen-Präfixe (`00_`, `01_`, …).

## Voraussetzungen

1. Google-Slides-Ziel-Präsentation mit eingerichtetem DHCraft-Master:
   - **Title-Layout**: linearer Grau-Gradient links (`#e8e8e8`) → rechts (`#f8f8f8`), DHCraft-Logo oben rechts, CC-BY-Logo unten rechts
   - **Content-Layouts**: weißer Hintergrund
   - Schriftart im Master: **Helvetica Neue**
2. Apps-Script-Projekt an die Präsentation gebunden (*Extensions → Apps Script*)
3. Google Slides API als Dienst aktiviert (in Apps Script: *Services → Add a service → Google Slides API v1*)

## Deployment

### Schnellweg (kombiniertes Build, copy-paste)

```
./build.sh bibliotheksinformatik
```

erzeugt `dist/bibliotheksinformatik.gs` — eine einzelne Datei mit Engine + Schema + Library + Präsentation. Kompletten Inhalt in den Apps-Script-Editor einfügen (überschreibt bestehenden Code), Entry-Funktion (`generateTag1` etc.) im Dropdown auswählen, ausführen.

`dist/` ist nicht in `.gitignore` — die Builds werden mitgecheckt, damit der aktuelle Stand ohne lokales Bauen nachvollziehbar ist.

### Modular (copy-paste pro Datei)

Alle `.gs`-Dateien aus `src/`, `lib/`, `presentations/*/` einzeln in den Apps-Script-Editor anlegen. Unpraktischer, aber näher am Repo-Layout.

### Via clasp (langfristig sauber)

```
npm install -g @google/clasp
clasp login
clasp clone <SCRIPT_ID>        # oder: clasp create --type standalone
clasp push
```

Die `.clasp.json` mit der Script-ID wird lokal angelegt und ist via `.gitignore` ausgeschlossen.

## Neues Präsentations-Paket anlegen

1. Ordner unter `presentations/<name>/` erstellen
2. `00_config.gs` mit Ziel-Präsentations-IDs und `COPY_SLIDES`
3. Eine oder mehrere Content-Funktionen (`getXxxContent()`) je nach Foliensatz
4. `99_run.gs` mit Entry Points (`function generateXxx() { generate(PRES_ID, getXxxContent()); }`)
5. Content-Funktionen präfixieren, wenn mehrere Präsentationen im selben Apps-Script-Projekt liegen sollen (z.B. `bib_getTag1Content`)

## Folientypen

- `title` — Titelfolie (Master-Gradient scheint durch)
- `section` — Block-Trenner (großer fetter Titel + Untertitel)
- `learning` — Lernziele (Titel zentriert, nummerierte Liste)
- `content` — Standard-Inhaltsfolie (Titel + Body + optionale Quelle)
- `discussion` — Leitfrage (großes `?` als visueller Anker)
- `exercise` — Übung mit Label in Teal
- `handson` — Anleitung links, gestrichelte Prompt-Box rechts (Consolas)
- `image_placeholder` — Platzhalter für nachträglich einzufügendes Bild
- `content_with_image` — Split-Layout Text + Bildplatzhalter
- `copy` — Folie aus anderer Präsentation kopieren (Slide Library)

## Inline-Formatierung in `body`/`title`

- `**fett**` für Schlüsselwörter
- `*kursiv*` für englische Fachbegriffe

## Lizenz

MIT (wenn nicht anders vermerkt).
