// FemPrompt SozArb, Internes Team-Update
// Deep-Research-gestützte Literature-Reviews, Epistemische Infrastruktur als Praxis
// 5 Folien: Titel, Rahmen und Begriffe, Pipeline und Dual Assessment, Benchmark und Divergenz, Umgesetzte Artefakte
// =============================================================================

function getFemPromptContent() {
  return [

    { type: 'title',
      title: 'Deep-Research-gestützte\nLiterature-Reviews',
      subtitle: 'Epistemische Infrastruktur als Praxis',
      meta: '2026-04-22 · Internes Team-Update\nChristopher Pollin · Susanne Sackl-Sharif · Sabine Klinger\nForum Wissenschaft 2/2026, Einreichfrist 4. Mai 2026',
      notes: 'Deep Research bezeichnet agentenbasierte LLM-Systeme für iterative Literatursuche. Der Untertitel verortet den Beitrag als methodologisch. Am Fall des Literature Reviews zu feministischen AI Literacies in der Sozialen Arbeit wird gezeigt, wie eine Infrastruktur aus Prozessen, Dokumentation, Werkzeugen und Akteuren entsteht, damit LLM-Beiträge nachvollziehbar und verantwortbar bleiben. Zielpublikation ist Forum Wissenschaft 2/2026 mit Einreichfrist am 4. Mai 2026.'
    },

    { type: 'content',
      title: 'Rahmen und zentrale Begriffe',
      body: 'Zwei Ebenen im Projekt. Inhaltlich ein *Systematic Literature Review* zu **feministischen AI Literacies** in der Sozialen Arbeit. Methodisch die Frage nach **epistemischer Infrastruktur** für LLM-gestützte Reviews.\n\nMotivation. *Confabulation* (kohärente, aber faktisch ungestützte Behauptungen des LLM) und *Sycophancy* (Tendenz, Vorannahmen im Prompt überzustimmen) können nicht am Output verhindert werden, nur im Prozess eingefangen.\n\n**Epistemische Infrastruktur**. Gesamtheit aus Prozessen, Dokumentation, Werkzeugen und Akteuren. Kernprinzip: Verlässlichkeit wird nicht beim System vorausgesetzt, sondern am Prozess hergestellt.\n\n**Verification Checkpoint**. Definierter Kontrollpunkt nach jedem KI-Schritt. Mensch oder Regel prüft, ob das Zwischenergebnis in den nächsten Schritt gehen darf.',
      small: true,
      notes: 'Die zwei Ebenen sind im Paper explizit getrennt. Die methodische Ebene ist der Kernbeitrag. Der inhaltliche Review dient als Fall, an dem die Infrastruktur sichtbar wird. Der logische Dreischritt auf der Folie ist Warum, Was, Wie. Confabulation und Sycophancy sind die beiden LLM-Phänomene, die das Infrastrukturdesign treiben. Verification Checkpoints übersetzen das Prinzip in konkrete Prozessentscheidungen an jedem Übergabepunkt.'
    },

    { type: 'content',
      title: 'Pipeline und Dual Assessment Track',
      body: 'Fünf Phasen als Abfolge. Identifikation · PDF-Beschaffung · Markdown-Konversion · *Knowledge Distillation* · Dual Assessment.\n\nIdentifikation über vier *Deep Research* Systeme (OpenAI, Google, Perplexity, Anthropic) plus manuelle Ergänzung. **326 Papers**. *Deep Research* bezeichnet agentenbasierte LLM-Systeme für iterative Literatursuche.\n\n**Knowledge Distillation** in drei Stufen. Stage 1 LLM-Extraktion, Stage 2 deterministische Formatierung ohne LLM, Stage 3 LLM-Verifikation gegen das Original. Ergebnis: **249 Knowledge Documents**.\n\n**Dual Assessment Track**. Expert:innen und LLM bewerten unabhängig, parallel und nach identischem Schema: 10 binäre Kategorien in zwei Gruppen.\nTechnik (4): AI Literacies, Generative KI, Prompting, KI Sonstige.\nSozial (6): Soziale Arbeit, Bias und Ungleichheit, Gender, Diversität, Feministisch, Fairness.\nEinschluss, wenn mindestens eine Technik- und eine Sozialkategorie zutrifft. Human 303 Papers, LLM 326 Papers.',
      small: true,
      source: 'benchmark/config/categories.yaml',
      notes: 'Die fünf Phasen sind im Repository vollständig dokumentiert und skriptbasiert reproduzierbar. Die dreistufige Distillation ist bewusst so gebaut, dass Stage 2 ohne LLM auskommt. Damit liegt eine deterministische Zwischenstufe zwischen zwei probabilistischen. Der Dual Assessment Track ist parallel und nicht sequentiell angelegt. Parallel erlaubt die Messung von Divergenz. Die 4 plus 6 Aufteilung der Kategorien spiegelt die Forschungsfrage nach der Überschneidung von feministischen AI Literacies, generativer KI beziehungsweise Prompting, und Sozialer Arbeit.'
    },

    { type: 'content',
      title: 'Benchmark und Divergenz',
      body: 'Messapparatur. **Konfusionsmatrix** (Kreuztabelle der Entscheidungen Human gegen LLM), **Base Rates** (Include-Raten je Seite), *Cohen\'s Kappa* (Übereinstimmungsmaß, das zufällige Übereinstimmung herausrechnet).\n\nErgebnis auf 291 geteilten Papers. Human **46,0 Prozent** Include, LLM (Haiku 4.5) **71,5 Prozent** Include, *Cohen\'s Kappa* 0,056 ("slight"). Konfusionsmatrix: Beide Include 100, Human Include und LLM Exclude 34, **Human Exclude und LLM Include 108**, Beide Exclude 49. Die Asymmetrie (108 gegen 34) ist das eigentliche Signal.\n\nDrei Divergenzmuster (Klassifikation mit Sonnet 4.6). Semantische Expansion 52 Prozent, Implizite Feldzugehörigkeit 30 Prozent, Keyword-Inklusion 18 Prozent. Die Muster werden im **Knowledge Graph** räumlich auf die Konzeptstruktur gelegt.\n\n2x2-Experiment mit zwei Modellen (Haiku 4.5, Sonnet 4.6) und zwei Input-Basen (Abstract, *Knowledge Document*). Befund. Mehr Modellkapazität und mehr Kontext schließen die Lücke nicht, sie verschieben sie.',
      small: true,
      source: 'benchmark/results/agreement_metrics.json',
      notes: 'Die Include-Rate-Differenz von 25,5 Prozentpunkten ist das zentrale empirische Ergebnis. 108 Fälle, in denen der LLM einschließt und Expert:innen ausschließen, stehen 34 umgekehrten Fällen gegenüber. Das 2x2-Experiment wurde am 1. April 2026 durchgeführt. Die beste Bedingung war Sonnet mit Knowledge Document. Auch dort bleibt die strukturelle Inklusionstendenz bestehen. Das stützt die These, dass die Divergenz nicht Informationsdefizit ist, sondern strukturell-epistemisch. Jedes Konzept, das in einem Divergenzpaper vorkommt, erhält im Knowledge Graph einen Ring in der Farbe des dominanten Musters. So wird die Divergenz topologisch lesbar.'
    },

    { type: 'content',
      title: 'Umgesetzte Artefakte',
      body: '**Obsidian Vault v2**. 505 verlinkte Markdown-Dateien (248 Papers, 136 Concepts, 111 Divergences, 5 Pipeline-Stages, 5 MOCs).\n\n**Evidence Companion** auf GitHub Pages, vier Views. Herausgehoben: *Knowledge Graph* aus 136 LLM-extrahierten Konzepten, Kanten als gemeinsame Paper-Vorkommen, Divergenzringe in drei Pattern-Farben überlagern die Benchmark-Divergenz auf die Konzeptstruktur. Weitere Views: *Knowledge Chat* (Gemini 3 Flash mit Zitationen), *Categories Explorer*, *Corpus*-Tabelle.\n\n**Prompt Governance**. Prompts versioniert, CHANGELOG, Negative Constraints gegen Sycophancy und Confabulation.\n\nRepository. knowledge/-Ordner als einzige Quelle, Git-Historie, .vault_cache/ für Reproduzierbarkeit. LLM-Gesamtkosten rund **11 US-Dollar**.\n\n**Zielpublikation**. Forum Wissenschaft 2/2026, Einreichfrist **4. Mai 2026**. Offen: Open-Access-Analyse, institutionelle Schicht der Infrastruktur, Vault-Regeneration nach Merge-Bug-Fix.',
      small: true,
      source: 'chpollin.github.io/FemPrompt_SozArb',
      notes: 'Der Obsidian Vault ist so gebaut, dass jedes Paper, jedes Konzept und jede Divergenz eine eigene Notiz mit Wikilinks ist. Der Knowledge Graph im Evidence Companion visualisiert die Benchmark-Ergebnisse direkt: Konzepte aus der Knowledge Distillation bilden die Knoten, Co-Occurrence die Kanten, und die Divergenzringe übertragen die drei Pattern-Farben aus dem Benchmark auf die Konzeptstruktur. Prompt Governance ist die Antwort auf Sycophancy und Confabulation. Die Kosten zeigen, dass eine belastbare Infrastruktur nicht teuer ist, aber diszipliniertes Prozessdesign voraussetzt. Die Deadline 4. Mai 2026 strukturiert die verbleibende Arbeit.'
    }

  ];
}
