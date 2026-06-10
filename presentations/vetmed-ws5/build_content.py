# -*- coding: utf-8 -*-
"""
Content-Builder fuer die Praesentation vetmed-ws5 (Workshop 5 Datenanalyse
Verwaltung, VetMedAI, 11.06.2026). Haelt den Folieninhalt als lesbare
Python-Struktur (mit echten Umlauten und Zeilenumbruechen) und emittiert
daraus 01_ws5.gs mit korrekt ASCII-escapetem JavaScript (json.dumps).

Aufruf:  python build_content.py   (schreibt 01_ws5.gs in denselben Ordner)
"""
import json
import os

slides = [
    # ---------------------------------------------------------------- Titel
    {"type": "title",
     "title": "Datenanalyse\nin der Verwaltung",
     "subtitle": "Von Prompt Engineering zu Context Engineering",
     "meta": "Workshop 5 · 11. Juni 2026 · Online\nVetMedAI · KI-Kompetenzaufbau Veterinärmedizinische Universität Wien"},

    # ------------------------------------------- Opener (Delta 10.06.2026)
    {"_delta": True,
     "type": "content",
     "title": "Gestern erschienen: Claude Fable 5",
     "body": "Anthropic veröffentlicht am 9. Juni 2026 **Claude Fable 5**, das erste öffentliche Modell der **Mythos-Klasse**.\n\n"
             "• Eine eigene Leistungsstufe **über** den bisherigen Spitzenmodellen\n"
             "• Stand der Technik auf nahezu allen *Benchmarks*\n"
             "• Arbeitet **länger autonom** an komplexen Aufgaben als jedes frühere Modell\n\n"
             "**Die Entwicklung flacht nicht ab.** Was das für die tägliche Arbeit mit Daten heißt, ist Thema dieses Workshops.",
     "source": "Anthropic (2026). Claude Fable 5 and Claude Mythos 5. anthropic.com/news.",
     "notes": "Anthropic hat am 9. Juni 2026 Claude Fable 5 veroeffentlicht, das erste oeffentlich zugaengliche Modell der Mythos-Klasse. Es liegt als eigene Leistungsstufe ueber den bisherigen Opus-Spitzenmodellen, ist Stand der Technik auf nahezu allen Benchmarks und arbeitet laenger autonom an komplexen Aufgaben als jedes fruehere Claude-Modell. Die Entwicklung seit 2023 setzt sich damit ungebremst fort."},

    {"_delta": True,
     "type": "content",
     "title": "Mythos und Fable: Sicherheit als Systemdesign",
     "body": "Das volle Modell **Mythos 5** erhält nur ein kleiner Kreis von Cyberverteidigern und Infrastrukturbetreibern (*Project Glasswing*, mit der US-Regierung).\n\n"
             "Das öffentliche **Fable 5** hat eingebaute **Klassifikatoren**: Anfragen zu *Cybersecurity*, Bio/Chemie oder Modell-*Destillation* beantwortet automatisch ein schwächeres Modell.\n\n"
             "**Verantwortung wird ins System gebaut.** Dieselbe Logik begleitet uns heute auf Nutzerseite: prüfen, bevor man vertraut.\n\n"
             "Die Live-Demo am Ende läuft auf genau diesem Modell.",
     "source": "Anthropic (2026). Claude Fable 5 and Claude Mythos 5. anthropic.com/news.",
     "notes": "Das volle Modell Mythos 5 erhaelt nur ein kleiner Kreis von Cyberverteidigern und Infrastrukturbetreibern im Rahmen von Project Glasswing in Kooperation mit der US-Regierung, weil die Mythos-Modelle Schwachstellen auf uebermenschlichem Niveau finden. Das oeffentliche Fable 5 nutzt dieselbe Technologie, aber Klassifikatoren leiten Anfragen zu Cybersecurity, Biologie und Chemie oder Modell-Destillation automatisch an ein schwaecheres Modell um. Die Verantwortung liegt damit nicht allein beim Nutzer, sondern ist in das System eingebaut. Die Live-Demo in Teil 3 laeuft auf Fable 5."},

    {"type": "learning",
     "title": "Lernziele",
     "body": "1. Tabellarische **Verwaltungsdaten** (*Excel*, *CSV*) mit *LLM*-Unterstützung auswerten und visualisieren\n\n"
             "2. **Code-Ausführung** für zuverlässige Berechnungen nutzen und von reiner Textantwort unterscheiden\n\n"
             "3. Ergebnisse **kritisch verifizieren**: Datenqualität, Quersummen, Fachwissen (*Critical Expert in the Loop*)\n\n"
             "4. **Grenzen** und datenschutzkonformen Einsatz (*Academic AI*) einordnen"},

    # ============================================ TEIL 1 Hinfuehrung
    {"type": "section", "title": "Teil 1",
     "subtitle": "Was ist Datenanalyse mit LLMs? Eine kurze Geschichte"},

    {"type": "content",
     "title": "2023: Das Ausgangsexperiment",
     "body": "Eine *Excel*-Tabelle mit ausgewerteten Fragebögen. Die Frage: Wer würde die eigenen kognitiven Fähigkeiten verbessern, und mit welchen Methoden?\n\n"
             "• Saubere Variablen, gute Datengrundlage\n"
             "• Werkzeug: *GPT-4* mit *Advanced Data Analysis*\n"
             "• Ergebnis in rund eineinhalb Tagen\n\n"
             "Damals eher zufällig schon **richtig** verwendet: erst die Daten lesen, dann analysieren, dann visualisieren.",
     "source": "Daten: Grinschgl et al., OSF-Projekt, Erhebung 2022.",
     "notes": "Das Beispiel stammt aus einem realen Projekt zu kognitivem Enhancement. Die Teilnehmenden beantworteten Frageboegen dazu, ob sie aktive oder passive Methoden zur Steigerung ihrer kognitiven Faehigkeiten akzeptieren. Entscheidend war die saubere Datengrundlage mit klar definierten Variablen. GPT-4 mit Advanced Data Analysis fuehrte echten Python-Code aus und lieferte die Auswertung in etwa eineinhalb Tagen."},

    {"type": "handson",
     "title": "Der Prompt von 2023",
     "body": "Bausteine, die man damals brauchte:\n\n"
             "• **Persona Modelling**\n"
             "• **Kontext** und **Aufgabe** in Schritten\n"
             "• *Chain-of-Thought*: Schritt für Schritt denken\n"
             "• *Emotional Prompting*: \"important to my career\"\n\n"
             "Heute ist das meiste davon **nicht mehr nötig**.",
     "prompt": "You are an expert in psychology\nand data visualization. Here is a\ndataset ...\n\n* Read the csv very carefully\n* Define user stories based on the\n  data and research questions\n* Implement the data visualizations\n\nTake a deep breath and work on this\nstep-by-step. This is very important\nto my career!",
     "notes": "Der Originalprompt kombinierte Persona Modelling, Kontext, Arbeitsschritte und zwei Techniken, die heute Zeitgeschichte sind. Chain-of-Thought wurde damals in den OpenAI-Discord-Channels aufgeschnappt, Emotional Prompting sollte das Modell zu mehr Sorgfalt bewegen. Aktuelle Modelle koennen das von sich aus, der Aufwand entfaellt."},

    {"type": "content",
     "title": "Was sich verändert hat",
     "body": "***Prompt Engineering* verliert, *Context Engineering* gewinnt.**\n\n"
             "• 2023: Die Kunst lag im **Bedienen** des Modells\n"
             "• Heute: Die Arbeit liegt im präzisen **Bereitstellen** von Aufgabe, Prozess und Daten\n\n"
             "Die Verbesserung in drei Jahren war **kategorisch**, nicht graduell. Am stärksten dort, wo eine gute Datengrundlage vorliegt.",
     "notes": "Der Kompetenzschwerpunkt hat sich verschoben. Frueher ging es darum, das Modell mit Tricks zu bedienen. Heute liegt die Arbeit darin, Aufgabe, Prozess und Daten praezise bereitzustellen. Diese Verschiebung ist die zentrale Botschaft des ersten Teils."},

    {"type": "handson",
     "title": "Heute: ein Satz genügt",
     "body": "Derselbe Datensatz, heute in *Claude Code*:\n\n"
             "1. Daten und Codebook selbst herunterladen lassen\n"
             "2. Passende statistische Verfahren eigenständig wählen\n"
             "3. Visualisierungen erzeugen\n"
             "4. Forschungsfragen beantworten\n\n"
             "Statt *Persona* und Tricks: eine **präzise Aufgabe** mit guter Datengrundlage.",
     "prompt": "Lies Daten und Codebook unter <URL>\nund analysiere sie sorgfältig.\n\nForschungsfrage: Korreliert\nIntelligenz mit der Akzeptanz von\nEnhancement-Methoden?\n\nWähle eigenständig die passenden\nVerfahren und Visualisierungen,\nbegründe deine Wahl, dokumentiere\ndie Schritte.",
     "notes": "Derselbe Anwendungsfall wie 2023, aber heute genuegt eine praezise Aufgabe. Claude Code laedt die Daten selbst herunter, liest das Codebook, waehlt die statistischen Verfahren und beantwortet die Forschungsfragen weitgehend autonom. Der Mensch nennt nur noch Frage und Datengrundlage."},

    {"type": "content",
     "title": "*Claude Code*: was man dabei sieht",
     "body": "• **Terminal und *Tool Use***: das Modell lädt die Daten selbst herunter und führt Code aus\n"
             "• **Permissions**: vor jeder eingreifenden Aktion fragt es nach\n"
             "• ***Read***: es liest das Codebook-PDF direkt, nichts wird abgetippt\n"
             "• **Sichtbares *Reasoning***: man sieht, was es vorhat, und kann eingreifen\n\n"
             "Das sichtbare Denken ist der **Feedback-Kanal** für den Menschen.",
     "notes": "Vier Funktionen von Claude Code werden am Enhancement-Lauf sichtbar. Das Modell baut sich selbst einen Befehl, um die Daten herunterzuladen, fragt vor der Ausfuehrung um Erlaubnis, liest das Codebook-PDF direkt und zeigt sein Reasoning. Das sichtbare Denken erlaubt es, einzugreifen bevor eine falsche Richtung eingeschlagen wird."},

    {"type": "content_with_image",
     "title": "Das Ergebnis: ein Überblick",
     "body": "Die Korrelationsmatrix zeigt:\n\n"
             "• Tatsächliche und selbsteingeschätzte Intelligenz hängen moderat zusammen (*r* = 0,47)\n"
             "• Intelligenz und Akzeptanz von Enhancement: durchgehend **schwach**\n"
             "• Aktive Methoden *r* = 0,14, passive praktisch null\n\n"
             "N = 257.",
     "placeholder": "fig3_heatmap.png\nKorrelationsmatrix der fokalen Variablen",
     "source": "Eigene Analyse, Claude Code (2026)."},

    {"type": "content_with_image",
     "title": "Die Falle: signifikant, aber nicht haltbar",
     "body": "Aktive Methode × tatsächliche Intelligenz:\n\n"
             "• rohes *p* = **0,027**, sieht signifikant aus\n"
             "• nach **Holm-Korrektur**: *p* = 0,109, **n.s.**\n\n"
             "Bei vier Tests muss man für multiples Testen korrigieren. Danach hält **keiner** der vier Zusammenhänge.\n\n"
             "2023 wäre man hier in die Falle gelaufen: ein Effekt, den es nicht gibt.",
     "placeholder": "fig1_scatter_grid.png\nVier Streudiagramme mit r, CI, p, Holm",
     "source": "Holm (1979). Scand. J. of Statistics.",
     "notes": "Das ist der didaktische Kern des ersten Teils. Das rohe p von 0,027 wirkt signifikant. Nach der Holm-Korrektur fuer multiples Testen steht 0,109 und der Zusammenhang haelt nicht mehr. Wer nur das rohe p liest, berichtet einen Effekt, den es nicht gibt. Das Modell hat hier korrekt korrigiert, aber verlassen darf man sich darauf nicht."},

    {"type": "content",
     "title": "*Critical Expert in the Loop*",
     "body": "Das Modell hat hier richtig korrigiert. **Verlassen** darf man sich darauf nicht.\n\n"
             "Die menschliche Rolle verschiebt sich von **Bedienung** zu **Validierung**:\n"
             "• Wissen, *dass* man bei vier Tests korrigieren muss\n"
             "• Das Ergebnis im Output **gegenprüfen**\n"
             "• Fachlich verantworten, was berichtet wird\n\n"
             "Konstant von 2023 bis heute: die **fachliche Validierung**.",
     "notes": "Die Verantwortung bleibt beim Menschen. Das Modell schlaegt vor und rechnet, die Fachperson entscheidet, ob das Ergebnis traegt. Diese Rolle bleibt von 2023 bis heute konstant, waehrend sich die Werkzeuge stark veraendert haben. Damit leitet der erste Teil zum Verwaltungsfall ueber."},

    # ============================================ TEIL 2 Hauptteil
    {"type": "section", "title": "Teil 2",
     "subtitle": "Datenanalyse im Verwaltungsalltag"},

    {"type": "content",
     "title": "Der Anwendungsfall: Wissensbilanz",
     "body": "Die **Wissensbilanz** braucht Personalkennzahlen je Organisationseinheit, dazu die Geschlechterverteilung.\n\n"
             "• Bisher: manuell in *Excel* zusammengetragen\n"
             "• Jetzt: im Dialog mit dem Modell, mit Kontrolle\n\n"
             "Anschluss an **Use Case 1** (Wissensbilanz-Dashboard), den Sie bereits kennen.",
     "notes": "Der Hauptteil arbeitet mit einem echten Verwaltungsfall. Die Wissensbilanz der Universitaet braucht Personalkennzahlen je Organisationseinheit und die Geschlechterverteilung. Bisher wurde das manuell in Excel zusammengetragen. Der Fall knuepft an Use Case 1 des Projekts an, das Wissensbilanz-Dashboard."},

    {"type": "content",
     "title": "Das Werkzeug: niederschwellig",
     "body": "*ChatGPT* oder *Claude* mit **Datei-Upload** und *Code-Interpreter*. Kein Terminal, kein Code-Schreiben.\n\n"
             "• *Excel* hochladen, Frage stellen, rechnen lassen, visualisieren\n\n"
             "**Datenschutz:** Echte Personaldaten gehören nicht in öffentliche Tools. Dafür die *Academic AI* der VetMed nutzen. Heute arbeiten wir mit **synthetischen** Daten.",
     "notes": "Anders als die Claude-Code-Hinfuehrung laeuft der Hauptteil ueber ein niederschwelliges Werkzeug. Eine Excel-Datei wird in ChatGPT oder Claude hochgeladen, der Code-Interpreter rechnet. Fuer echte Personaldaten ist die Academic AI der VetMed der datenschutzkonforme Weg. Die heutige Demo nutzt bewusst synthetische Daten."},

    {"type": "handson",
     "title": "Schritt 1: Überblick verschaffen",
     "body": "1. *Excel*-Datei hochladen (Blatt \"Personal\", 150 Zeilen)\n"
             "2. Das Modell den Aufbau beschreiben lassen\n"
             "3. Nach **Datenqualitätsproblemen** fragen\n\n"
             "Ein gutes Modell meldet schon hier: gemischte Zahlenformate, fehlende Werte.",
     "prompt": "Ich habe eine Excel-Datei mit\nPersonaldaten hochgeladen (Blatt\n\"Personal\"). Verschaff dir einen\nÜberblick: Zeilen, Spalten, und\nwelche Datenqualitätsprobleme\nfallen dir auf? Noch keine\nAuswertung."},

    {"type": "content_with_image",
     "title": "Schritt 2: Zählen, und die Falle",
     "body": "Frage: Personen je Organisationseinheit.\n\n"
             "Das Modell listet **zwei** Kleintierkliniken getrennt: \"Universitätsklinik für Kleintiere\" (12) und \"Univ.-Klinik f. Kleintiere\" (8).\n\n"
             "**Dieselbe Klinik, zwei Schreibweisen.** Korrekt zusammengeführt: **20**.\n\n"
             "Die Zahl sieht sauber aus und ist trotzdem falsch.",
     "placeholder": "admin_falle_schreibvariante.png\nBalken: 8 + 12 gespalten vs. 20 korrekt",
     "notes": "Genau dieselbe Klasse Fehler wie die Holm-Geschichte, nur im Verwaltungsfeld. Das Modell zaehlt zwei Schreibweisen derselben Klinik als getrennte Einheiten. Die korrekte Zahl ist 20, nicht 12. Die Fachperson erkennt, dass zwei Labels eine Einheit sind, das Modell nicht zuverlaessig."},

    {"type": "content",
     "title": "Schritt 3: Rechnen lassen, nicht raten",
     "body": "Die Summe der Vollzeitäquivalente (VZÄ):\n\n"
             "• **Aus dem Bauch geschätzt**: das Modell nennt irgendeine plausible Zahl, unzuverlässig\n"
             "• **Mit *Code-Interpreter***: exakt **110,00**, aber nur, wenn die Komma-Werte (\"0,75\") sauber bereinigt werden\n\n"
             "Reine Textantwort bei Zahlen ist riskant. **Code-Ausführung erzwingen** und die Aufbereitung prüfen.",
     "notes": "Der Kontrast zeigt, warum Code-Ausfuehrung zaehlt. Eine reine Sprachmodell-Schaetzung von Zahlen ist unzuverlaessig. Der Code-Interpreter liefert exakt 110,00 Vollzeitaequivalente, aber nur wenn die als Text gespeicherten Komma-Werte vorher bereinigt werden. Verlaesslichkeit haengt an Code-Ausfuehrung und sauberer Aufbereitung zugleich."},

    {"type": "content_with_image",
     "title": "Schritt 4: Visualisieren",
     "body": "Geschlechterverteilung, gesamt und je Funktionsgruppe:\n\n"
             "• gesamt 69 w, 80 m, 1 d, **Frauenanteil 46 %**\n"
             "• je Funktionsgruppe direkt als Balkendiagramm\n\n"
             "**Verifikation:** Quersumme prüfen. 69 + 80 + 1 = 150 = Zeilenzahl. Stimmt sie nicht, hat das Modell stillschweigend Zeilen verloren.",
     "placeholder": "admin_geschlecht.png\nGeschlecht gesamt und je Funktionsgruppe"},

    {"type": "content",
     "title": "Schritt 5: Für den Bericht aufbereiten",
     "body": "Eine Tabelle je Organisationseinheit mit Kopfzahl und VZÄ, dazu drei Sätze Fließtext für die Entscheidungsvorlage.\n\n"
             "**Verifikation:**\n"
             "• Gesamt-Kopfzahl muss 150 sein, Gesamt-VZÄ 110,00\n"
             "• Der Text darf nur behaupten, was die Tabelle zeigt\n"
             "• Kein \"deutlicher Anstieg\" ohne Zeitreihe",
     "notes": "Am Ende steht ein berichtsfertiges Ergebnis. Eine Tabelle je Organisationseinheit mit Kopfzahl und Vollzeitaequivalenten plus ein kurzer Fliesstext fuer die Entscheidungsvorlage. Die Verifikation prueft, ob die Gesamtsummen stimmen und ob der Text nur behauptet, was die Tabelle belegt."},

    {"type": "content",
     "title": "Die Grenzen kennen",
     "body": "• **Rechenfehler ohne Code**: Textantworten zu Zahlen sind unzuverlässig\n"
             "• **Halluzination bei Zahlen**: plausibel, aber falsch\n"
             "• **Domänenfehler**: zwei Schreibweisen als eine Einheit erkennt das Modell nicht zuverlässig\n"
             "• **Größenlimits**: sehr große Dateien werden gekürzt oder gesampelt\n"
             "• **Datenschutz**: keine echten Personaldaten in öffentliche Tools"},

    {"type": "content",
     "title": "Verifikations-Checkliste Verwaltung",
     "body": "1. Stimmt die **Quersumme** mit der Zeilenzahl überein?\n"
             "2. Wurde mit **Code** gerechnet, nicht geschätzt?\n"
             "3. Sind Kategorien **konsolidiert** (Schreibvarianten, Tippfehler, Einheiten)?\n"
             "4. Behauptet der **Text** nur, was die Tabelle zeigt?\n"
             "5. Bei echten Daten: **datenschutzkonformes** Werkzeug?",
     "notes": "Die Checkliste fasst die Verifikationsschritte zusammen, die im Verwaltungsalltag tragen. Quersumme gegen Zeilenzahl, Rechnen mit Code statt Schaetzung, konsolidierte Kategorien, Deckung von Text und Tabelle, und bei echten Daten ein datenschutzkonformes Werkzeug."},

    # ============================================ TEIL 3 Live-Demo + Einordnung
    {"type": "section", "title": "Teil 3",
     "subtitle": "Live-Demo Claude Code und Einordnung"},

    # --------------------------------------- Live-Demo (Delta 10.06.2026)
    {"_delta": True,
     "type": "content",
     "title": "Live: derselbe Fall in *Claude Code*",
     "body": "Gleiche Daten, gleiche Fragen wie eben. Ein Unterschied:\n\n"
             "• Teil 2: **fünf Fragen** nacheinander, nach jeder geprüft\n"
             "• Jetzt: **ein Arbeitsauftrag**, formuliert wie an eine Kollegin\n\n"
             "Das Werkzeug plant die Schritte selbst, schreibt den Code und führt ihn aus. Am Ende steht ein **HTML-Report**, der beim nächsten Quartal mit neuen Daten erneut laufen kann.",
     "notes": "Der dritte Teil zeigt denselben Verwaltungsfall in Claude Code. In Teil 2 wurden fuenf Fragen nacheinander gestellt und nach jeder geprueft. Jetzt wird der gesamte Arbeitsauftrag auf einmal formuliert, so wie man ihn einer Kollegin geben wuerde. Das Werkzeug plant die Schritte selbst, schreibt ein Python-Skript und erzeugt einen HTML-Report, der beim naechsten Quartal mit neuen Daten erneut laufen kann."},

    {"_delta": True,
     "type": "handson",
     "title": "Der eine Auftrag",
     "body": "Worauf Sie live achten können:\n\n"
             "1. **Planung**: das Modell legt sich einen Arbeitsplan an\n"
             "2. **Permissions**: vor der Skript-Ausführung kommt die Nachfrage\n"
             "3. **Code statt Schätzen**: es schreibt und prüft *Python*\n"
             "4. Findet es die **Schreibvarianten-Falle** selbst?",
     "prompt": "Lies VetMed_Verwaltung_Demodaten.xlsx\n(Blatt \"Personal\") und erstelle die\nPersonalauswertung für die\nWissensbilanz: Kopfzahl und VZÄ je\nOrganisationseinheit, Geschlechter-\nverteilung gesamt und je Funktions-\ngruppe. Prüfe und bereinige die\nDatenqualität, dokumentiere jede\nBereinigung. Erzeuge einen HTML-\nReport mit Tabellen und Diagrammen.\nVerifiziere die Quersummen gegen\ndie Zeilenzahl.",
     "notes": "Der Auftrag steht zum Mitlesen auf der Folie und wird live in Claude Code ausgefuehrt. Sichtbar werden der Arbeitsplan des Modells, die Permission-Nachfrage vor der Skript-Ausfuehrung und die Code-Ausfuehrung selbst. Offen bleibt, ob das Modell die zwei Schreibweisen der Kleintierklinik ohne Hinweis zusammenfuehrt. Falls nicht, erfolgt der Eingriff live."},

    {"_delta": True,
     "type": "content",
     "title": "Verifikation: Sie kennen die Zahlen",
     "body": "Die Sollwerte aus Teil 2 sind der Prüfanker:\n\n"
             "• **150** Personen, **110,00** VZÄ\n"
             "• Kleintierklinik **20** (nicht 12 + 8)\n"
             "• Frauenanteil **46 %**\n\n"
             "Übersieht das Modell die Schreibvarianten, greifen wir ein. Genau das ist die Rolle des *Critical Expert*.\n\n"
             "**Mehr Autonomie heißt mehr Verifikation, nicht weniger.** Vertiefung: *VetMed Winter School*.",
     "notes": "Die Teilnehmenden kennen die Sollwerte aus Teil 2 und pruefen das Ergebnis selbst. 150 Personen, 110 Vollzeitaequivalente, 20 Personen in der konsolidierten Kleintierklinik und 46 Prozent Frauenanteil. Uebersieht das Modell die Schreibvarianten, wird live eingegriffen. Die Verifikations-Checkliste gilt fuer beide Werkzeuge unveraendert. Je autonomer das Werkzeug arbeitet, desto wichtiger wird die Pruefung. Die VetMed Winter School vertieft diesen Arbeitsmodus."},

    {"type": "content",
     "title": "Welches Werkzeug wann?",
     "body": "• **Schnell und niederschwellig**: *ChatGPT* oder *Claude* mit Datei-Upload, für einmalige Auswertungen\n"
             "• **Datenschutzkonform**: *Academic AI* der VetMed, für echte Personal- und Verwaltungsdaten\n"
             "• **Mächtig und wiederholbar**: *Claude Code*, für wiederkehrende oder komplexe Auswertungen\n\n"
             "Die Frage ist nicht \"welches Tool\", sondern \"welche Aufgabe\".",
     "notes": "Die drei Werkzeuge decken unterschiedliche Beduerfnisse ab. Datei-Upload fuer schnelle Einzelauswertungen, Academic AI fuer echte Verwaltungsdaten, Claude Code fuer wiederkehrende oder komplexe Aufgaben. Der Ausgangspunkt ist immer die Aufgabe, nicht das Werkzeug."},

    {"type": "discussion",
     "question": "Welche wiederkehrende Auswertung aus Ihrem Arbeitsalltag würden Sie als Erstes mit einem *LLM* ausprobieren, und welche Datenqualitätsfalle erwarten Sie dabei?"},

    {"type": "content",
     "title": "Zusammenfassung",
     "body": "Die durchgehende Linie:\n\n"
             "• 2023: Kompetenz war **Prompt Engineering** (Persona, *Chain-of-Thought*, Tricks)\n"
             "• Heute: Kompetenz ist **Context Engineering** (Aufgabe, Prozess, Daten präzise bereitstellen)\n"
             "• Konstant: die **fachliche Validierung**\n\n"
             "Das Werkzeug rechnet. **Der Mensch verantwortet.**",
     "notes": "Die Zusammenfassung spannt den Bogen ueber beide Teile. Frueher lag die Kompetenz im Prompt Engineering, heute im Context Engineering. Konstant bleibt die fachliche Validierung. Das Werkzeug rechnet, der Mensch verantwortet das Ergebnis."},
]

