// ============================================================
// Sammlung online: was nun? Von der Datenbank zum Publikum
// NOe Regionalmuseen, 26.06.2026, Schloss Atzenbrugg (Demo-Vortrag)
// 30 Folien (F01 bis F30) plus Section-Trenner.
// Stil: sachlich, keine Doppelpunkte, keine Dashes als Satzzeichen.
// ============================================================

function getNoeContent() {
  return [

    // ---------- Block 0: Ankommen und Standortbestimmung ----------

    { type: 'title',
      title: 'Sammlung online\nVon der Datenbank zum Publikum',
      subtitle: 'Demo-Vortrag fuer NOe Regionalmuseen',
      meta: 'Teil 2 · 26. Juni 2026 · Schloss Atzenbrugg\nmuseumsmanagement niederoesterreich',
      notes: 'Der praesente Teil 2 der Reihe Sammlung online schliesst an den Online-Teil 1 an und zeigt an echten Daten, was mit den eigenen DIPkatalog-Bestaenden moeglich ist. Das Format ist ein Demo-Vortrag mit Plenumsdiskussion ohne Hands-on. Die Gruppe ist heterogen und reicht von Datenbank-Bearbeitenden ueber Museumsleitende bis zu ehrenamtlichen Teams. Die Vorkenntnisse zu KI sind sehr unterschiedlich.' },

    { type: 'content',
      title: 'Standortbestimmung',
      body: '**Drei Fragen zum Einstieg**\n\n• Welche KI-Anwendungen sind Ihnen zuletzt begegnet?\n• Welche methodischen Ansaetze haben Sie dabei gesehen?\n• Welche Fragen sind offen geblieben?',
      notes: 'Drei Fragen erheben den Erfahrungsstand der Gruppe. In der oesterreichischen Museumslandschaft sind zuletzt mehrere KI-Projekte diskutiert worden, durchgaengig im Paradigma des spezialisierten Machine Learning. Dieser Workshop ergaenzt den zweiten Weg ueber Frontier-Modelle und Context Engineering. Die Standortbestimmung knuepft daran an und positioniert sich nicht als Gegenentwurf.' },

    { type: 'content',
      title: 'Aufgeklaerte Neugier',
      body: 'Eine Haltung zwischen blindem Hype und reflexhafter Ablehnung.\n\n• KI ist ein **maechtiges, aber limitiertes** Werkzeug\n• Die Limitationen gehoeren zur Methode, nicht ins Kleingedruckte\n• Leitfrage ist, wie Museen diese Werkzeuge nutzen, ohne die Kontrolle ueber die eigenen Daten zu verlieren',
      notes: 'Aufgeklaerte Neugier behandelt KI weder als Heilsversprechen noch als Bedrohung. Die Limitationen sind Teil der Methode und kein Kleingedrucktes. Die Leitfrage fuer den Nachmittag ist, wie Museen maechtige, aber limitierte Werkzeuge nutzen, ohne die Kontrolle ueber die eigenen Daten zu verlieren.' },

    { type: 'content',
      title: 'Der rote Faden des Nachmittags',
      body: 'Ein Objekt aus dem **DIPkatalog** begleitet uns von der Datenbank bis zum Publikum.\n\n• Von der Datenbankzeile zur Analyse\n• Vom Datensatz zur erschlossenen Beschreibung\n• Vom Bestand zur publikumsfaehigen Online-Ansicht\n\nAn jeder Station faellt der Begriff, den sie braucht.',
      notes: 'Ein Objekt aus dem DIPkatalog verbindet die drei Demos. Es geht von der Datenbankzeile ueber die erschlossene Beschreibung bis zur publikumsfaehigen Online-Ansicht. An jeder Station erklaert sich ein Grundlagenbegriff aus dem konkreten Schritt, statt vorab als geschlossener Theorieblock.' },

    // ---------- Block 1: Was ein Sprachmodell ist ----------

    { type: 'section', title: 'Grundlagen', subtitle: 'Was ein Sprachmodell ist und was nicht' },

    { type: 'content',
      title: 'Ein Sprachmodell als Kompression',
      body: 'Ein *Large Language Model* ist eine verlustbehaftete, probabilistische Verdichtung grosser Textmengen.\n\n• Es speichert **Muster**, keine exakten Eintraege\n• Vergleichbar mit einer komprimierten Datei, die nicht alle Details bewahrt\n• Drei Eigenschaften sind verlustbehaftet, probabilistisch und zeitlich begrenzt',
      source: 'Metapher nach Karpathy (2025).',
      notes: 'Ein Sprachmodell verdichtet grosse Textmengen verlustbehaftet und probabilistisch. Es speichert statistische Muster und keine exakten Eintraege, vergleichbar mit einer komprimierten Datei, die nicht alle Details bewahrt. Drei Eigenschaften praegen es. Es ist verlustbehaftet, probabilistisch und auf den Trainingszeitpunkt begrenzt.' },

    { type: 'content',
      title: 'Plausibel ist nicht korrekt',
      body: 'Das Modell schreibt Wahrscheinlichkeiten fort, daher klingt jede Ausgabe stimmig.\n\n• Eine Antwort kann **fluessig und falsch** zugleich sein\n• Konfabulation ist fuer probabilistische Systeme mathematisch unvermeidbar\n• Jede Ausgabe braucht fachliche Pruefung',
      source: 'Kalai, A. T. & Vempala, S. S. (2025). Why Language Models Hallucinate. OpenAI.',
      notes: 'Weil das Modell Wahrscheinlichkeiten fortschreibt, klingt jede Ausgabe stimmig. Eine Antwort kann fluessig und sachlich falsch zugleich sein. Konfabulation ist fuer probabilistische Systeme mathematisch unvermeidbar. Daraus folgt, dass jede Ausgabe fachlich geprueft werden muss.' },

    { type: 'content',
      title: 'Die KI kennt Ihre Sammlung nicht',
      body: 'Das Modell greift nicht live auf das Web zu, sondern nur auf seine Trainingsmuster.\n\n• Es kennt **allgemeines Weltwissen**, nicht Ihren Bestand\n• Den Sammlungskontext muss man aktiv zufuehren\n• Websuche laeuft nur ueber einen separaten Werkzeug-Mechanismus',
      notes: 'Das Modell greift nicht live auf das Web zu, sondern nur auf seine Trainingsmuster. Es kennt allgemeines Weltwissen, aber nicht den eigenen Bestand. Den Sammlungskontext muss man aktiv in den Prompt geben. Eine Websuche laeuft nur ueber einen separaten Werkzeug-Mechanismus.' },

    // ---------- Block 2 (Demo 1): Von der DIPkatalog-Zeile zur Analyse ----------

    { type: 'section', title: 'Demo 1', subtitle: 'Von der DIPkatalog-Zeile zur Analyse' },

    { type: 'handson',
      title: 'Den Export im Chat erkunden',
      body: '1. DIPkatalog-Export als Tabelle in das Chat-Interface laden\n2. Mit offenen Fragen erkunden, etwa Objekttypen und Verteilung\n3. Ein Balkendiagramm der Objekttypen erzeugen lassen',
      prompt: 'Hier ist ein Export aus unserer\nSammlungsdatenbank. Verschaff dir\neinen Ueberblick. Wie viele Objekte,\nwelche Objekttypen, welche\nDatenqualitaetsprobleme fallen auf?\nErzeuge ein Balkendiagramm der\nObjekttypen.',
      notes: 'Die erste Demo laedt einen realen Export aus der Sammlungsdatenbank in ein Chat-Interface. Offene Fragen klaeren Umfang, Objekttypen und Datenqualitaet. Ein Balkendiagramm der Objekttypen entsteht direkt im Chat. Der Schritt zeigt, dass aus dem eigenen Export ohne Programmierung Antworten entstehen.' },

    { type: 'content',
      title: 'Context Window',
      body: 'Das *Context Window* ist der Arbeitsspeicher des Modells.\n\n• Es umfasst alles, was in der Konversation sichtbar ist\n• **Was nicht darin steht, existiert fuer das Modell nicht**\n• Die Groesse ist begrenzt, auch bei grossen Fenstern',
      notes: 'Das Context Window ist der Arbeitsspeicher des Modells und umfasst alles, was in der Konversation sichtbar ist. Was nicht darin steht, existiert fuer das Modell nicht. Auch grosse Kontextfenster aendern diesen Grundsatz nicht. Die Qualitaet der Antwort haengt davon ab, was im Fenster liegt.' },

    { type: 'content',
      title: 'Beschreiben oder ausfuehren',
      body: 'Ein Chat verarbeitet Daten auf zwei Wegen.\n\n• **Beschreiben** heisst, das Modell liest und erzaehlt, das Ergebnis kann erfunden sein\n• **Ausfuehren** heisst, das Modell schreibt Code, der in einer Sandbox laeuft und nachpruefbar rechnet\n• Bei Zahlen ist die Code-Ausfuehrung der verlaessliche Weg',
      notes: 'Ein Chat verarbeitet Daten auf zwei Wegen. Beim Beschreiben liest das Modell und erzaehlt, das Ergebnis kann erfunden sein. Beim Ausfuehren schreibt es Code, der in einer Sandbox laeuft und nachpruefbar rechnet. Bei Zahlen ist die Code-Ausfuehrung der verlaessliche Weg. ChatGPT, Claude und Gemini bieten diese Ausfuehrung je unterschiedlich aktivierbar an.' },

    { type: 'content',
      title: 'Drei Elemente guten Kontexts',
      body: 'Die Qualitaet der Ausgabe haengt an der Qualitaet des Kontexts.\n\n• **Datenbeispiel** zeigen statt beschreiben\n• **Erwartetes Ergebnis** konkret benennen\n• **Constraints** als Einschraenkungen mitgeben',
      notes: 'Gute Ergebnisse haengen an gutem Kontext. Ein Datenbeispiel zeigt dem Modell die Struktur, statt sie zu beschreiben. Das erwartete Ergebnis muss konkret benannt sein. Constraints grenzen ein, was erlaubt ist. Diese drei Elemente wirken staerker als die genaue Wortwahl des Prompts.' },

    { type: 'content',
      title: 'Tokens statt Buchstaben',
      body: 'Das Modell verarbeitet Text in *Tokens*, nicht in einzelnen Buchstaben.\n\n• Es sieht ein Wort als eine Einheit, nicht als Folge von Buchstaben\n• Buchstaben zaehlen und exaktes Rechnen sind deshalb unzuverlaessig\n• Optionaler Einschub fuer Gruppen, die genauer nachfragen',
      notes: 'Das Modell verarbeitet Text in Tokens und nicht in einzelnen Buchstaben. Es behandelt ein Wort als geschlossene Einheit, weshalb Buchstabenzaehlen und exaktes Rechnen unzuverlaessig sind. Die Folie ist ein optionaler Einschub und erklaert, warum scheinbar simple Aufgaben manchmal scheitern.' },

    // ---------- Block 3 (Demo 2): Erschliessen mit Kontext ----------

    { type: 'section', title: 'Demo 2', subtitle: 'Erschliessen mit Kontext' },

    { type: 'handson',
      title: 'Drei Blicke auf ein Objekt',
      body: '1. **Blind**, das Modell sieht nur das Objektfoto\n2. **Enriched**, das Modell sieht Foto und Metadaten\n3. **Judge**, ein zweites Modell bewertet beide gegen den Originaleintrag',
      prompt: 'Bestimme das Objekt auf dem Foto.\nNenne den passenden\nThesaurusbegriff und eine\nsammlungskonforme Beschreibung.\nNutze nur Begriffe aus dem\nvorgegebenen Vokabular.',
      notes: 'Die zweite Demo prueft dasselbe Objektfoto dreifach. Der blinde Durchlauf sieht nur das Foto. Der angereicherte Durchlauf sieht zusaetzlich die Metadaten. Ein zweites, staerkeres Modell bewertet beide gegen den Originaleintrag und trennt eine Sammlungskonvention von einem Fehler. Das Begleittool zeigt alle vier Sichten nebeneinander und nutzt Daten der Landessammlungen Niederoesterreich. Der Bezug zu den eigenen Bestaenden der teilnehmenden Haeuser ist herzustellen.' },

    { type: 'content',
      title: 'Context Engineering',
      body: '*Context Engineering* ist die gezielte Gestaltung des zugefuehrten Kontexts.\n\n• Der Kontext bestimmt das Ergebnis staerker als die **Modellgroesse**\n• Wer die Sammlung kennt, bereitet ihr Wissen als Kontext auf\n• Die Investition liegt in der Datenaufbereitung, nicht im Modell',
      source: 'Mei, K. et al. (2025). Context Engineering for AI Agents.',
      notes: 'Context Engineering gestaltet den zugefuehrten Kontext gezielt. Das Frontier-Modell bringt Weltwissen ueber materielle Kultur mit, der sammlungsspezifische Kontext fehlt ihm. Diesen Kontext liefert der Prompt ueber Thesaurus, Beschreibungskonventionen und Referenzbeispiele. Die Qualitaet der Aufbereitung entscheidet staerker als die Modellgroesse.' },

    { type: 'content', small: true,
      title: 'Training oder Context Engineering',
      body: '**Klassisches Training**\nSpezialisiert, lokal, ressourceneffizient. Braucht ML-Expertise, gelabelte Daten und erneutes Training bei jeder Aenderung.\n\n**Context Engineering**\nFlexibel ueber Sammlungen, kein Training noetig, sofort einsetzbar. Braucht Kompetenz in Kontextgestaltung und Zugang zu Frontier-Modellen.\n\nKeiner der beiden Wege ist pauschal besser.',
      notes: 'Die Aufgabe Objekt klassifizieren laesst sich ueber zwei Wege loesen. Klassisches Training erzeugt ein spezialisiertes Modell aus gelabelten Daten und verlangt erneutes Training bei jeder Aenderung. Context Engineering verbindet vorhandenes Weltwissen ueber den Prompt mit dem Sammlungskontext und ist sofort einsetzbar. Fuer heterogene Bestaende und kleine Teams ist der zweite Weg oft der realistischere Einstieg.' },

    { type: 'content',
      title: 'Sycophancy',
      body: '*Sycophancy* ist die Neigung des Modells, eine vorgegebene Annahme zu bestaetigen.\n\n• Ein Begriff im Objektnamen kann die Zuordnung **dominieren**\n• Das Modell folgt der Hypothese, auch wenn das Foto anderes zeigt\n• Der Blind-Durchlauf und das Judge-Modell wirken dem entgegen',
      source: 'Zhao, Y. et al. (2026). Sycophancy in Vision-Language Models. Neurocomputing.',
      notes: 'Sycophancy ist die Neigung des Modells, eine im Prompt mitschwingende Annahme zu bestaetigen. Ein Begriff im Objektnamen kann die Zuordnung dominieren, auch wenn das Foto eine andere Deutung nahelegt. Der blinde Durchlauf ohne Metadaten und das bewertende Judge-Modell wirken dem strukturell entgegen.' },

    { type: 'content', small: true,
      title: 'Risiken im Sammlungskontext',
      body: '• **Konfabulation**, erfundene Inschriften, Datierungen, Hersteller\n• **Bias**, regionale Objekte und Mundart sind schwaecher abgedeckt\n• **Anbieterabhaengigkeit**, ein Modellwechsel veraendert Ausgaben unbemerkt\n• **Oekologische und epistemische Kosten**, Inference und Kompetenzverlust',
      notes: 'Vier Risiken sind im Sammlungskontext besonders relevant. Konfabulation fabriziert plausible, aber falsche Inschriften, Datierungen und Hersteller. Bias unterrepraesentiert regionale Objekte und mehrsprachige Beschriftungen. Anbieterabhaengigkeit veraendert Ausgaben bei einem Modellwechsel unbemerkt. Inference verursacht oekologische Kosten, und die Delegation an ein Modell verlagert Expertise aus dem Haus.' },

    { type: 'content',
      title: 'Critical Expert in the Loop',
      body: 'Das Modell schlaegt vor, die **Fachperson entscheidet**.\n\n• Eine Abweichung vom Katalog ist nicht automatisch ein Fehler\n• Sie kann auf eine kuratorische Entscheidung verweisen\n• Die fachliche Letztverantwortung bleibt im Haus',
      notes: 'Das Modell schlaegt vor, die Fachperson entscheidet. Eine Abweichung vom Originalkatalog ist nicht automatisch ein Fehler, sie kann auf eine kuratorische Entscheidung ausserhalb des sichtbaren Kontexts verweisen. Die fachliche Letztverantwortung bleibt im Haus.' },

    // ---------- Block 4 (Demo 3): Vom Bestand zur Online-Ansicht ----------

    { type: 'section', title: 'Demo 3', subtitle: 'Vom Bestand zur Online-Ansicht' },

    { type: 'content',
      title: 'Vier Anwendungsbereiche',
      body: 'KI in der Sammlungsarbeit ordnet sich in vier Felder.\n\n• **Datenerfassung**, **Datenanalyse**, **Exploration**, **Vermittlung**\n\nWiederkehrende Aufgaben nach van Strien sind Transformieren, Extrahieren, Beschreiben, Ordnen und Auffindbarmachen.',
      source: 'Van Strien, D. (2026). AI Design Patterns for Information Professionals.',
      notes: 'KI in der Sammlungsarbeit ordnet sich in Datenerfassung, Datenanalyse, Exploration und Vermittlung. Quer dazu beschreibt van Strien wiederkehrende Aufgabentypen fuer Kultureinrichtungen, naemlich Transformieren, Extrahieren, Beschreiben, Ordnen und Auffindbarmachen. Diese Landkarte ordnet die drei Demos in groessere Einsatzfelder ein.' },

    { type: 'content_with_image',
      title: 'Vom Datensatz zur Online-Ansicht',
      body: 'Der *Kulturpool Explorer* zeigt eine Teilsammlung als statische Website.\n\n• **Bildteppich** als Einstieg\n• **Ueberblicksgrafik** der Sammlungsstruktur\n• **Facettennavigation** und Detailansicht mit Link zur Quelle\n\nBeispiel Volkskundemuseum Wien, rund 19.000 frei lizenzierte Objekte.',
      placeholder: 'kulturpool_explorer.png\nCollection Wall mit Ueberblicksgrafik und Facetten',
      source: 'Kulturpool Explorer · github.com/chpollin/vkm-explorer · Screencast youtu.be/tQBaaVhPu5U',
      notes: 'Die dritte Demo zeigt eine Teilsammlung als statische Website. Der Kulturpool Explorer nutzt rund 19.000 frei lizenzierte Objekte des Volkskundemuseums Wien. Den Einstieg bildet ein Bildteppich, eine Ueberblicksgrafik zeigt die Sammlungsstruktur, Facetten und Detailansicht fuehren zur Originalquelle. Ein Screencast dokumentiert den Weg von der Kulturpool-Schnittstelle bis zur fertigen Ansicht.' },

    { type: 'content',
      title: 'Promptotyping',
      body: '*Promptotyping* haelt Daten und Anforderungen erst in Markdown-Dokumenten fest und baut dann mit einem KI-Agenten einen Prototyp.\n\n• Erst **Wissen aufbereiten**, dann implementieren\n• Die Aufbereitung des Sammlungswissens ist der eigentliche Hebel\n• Nicht die Code-Erzeugung entscheidet ueber die Qualitaet',
      notes: 'Promptotyping haelt Daten und Anforderungen erst in Markdown-Dokumenten fest und baut dann mit einem KI-Agenten einen Prototyp. Die Trennung von Wissensaufbereitung und Implementierung ist der eigentliche Hebel. Nicht die Code-Erzeugung entscheidet ueber die Qualitaet, sondern die Strukturierung des Sammlungswissens.' },

    { type: 'content',
      title: 'Jagged Frontier',
      body: 'Das Modell kann funktionierenden Code erzeugen und trotzdem an der echten Datenmenge scheitern.\n\n• Bei rund 19.000 Objekten haengt der Browser ohne Optimierung\n• Staerken und Schwaechen liegen **unregelmaessig** verteilt\n• Was einfach aussieht, kann schwer sein und umgekehrt',
      notes: 'Das Modell erzeugt funktionierenden Code und scheitert trotzdem an der tatsaechlichen Datenmenge. Bei rund 19.000 Objekten haengt der Browser ohne Optimierung. Staerken und Schwaechen liegen unregelmaessig verteilt, eine einfach wirkende Aufgabe kann schwer sein und umgekehrt. Genau deshalb braucht jede Ausgabe eine Pruefung am realen Fall.' },

    { type: 'content',
      title: 'Derselbe Weg mit DIPkatalog-Daten',
      body: 'Sobald die DIPkatalog-Schnittstelle bereitsteht, laeuft derselbe Weg mit den eigenen Bestaenden.\n\n• Von der Schnittstelle zur aufbereiteten Datenbasis\n• Von der Datenbasis zur publikumsfaehigen Ansicht\n• Damit schliesst sich der rote Faden von der Datenbank zum Publikum',
      notes: 'Sobald die DIPkatalog-Schnittstelle bereitsteht, laeuft derselbe Weg mit den eigenen Bestaenden. Von der Schnittstelle entsteht eine aufbereitete Datenbasis, daraus eine publikumsfaehige Ansicht. Damit schliesst sich der Weg von der Datenbank zum Publikum. Steht der Zugang nicht rechtzeitig, uebernimmt der Kulturpool Explorer als gleichwertiges Beispiel.' },

    // ---------- Block 5 + 6: Einordnung und Ausblick ----------

    { type: 'section', title: 'Einordnung und Ausblick', subtitle: 'Modellwahl, Datenhoheit und die naechsten Schritte' },

    { type: 'content', small: true,
      title: 'Drei Einstiegspunkte',
      body: '• **Kommerzielle Frontier-Schnittstelle**, geringe Einstiegskosten, die Daten verlassen das Haus\n• **Lokales Open-Source-Modell**, volle Datenhoheit, Einrichtung im Haus\n• **Spezialisiertes trainiertes Modell**, sinnvoll bei stabilem Schema und hohem Durchsatz\n\nFuer die meisten Haeuser ist eine Kombination realistisch.',
      notes: 'Der Context-Engineering-Weg laesst sich ueber drei Einstiegspunkte umsetzen. Eine kommerzielle Frontier-Schnittstelle ist sofort einsetzbar, die Daten verlassen aber das Haus. Ein lokales Open-Source-Modell sichert volle Datenhoheit und verlangt Einrichtung im Haus. Ein spezialisiertes trainiertes Modell lohnt sich bei stabilem Schema und hohem Durchsatz. Fuer die meisten Haeuser ist eine Kombination realistisch.' },

    { type: 'content',
      title: 'Datenhoheit und Lizenz',
      body: 'Bei kommerziellen Diensten verlassen die Daten das Haus, bei lokalen Modellen bleiben sie unter eigener Kontrolle.\n\n• Die Investition liegt in der **Datenaufbereitung**, nicht in der Modellwahl\n• **Open Weights ist nicht Open Source**, freie Gewichte heissen nicht offene Trainingsdaten oder freie Lizenz',
      notes: 'Bei kommerziellen Diensten verlassen die Daten das Haus, bei lokalen Modellen bleiben sie unter eigener Kontrolle. Die eigentliche Investition liegt in der Datenaufbereitung und nicht in der Modellwahl. Frei verfuegbare Modellgewichte sind nicht dasselbe wie offengelegte Trainingsdaten oder eine freie Lizenz.' },

    { type: 'content', small: true,
      title: 'Leitfragen fuer Ihr Haus',
      body: '• Welcher **Objekttyp** waere ein realistischer erster Anwendungsfall?\n• Welche Daten liegen bei Ihnen bereits **strukturiert** vor?\n• Welche Aufgabe hat Prioritaet, Erfassung, Analyse, Exploration oder Vermittlung?\n• Welche **Voraussetzungen** muessten Sie schaffen?',
      notes: 'Vier Fragen helfen, ein erstes Vorhaben im eigenen Haus zu umreissen. Welcher Objekttyp eignet sich als realistischer Anwendungsfall, welche Daten liegen strukturiert vor, welche Aufgabe hat Prioritaet und welche Voraussetzungen fehlen noch. Das Ziel ist Projektentwicklungskompetenz und nicht die technische Umsetzung im Workshop.' },

    { type: 'content',
      title: 'Fuenf Schritte fuer den Einstieg',
      body: '1. Mit **kleinen Bestaenden** beginnen\n2. KI als **Komponente** einbauen, nicht als Standalone\n3. **Fachexpertise** durchgaengig einbinden\n4. **Jedes Ergebnis pruefen**\n5. Erfolge und Fehlschlaege **dokumentieren**',
      notes: 'Fuenf Schritte tragen den Einstieg in kleinen Haeusern. Mit kleinen Bestaenden beginnen, KI als Komponente in einen groesseren Ablauf einbauen, Fachexpertise durchgaengig einbinden, jedes Ergebnis pruefen und Erfolge wie Fehlschlaege dokumentieren. Die Dokumentation macht den Prozess nachvollziehbar und wiederholbar.' },

    { type: 'content',
      title: 'Jetzt anfangen',
      body: 'Auf bessere Modelle zu warten ist technisch legitim, institutionell nicht.\n\n• **Kompetenz und Dokumentationspraxis** lohnen sich sofort\n• Wer jetzt Routine aufbaut, kann kommende Technik mitgestalten\n• Die saubere Datenaufbereitung bleibt, unabhaengig vom Modell',
      notes: 'Auf leistungsfaehigere Modelle zu warten ist technisch eine legitime Strategie, institutionell nicht. Der Aufbau von Kompetenz und Dokumentationspraxis lohnt sich sofort. Wer jetzt methodische Routine aufbaut, kann kommende Technik aktiv mitgestalten. Die saubere Datenaufbereitung bleibt unabhaengig vom jeweiligen Modell wertvoll.' },

    { type: 'content',
      title: 'Nachbetreuung ueber den Sommer',
      body: 'Ausgewaehlte Haeuser koennen bei der Umsetzung eines digitalen Formats begleitet werden.\n\n• Vom Projektgedanken zum ersten Prototyp\n• Mit den eigenen DIPkatalog-Daten',
      notes: 'Als Anschluss koennen ausgewaehlte Haeuser ueber den Sommer bei der Umsetzung eines digitalen Formats begleitet werden. Der Weg fuehrt vom Projektgedanken zum ersten Prototyp mit den eigenen DIPkatalog-Daten. Die konkrete Ausgestaltung ist offen und haengt von der Resonanz ab.' },

    { type: 'discussion',
      question: 'Kann KI kulturgeschichtliche Objekte erschliessen und vermitteln, und was braucht es dafuer?',
      notes: 'Die Schlussfrage greift die Standortbestimmung vom Anfang auf. Die Antwort des Nachmittags lautet, dass gute Daten, aufbereiteter Kontext und fachliches Urteil zusammen mehr leisten als das groesste Modell.' }
  ];
}
