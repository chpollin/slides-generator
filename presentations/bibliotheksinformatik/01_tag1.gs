// TAG 1 — Die Bibliothek als KI-Umgebung (22 Folien)
// ============================================================

function getTag1Content() {
  return [
    { type: 'title', title: 'K\u00fcnstliche Intelligenz\nin Bibliotheken', subtitle: 'Die Bibliothek als KI-Umgebung', meta: 'Block 7a.4 Bibliotheksinformatik \u00b7 8. Juni 2026 \u00b7 Wien\nULG Library and Information Studies' },

    { type: 'learning', title: 'Lernziele', body: '1. Den **kybernetischen Regelkreis** als Grundmodell f\u00fcr *KI-Agenten* erkl\u00e4ren\n\n2. Die **Bibliothek** aus informationswissenschaftlicher und Forschungsdatenperspektive als **KI-Umgebung** einordnen\n\n3. Den **Transformationsprozess** von Rohdaten zu strukturierter Information an einer *OCR-Pipeline* nachvollziehen\n\n4. **Wissensdokumente** in *Markdown* mit *YAML-Frontmatter* als Grundlage f\u00fcr *Context Engineering* erstellen' },

    { type: 'content', title: 'Haus\u00fcbung: LLM-gest\u00fctzter Wissensraum', body: 'Erstellen Sie einen *Obsidian* Vault zu einem Themenfeld aus dem **Bibliothekswesen**.\n\nDer Vault enth\u00e4lt:\n\u2022 Mindestens 10 Wissensdokumente in *Markdown* mit *YAML-Frontmatter*\n\u2022 Mindestens 3 **Literaturnotizen** mit bibliographischen Angaben\n\u2022 1 *Map of Content* (MOC) als Einstiegsseite\n\u2022 Konsistente Ordnerstruktur, Verlinkung und Tag-Vergabe\n\n**Reflexion** (max. 2 Seiten PDF): Wie ver\u00e4ndert der Einsatz von *LLMs* bibliothekarische Arbeitsprozesse, und wo bleibt fachliche Urteilskraft unverzichtbar?\n\nAbgabe auf Moodle: Vault als ZIP + Reflexion als PDF. Details am Ende von Tag 3.' },

    { type: 'section', title: 'Block 1', subtitle: 'Kybernetik, Agenten, Diskurs' },

    { type: 'content', title: 'Kybernetik und Agenten', body: '**Kybernetischer Regelkreis:** Wahrnehmung, Verarbeitung, Handlung, *Feedback*.\n\n**Norbert Wiener** (1948): Steuerung und Kommunikation in Maschinen und Lebewesen. Systeme, die ihre Umgebung wahrnehmen, daraus Handlungen ableiten und durch R\u00fcckkopplung lernen.\n\nDieses Modell ist 80 Jahre alt und steckt in jedem modernen *KI-Agenten*.', source: 'Wiener, N. (1948). Cybernetics. New York: John Wiley & Sons.' },

    { type: 'content', title: 'Kybernetik und Kritik', body: 'Elon Musk bezeichnet X als "kybernetische Superintelligenz"\nMark Zuckerberg denkt Unternehmen als "lernende Organismen"\nDer Erfinder von *Google Glass*: "Die Kybernetik ist \u00fcberall, wie Luft."\n\n**Nosthoff/Maschewski** (2026): Von der Kybernetik \u00fcber den *Cyberspace* zum KI-Hype und techno-autorit\u00e4ren Str\u00f6mungen. **Kybernetisierung** betrifft auch die Kritik selbst.', source: 'Nosthoff, A.-V. & Maschewski, F. (2026). Kybernetik und Kritik. Suhrkamp.' },

    { type: 'content', title: 'Von der Kybernetik zum KI-Agenten', small: true, body: '**Wooldridge/Jennings** (1995): **Autonomie**, **Reaktivit\u00e4t**, **Proaktivit\u00e4t**, soziale F\u00e4higkeit.\n\nF\u00fcnf **Agententypen** (Russell/Norvig):\n\u2022 *Simple Reflex* (Thermostat) \u2022 *Model-Based* (Staubsaugerroboter)\n\u2022 *Goal-Based* (autonomes Auto) \u2022 *Utility-Based* (Drohne) \u2022 *Learning Agent* (Schachbot)\n\nBegriffliche Einordnung: *Narrow AI* (aufgabenspezifisch, heute), *AGI* (menschengleich, Prognose 2027\u20132030), *ASI* (\u00fcbermenschlich). F\u00fcr Bibliotheken relevant als Hintergrund des \u00f6ffentlichen Diskurses.', source: 'Wooldridge, M. & Jennings, N. R. (1995). Intelligent Agents. Knowledge Engineering Review 10(2).' },

    { type: 'content', title: 'Agentische Systeme heute', body: '**Agent** vs. **agentisches System**: Einfache Agenten f\u00fchren einen Schritt aus. Agentische Systeme verketten Schritte, nutzen Werkzeuge, reflektieren Ergebnisse.\n\n**Andrew Ng:** Vier *Design Patterns*: *Reflection*, *Tool Use*, *Planning*, *Multi-Agent Collaboration*. Die meisten praktischen Chancen liegen in linearen *Workflows*.\n\n*Claude Code* als konkretes Beispiel: *LLM* als *Reasoning Engine*, *Tool Use* (Dateien, Terminal, Web), *Planning*, Reflexion. Vorschau auf Tag 3.', source: 'Ng, A. (2024). Agentic AI Design Patterns. Sequoia AI Ascent.' },

    { type: 'section', title: 'Block 2', subtitle: 'Informationswissenschaftliche Grundlagen' },

    { type: 'content', highlight: true, title: 'Nicht schon wieder: Daten, Information, Wissen', body: '**DIKW-Hierarchie** (Ackoff 1989) und ihre Grenzen: statisch, linear, \u00fcbersieht *Feedback-Loops*.\n\n**Langefors\u2019 infologische Gleichung** I=i(D,S,t): Information entsteht als Funktion von Daten (D), Wissensstrukturen des Empf\u00e4ngers (S) und Zeit (t). Information ist kein Ding, sondern ein **Konstrukt** (Kuhlen et al. 2023).\n\nBeispiel: 4\u00b0C ist **Daten**. "Es ist kalt, Jacke anziehen" ist **Alltagswissen**. "Dichteanomalie des Wassers" ist **Physikwissen**. Selbe Daten, anderes S.\n\nDie Variable S entspricht dem, was wir *Context Engineering* nennen.', source: 'Langefors (1966). Theoretical Analysis of Information Systems.\nKuhlen et al. (2023). Grundlagen der Informationswissenschaft. 7. Aufl. De Gruyter.' },

    { type: 'copy', ref: 'wissenspyramide', fallbackTitle: 'Wissenspyramide', fallbackDesc: 'Wissenspyramide / Ladder of Knowledge' },
    { type: 'copy', ref: 'dikw_network', fallbackTitle: 'DIKW Netzwerk-Visualisierung', fallbackDesc: 'Data \u2192 Information \u2192 Knowledge \u2192 Insight \u2192 Wisdom' },

    { type: 'discussion', question: 'Wo in Ihrem Arbeitsalltag transformieren Sie Daten zu Information, und wo entsteht daraus Wissen?' },

    { type: 'content', title: '"Die KI": ML, Generative KI, Knowledge Graphs', small: true, body: 'Drei Werkzeugfamilien:\n\n**Machine Learning:** Klassifikation, *Empfehlungssysteme*, Mustererkennung. Deterministisch, aufgabenspezifisch. Besser bei: gro\u00dfe Best\u00e4nde, Anomalieerkennung.\n\n**Generative KI / *LLMs*:** *Frontier-Modelle* (GPT, Claude, Gemini), *Open Weights* (Llama, Mistral, DeepSeek), lokale Modelle. Besser bei: Freitexterschlie\u00dfung, Metadatenextraktion, Mehrsprachigkeit.\n\n**Wissensbasierte Systeme:** *Knowledge Graphs*, Ontologien, Datenbanken. *GraphRAG*: neuro-symbolische Kombination.\n\nZusammenspiel statt Entweder-Oder. Bibliotheksdaten als Forschungsdaten (Drucker 2011: "**capta**" statt "data").', source: 'Drucker, J. (2011). Humanities Approaches to Graphical Display. DHQ 5(1).' },

    { type: 'section', title: 'Block 3', subtitle: 'Die Bibliothek als KI-Umgebung' },

    { type: 'content', title: 'Bibliothekarische Arbeitsprozesse', body: 'Sechs Kernprozesse, bei denen KI eine Rolle spielen kann:\n\n\u2022 **Erschlie\u00dfung:** Formal-/Sacherschlie\u00dfung, Metadatenvergabe, Klassifikation\n\u2022 **Recherche:** Literatur-/Faktenrecherche, Datenbanksuche\n\u2022 **Datenaufbereitung:** Bereinigen, normieren, strukturieren\n\u2022 **Digitalisierung:** *OCR*, Retrodigitalisierung, Texterkennung\n\u2022 **Wissensorganisation:** Taxonomien pflegen, Best\u00e4nde systematisieren\n\u2022 **Informationsvermittlung:** Inhalte aufbereiten, Beratung, Schulungen' },

    { type: 'content', title: 'Bibliothek als KI-Umgebung + kritische Perspektiven', small: true, body: 'Bibliotheken als strukturierte Informationsumgebungen: kontrollierte Vokabulare, Metadatenstandards (*MARC*, *Dublin Core*, *METS/MODS*), Normdaten (*GND*). Gleichzeitig **Ressource** f\u00fcr KI und **Qualit\u00e4tsma\u00dfstab**.\n\n**Digitale Souver\u00e4nit\u00e4t:** Propriet\u00e4r vs. *Open Weights*. Abh\u00e4ngigkeit US/China. *Self-Hosting* ca. $250.000. *Asymmetric Amplification*.\n\n**Ethisch:** *Bias*, Urheberrecht, *Halluzination*. **Sozial:** Arbeitsplatzver\u00e4nderung, Zugangsgerechtigkeit. **\u00d6kologisch:** Energieverbrauch, Rechenzentren, Wasserverbrauch.' },

    { type: 'discussion', question: 'Welche kritische Dimension (Souver\u00e4nit\u00e4t, Ethik, Soziales, \u00d6kologie) ist f\u00fcr Ihre Institution am relevantesten, und warum?' },

    { type: 'section', title: 'Block 4', subtitle: 'OCR-Pipeline als Transformationsbeispiel' },

    { type: 'content_with_image', title: 'SZD-HTR: OCR-Pipeline als Transformation', body: '**Stefan-Zweig-Transkriptionspipeline**\n2.107 Objekte, 18.719 Scans\n\nF\u00fcnf Stufen:\n1. **Kontextaufl\u00f6sung** (*TEI-XML*)\n2. **Transkription** (*Gemini*, 4-Schichten-*Prompt*)\n3. *Quality Signals* (7 Indikatoren)\n4. **Verifikation** (3-Modell-Konsens)\n5. **Export** (*PAGE XML*, *METS/MODS*)\n\nScan = **Rohdaten**, Text = **Information**, Metadaten = **Wissen**.\n\nUmgesetzt via *Promptotyping* mit *Claude Code*.', placeholder: 'Screenshot: SZD-HTR Live Viewer\nchpollin.github.io/szd-htr-ocr-pipeline/', source: 'github.com/chpollin/szd-htr-ocr-pipeline' },

    { type: 'section', title: 'Block 5', subtitle: 'Werkzeuge und Context Engineering' },

    { type: 'content', title: 'Obsidian, Markdown, YAML, Context Engineering', small: true, body: '**Obsidian:** Lokale *Markdown*-Dateien, bidirektionale Verlinkung, *Graph View*. Keine Cloud-Abh\u00e4ngigkeit.\n\nWarum *Markdown*? *LLMs* haben im *Pre-Training* extrem viel *Markdown* gesehen. Kompakter als Excel/CSV, bessere *Token*-Effizienz. *Context Window* und *Context Rot*: Je strukturierter, desto besser.\n\n*YAML-Frontmatter*: Metadatenebene, die aus Text ein erschlossenes Objekt macht. Parallele zu *MARC*/*Dublin Core*.\n\n*Context Engineering*: Systematische Gestaltung von Eingabekontexten. *RAG*, *MCP* ("USB-C f\u00fcr KI"), *CLAUDE.md*. F\u00fcnf Kontextebenen: **Quellen-**, **Erfassungs-**, **Daten-**, **Forschungs-**, **Modellkontext**.\n\n\u2192 Live-Demo und \u00dcbungen: Erstes Wissensdokument + *YAML-Frontmatter* schreiben.', source: 'obsidian.md | Pollin (2026). Context Engineering.' }
  ];
}
