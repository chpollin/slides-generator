// PROMPTOTYPING HANDS-ON v2 — ca. 22 Folien
// ============================================================
// Struktur: keine Schritt-Nummern in Titeln, Flow-Diagramm vorweg,
// journal.md frueh, Datenschutz + synthetische Daten direkt an data.md,
// Fehlerdiagnose und MS2-Uebergang neu, Pitch als discussion am Ende.

function getHandsOnContent() {
  return [

    // 1 — Titel
    {
      type: 'title',
      title: 'Promptotyping\nHands-On',
      subtitle: 'Vom eigenen Datensatz zum Prototyp',
      meta: 'Workshop Museumsbund \u00d6sterreich \u00b7 24. April 2026 \u00b7 Kurssaal NHM Wien\nPromptotyping-Workshop, Teil 2'
    },

    // 2 — Vor dem Start
    {
      type: 'content',
      title: 'Vor dem Start',
      body: 'Modell **Claude Sonnet 4.6**. Opus w\u00fcrde das Usage-Limit im Workshop schnell sprengen, Sonnet 4.6 reicht f\u00fcr Prototyping-Aufgaben gut aus. In **Claude Code** wechseln mit dem Kommando `/model`.\n\n**So arbeiten wir.** Ich komme aktiv zu jedem Laptop. Fragen sofort stellen, auch die vermeintlich dummen. Fehlermeldungen in der Browser-Konsole sind Kontextinformation und kein Problem.'
    },

    // 3 — Am Ende der Pitch
    {
      type: 'content',
      title: 'Am Ende euer Pitch',
      body: 'Optional, aber erw\u00fcnscht. Circa 3 Minuten pro Person.\n\nDrei Leitfragen, die vorher im Kopf sein sollten.\n\n1. Was war die Idee, und was ist das Ergebnis geworden?\n2. Wo gab es Probleme, wo war die Arbeit bereichernd oder \u00fcberraschend?\n3. Welche Limitationen, Herausforderungen oder weiteren M\u00f6glichkeiten sind sichtbar?\n\nNicht fertig zu werden ist okay. Ein **MVP** zu erreichen ist ein valider Workshop-Ausgang.'
    },

    // 4 — One-Pager
    {
      type: 'content',
      title: 'Der One-Pager als Ausgangspunkt',
      body: 'Jeder hat einen **One-Pager** mitgebracht oder erstellt ihn jetzt in zehn Minuten.\n\n*Was willst du umsetzen? Das Projekt, die Idee, das Vorhaben, die Forschungsfrage.*\n\nEine Seite, Stichpunkte sind okay. Das **LLM** kann nicht wissen, was nicht formuliert wird.'
    },

    // 5 — Exercise: One-Pager schreiben (fuer alle ohne)
    {
      type: 'exercise',
      title: 'One-Pager in zehn Minuten',
      body: 'Wer noch keinen One-Pager hat, schreibt ihn jetzt.\n\n**Struktur als Merkliste.**\n\n\u2022 Ziel. Eine Zeile. Was soll am Ende stehen.\n\u2022 Leitfrage oder Forschungsfrage. Zwei bis drei S\u00e4tze.\n\u2022 Daten. Welche, in welchem Format, wie viele Records.\n\u2022 Zielgruppe. Wer nutzt den Prototypen.\n\u2022 Nicht-Ziele. Was explizit nicht gebaut wird.\n\nStichpunkte reichen. Perfektion nicht n\u00f6tig, das Dokument wird mit Claude Code gleich verfeinert.'
    },

    // 6 — Arbeitsstruktur (Ordnerbaum)
    {
      type: 'content',
      title: 'Arbeitsstruktur — drei Dokumente, zwei Ordner',
      small: true,
      body: '```\nworkshop-projekt/\n\u251c\u2500\u2500 knowledge/\n\u2502   \u251c\u2500\u2500 project.md      <- die Idee\n\u2502   \u251c\u2500\u2500 data.md         <- Wissen \u00fcber die Daten\n\u2502   \u251c\u2500\u2500 plan.md         <- Milestones und Tests\n\u2502   \u2514\u2500\u2500 journal.md      <- Arbeitstagebuch\n\u251c\u2500\u2500 data/\n\u2502   \u2514\u2500\u2500 [eure Rohdaten oder synthetische Daten]\n\u2514\u2500\u2500 [Code kommt sp\u00e4ter]\n```\n\n**Claude Code** hat Zugriff auf diesen Ordner. Alles in `knowledge/` ist Kontext f\u00fcr alle weiteren Prompts.'
    },

    // 7 — Flow-Diagramm VORWEG
    {
      type: 'content',
      title: 'Der Arbeitsfluss im \u00dcberblick',
      small: true,
      body: '```\n  One-Pager            (mitgebracht oder jetzt geschrieben)\n       \u2193\n  project.md           (Idee strukturieren)\n       \u2193\n  data.md              (Daten verstehen, kompakt)\n       \u2193\n  plan.md              (Milestones, Tests, Logging)\n       \u2193\n  Milestone 1          (Daten laden und anzeigen, MVP)\n       \u2193\n  Iteration            (Konsole, Screenshots, Ideen)\n       \u2193\n  Refactoring          (Code und Wissensdokumente)\n       \u2193\n  Pitch                (3 Minuten, 3 Leitfragen)\n```\n\n**Parallel dazu laufend** `journal.md`. Eine Zeile pro Arbeitsschritt.\n\nMilestone 1 reicht als Workshop-Ergebnis.'
    },

    // 8 — project.md erzeugen (handson)
    {
      type: 'handson',
      title: '`project.md` erzeugen',
      body: 'Die Projektidee in strukturiertes Markdown \u00fcberf\u00fchren.\n\nOne-Pager direkt in den Prompt einf\u00fcgen.\n\nFaustregel. `project.md` passt auf eine Bildschirmseite.',
      prompt: 'Hier ist mein One-Pager zum Projekt.\n---\n[One-Pager einfuegen]\n---\nErzeuge daraus knowledge/project.md mit\ndieser Struktur.\n- Ziel. Ein Satz.\n- Forschungsfrage oder Leitfrage.\n  Zwei bis drei Saetze.\n- Zielgruppe. Wer nutzt das Ergebnis.\n- Erwarteter Output. Was soll am Ende\n  konkret existieren.\n- Nicht-Ziele. Was explizit nicht\n  gebaut wird.\n\nKompakt, praezise, maximale Information\nbei wenig Tokens.\nFrage nach, wenn etwas unklar oder\nwiderspruechlich ist.'
    },

    // 9 — data.md erklaert
    {
      type: 'content',
      title: '`data.md` ist das wichtigste Dokument',
      body: '`data.md` ist das Wissen \u00fcber die eigenen Daten. Struktur ist zweitrangig, Markdown reicht. Was z\u00e4hlt ist **maximal konkret, maximal pr\u00e4zise, informationsdicht**.\n\nInhalt typischerweise\n\n\u2022 Quelle, Format, Lizenz, Anzahl Records\n\u2022 Felder mit Datentypen\n\u2022 Drei Beispiel-Records\n\u2022 Besonderheiten wie L\u00fccken, Inkonsistenzen, Kodierungen'
    },

    // 10 — Datenschutz + Synthetische Daten (ERWEITERT)
    {
      type: 'content',
      title: 'Datenschutz, Rechte, Daten hergeben',
      small: true,
      body: 'Was hochgeladen wird, verl\u00e4sst den eigenen Rechner. Drei Fragen kl\u00e4ren.\n\n\u2022 Darf ich diese Daten bei einem US-Anbieter verarbeiten? DSGVO, Nutzungsvereinbarung.\n\u2022 Sind Rechte Dritter betroffen? Lizenz der Quelle, Urheberrecht am Material.\n\u2022 Will ich diese Daten dem Anbieter zum Training oder f\u00fcr sp\u00e4tere Nutzung \u00fcberlassen? Keine Konsultations-AGB akzeptiert das pauschal aus.\n\n**Eleganter Ausweg: synthetische Daten.** `data.md` l\u00e4sst sich mit **Fake-Daten** oder einer reinen **Strukturbeschreibung** bauen. Der Code ist deterministisch und wird dann **lokal** gegen die echten Daten ausgef\u00fchrt. Das LLM sieht nur die Struktur, nicht die Inhalte.\n\nIm Zweifel anonymisieren, Teilmengen verwenden, keine sensiblen PDFs hochladen.'
    },

    // 11 — Drei Wege zu data.md (handson)
    {
      type: 'handson',
      title: 'Drei Wege zu einem guten `data.md`',
      body: '**Kleine Datens\u00e4tze** (wenige MB). Direkt in den Arbeitsordner legen, Claude Code liest sie.\n\n**Mittlere Datens\u00e4tze.** Python-Script erzeugen lassen, das die Struktur abbildet (Prompt rechts).\n\n**Grosse Datens\u00e4tze.** *Gemini* mit gr\u00f6sserem Context Window oder *ChatGPT Pro* nutzen, Ergebnis als Markdown in `data.md` \u00fcbernehmen.',
      prompt: 'Analysiere die Struktur von\ndata/[meine-datei.json].\nSchreibe ein Python-Script\ndata/inspect.py, das ausgibt.\n- Anzahl Records\n- Feldnamen mit Datentypen\n- Abdeckung pro Feld in Prozent\n- Drei repraesentative\n  Beispiel-Records\n- Auffaelligkeiten, leere Felder,\n  Encoding, Inkonsistenzen\nFuehre das Script aus.\nSchreibe das Ergebnis kompakt\nals knowledge/data.md.\nStrukturiere in. Quelle, Format,\nLizenz, Felder, Beispiele,\nBesonderheiten.'
    },

    // 12 — journal.md (handson, paralleler Begleitschritt)
    {
      type: 'handson',
      title: '`journal.md` als paralleler Begleiter',
      body: 'Eine Zeile pro Arbeitsschritt. Wer jetzt arbeitet, weiss in zwei Stunden nicht mehr, was vor zwei Stunden gemacht wurde.\n\nDas Journal ist **Kontextinformation** f\u00fcr einen selbst und f\u00fcr das LLM. Es wird w\u00e4hrend der Arbeit gepflegt, nicht am Ende.',
      prompt: 'Lege knowledge/journal.md an.\nFormat pro Eintrag.\n\n## YYYY-MM-DD\n- HH:MM Was getan\n- HH:MM Entscheidung. X weil Y\n- HH:MM Fehler. Z, Fix durch W\n- HH:MM Naechster Schritt\n\nTrage den ersten Eintrag ein\nmit Zeitstempel jetzt und einer\nZeile, was wir gerade begonnen\nhaben.\nNach jedem groesseren Schritt\nerinnere mich, eine Zeile zu\nergaenzen.'
    },

    // 13 — Plan fuer den Prototypen (handson)
    {
      type: 'handson',
      title: 'Plan f\u00fcr den Prototypen',
      body: 'Ziel ist ein statischer Prototyp mit **Vanilla HTML, CSS, JavaScript**. Theoretisch *GitHub-Pages*-f\u00e4hig. Keine Build-Tools, keine Dependencies.\n\nClaude Code soll den Plan entwickeln, bevor eine Zeile Code geschrieben wird.',
      prompt: 'Lies knowledge/project.md und\nknowledge/data.md.\nErstelle knowledge/plan.md fuer\neinen statischen Prototypen.\n- Tech-Stack. Vanilla HTML,\n  CSS, JavaScript. Keine Build-\n  Tools, GitHub-Pages-faehig.\n- Arbeite test-getrieben.\n  Definiere pro Milestone Tests\n  in der Browser-Konsole und in\n  einer Test-Datei.\n- Plane kompaktes Logging mit\n  sprechenden Prefixes.\n- Strukturiere in zwei bis drei\n  Milestones mit messbaren\n  Exit-Kriterien.\n\nMilestone 1 ist der MVP.\nDaten laden korrekt und werden\nangezeigt. Nicht mehr.\nSchreibe noch keinen Code.\nNur den Plan.'
    },

    // 14 — Warum MVP, warum Tests
    {
      type: 'content',
      title: 'Warum MVP zuerst, warum Tests vorher',
      body: '**MVP zuerst.** Wenn Daten nicht sauber laden, ist alles andere Kosmetik. Milestone 1 heisst ich sehe meine Daten im Browser.\n\n**Tests vorher.** Das LLM produziert Code, der aussehen kann, als w\u00fcrde er funktionieren, aber Fehler versteckt. Tests als Vertrag vorab zwingen zu Klarheit.\n\n**Logging.** Kompakt, strukturiert, sprechend. Die **Browser-Konsole** ist die wichtigste Diagnosequelle.'
    },

    // 15 — Exercise: MS1 in einem Satz definieren
    {
      type: 'exercise',
      title: 'Milestone 1 in einem Satz',
      body: 'Bevor Claude Code den Plan erstellt, formuliert ihr selbst.\n\n*Was soll der Browser am Ende der n\u00e4chsten 30 Minuten zeigen?*\n\nEin Satz, konkret und pr\u00fcfbar.\n\nBeispiele.\n\u2022 "Eine Liste aller 1.200 Inventarnummern mit Titel und Jahr, aus inventar.json geladen."\n\u2022 "Eine Karte mit Markern f\u00fcr alle 48 Ausstellungsorte aus orte.csv."\n\u2022 "Eine Tabelle aus bestand.xlsx mit Filter nach Objekttyp."\n\nDieser Satz wandert in den n\u00e4chsten Prompt.'
    },

    // 16 — Milestone 1 implementieren (handson)
    {
      type: 'handson',
      title: 'Milestone 1 implementieren',
      body: 'Nach dem Plan Milestone f\u00fcr Milestone umsetzen lassen.\n\nNach der Umsetzung **Live Server** starten, im Browser \u00f6ffnen, Konsole pr\u00fcfen.',
      prompt: 'Implementiere Milestone 1\nnach knowledge/plan.md.\n- Beginne mit den Tests.\n  Tests schreiben, erst dann\n  Code.\n- Logge kompakt mit Prefix\n  [MS1] in die Browser-Konsole.\n- Stoppe nach Milestone 1.\n  Kein Vorgriff auf MS2.\n- Schreibe nach Abschluss eine\n  Zeile in knowledge/journal.md.\n\nIch pruefe im Browser, ob die\nDaten korrekt laden, bevor\nwir weitermachen.'
    },

    // 17 — Fehlerdiagnose (NEU, handson)
    {
      type: 'handson',
      title: 'Wenn Milestone 1 nicht l\u00e4uft',
      body: 'Bevor der n\u00e4chste Code-Patch startet, Diagnose anfordern. Das LLM neigt sonst zu wildem Raten.\n\nBrowser-Konsole kopieren, Fehlermeldung sichtbar machen, dann fragen.',
      prompt: 'Milestone 1 laeuft nicht.\nKonsolen-Output unten.\n---\n[Konsolen-Output einfuegen]\n---\nDiagnose.\n- Nenne die wahrscheinlichste\n  Ursache mit Begruendung.\n- Schlage einen minimalen Fix\n  vor, bevor du ihn umsetzt.\n- Wenn mehrere Hypothesen\n  moeglich sind, erklaere wie\n  wir sie unterscheiden koennen.\n\nPatche erst, wenn ich die\nDiagnose bestaetigt habe.'
    },

    // 18 — Iteration mit drei Eingabekanaelen (handson)
    {
      type: 'handson',
      title: 'Iterieren mit drei Eingabekan\u00e4len',
      body: '**Konsolen-Output** (Daten, Fehler) per Copy-paste in den Prompt.\n\n**Screenshots** der Web-UI. Claude kann Bilder analysieren.\n\n**Eigene Meinung oder Idee als Text.** Mir gef\u00e4llt X nicht, weil ist ein valider Prompt.',
      prompt: 'Screenshots und Konsolen-Output\nvom aktuellen Stand unten.\nAnalysiere.\n- Was laeuft gut.\n- Was bricht. Konsolenfehler\n  pro Zeile nennen.\n- Wie koennen wir das Logging\n  kompakter und sprechender\n  machen.\n\nSchlage konkrete Aenderungen\nvor, bevor du sie umsetzt.'
    },

    // 19 — Experten-Personas (handson, Klawiter-Pattern)
    {
      type: 'handson',
      title: 'Experten-Personas als Denkwerkzeug',
      body: 'Personas schr\u00e4nken den Antwortraum sinnvoll ein. Statt generischer Vorschl\u00e4ge bekommt man zielgerichtete Kritik aus einer konkreten Sicht.',
      prompt: 'Wer waere die beste Experten-\nPersona oder -Gruppe, um uns\nkritisch zu reviewen.\n- Schlage drei Personas vor\n  mit Hintergrund, Perspektive\n  und typischer Kritik.\n- Ich waehle eine aus.\n- Du nimmst dann diese Rolle\n  an und gehst die letzten\n  Aenderungen durch, als waerest\n  du diese Person.\n- Nenne die drei wichtigsten\n  Verbesserungsvorschlaege aus\n  Sicht dieser Persona.'
    },

    // 20 — Refactoring Code (handson)
    {
      type: 'handson',
      title: 'Refactoring — Code pr\u00fcfen',
      body: 'Nach der ersten Iteration lohnt ein strukturierter Blick auf den Code. Claude soll vorschlagen, nicht sofort \u00e4ndern.',
      prompt: 'Pruefe den Code im Hinblick auf.\n- Namensgebung. Sprechend und\n  konsistent.\n- Redundanzen und tote Pfade.\n- Lesbarkeit. Wo wuerde ein\n  fremder Entwickler stolpern.\n- Logging-Qualitaet.\n\nSchlage konkrete Aenderungen\nals Liste vor.\nSetze sie erst um, nachdem\nich sie freigegeben habe.'
    },

    // 21 — Refactoring Wissensdokumente (handson)
    {
      type: 'handson',
      title: 'Refactoring — Wissensdokumente pflegen',
      body: 'Der `knowledge/`-Ordner ist kein Archiv, sondern **lebendiger Kontext**. Erkenntnisse aus den Iterationen fliessen zur\u00fcck.\n\nHistorie bleibt im `journal.md` und in *Git*.',
      prompt: 'Aktualisiere knowledge/project.md\nund knowledge/data.md auf Basis\nder letzten Arbeitsphasen.\n- Neue Erkenntnisse zu Daten-\n  struktur und Projektzielen\n  einpflegen.\n- Ueberholte Passagen kuerzen\n  oder loeschen.\n- Dokumente kompakt halten.\n  Maximal eine Bildschirmseite.\n\nHistorie bleibt in\nknowledge/journal.md, nicht\nin project.md oder data.md.'
    },

    // 22 — Uebergang Milestone 2 (NEU, handson)
    {
      type: 'handson',
      title: '\u00dcbergang zu Milestone 2',
      body: 'Wer MS1 stabil hat und weitergehen will, aktualisiert zuerst den Plan.\n\nDas verhindert, dass MS2 auf falschen Annahmen aus der urspr\u00fcnglichen Planung aufbaut.',
      prompt: 'Milestone 1 laeuft.\nBevor wir MS2 starten.\n- Was im Plan hat sich als\n  falsch oder unvollstaendig\n  erwiesen.\n- Welche Annahmen sind\n  bestaetigt, welche verworfen.\n- Aktualisiere knowledge/plan.md\n  fuer MS2 entsprechend.\n\nDann starten wir MS2 nach dem\naktualisierten Plan.\nGleicher Rhythmus wie MS1.\nTests zuerst, Logging, stoppen\nnach MS2.'
    },

    // 23 — Pitch-Leitfrage (discussion)
    {
      type: 'discussion',
      question: 'Was war das \u00dcberraschendste an deinem Prototypen, und was bleibt offen?'
    }
  ];
}
