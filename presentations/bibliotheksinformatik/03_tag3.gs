
// ============================================================
// TAG 3 — Vom Prompt zur Strategie (20 Folien)
// ============================================================

function getTag3Content() {
  return [
    { type: 'title', title: 'K\u00fcnstliche Intelligenz\nin Bibliotheken', subtitle: 'Vom Prompt zur Strategie', meta: 'Block 7a.4 Bibliotheksinformatik \u00b7 10. Juni 2026 \u00b7 Wien\nULG Library and Information Studies' },

    { type: 'learning', title: 'Lernziele', body: 'Nach diesem Tag k\u00f6nnen Sie:\n\n1. *Best Practices* f\u00fcr *Prompts* in bibliographischen und erschlie\u00dfenden Aufgaben anwenden\n\n2. Eine mehrstufige **KI-Pipeline** von der *OCR* bis zur Metadatenanreicherung mit *Promptotyping* aufbauen\n\n3. *KI-Agenten* als Werkzeuge f\u00fcr bibliothekarische *Workflows* praktisch einsetzen\n\n4. Eine **KI-Einsatzstrategie** f\u00fcr den eigenen Arbeitskontext formulieren' },

    { type: 'section', title: 'Block 1', subtitle: 'Prompt Engineering' },

    { type: 'content', title: 'Prompt Engineering: Grundlagen', body: '*Prompting*-Modi:\n\u2022 *Zero-Shot*: Aufgabe beschreiben, keine Beispiele\n\u2022 *Few-Shot*: Aufgabe + 2\u20133 Beispiele mitgeben\n\u2022 *System Prompt*: Rolle und Rahmenbedingungen (persistent)\n\u2022 *User Prompt*: Konkrete Aufgabe (pro Anfrage)\n\nStruktur eines guten *Prompts*:\n**Rolle:** Wer soll das Modell sein?\n**Aufgabe:** Was genau soll getan werden?\n**Kontext:** Welche Hintergrundinformation?\n**Format:** Wie soll das Ergebnis aussehen?\n**Einschr\u00e4nkungen:** Was soll das Modell nicht tun?' },

    { type: 'content', title: 'Prompts f\u00fcr Sacherschlie\u00dfung', body: '*Prompt*: "Du bist ein Fachreferent. Vergib maximal 5 Schlagw\u00f6rter nach *GND*-Terminologie. Gib f\u00fcr jedes die *GND-ID* an, falls bekannt."\n\nBeobachtungen:\n\u2022 *GND*-Terminologie bekannt, aber nicht zuverl\u00e4ssig\n\u2022 *GND-IDs* werden h\u00e4ufig **halluziniert**\n\u2022 Schlagw\u00f6rter thematisch passend, nicht immer normkonform\n\n**Konsequenz:** *LLM* als **Vorschlagssystem**, nicht als Entscheidungssystem. Fachliche Pr\u00fcfung bleibt notwendig.' },

    { type: 'content', title: 'Prompts f\u00fcr Metadatenextraktion + Katalogisierung', body: '**Metadatenextraktion** (3 Varianten vergleichen):\n\u2022 *Zero-Shot*: "Extrahiere Autor, Titel, Jahr. Ausgabe als *JSON*."\n\u2022 *Few-Shot*: + 2 Beispiele als Vorlage\n\u2022 *Structured Output*: "Gib in folgendem *YAML*-Format aus: [Template]"\n\n**Abstract-Generierung:**\n\u2022 Korrektheit, Vollst\u00e4ndigkeit, Fachsprache, L\u00e4nge als Kriterien\n\u2022 *LLMs* tendieren zu generischen Formulierungen\n\u2022 Spezifische Fachsprache muss im *Prompt* mitgegeben werden' },

    { type: 'handson', title: 'Eigene Prompts entwickeln', body: '1. W\u00e4hlen Sie eine Aufgabe aus Ihrem Arbeitskontext\n2. Formulieren Sie einen *Prompt*\n3. Testen und bewerten Sie das Ergebnis\n4. Verbessern Sie den *Prompt*, testen Sie erneut\n5. Dokumentieren Sie den Prozess:\n\u2022 Welcher *Prompt*?\n\u2022 Welches Modell?\n\u2022 Was war das Ergebnis?\n\u2022 Was wurde korrigiert?', prompt: 'Vorlage:\n\n"Du bist [ROLLE].\n\n[AUFGABE BESCHREIBEN]\n\nKontext:\n[HINTERGRUNDINFORMATION]\n\nFormat:\n[GEW\u00dcNSCHTES AUSGABEFORMAT]\n\nEinschr\u00e4nkungen:\n[WAS NICHT TUN]"' },

    { type: 'section', title: 'Block 2', subtitle: 'Prompting-Strategien und Context Engineering' },

    { type: 'content', title: 'Prompting-Strategien', body: '***Chain of Thought* (CoT):** Schritt f\u00fcr Schritt denken lassen. Verbessert Schlussfolgerungen.\n\n***Structured Output*:** *JSON*, *XML*, *YAML* erzwingen. Reduziert Variabilit\u00e4t, erleichtert Weiterverarbeitung.\n\n**Mehrstufige *Prompts*:** Komplexe Aufgabe in Teilschritte. Output Schritt 1 = Input Schritt 2.\n\nWann welche Strategie?\nEinfache Extraktion: *Zero-Shot*. Komplexe Bewertung: *CoT*. Pipeline: Mehrstufig.' },

    { type: 'content', title: 'Context Engineering (Vertiefung)', body: 'Praktische Prinzipien:\n\u2022 ***Sweet Spot*:** So viel Kontext wie n\u00f6tig, so wenig wie m\u00f6glich\n\u2022 ***Lost-in-the-Middle*:** Anfang/Ende wird besser verarbeitet\n\u2022 ***Context Rot*:** Performance sinkt mit Kontextl\u00e4nge (ab 50\u201360%)\n\n**Funktionale Wissensdokumente:** *Markdown* f\u00fcr *LLMs*. Kompakt, strukturiert, ohne Redundanz.\n\nF\u00fcnf Kontextebenen (DH-Perspektive):\n**Quellen-**, **Erfassungs-**, **Daten-**, **Forschungs-**, **Modellkontext**\n\n*Context Engineering* ist **Quellenkritik** mit anderen Mitteln.', source: 'Pollin (2026). Context Engineering.' },

    { type: 'content', title: 'Promptotyping', body: 'Iterative *Context-Engineering*-Arbeitstechnik, die *Prompt Engineering* mit *User-Centred Design* verbindet.\n\nVier Phasen:\n1. **Preparation:** Rohmaterialien zusammentragen\n2. **Exploration and Mapping:** Schnittstelle Daten/Forschungskontext sondieren\n3. **Destillation:** *Context Compression*, Wissensdokumente verdichten\n4. **Implementation:** Iterative Entwicklung mit *Expert-Feedback*\n\nKernprinzip: *Promptotyping Documents* sind die **Source of Truth**.\nVerbindung zur Haus\u00fcbung: Sie erstellen einen Wissensraum nach diesem Prinzip.', source: 'Pollin (2026). Promptotyping. Eingereicht.' },

    { type: 'section', title: 'Block 3', subtitle: 'KI-Agenten in der Praxis' },

    { type: 'content_with_image', title: 'SZD-HTR als mehrstufiger Workflow', body: '1. Bild + Kontext aus *TEI-XML*\n2. **Transkription** mit *VLM*\n   (*Prompt* steuert Objekttyp/Sprache)\n3. *Quality Signals* (regelbasiert)\n4. **Verifikation** (3-Modell-Konsens\n   oder *Agent*-Verifikation)\n5. **Export** (*PAGE XML*, *TEI*)\n\nJeder Schritt: eigener *Prompt*,\neigenes Werkzeug, eigenes\nQualit\u00e4tskriterium.', placeholder: 'Diagramm: 5-Stufen-Pipeline\nKontextaufl\u00f6sung \u2192 Transkription \u2192\nQuality Signals \u2192 Verifikation \u2192 Export', source: 'github.com/chpollin/szd-htr-ocr-pipeline' },

    { type: 'content', title: 'Claude Code: Live-Demo', body: 'Ein *Agent*, der Aufgaben plant, Werkzeuge nutzt, Ergebnisse pr\u00fcft.\n\n\u2022 Aufgabe verstehen und in Teilschritte zerlegen\n\u2022 Dateien lesen und analysieren\n\u2022 Code schreiben und ausf\u00fchren\n\u2022 Ergebnisse pr\u00fcfen und korrigieren\n\nBibliotheksbezogenes Beispiel: Aus einer Titelliste Metadaten extrahieren, in *YAML* strukturieren, als *Obsidian*-Dokumente anlegen.\n\nDer **kybernetische Regelkreis** in Aktion: Wahrnehmung \u2192 Planung \u2192 Handlung \u2192 *Feedback*.' },

    { type: 'content', title: 'Agenten f\u00fcr Bibliotheken + Expert-in-the-Loop', small: true, body: '\u2022 **Erschlie\u00dfung:** *Agent* liest Volltext, schl\u00e4gt Schlagw\u00f6rter vor, pr\u00fcft gegen Normdatei\n\u2022 **Recherche:** *Agent* formuliert Suchanfragen, vergleicht Ergebnisse\n\u2022 **Datenbereinigung:** *Agent* identifiziert Inkonsistenzen\n\u2022 **Digitalisierung:** *Agent* transkribiert, extrahiert Layout, reichert Metadaten an\n\n***Critical-Expert-in-the-Loop*:** Drei Komponenten:\n1. **Dom\u00e4nenexpertise** (faktische Korrektheit pr\u00fcfen)\n2. **Technisches Modellverst\u00e4ndnis** (*Context Windows*, *Sycophancy* kennen)\n3. **Metakognitive Vigilanz** (unerforschte Optionen reflektieren)\n\nDer *Agent* schl\u00e4gt vor, der **Mensch** entscheidet.', source: 'Pollin (2026). Critical-Expert-in-the-Loop.' },

    { type: 'section', title: 'Block 4', subtitle: 'KI-Strategie' },

    { type: 'content', title: 'ACRL AI Competencies 2025', body: 'F\u00fcnf leitende Haltungen:\n*Curiosity*, *Skepticism*, *Judgment*, *Responsibility*, *Collaboration*\n\nVier Kompetenzkategorien:\n\u2022 *Ethical Considerations*\n\u2022 *Knowledge and Understanding*\n\u2022 *Analysis and Evaluation*\n\u2022 *Use and Application*\n\nDie zentrale Berufsorganisation erkennt **KI-Kompetenz** als integralen Teil von **Informationskompetenz** an, nicht als Erg\u00e4nzung.', source: 'ACRL (2025). AI Competencies for Academic Library Workers.' },

    { type: 'content', title: 'KI-Einsatzstrategie entwickeln', body: '**Welche Aufgaben?** Nicht alles Automatisierbare sollte automatisiert werden. Priorisierung: Aufwand, H\u00e4ufigkeit, Fehlerpotenzial.\n\n**Welche Werkzeuge?** Propriet\u00e4r vs. *Open Weights* vs. lokal. *API* vs. Webinterface.\n\n**Welche Risiken?** Datenschutz, Qualit\u00e4tssicherung, Abh\u00e4ngigkeit, Kosten.\n\n**Welche Governance?** Wer entscheidet? Wie wird dokumentiert? Wer pr\u00fcft?' },

    { type: 'exercise', title: 'KI-Strategie f\u00fcr den eigenen Arbeitskontext', body: 'Gruppenarbeit:\n\n\u2022 Drei KI-Einsatzszenarien f\u00fcr die eigene Institution identifizieren\n\u2022 Nach **Machbarkeit** und **Nutzen** priorisieren\n\u2022 **Risiken** benennen\n\u2022 Ersten konkreten Schritt definieren' },

    { type: 'content', title: 'Haus\u00fcbung im Detail + Abschluss', small: true, body: '**LLM-gest\u00fctzter Wissensraum im Bibliothekswesen**\nThemenfeld: Frei w\u00e4hlbar. Vault: 10+ Wissensdokumente, 3+ Literaturnotizen, 1 *MOC*.\n**Reflexion** (max. 2 S. PDF): Welche *LLMs*, welche *Prompts*, wo brauchbar, wo korrigiert?\nAbgabe auf Moodle: Vault als ZIP + Reflexion als PDF.\n\nRessourcen: obsidian.md | claude.ai | chat.openai.com | gemini.google.com\n\nR\u00fcckblick: Tag 1 **Orientierung** \u2192 Tag 2 **Verst\u00e4ndnis** \u2192 Tag 3 **Anwendung**\nVerbindung zum Block *Media-Lab* (16.\u201318. Juni, Pr\u00e4senz \u00d6NB).' }
  ];
}
