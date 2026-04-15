// ============================================================
// SuGW Frontend — Datenbasis und Provenienz (12 Folien)
// ============================================================

function getProvenienzContent() {
  return [
    { type: 'title',
      title: 'SuGW Frontend\nDatenbasis und Provenienz',
      subtitle: 'Vorbesprechung · 17. April 2026',
      meta: 'mit Karin Gruenwald und Christina Lutter\nStadt und Gemeinschaft Wien · A-Nr. 16\u200A/\u200A26',
      notes: 'Vorbesprechung zu dritt vor der Arbeitssitzung am 23. und 24. April mit Daniel, Max und Viktor. Rahmen von etwa einer Stunde, online. Live-Demo im Browser ist der zentrale Teil, die Folien rahmen das Gespraech.' },

    { type: 'content',
      title: 'Worum es heute geht',
      body: 'Nicht \u00fcber **Design** oder **Funktionsumfang** sprechen, sondern dar\u00fcber, wie jede Zahl im Interface **zustande kommt**.\n\nGemeinsame Sprache aufbauen f\u00fcr die **Arbeitssitzung am 23.\u200A/\u200A24.04.** mit Daniel, Max und Viktor.\n\nOffene Entscheidungen zu Datengruppierungen **sichtbar machen** und wenn m\u00f6glich heute kl\u00e4ren.',
      notes: 'Die Mail von Karin und Christina hat das Anliegen klar formuliert. Beim Check von Zahlen im alten System sind Nachvollziehbarkeits-Probleme aufgefallen. Diese Stunde stellt Provenienz ins Zentrum, nicht Oberflaechen-Feedback. Das naechste Meeting mit dem erweiterten Team soll auf dieser Basis laufen. Wenn Q2, Q3 oder Q4 heute schon entschieden werden koennen, sparen wir Arbeitszyklen.' },

    { type: 'content',
      title: 'Das neue Frontend auf einen Blick',
      body: '**Editionsansicht** \u00b7 5.715 Dokumente, Text-Bild-Synopse, farbcodierte Annotation.\n\n**Register** \u00b7 Personen, Organisationen, Orte mit R\u00fcckverweisen in alle Nennungen.\n\n**Vier Explorer** \u00b7 Rollen, Beziehungen, Transaktionen, Orte, jeweils mit *Drill-Down*.\n\n**Statistik-Dashboard** \u00b7 Coverage, Top-10-Listen, Dekaden-Histogramm.\n\nAlles statisch auf **GitHub Pages**, keine Datenbank, keine Serverwartung.',
      notes: 'Kurzer Ueberblick als Orientierung. Vier inhaltliche Bausteine plus die Editionsansicht selbst. Der Verzicht auf eine serverseitige Datenbank ist eine bewusste Entscheidung fuer Nachhaltigkeit. Das alte PHP/MariaDB-System wird abgeloest, die Daten bleiben in TEI-XML, die Auswertung passiert deterministisch in der Pipeline.' },

    { type: 'content',
      title: 'Datenfluss \u2014 von der TEI-Quelle bis zum Chart',
      body: '**TEI-XML** \u2192 **Python-Pipeline** \u2192 **CSV** \u2192 **Aggregator** \u2192 **JSON** \u2192 **Chart**\n\n**TEI-XML** \u00b7 Quellen und Register, die editoriale Grundlage.\n**Python-Pipeline** \u00b7 14 Transformer und 2 Validatoren, Code im Repo.\n**21 CSV-Dateien** \u00b7 203.475 Datenzeilen, in pipeline/output.\n**Aggregator** \u00b7 edition/aggregator.py verdichtet CSV-Reihen zu Ansichten.\n**6 JSON-Dateien** \u00b7 timeline, epic\u2011a, epic\u2011b, epic\u2011c, epic\u2011d, quality.\n**Chart** \u00b7 client-seitig, im Browser gerendert.\n\nDrei unabh\u00e4ngige Pfade teilen sich die Quellen, aber nicht den Code: *CSV-Export*, *Digitale Edition*, *Validation*.',
      notes: 'Dies ist die wichtigste Folie der Stunde. Jeder Schritt ist ein Ort, an dem Information geformt wird, und jeder Schritt ist nachvollziehbar. Die Pipeline ist versioniert im Git, die Tests laufen automatisiert, der Aggregator ist Python-Code den man lesen kann. Wenn eine Zahl im Chart zweifelhaft wirkt, ist sie bis zur TEI-Annotation zurueckverfolgbar. Die drei parallelen Pfade sind unabhaengig, eine Aenderung an der Edition bricht die CSV nicht und umgekehrt.' },

    { type: 'content',
      title: 'Drei Arten von Schritten',
      body: '**Deterministisch** \u00b7 Pipeline, Renderer, Tests. Dasselbe Ergebnis bei jedem Lauf. Beispiel: TEI \u2192 CSV.\n\n**Normalisiert** \u00b7 Label-Zusammenf\u00fchrung (93 Varianten in Epic\u00a0B), Datums-Parsing, Triggerstring-Matching. Bewusste Vereinfachung. Beispiel: "Kaufmann" und "kaufmann" derselben Kategorie.\n\n**Aggregiert** \u00b7 Z\u00e4hlungen pro Dekade, Top-N-Listen, Heatmap-Zellen. Verdichtete Sicht. Beispiel: "X Transaktionen pro Dekade".\n\nJede Schicht ist **nachvollziehbar**, wenn sie sichtbar gemacht wird.',
      notes: 'Die Unterscheidung zaehlt fuer die Kommunikation mit Karin und Christina. Deterministische Schritte produzieren reproduzierbare Zahlen und brauchen keine Vertrauensdiskussion. Normalisierte Schritte haben bewusst Entscheidungen getroffen, die von aussen nicht immer ersichtlich sind. Aggregierte Zahlen verlieren Detail, gewinnen Uebersicht. Der Vorschlag in Folie 8 geht genau darauf ein, jede dieser Schichten am richtigen Ort sichtbar zu machen.' },

    { type: 'content',
      title: 'Live-Walkthrough \u00b7 eine Zahl bis zur Quelle',
      body: 'Beispiel: **Weibliche Issuer im 15.\u00a0Jahrhundert** (Epic\u00a0A Panel\u00a01).\n\n1. Balken im Chart anklicken \u2192 *Drill-Down* mit Dokumentliste\n2. Dokument anklicken \u2192 Editionsansicht mit Personen-Annotation\n3. Person anklicken \u2192 Registerseite, alle Nennungen dieser Person\n4. **TEI-XML-Download** \u2192 rohe Annotation als Prim\u00e4rquelle\n\nVier Klicks von der Aggregation zur Annotation. Gleich im Browser.',
      notes: 'Jetzt Browser aufmachen und diese Kette wirklich durchlaufen. Wenn Karin oder Christina eine andere Zahl konkret im Kopf haben, die Kette stattdessen fuer diese Zahl zeigen, die Folie ist ein Beispiel. Beim Anklicken jedes Schrittes laut benennen, welcher Layer aus Folie 5 gerade betreten wird: der Chart ist Aggregation, das Drill-Down ist Normalisierung sichtbar gemacht, die Editionsansicht ist deterministisches TEI-Rendering, der Download ist die Originalquelle.' },

    { type: 'content',
      title: 'Was heute schon transparent ist',
      body: '**Quality-Strip** pro Dokument (gr\u00fcn\u200A/\u200Agelb\u200A/\u200Aorange) mit ausklappbaren Findings.\n\n*Drill-Down* auf jeder Aggregation, bis zur Dokumentliste.\n\n**Register-Reverse-Index** \u00b7 von Person zu allen Nennungen im Korpus.\n\n**TEI-XML-Download** auf jeder Dokumentseite.\n\n**Statistik-Dashboard** mit Coverage-Bars pro Collection.',
      notes: 'Die Liste zeigt, dass die Infrastruktur fuer Nachvollziehbarkeit schon steht. Der Quality-Strip gibt pro Dokument eine Einschaetzung zur Annotationstiefe. Der Reverse-Index loest die Kernfrage der alten Abfragemaske, naemlich das Finden aller Nennungen einer Person. Was noch fehlt, ist Sichtbarkeit auf der Aggregationsebene, also neben jedem Chart. Dort setzen die naechsten Folien an.' },

    { type: 'content',
      title: 'Vier Direkt-Ma\u00dfnahmen bis zum Wien-Block',
      body: '1. **Provenance-Panel** neben jedem Chart \u00b7 CSV-Quelle, Aggregation, Normalisierung, aktive Filter, Stand\n2. **Raw-Number-Tooltip** \u00b7 beim Hover nicht nur Label + Zahl, sondern Herleitungspfad\n3. **URL-State-Indicator** \u00b7 aktive Filter als Link teilbar ("diese Zahl finde ich komisch")\n4. **Normalisations-Mapping sichtbar** \u00b7 93 zusammengefasste Label-Varianten in Epic\u00a0B aufklappbar\n\nAufwand 1\u20132 Tage. Keine Neuberechnung, nur Sichtbarkeit.',
      notes: 'Vorschlag fuer konkrete Bauarbeiten bis zum Wien-Block. Der Aggregator weiss bereits, welche Spalte aus welcher CSV welche Zahl erzeugt hat, diese Information wird nur nicht angezeigt. Der URL-State-Indicator loest das praktische Problem aus der Mail: Karin und Christina koennen eine konkrete Chart-Situation per Link zurueckmelden. Der letzte Punkt adressiert die 93 Label-Varianten in Epic B, die heute implizit zusammengefuehrt sind. Alle vier Punkte sind Ergaenzungen, keine Rueckbauten.' },

    { type: 'content', small: true,
      title: 'Drei Entscheidungen, die direkt sichtbar werden',
      body: '**Q2 \u00b7 Kirche \u200A/\u200A Kapelle \u200A/\u200A Kirche_Kapelle** \u2014 mergen oder trennen?\nBlockiert: Spenden-Zeitreihen (V3-T5). *Empfehlung:* fachlich entscheiden, technisch umschaltbar halten.\n\n**Q3 \u00b7 Ecclesiastical \u200A/\u200A Secular Mapping** f\u00fcr 24 Organisationstypen.\nBlockiert: Panel\u00a02 und Panel\u00a03 in Epic\u00a0A (V2-T5\u200A/\u200AT6\u200A/\u200AT7). *Empfehlung:* gemeinsame Liste erstellen, Ambivalenzen als "beides" erlauben.\n\n**Q4 \u00b7 Place-Annotation-Ausweitung** \u2014 eigene Aufgabe oder Prototype-Akzeptanz?\nBlockiert: V5-Erweiterung. *Empfehlung:* Prototype akzeptieren, Ausweitung als separates Paket planen.\n\nJede dieser Entscheidungen \u00e4ndert, was im Chart steht.',
      notes: 'Dies sind die drei offenen Fragen aus knowledge/plan.md, die konkret Chart-Darstellungen bestimmen. Die Empfehlungen sind Diskussionsangebote, nicht Setzungen. Bei Q2 geht es um die Frage, ob Kirchengebaeude verschiedener Widmung zusammengeworfen werden duerfen. Bei Q3 um die schwierige Einordnung mittelalterlicher Organisationen. Bei Q4 darum, wie viel Aufwand in Orts-Annotationen fliesst, die heute nur punktuell gesetzt sind. Wenn heute entschieden wird, kann die Umsetzung direkt in die Woche danach wandern.' },

    { type: 'content', small: true,
      title: 'Neun Knowledge-Dokumente \u00b7 Lesekarte',
      body: '**plan.md** \u2014 Phasen, offene Fragen \u2192 Roadmap\n**data.md** \u2014 Datenqualit\u00e4t, Bereinigungshistorie \u2192 Datenbasis\n**architecture.md** \u2014 Pipeline, ER-Modell \u2192 Datenfluss\n**edition.md** \u2014 HTML-Rendering, ID-Konstruktion \u2192 Interface\n**ui.md** \u2014 Komponenten, Interaction Patterns \u2192 Bedienung\n**design.md** \u2014 Design-Tokens, Farben \u2192 Erscheinung\n**visualization.md** \u2014 Epics, Research Questions \u2192 Charts\n**journal.md** \u2014 Session-Log \u2192 Arbeitsstil\n**system_prompt_tei_annotation.md** \u2014 Annotations-Prompt \u2192 agentische Arbeit\n\nAuf Englisch im Repo. Prim\u00e4reinstieg f\u00fcr heute: **plan.md** und **visualization.md**.',
      notes: 'Die neun Dokumente sind die schriftliche Grundlage, auf der das neue Frontend gebaut wurde. Karin und Christina haben in der Mail danach gefragt, auf welcher Dokumentationsbasis gearbeitet wurde. Das hier ist die Antwort. plan.md gibt die Chronologie der Phasen und die offenen Fragen. visualization.md beschreibt die vier Explorer und die 13 Forschungsfragen dahinter. Alle auf Englisch, das ist die Projektkonvention im Repo.' },

    { type: 'content',
      title: 'Was wir aus dieser Stunde mitnehmen',
      body: '**Gemeinsames Vokabular** \u2014 *deterministisch*, *normalisiert*, *aggregiert*, *Drill-Down*, *Provenienz*.\n\n**Entscheidungen** zu Q2\u200A/\u200AQ3\u200A/\u200AQ4 oder klarer Weg zur Entscheidung bis 23.\u200A/\u200A24.04.\n\n**Feedback-Modus** \u2014 URL-Link mit Kurzkommentar als Standardform.\n\n**Priorisierung** f\u00fcr 23.\u200A/\u200A24.04. mit Daniel, Max, Viktor.',
      notes: 'Abschluss-Folie, knapp. Die vier Punkte sind die Arbeitsergebnisse der Stunde, keine Wunschliste. Wenn alle vier erreicht sind, ist die Vorbesprechung erfolgreich und die Arbeitssitzung am 23. und 24. April laeuft mit klarer Ausgangslage. Den Feedback-Modus mit URL-Link konkret ausprobieren lassen, Karin oder Christina sendet heute nach dem Meeting einen ersten Link mit einer Zahl, die sie interessiert.' },

    { type: 'content',
      title: 'Ausblick \u00b7 Arbeitssitzung 23.\u200A/\u200A24.04. Wien',
      body: 'Welche konkreten Zahlen gehen wir mit dem Team durch?\n\nWer testet welchen Explorer, wer verantwortet welche Q-Entscheidung?\n\nWelche der vier Direkt-Ma\u00dfnahmen sollen bis dahin live sein?',
      source: 'N\u00e4chster Termin \u00b7 23.\u200A/\u200A24.04.2026 \u00b7 Wien',
      notes: 'Kurzausblick auf den Wien-Block. Die drei Leitfragen sind die Vorbereitung, die zwischen heute und dem 23. laufen muss. Je mehr heute schon entschieden ist, desto produktiver die Arbeitssitzung. Falls die vier Direkt-Massnahmen bis dahin implementiert sind, kann die Arbeitssitzung die Live-Demo sein, nicht mehr ein Vorschlag.' }
  ];
}