# ---------------------------------------------------------------------------
# Emit 01_ws5.gs
# ---------------------------------------------------------------------------
KEY_ORDER = ["type", "title", "subtitle", "meta", "question",
             "body", "prompt", "placeholder", "source", "small", "highlight", "notes"]


def emit_item(item):
    parts = []
    for k in KEY_ORDER:
        if k in item:
            v = item[k]
            if isinstance(v, bool):
                parts.append("%s: %s" % (k, "true" if v else "false"))
            else:
                parts.append("%s: %s" % (k, json.dumps(v, ensure_ascii=True)))
    return "    { " + ", ".join(parts) + " }"


header = (
    "\n"
    "// ============================================================\n"
    "// WS5 — Datenanalyse Verwaltung (VetMedAI, 11.06.2026)\n"
    "// Generiert aus build_content.py — nicht von Hand editieren.\n"
    "// ============================================================\n\n"
    "function getWs5Content() {\n"
    "  return [\n"
)
# escape the non-ascii in the header comment too
header = header.encode("ascii", "backslashreplace").decode("ascii").replace("\\x", "\\u00")

body = ",\n\n".join(emit_item(s) for s in slides)
footer = "\n  ];\n}\n"

out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "01_ws5.gs")
with open(out_path, "w", encoding="ascii") as f:
    f.write(header + body + footer)

