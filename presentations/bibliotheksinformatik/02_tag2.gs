
// ============================================================
// TAG 2 — Sprachmodelle und Grenzen (20 Folien)
// ============================================================

function getTag2Content() {
  return [
    { type: 'title', title: 'K\u00fcnstliche Intelligenz\nin Bibliotheken', subtitle: 'Wie Sprachmodelle funktionieren und wo sie scheitern', meta: 'Block 7a.4 Bibliotheksinformatik \u00b7 9. Juni 2026 \u00b7 Wien\nULG Library and Information Studies' },

    { type: 'learning', title: 'Lernziele', body: '1. Die Funktionsweise generativer **Sprachmodelle** erkl\u00e4ren und erste *Prompts* formulieren\n\n2. Systematische **Grenzen** von *LLMs* anhand konkreter Beispiele aus dem Bibliothekswesen identifizieren\n\n3. KI-Einsatzszenarien unter Gesichtspunkten der **Forschungsintegrit\u00e4t**, *Prozesstransparenz* und Modelloffenheit bewerten\n\n4. **Evaluierungsmethoden** f\u00fcr KI-Werkzeuge auf bibliothekarische Anwendungsf\u00e4lle anwenden' },

    { type: 'section', title: 'Block 1', subtitle: 'Grundlagen generativer KI' },

    { type: 'copy', ref: 'tokenization', fallbackTitle: 'Tokenization', fallbackDesc: 'Zerlegung von Text in Tokens als Input-Repr\u00e4sentation' },

    { type: 'copy', ref: 'embeddings_dog_cat_stone', fallbackTitle: 'Embeddings (dog, cat, stone)', fallbackDesc: 'Tokens als Vektoren, semantische N\u00e4he im Raum' },

    { type: 'copy', ref: 'embeddings_king_queen', fallbackTitle: 'Embeddings (king and queen)', fallbackDesc: 'Vektor-Arithmetik mit Embeddings' },

    { type: 'copy', ref: 'embeddings_shakespeare', fallbackTitle: 'Embeddings (Shakespeare)', fallbackDesc: 'Kontextuelle Embeddings an einem Shakespeare-Satz' },

    { type: 'copy', ref: 'next_token_prediction', fallbackTitle: 'Next Token Prediction', fallbackDesc: 'Autoregressive Generierung Token f\u00fcr Token' },

    { type: 'copy', ref: 'transformer', fallbackTitle: 'Transformer-Architektur', fallbackDesc: 'Attention-Mechanismus, Encoder-Decoder vs. Decoder-only' },

    { type: 'copy', ref: 'pre_training', fallbackTitle: 'Pre-Training', fallbackDesc: 'Kompression von Wissen, Next-Token-Training, verlustbehaftet und probabilistisch',
      notes: 'Pre-Training ist die Phase, in der das Modell auf gro\u00dfen Datenmengen trainiert wird. Der Begriff \u201eKompression von Wissen\u201c stammt sinngem\u00e4\u00df von Andrej Karpathy.\n\nAls Input dienen Billionen von Tokens, die \u00fcberwiegend aus Webdaten stammen. Zunehmend werden auch synthetische Daten eingesetzt. Die Trainingsaufgabe besteht darin, das jeweils n\u00e4chste Token in einer Sequenz vorherzusagen. Daraus lernt das Modell implizit Grammatik, Weltwissen und Schlussfolgerungsmuster.\n\nDas Ergebnis hat drei Eigenschaften. Die Kompression ist verlustbehaftet: Das Modell speichert keine Trainingsdaten w\u00f6rtlich, sondern statistische Muster. Es ist probabilistisch: Das Modell arbeitet mit Wahrscheinlichkeitsverteilungen \u00fcber m\u00f6gliche Fortsetzungen, nicht mit gesicherten Fakten. Und es hat eine zeitlich fixierte Wissensgrenze, sofern keine zus\u00e4tzlichen Werkzeuge wie Websuche eingebunden werden.\n\nPre-Training erfordert erhebliche Ressourcen an Geld, Energie und spezialisierter Hardware. \u201eLangsam\u201c bezieht sich auf den Trainingsprozess, nicht auf die sp\u00e4tere Nutzung.\n\nDas Bild links unten zeigt ein geplantes Rechenzentrum von Meta und illustriert die Dimension der erforderlichen Infrastruktur.' },

    { type: 'copy', ref: 'gestalt_zebras', fallbackTitle: 'Die Gestalt eines Wikipedia-Artikels \u00fcber Zebras', fallbackDesc: 'Karpathys Gestalt-Begriff, Muster statt Artikeltext, Tool Use f\u00fcr exakte Fakten',
      notes: 'Diese Folie veranschaulicht, was \u201eKompression\u201c aus der vorherigen Folie konkret bedeutet. Ein Wikipedia-Artikel \u00fcber Zebras war m\u00f6glicherweise Teil der Trainingsdaten. Das Modell hat daraus Muster \u00fcber Zebras extrahiert, etwa dass Zebras Pferde mit Streifen sind, in Afrika vorkommen und zu den S\u00e4ugetieren geh\u00f6ren. Es hat aber nicht den Artikeltext gespeichert. Karpathy verwendet den Begriff \u201eGestalt\u201c, um diesen Unterschied zu fassen: Das Modell kennt die Gestalt des Wissens, nicht dessen exakte Form. Deshalb kann ein LLM Fragen \u00fcber Zebras beantworten, aber nicht den Wikipedia-Artikel w\u00f6rtlich wiedergeben. Wenn ein LLM aktuelle oder exakte Informationen ben\u00f6tigt, kann es \u00fcber Tool Use auf externe Quellen zugreifen, etwa eine Websuche durchf\u00fchren. Das ist ein grundlegend anderer Mechanismus als das im Training erworbene Wissen.' },

    { type: 'copy', ref: 'context_window_8k', fallbackTitle: 'Context Window = 8K', fallbackDesc: 'Maximale Tokenanzahl f\u00fcr Input plus Output' },

    { type: 'content', title: 'Modelllandschaft', body: '**Propriet\u00e4re Modelle:** GPT-4o, o3 (*OpenAI*), Claude Opus/Sonnet (*Anthropic*), Gemini (*Google*). Zugang \u00fcber *API*, kein Einblick in Gewichte.\n\n***Open-Weights*-Modelle:** Llama (*Meta*), Mistral (Frankreich), DeepSeek (China), Qwen (*Alibaba*). Lokal betreibbar, Training oft intransparent.\n\n**Lokale Modelle:** \u00dcber *Ollama*, *LM Studio*, *vLLM* auf eigener Hardware. Volle Kontrolle, begrenzte Leistung.\n\nEntscheidungskriterien: Leistung, Kosten, Datenschutz, institutionelle Vorgaben.' },

    { type: 'handson', title: 'Erste Prompts formulieren', body: '\u00dcbersetzen Sie einen bibliothekarischen Task in einen *Prompt*:\n\n1. W\u00e4hlen Sie eine Aufgabe: **Sacherschlie\u00dfung**, **Abstract** oder **Metadatenextraktion**\n2. Formulieren Sie einen *Prompt* in *Claude* oder *ChatGPT*\n3. Testen Sie das Ergebnis\n4. Notieren Sie: Was funktioniert? Wo weicht es ab?', prompt: 'Beispiel-Prompt:\n\n"Du bist ein Fachreferent f\u00fcr\nGeschichtswissenschaft.\n\nVergib f\u00fcr den folgenden Abstrakt\nmaximal 5 Schlagw\u00f6rter nach\nGND-Terminologie.\n\nGib f\u00fcr jedes Schlagwort die\nGND-ID an, falls bekannt.\n\nFormat: Schlagwort (GND-ID)\n\n[Abstrakt hier einf\u00fcgen]"' },

    { type: 'section', title: 'Block 2', subtitle: 'Systematische Grenzen' },

    { type: 'content', title: 'LLM-Limitationen: Taxonomie', small: true, body: '**Technisch:**\n\u2022 **Halluzinationen** (mathematisch unvermeidbar bei *Next-Token-Prediction*)\n\u2022 *Context Window* / *Context Rot* (Performance sinkt mit L\u00e4nge)\n\u2022 *Knowledge Cutoff* (Wissen endet am Trainingsdatum)\n\u2022 **Nicht-deterministisch** (selber *Prompt*, andere Ergebnisse)\n\n**Epistemisch:**\n\u2022 Kein **Weltmodell** (sprachliche Muster, kein Verstehen)\n\u2022 *Verification Gap* (kann eigene Outputs nicht pr\u00fcfen)\n\u2022 "*Reasoning*" = *Thinking Tokens* erzeugen, nicht logisch schlie\u00dfen\n\n**Ethisch/Gesellschaftlich:**\n\u2022 *Bias* und Diskriminierung \u2022 Umweltkosten \u2022 Monopolisierung \u2022 *Shadow AI* \u2022 Datenschutz', source: 'Summerfield, C. (2025). These Strange New Minds. Viking.' },

    { type: 'content', highlight: true, title: 'Halluzination', body: '*LLMs* erfinden plausible Fakten. Statistisch plausibel \u2260 faktisch korrekt.\n\nBeispiel: **Bibliographische Angaben**, korrekt formatiert, aber nicht existent (erfundene DOIs, Autoren).\n\nBeispiel **SZD-HTR**: *Gemini* erfindet W\u00f6rter statt "[?]" zu setzen, was *Quality Signals* entwertet.\n\nWarum: Das Modell optimiert auf **Plausibilit\u00e4t**, nicht **Wahrheit**. Es hat kein Konzept von "ich wei\u00df es nicht".\n\n"*Every cat is smarter than an LLM.*" (Yann LeCun)' },

    { type: 'content', title: 'Bias, Sycophancy, Shadow AI', small: true, body: '***Bias*:** Englischsprachige Texte dominieren. Konsequenzen f\u00fcr mehrsprachige Erschlie\u00dfung. Wessen Wissen ist repr\u00e4sentiert?\n\n***Sycophancy*:** Modelle best\u00e4tigen statt zu widersprechen. *RLHF* belohnt Zustimmung. *Social Sycophancy*: *LLMs* bewahren das Gesicht 45 Prozentpunkte h\u00e4ufiger als Menschen (Cheng et al. 2025).\n\n***Shadow AI*:** \u00dcber 90% der Unternehmen haben undokumentierte KI-Nutzung (MIT NANDA 2025). 86% der Studierenden nutzen KI, 24% t\u00e4glich (DEC 2024). **Transparenz** ist keine B\u00fcrde, sondern Grundlage.', source: 'Malmqvist (2024). Sycophancy in LLMs. | MIT NANDA (2025). | DEC Survey (2024).' },

    { type: 'discussion', question: 'Wird in Ihrer Institution bereits KI eingesetzt, und wenn ja, wie transparent?' },

    { type: 'section', title: 'Block 3', subtitle: 'Forschungsintegrit\u00e4t und Offenheit' },

    { type: 'content', title: 'Forschungsintegrit\u00e4t: F\u00fcnf Tugenden', body: '**Ehrlichkeit:** Offenlegen, wo KI eingesetzt wurde.\n**Sorgfalt:** Output pr\u00fcfen, nicht blind \u00fcbernehmen.\n**Transparenz:** Modell, *Prompt*, Nachbearbeitung dokumentieren.\n**Unabh\u00e4ngigkeit:** Eigenes Urteil bewahren trotz KI-Unterst\u00fctzung.\n**Verantwortung:** Konsequenzen des eigenen Handelns bedenken.\n\n"*It\u2019s not about automation, it\u2019s about amplification.*" (Ethan Mollick)', source: 'ALLEA (2023). European Code of Conduct for Research Integrity.\nDingemanse (2024). Five Virtues Framework.' },

    { type: 'content', title: 'Prozesstransparenz + Offene Modelle', small: true, body: 'Dokumentation: Welches Modell? Welcher *Prompt*? Welche Nachbearbeitung?\n\nDrei Ebenen (Strutz 2026): 1. **Algorithmische Baseline** (*CER*, *F1*) 2. **Inhaltliche Korrektheit** (Fachpr\u00fcfung) 3. **Prozesstransparenz** (Workflow-Dokumentation)\n\n*Open Source* vs. *Open Weights* vs. *Open Data*:\n\u2022 *Open Source*: Framework-Code \u00f6ffentlich\n\u2022 *Open Weights*: Gewichte herunterladbar, lokal nutzbar\n\u2022 *Open Data*: Trainingsdaten dokumentiert\nRealit\u00e4t: Meiste "offene" Modelle = *Open Weights*.\n\n*Explainable AI*: *Chain of Thought*, Quellenangaben, *Structured Output* als Proxies, nicht echte Transparenz.', source: 'Strutz (2026). Evaluation Framework for TEI Encoding. JOHD 12(39).' },

    { type: 'section', title: 'Block 4', subtitle: 'Evaluierung' },

    { type: 'content', title: 'Evaluierungsmethoden + Strutz 2026', small: true, body: '**Metriken:** *CER* (Zeichengenauigkeit, *OCR/HTR*), *WER* (Wortgenauigkeit), *Precision* (korrekte Treffer), *Recall* (gefundene Treffer), *F1-Score* (harmonisches Mittel). Generierung: menschliche Bewertung.\n\n**Strutz 2026:** *Multi-Dimensional Evaluation Framework for TEI Encoding*.\nDrei Ebenen: 1. **Algorithmische Baseline** (automatisch) 2. **Inhaltliche Korrektheit** (Fachpersonal) 3. **Prozesstransparenz** (Workflow).\n\n\u00dcbertragbar auf jede bibliothekarische Aufgabe mit *LLM*-Output.\n\nZahlen ohne Kontext sind wertlos: Datensatz, Aufgabe, Vergleichsbasis m\u00fcssen bekannt sein.', source: 'Strutz, S. (2026). Multi-Dimensional Evaluation Framework for TEI Encoding. JOHD 12(39).' },

    { type: 'content', title: 'Zusammenfassung und Ausblick Tag 3', body: 'R\u00fcckblick:\n1. Funktionsweise generativer **Sprachmodelle**\n2. Systematische **Grenzen** (technisch, epistemisch, ethisch)\n3. **Forschungsintegrit\u00e4t**, *Prozesstransparenz*, Modelloffenheit\n4. **Evaluierungsmethoden**\n\nMorgen: Vom Verstehen zum Anwenden.\n*Prompt Engineering* als Handwerk, *Promptotyping* als Methodik, *KI-Agenten* in der Praxis, KI-Einsatzstrategie.' }
  ];
}
