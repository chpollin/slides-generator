// ============================================================
// SuGW Frontend Roadmap (7 Folien)
// ============================================================

function getRoadmapContent() {
  return [
    { type: 'title',
      title: 'SuGW Frontend\nRoadmap',
      subtitle: 'Stand 17. April 2026',
      meta: 'Auftrag A-Nr. 16\u200A/\u200A26 \u00b7 Digitale Edition\nStadt und Gemeinschaft Wien',
      notes: 'Lebendes Arbeits-Deck. Wird bis zum Projektabschluss weitergepflegt, Stand jeweils auf der Titelfolie aktualisieren.' },

    { type: 'content', small: true,
      title: 'Status auf einen Blick',
      body: '**Erledigt**\nEditionsansicht \u00b7 vier Explorer (A, B, C, D) \u00b7 Statistik-Dashboard \u00b7 M1 Quality-Strip \u00b7 M2 Quality-Dashboard \u00b7 WCAG-2.1-AA-Paket \u00b7 Startseite \u00b7 Impressum\n\n**In Arbeit**\nVolltextsuche \u00b7 Persistent URIs \u00b7 Mobile-Polish \u00b7 WCAG-Audit-Bericht\n\n**Offen \u200A/\u200A Blockiert**\nPlaywright E2E \u00b7 IIIF-Viewer (abh\u00e4ngig von Monasterium\u200A/\u200AACDH) \u00b7 Q2\u200A/\u200AQ3\u200A/\u200AQ4-Entscheidungen',
      notes: 'Drei Spalten als Status-Panorama. Grundlage ist knowledge/plan.md im Hauptrepository. Die Kategorie offen und blockiert unterscheidet zwischen Aufgaben, die nur Zeit brauchen (Playwright E2E), Aufgaben mit externer Abhaengigkeit (IIIF-Viewer via Monasterium oder ACDH) und Aufgaben, die auf Projekt-Entscheidungen warten (Q2 bis Q4).' },

    { type: 'content',
      title: 'Direkt-Ma\u00dfnahmen bis zur Vorbesprechung',
      body: '**Provenance-Panel** pro Chart \u00b7 CSV-Quelle, Aggregation, Normalisierung, aktive Filter.\n\n**Raw-Number-Tooltip** \u00b7 Hover zeigt Herleitungspfad, nicht nur Zahl.\n\n**URL-State-Indicator** \u00b7 aktive Filter als Link teilbar.\n\n**Normalisations-Mapping sichtbar** \u00b7 93 Varianten in Epic\u00a0B aufklappbar.\n\nAufwand 1\u20132 Tage. Sichtbarkeit, nicht Neuberechnung.',
      notes: 'Vier konkrete UI-Erweiterungen, die Provenienz an der Aggregationsebene sichtbar machen. Alle vier nutzen bestehende Datenstrukturen im Aggregator und erfordern keine neue Pipeline-Arbeit.' },

    { type: 'content',
      title: 'Mittelfristig bis zum Wien-Block',
      body: 'Dedizierte **data-lineage.html** \u00b7 Datenwegdiagramm, CSV-Tabelle, Aggregationsregeln.\n\n**TEI-Source-Verifikationslinks** \u00b7 aus *Drill-Down*-Tabellen direkt ins annotierte XML-Element.\n\n**Open-Questions-Badges** \u00b7 Q2\u200A/\u200AQ3\u200A/\u200AQ4 an betreffenden Chart-Stellen als "tentative grouping".',
      notes: 'Drei Pakete, die auf die Direkt-Massnahmen aufbauen. Die data-lineage.html fasst den Datenweg als eigene Seite zusammen, referenzierbar fuer externe Nachfragen. Die TEI-Source-Links koennen direkt zu einem bestimmten XML-Element springen, nicht nur zur Datei. Die Badges markieren Darstellungen, in denen eine offene Frage die Kategorisierung beeinflusst.' },

    { type: 'content', small: true,
      title: 'Restarbeiten pro Phase I.1\u2013I.4',
      body: '**I.1 Scholarly Functions** \u00b7 Persistent URIs (w3id.org oder vergleichbar), ER-Modell-Diagramm als Dokumentationsartefakt.\n\n**I.2 Search & Exploration** \u00b7 Volltextsuche \u00fcber Dokumentinhalt, Annotation-basierte Filter, Suchergebnis-Export (CSV\u200A/\u200AJSON), IIIF-Viewer (abh\u00e4ngig von Monasterium\u200A/\u200AACDH).\n\n**I.3 Web-Pr\u00e4senz** \u00b7 Mobile-Polish, dokumentierter WCAG-2.1-AA-Audit.\n\n**I.4 Nachhaltigkeit** \u00b7 Playwright E2E-Tests, Deployment-Dokumentation (GitHub Pages, lokal, Portabilit\u00e4t).',
      notes: 'Strukturierte Restliste nach den vier Komponenten des Auftrags. Reihenfolge nach Prioritaet innerhalb jeder Phase. Die Volltextsuche in I.2 ist die wichtigste verbleibende Funktionalitaet, der IIIF-Viewer haengt an externer Bereitstellung durch Monasterium oder ACDH.' },

    { type: 'content',
      title: 'Drei Entscheidungen, drei Blockaden',
      body: '**Q2** \u00b7 Kirche\u200A/\u200AKapelle-Gruppierung \u2192 blockiert V3-T5 *Donation Patterns*.\n\n**Q3** \u00b7 Ecclesiastical\u200A/\u200ASecular Mapping \u2192 blockiert V2-T5\u200A/\u200AT6\u200A/\u200AT7 *Panel-2\u200A/\u200A3-Vollversion*.\n\n**Q4** \u00b7 Place-Annotation-Ausweitung \u2192 blockiert V5-Erweiterung.',
      source: 'Entscheidungspfad \u00b7 Vorbesprechung 17.04. \u2192 Wien-Block 23.\u200A/\u200A24.04. \u2192 Umsetzung Mai',
      notes: 'Jede offene Frage ist an eine konkrete Visualisierung geknuepft, nicht abstrakt. Die Entscheidungen fallen im Auftraggeberteam, die Umsetzung folgt in der Woche nach dem Wien-Block.' },

    { type: 'content',
      title: 'Abnahme \u00b7 Rechnung \u00b7 Wartungs\u00fcbergabe',
      body: '**Knowledge-Transfer-Dokumentation** und Onboarding-Pfad \u00fcber das Trainings-Repo.\n\n**Repo-Abnahme-Meeting** beim Wien-Block 23.\u200A/\u200A24.04.\n\n**Rechnungen** \u00b7 A-Nr. 09\u200A/\u200A26 Teilrechnung\u00a01 (Pipeline) \u00b7 Teilrechnung\u00a02 (Workshops) \u00b7 A-Nr. 16\u200A/\u200A26 Frontend.\n\n**Lizenz** \u00b7 Platzhalter CC-BY-4.0 \u2192 verbindlich.',
      notes: 'Projektabschluss-Pakete. Die Knowledge-Transfer-Dokumentation ist bereits als Arbeitsdokument im Vault angelegt. Das Trainings-Repo db_for_medieval_legal_transactions_simplified dient als Onboarding-Pfad fuer das Projektteam. Drei Rechnungen sind vorgesehen, die Reihenfolge richtet sich nach Abschluss der jeweiligen Arbeitspakete.' }
  ];
}