print("wrote", out_path)
print("slides:", len(slides))

# ---------------------------------------------------------------------------
# Emit 02_ws5_delta.gs — nur die mit _delta markierten Folien, fuer
# generateAppend() auf das bestehende Deck (manuell eingefuegte Bilder
# bleiben erhalten). Reihenfolge: erst Opener, dann Teil-3-Live-Demo.
# ---------------------------------------------------------------------------
delta = [s for s in slides if s.get("_delta")]

delta_header = (
    "\n"
    "// ============================================================\n"
    "// WS5 Delta — Fable-5-Opener + Teil-3-Live-Demo (10.06.2026)\n"
    "// Generiert aus build_content.py — nicht von Hand editieren.\n"
    "// Fuer generateAppend(): haengt hinten an, danach manuell\n"
    "// einsortieren (Opener nach Folie 1, Live-Demo nach Section Teil 3).\n"
    "// ============================================================\n\n"
    "function getWs5DeltaContent() {\n"
    "  return [\n"
)
delta_header = delta_header.encode("ascii", "backslashreplace").decode("ascii").replace("\\x", "\\u00")

delta_out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "02_ws5_delta.gs")
with open(delta_out, "w", encoding="ascii") as f:
    f.write(delta_header + ",\n\n".join(emit_item(s) for s in delta) + footer)

print("wrote", delta_out)
print("delta slides:", len(delta))
