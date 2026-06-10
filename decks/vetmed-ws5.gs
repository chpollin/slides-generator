/**
 * slides-generator — combined build for presentation: vetmed-ws5
 * Generated 2026-06-10 14:10 from 3faa205
 *
 * Paste this entire file into Google Apps Script (replaces existing code).
 * Requires: Slides API v1 service enabled.
 */

/**
 * DHCraft Design Schema
 *
 * Voraussetzung: Ziel-Präsentation hat DHCraft-Master eingerichtet
 *   - Title-Layout: Grau-Gradient links→rechts, DHCraft-Logo oben rechts, CC-BY unten rechts
 *   - Content-Layouts: weiß
 *   - Schriftart im Master: Helvetica Neue
 *
 * Einziges aktives Schema. Beim Hinzufügen eines zweiten Schemas:
 * - Diese Konstante in `D_DHCRAFT` umbenennen
 * - In jeder `run.gs` pro Präsentation `var D = D_DHCRAFT;` setzen (vor generate-Aufruf)
 * - Builder und Shapes referenzieren dann weiterhin `D`
 */

var D = {
  W: 720, H: 405,
  ML: 45, MR: 45, MT: 40,

  BG:            '#ffffff',
  BG_PLACEHOLDER:'#f0f0f0',

  // Fließtext-Schrift ist pure schwarz (Kontrast bei Projektion).
  // Grau nur für bewusst untergeordnete Elemente (Quellen, Kontakt, Section-Subtitle).
  TEXT_BLACK:     '#000000',
  TEXT_DARK:      '#000000',  // alias für Fließtext/Labels — bewusst = TEXT_BLACK
  TEXT_GRAY:      '#666666',
  TEXT_MUTED:     '#888888',
  TEXT_TEAL:      '#0097a7',  // nur für Hyperlinks (via opts.links)

  BORDER_PLACEHOLDER: '#aaaaaa',

  FONT:      'Helvetica Neue',
  FONT_MONO: 'Consolas',

  S_TITLE:      28,
  S_SUBTITLE:   16,
  S_META:       11,
  S_HEADING:    20,
  S_BODY:       13,
  S_BODY_SM:    11,
  S_SOURCE:     9,
  S_SECTION:    28,
  S_QUESTION:   20,
  S_LABEL:      10,
  S_LEARNING:   14,

  // AI-Badge (siehe addAiBadge).
  // Werte aus Google-Slides-UI vermessen (cm) und in pt umgerechnet (1 cm = 28.35 pt).
  AI_BADGE_W:    71,  // 2.5 cm
  AI_BADGE_H:    28,  // 1.0 cm
  AI_BADGE_FONT:  6,  // pt

  // Layout-Konstanten pro Folientyp (magic numbers raus).
  LAYOUT: {
    title: {
      textX:     325,
      titleY:    130,
      subtitleY: 210,
      metaY:     260,
      contactY:  345,
      contactW:  225,
      contactH:  55,
      // Badge-Position direkt über CC-BY im Master (vermessen in Slides-UI).
      badgeX:    545,  // 19.22 cm
      badgeY:    372   // 13.13 cm
    }
  },

  get CW() { return this.W - this.ML - this.MR; }
};

/**
 * Slide Library — Registry wiederverwendbarer Folien aus DHCraft-Präsentationen.
 *
 * Jede Präsentation definiert ihr eigenes COPY_SLIDES (in presentations/<name>/00_config.gs)
 * und referenziert darin Einträge aus SLIDE_REGISTRY.
 *
 * Siehe auch: Teaching/Slide Library.md im Obsidian-Vault.
 */

var SOURCE_PRES = {
  TEMPLATE: '1ULx2vC-lUsJ2nj4IVV4USlclNkWscRqqyd28YAFIRFs' // Slide Generator Template
};

// Flach — keine thematische Zwischenebene. Neue Einträge hier, nach Bedarf sortiert.
var SLIDE_REGISTRY = {
  tokenization:             { pres: SOURCE_PRES.TEMPLATE, id: 'g3d60558fe24_0_383' },
  embeddings_dog_cat_stone: { pres: SOURCE_PRES.TEMPLATE, id: 'g3d60558fe24_0_455' },
  embeddings_king_queen:    { pres: SOURCE_PRES.TEMPLATE, id: 'g3d60558fe24_0_462' },
  embeddings_shakespeare:   { pres: SOURCE_PRES.TEMPLATE, id: 'g3d60558fe24_0_470' },
  next_token_prediction:    { pres: SOURCE_PRES.TEMPLATE, id: 'g3d60558fe24_0_5'   },
  transformer:              { pres: SOURCE_PRES.TEMPLATE, id: 'g3d60558fe24_0_143' },
  pre_training:             { pres: SOURCE_PRES.TEMPLATE, id: 'g3d60558fe24_0_228' },
  gestalt_zebras:           { pres: SOURCE_PRES.TEMPLATE, id: 'g3d60558fe24_0_366' },
  context_window_8k:        { pres: SOURCE_PRES.TEMPLATE, id: 'g3d60558fe24_0_486' }
};

/**
 * Core Engine — Slide-Clear + Dispatch.
 *
 * generate(presId, content) wird aus presentations/.../99_run.gs aufgerufen.
 * Löscht alle Folien außer Folie 1, setzt CURRENT_PRES (damit copy-Builder
 * die Target-Präsentation kennt) und rendert das Content-Array:
 *   - i=0: erste Folie behalten (Master-Titel-Layout mit Gradient/Logos),
 *     vorhandene Elemente löschen, neu bauen.
 *   - i>0: neue BLANK-Folie anhängen.
 *
 * Unbekannte Folientypen (z.B. Tippfehler in `type`) werfen einen Fehler,
 * statt silent zu failen.
 */

// Referenz auf die aktuell generierte Präsentation. Wird von BUILDERS.copy
// konsumiert. Apps Script läuft synchron — kein Race-Risiko bei generateAll().
var CURRENT_PRES = null;

function generate(presId, content) {
  if (typeof PRESENTER === 'undefined') {
    throw new Error('PRESENTER fehlt. Bitte in presentations/<name>/00_config.gs setzen.');
  }

  var pres = SlidesApp.openById(presId);
  CURRENT_PRES = pres;

  try {
    var slides = pres.getSlides();
    for (var i = slides.length - 1; i >= 1; i--) slides[i].remove();

    var slideNum = 0;
    for (var i = 0; i < content.length; i++) {
      var item = content[i];
      slideNum++;

      var slide;
      if (i === 0) {
        slide = slides[0];
        var els = slide.getPageElements();
        for (var e = els.length - 1; e >= 0; e--) els[e].remove();
      } else {
        slide = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
      }

      var builder = BUILDERS[item.type];
      if (!builder) {
        throw new Error('Unknown slide type "' + item.type + '" at index ' + i);
      }
      // Builder kann eine neue Folie zurückgeben (copy-Fall) — sonst bleibt slide gültig.
      var actualSlide = builder(slide, item) || slide;

      // Foliennummern auf Content-Folien (nicht auf Titel, Section, Copy).
      if (item.type !== 'title' && item.type !== 'section' && item.type !== 'copy') {
        addSlideNumber(actualSlide, slideNum);
      }

      // Speaker Notes: item.notes überschreibt ggf. die von copy mitgenommenen Notes.
      if (item.notes) addSpeakerNotes(actualSlide, item.notes);
    }
  } finally {
    // Temp-Kopien der Source-Präsentationen aufräumen, auch bei Fehler/Timeout.
    clearSourceCache();
  }
}

/**
 * Wie generate(), aber ohne Clear: hängt das Content-Array hinter die
 * bestehenden Folien an. Für Delta-Updates von Decks mit manuell
 * eingefügten Bildern. 'title'-Folien sind nicht erlaubt (der Titel-
 * Sonderfall setzt Folie 1 voraus). Foliennummern laufen hinter der
 * letzten bestehenden Folie weiter und stimmen nach manuellem
 * Umsortieren nicht mehr — ein Voll-Rebuild korrigiert sie.
 */
function generateAppend(presId, content) {
  if (typeof PRESENTER === 'undefined') {
    throw new Error('PRESENTER fehlt. Bitte in presentations/<name>/00_config.gs setzen.');
  }

  var pres = SlidesApp.openById(presId);
  CURRENT_PRES = pres;

  try {
    var slideNum = pres.getSlides().length;
    for (var i = 0; i < content.length; i++) {
      var item = content[i];
      slideNum++;

      if (item.type === 'title') {
        throw new Error('generateAppend unterstuetzt keine title-Folien (index ' + i + ')');
      }
      var slide = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);

      var builder = BUILDERS[item.type];
      if (!builder) {
        throw new Error('Unknown slide type "' + item.type + '" at index ' + i);
      }
      var actualSlide = builder(slide, item) || slide;

      if (item.type !== 'section' && item.type !== 'copy') {
        addSlideNumber(actualSlide, slideNum);
      }
      if (item.notes) addSpeakerNotes(actualSlide, item.notes);
    }
  } finally {
    clearSourceCache();
  }
}

/**
 * BUILDERS — eine Render-Funktion pro Folientyp.
 *
 * Jeder Builder erhält (slide, item) und baut das Layout auf.
 * Content-Builder rufen fillBg(slide) (weißer Hintergrund, Master-Gradient
 * scheint NUR auf Titelfolie durch). Quellenzeilen per addSource(slide, item.source).
 *
 * Der title-Builder liest die Sprecherdaten aus PRESENTER (pro Präsentation
 * in 00_config.gs definiert). Fehlt PRESENTER, wirft generate() in core.gs
 * einen sprechenden Fehler.
 *
 * Der copy-Builder holt sich die Target-Präsentation aus CURRENT_PRES, die
 * in generate() gesetzt wird.
 */

var BUILDERS = {

  // Titelfolie: Gradient + Logos kommen aus Master.
  // Text auf rechter Seite — linke Hälfte bleibt frei für thematisches Bild.
  // AI-Badge direkt über dem CC-BY-Logo.
  title: function(slide, item) {
    // KEIN fillBg — Master-Gradient soll durchscheinen.
    var L = D.LAYOUT.title;
    var textW = D.W - L.textX - D.MR;

    addRichText(slide, item.title,    { x: L.textX, y: L.titleY,    w: textW, h: 75, font: D.FONT, size: D.S_TITLE,    bold: true, color: D.TEXT_BLACK });
    addRichText(slide, item.subtitle, { x: L.textX, y: L.subtitleY, w: textW, h: 40, font: D.FONT, size: D.S_SUBTITLE,             color: D.TEXT_DARK  });
    addRichText(slide, item.meta,     { x: L.textX, y: L.metaY,     w: textW, h: 40, font: D.FONT, size: D.S_META,                 color: D.TEXT_DARK, lineSpacing: 140 });

    // Kontaktdaten aus PRESENTER, rechts aligned mit Text-Spalte.
    var contact = PRESENTER.name + '\n'
                + PRESENTER.github + ' \u00b7 ' + PRESENTER.email + '\n'
                + PRESENTER.org + ' \u00b7 ' + PRESENTER.website;
    addRichText(slide, contact,
      { x: L.textX, y: L.contactY, w: L.contactW, h: L.contactH,
        font: D.FONT, size: 8, color: D.TEXT_GRAY,
        links: [
          { find: PRESENTER.github,  url: 'https://' + PRESENTER.github },
          { find: PRESENTER.email,   url: 'mailto:' + PRESENTER.email },
          { find: PRESENTER.website, url: 'https://' + PRESENTER.website }
        ]
      });

    // AI-Badge: feste Position aus Slides-UI vermessen (in Schema).
    addAiBadge(slide, L.badgeX, L.badgeY);
  },

  // Section: großer fetter Titel, Untertitel grau.
  section: function(slide, item) {
    fillBg(slide);
    addRichText(slide, item.title, { x: D.ML, y: 140, w: D.CW, h: 55, font: D.FONT, size: D.S_SECTION, bold: true, color: D.TEXT_BLACK });
    if (item.subtitle) addRichText(slide, item.subtitle, { x: D.ML, y: 205, w: D.CW, h: 35, font: D.FONT, size: D.S_SUBTITLE, color: D.TEXT_GRAY });
  },

  // Lernziele: Titel zentriert fett, Body linksbündig.
  learning: function(slide, item) {
    fillBg(slide);
    addRichText(slide, item.title, { x: D.ML, y: D.MT, w: D.CW, h: 35, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK, align: 'CENTER' });
    addRichText(slide, item.body,  { x: D.ML, y: 85,  w: D.CW, h: 295, font: D.FONT, size: D.S_LEARNING, color: D.TEXT_DARK, lineSpacing: 150 });
  },

  // Content: Titel fett zentriert, Body, optional Quelle am Fuß.
  // Mit item.highlight=true: vertikaler Akzentbalken links neben Body.
  content: function(slide, item) {
    fillBg(slide);
    addRichText(slide, item.title, { x: D.ML, y: D.MT, w: D.CW, h: 35, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK, align: 'CENTER' });

    if (item.highlight) {
      var accent = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, 30, 85, 3, 260);
      accent.getFill().setSolidFill(D.TEXT_DARK);
      accent.getBorder().setTransparent();
    }

    var bH = item.source ? 260 : 295;
    var sz = item.small ? D.S_BODY_SM : D.S_BODY;
    addRichText(slide, item.body, { x: D.ML, y: 85, w: D.CW, h: bH, font: D.FONT, size: sz, color: D.TEXT_DARK, lineSpacing: 140 });
    addSource(slide, item.source);
  },

  // Diskussion: großes "?" als visueller Anker, Frage zentriert.
  discussion: function(slide, item) {
    fillBg(slide);
    addRichText(slide, '?', { x: D.W - 140, y: 30, w: 100, h: 120, font: D.FONT, size: 96, bold: true, color: '#e0e0e0' });
    addRichText(slide, 'Leitfrage zur Diskussion', { x: D.ML, y: 50, w: D.CW - 120, h: 22, font: D.FONT, size: D.S_LABEL, bold: true, color: D.TEXT_DARK });
    addRichText(slide, item.question, { x: D.ML, y: 110, w: D.CW - 80, h: 250, font: D.FONT, size: D.S_QUESTION, bold: true, color: D.TEXT_BLACK, lineSpacing: 170 });
  },

  // Übung: Label "Übung" + Titel fett, Body normal.
  exercise: function(slide, item) {
    fillBg(slide);
    addRichText(slide, '\u00dcbung', { x: D.ML, y: D.MT, w: D.CW, h: 20, font: D.FONT, size: D.S_LABEL, bold: true, color: D.TEXT_DARK });
    addRichText(slide, item.title, { x: D.ML, y: 62, w: D.CW, h: 30, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK });
    addRichText(slide, item.body, { x: D.ML, y: 105, w: D.CW, h: 275, font: D.FONT, size: D.S_BODY, color: D.TEXT_DARK, lineSpacing: 140 });
  },

  // Hands-On: nummerierte Anleitung + gestrichelte Prompt-Box (Consolas).
  handson: function(slide, item) {
    fillBg(slide);
    addRichText(slide, 'Hands-On', { x: D.ML, y: D.MT, w: D.CW, h: 20, font: D.FONT, size: D.S_LABEL, bold: true, color: D.TEXT_DARK });
    addRichText(slide, item.title, { x: D.ML, y: 62, w: D.CW, h: 30, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK });

    var leftW = item.prompt ? (D.CW / 2) - 15 : D.CW;
    addRichText(slide, item.body, { x: D.ML, y: 105, w: leftW, h: 240, font: D.FONT, size: D.S_BODY, color: D.TEXT_DARK, lineSpacing: 140 });
    if (item.prompt) {
      var boxX = D.ML + leftW + 20;
      var boxW = D.CW - leftW - 20;
      addPromptBox(slide, item.prompt, boxX, 105, boxW, 240);
    }
    addSource(slide, item.source);
  },

  // Bildplatzhalter.
  image_placeholder: function(slide, item) {
    fillBg(slide);
    addRichText(slide, item.title, { x: D.ML, y: D.MT, w: D.CW, h: 35, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK, align: 'CENTER' });
    addPlaceholderBox(slide, item.placeholder, D.ML, 85, D.CW, 250);
    addSource(slide, item.source);
  },

  // Split: Text links, Bildplatzhalter rechts.
  content_with_image: function(slide, item) {
    fillBg(slide);
    addRichText(slide, item.title, { x: D.ML, y: D.MT, w: D.CW, h: 35, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK });
    var halfW = (D.CW / 2) - 12;
    addRichText(slide, item.body, { x: D.ML, y: 85, w: halfW, h: 260, font: D.FONT, size: D.S_BODY_SM, color: D.TEXT_DARK, lineSpacing: 140 });
    addPlaceholderBox(slide, item.placeholder, D.ML + halfW + 24, 85, halfW, 260);
    addSource(slide, item.source);
  },

  // Copy: Folie aus anderer Präsentation kopieren.
  // Nutzt CURRENT_PRES (in generate() gesetzt), weil copySlideInto die
  // Target-Präsentation braucht — nicht nur das Slide-Objekt.
  copy: function(slide, item) {
    var config = COPY_SLIDES[item.ref];
    if (!config) {
      BUILDERS.image_placeholder(slide, {
        title: item.fallbackTitle || 'Folie manuell kopieren',
        placeholder: 'Ref nicht gefunden: ' + item.ref
      });
      return;
    }
    try {
      return copySlideInto(CURRENT_PRES, config, slide);
    } catch (err) {
      BUILDERS.image_placeholder(slide, {
        title: item.fallbackTitle || 'Folie manuell kopieren',
        placeholder: 'Manuell kopieren:\n' + (item.fallbackDesc || item.ref)
      });
    }
  }
};

/**
 * Rich-Text mit Inline-Formatierung
 *
 * parseInlineFormatting: **fett** und *kursiv* in Text-Segmente mit Stil-Flags.
 * addRichText: Textbox auf Folie, Segmente einzeln mit Stil-Reset anlegen.
 *
 * Der Style-Reset pro Segment (setBold(false).setItalic(false)) verhindert
 * Stil-Vererbung vom vorherigen Segment.
 */

function addRichText(slide, rawText, opts) {
  var box = slide.insertTextBox('');
  box.setLeft(opts.x).setTop(opts.y).setWidth(opts.w).setHeight(opts.h);
  box.setContentAlignment(SlidesApp.ContentAlignment.TOP);
  var tf = box.getText();
  var segments = parseInlineFormatting(rawText);
  for (var i = 0; i < segments.length; i++) {
    var seg = segments[i];
    var range = tf.appendText(seg.text);
    var style = range.getTextStyle();
    style.setFontFamily(opts.font).setFontSize(opts.size).setForegroundColor(opts.color);
    style.setBold(false).setItalic(false);
    if (opts.bold) style.setBold(true);
    if (opts.italic) style.setItalic(true);
    if (seg.bold) style.setBold(true);
    if (seg.italic) style.setItalic(true);
  }
  if (tf.asString().charAt(0) === '\n' && tf.asString().length > 1) {
    tf.getRange(0, 1).clear();
  }
  var para = tf.getParagraphStyle();
  if (opts.align === 'CENTER') {
    para.setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  } else {
    para.setParagraphAlignment(SlidesApp.ParagraphAlignment.START);
  }
  if (opts.lineSpacing) para.setLineSpacing(opts.lineSpacing);

  // Links: nach Text-Aufbau Substrings finden und setLinkUrl anwenden.
  // opts.links = [{find: 'chpollin.github.io', url: 'https://chpollin.github.io'}]
  if (opts.links && opts.links.length) {
    var full = tf.asString();
    for (var l = 0; l < opts.links.length; l++) {
      var link = opts.links[l];
      var idx = full.indexOf(link.find);
      if (idx !== -1) {
        tf.getRange(idx, idx + link.find.length).getTextStyle()
          .setLinkUrl(link.url)
          .setForegroundColor(D.TEXT_TEAL);
      }
    }
  }
  return box;
}

function parseInlineFormatting(text) {
  if (!text) return [{text: '', bold: false, italic: false}];
  var segments = [];
  var regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  var lastIndex = 0;
  var match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) segments.push({text: text.substring(lastIndex, match.index), bold: false, italic: false});
    if (match[2]) segments.push({text: match[2], bold: true, italic: false});
    else if (match[3]) segments.push({text: match[3], bold: false, italic: true});
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) segments.push({text: text.substring(lastIndex), bold: false, italic: false});
  if (segments.length === 0) segments.push({text: text, bold: false, italic: false});
  return segments;
}

/**
 * Shape-Helpers und Layout-Utilities.
 *
 * fillBg(slide)         — weißer Hintergrund auf Content-Folien (Master-Gradient nur auf Titel).
 * addSource(slide, s)   — kursive Quellenzeile am Fuß (y=370), grau.
 * addSpeakerNotes       — Speaker Notes in die Notes-Page schreiben.
 * addSlideNumber        — Foliennummer unten rechts.
 * addPromptBox          — gestrichelte hellgraue Box mit Monospace-Text (Consolas).
 * addPlaceholderBox     — gestrichelte Platzhalter-Box mit kursiver Beschreibung.
 * addAiBadge            — dezente Pill, "✳ Slides are LLM-assisted".
 */

function fillBg(slide) {
  slide.getBackground().setSolidFill(D.BG);
}

function addSource(slide, text) {
  if (!text) return;
  addRichText(slide, text, {
    x: D.ML, y: 370, w: D.CW, h: 25,
    font: D.FONT, size: D.S_SOURCE,
    italic: true, color: D.TEXT_GRAY
  });
}

function addSpeakerNotes(slide, text) {
  if (!text) return;
  slide.getNotesPage().getSpeakerNotesShape().getText().setText(text);
}

function addSlideNumber(slide, num) {
  var box = slide.insertTextBox(String(num));
  box.setLeft(D.W - D.MR - 30).setTop(D.H - 25).setWidth(30).setHeight(18);
  box.setContentAlignment(SlidesApp.ContentAlignment.BOTTOM);
  var style = box.getText().getTextStyle();
  style.setFontFamily(D.FONT).setFontSize(8).setForegroundColor(D.TEXT_MUTED);
  box.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.END);
}

function addPromptBox(slide, text, x, y, w, h) {
  var pad = 2;
  var rect = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, x + pad, y + pad, w - 2 * pad, h - 2 * pad);
  rect.getFill().setSolidFill('#f8f8f8');
  rect.getBorder().getLineFill().setSolidFill('#cccccc');
  rect.getBorder().setWeight(1);
  rect.getBorder().setDashStyle(SlidesApp.DashStyle.DASH);
  var tf = rect.getText();
  tf.setText(text);
  tf.getTextStyle().setFontFamily(D.FONT_MONO).setFontSize(10).setForegroundColor(D.TEXT_DARK);
  rect.setContentAlignment(SlidesApp.ContentAlignment.TOP);
  tf.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.START);
}

function addPlaceholderBox(slide, text, x, y, w, h) {
  var rect = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, x, y, w, h);
  rect.getFill().setSolidFill(D.BG_PLACEHOLDER);
  rect.getBorder().getLineFill().setSolidFill(D.BORDER_PLACEHOLDER);
  rect.getBorder().setWeight(1);
  rect.getBorder().setDashStyle(SlidesApp.DashStyle.DASH);
  var tf = rect.getText();
  tf.setText(text);
  tf.getTextStyle().setFontFamily(D.FONT).setFontSize(D.S_BODY_SM).setForegroundColor(D.TEXT_GRAY).setItalic(true);
  rect.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
  tf.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
}

/**
 * AI-Badge — kleine Pill mit dezent grauem Rahmen. Breite aus D.AI_BADGE_W,
 * damit sie an die CC-BY-Breite angeglichen werden kann.
 */
function addAiBadge(slide, x, y) {
  var rect = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, y, D.AI_BADGE_W, D.AI_BADGE_H);
  rect.getFill().setTransparent();
  rect.getBorder().getLineFill().setSolidFill('#cccccc');
  rect.getBorder().setWeight(0.5);
  var tf = rect.getText();
  tf.setText('\u2733 Slides are LLM-assisted');
  tf.getTextStyle().setFontFamily(D.FONT).setFontSize(D.AI_BADGE_FONT).setForegroundColor(D.TEXT_MUTED);
  rect.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
  tf.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
}

/**
 * Slide-Copy-Utility
 *
 * Kopiert Folien aus Quell-Präsentationen in die Ziel-Präsentation.
 * Pro Source-Präsentation wird einmalig eine temporäre Drive-Kopie angelegt
 * und in SOURCE_CACHE gehalten, damit mehrere Copy-Aufrufe aus derselben
 * Quelle nicht jedes Mal eine vollständige Drive-Kopie auslösen (teuer).
 *
 * generate() in 00_core.gs räumt den Cache am Ende via clearSourceCache() auf.
 * Ohne dieses Cleanup bleiben temporäre Kopien im Drive-Papierkorb liegen.
 *
 * Voraussetzungen: Google Slides API als Dienst aktiviert, DriveApp-Berechtigung.
 */

// Pro generate()-Lauf: Source-Pres-ID → {file, pres}.
var SOURCE_CACHE = {};

function copySlideInto(targetPres, config, placeholderSlide) {
  var cache = SOURCE_CACHE[config.pres];
  if (!cache) {
    var tempFile = DriveApp.getFileById(config.pres).makeCopy('_temp_slide_copy_' + Date.now());
    var tempPres = SlidesApp.openById(tempFile.getId());
    cache = { file: tempFile, pres: tempPres };
    SOURCE_CACHE[config.pres] = cache;
  }
  var tempSlides = cache.pres.getSlides();
  var sourceSlide = null;
  for (var i = 0; i < tempSlides.length; i++) {
    if (tempSlides[i].getObjectId() === config.id) { sourceSlide = tempSlides[i]; break; }
  }
  if (!sourceSlide) throw new Error('Slide not found: ' + config.id);
  var appended = targetPres.appendSlide(sourceSlide, SlidesApp.SlideLinkingMode.NOT_LINKED);
  placeholderSlide.remove();
  return appended;
}

function clearSourceCache() {
  for (var k in SOURCE_CACHE) {
    try { SOURCE_CACHE[k].file.setTrashed(true); } catch (e) {}
  }
  SOURCE_CACHE = {};
}

/**
 * vetmed-ws5 \u2014 Konfiguration
 *
 * Workshop 5 "Datenanalyse Verwaltung", VetMedAI KI-Kompetenzaufbau,
 * 11.06.2026, online. Ziel-Praesentation und Sprecher-Daten.
 */

var PRES_WS5 = '1JrVoKaAQE0wYqtP3_jMnEuBgt_Qhc9aoFU-JmGmeOVU';

// Kontaktdaten fuer die Titelfolie. Engine wirft Fehler, wenn PRESENTER fehlt.
var PRESENTER = {
  name:    'Dr. Christopher Pollin \u00b7 Mag. Christian Steiner',
  github:  'chpollin.github.io',
  email:   'office@dhcraft.org',
  org:     'Digital Humanities Craft OG',
  website: 'www.dhcraft.org'
};

// Keine kopierten Bibliotheks-Folien in diesem Deck.
var COPY_SLIDES = {};


// ============================================================
// WS5 \u2014 Datenanalyse Verwaltung (VetMedAI, 11.06.2026)
// Generiert aus build_content.py \u2014 nicht von Hand editieren.
// ============================================================

function getWs5Content() {
  return [
    { type: "title", title: "Datenanalyse\nin der Verwaltung", subtitle: "Von Prompt Engineering zu Context Engineering", meta: "Workshop 5 \u00b7 11. Juni 2026 \u00b7 Online\nVetMedAI \u00b7 KI-Kompetenzaufbau Veterin\u00e4rmedizinische Universit\u00e4t Wien" },

    { type: "content", title: "Claude Fable 5", body: "Anthropic ver\u00f6ffentlicht am 9. Juni 2026 **Claude Fable 5**, das erste \u00f6ffentliche Modell der **Mythos-Klasse**.\n\n\u2022 Eigene Leistungsstufe \u00fcber den bisherigen Spitzenmodellen (*Opus*)\n\u2022 Stand der Technik auf nahezu allen *Benchmarks*, darunter *Software Engineering* und Wissensarbeit\n\u2022 Arbeitet **l\u00e4nger autonom** an komplexen Aufgaben als jedes fr\u00fchere Modell\n\nDrei Jahre nach dem *GPT-4*-Beispiel von 2023 (Teil 1) setzt sich die Entwicklung unvermindert fort.", source: "Anthropic (2026). Claude Fable 5 and Claude Mythos 5. anthropic.com/news/claude-fable-5-mythos-5 \u00b7 Video: \"Claude Fable is Live...and its WILD!\", youtube.com/watch?v=KwQXyyVl2cM", notes: "Anthropic hat am 9. Juni 2026 Claude Fable 5 veroeffentlicht, das erste oeffentlich zugaengliche Modell der Mythos-Klasse. Fable 5 uebertrifft die Opus-Modelle bei laengeren, komplexeren Aufgaben und arbeitet laenger autonom als alle frueheren Claude-Modelle. Anthropic berichtet Bestwerte unter anderem in Software Engineering, Wissensarbeit, Bildverstehen und wissenschaftlicher Recherche. Das Kontextfenster umfasst eine Million Token, der Preis liegt bei 10 Dollar pro Million Eingabe-Token und 50 Dollar pro Million Ausgabe-Token. Fuer den Workshop zaehlt der Befund, dass die Modellentwicklung seit dem GPT-4-Beispiel von 2023 nicht stagniert." },

    { type: "content", title: "Fable 5 und Mythos 5: gestufte Freigabe", body: "**Mythos 5** (volles Modell) erh\u00e4lt nur ein kleiner Kreis von Cyberverteidigern und Infrastrukturbetreibern (*Project Glasswing*, mit der US-Regierung).\n\n**Fable 5** (\u00f6ffentlich) nutzt dieselbe Technologie mit **Klassifikatoren**: Anfragen zu *Cybersecurity*, Bio/Chemie oder Modell-*Destillation* \u00fcbernimmt automatisch das schw\u00e4chere Modell *Opus 4.8*.\n\nDie Schutzschicht liegt beim Anbieter, die fachliche Pr\u00fcfung der Ergebnisse beim Nutzer: **Das Werkzeug rechnet, der Mensch verantwortet.**\n\nDie Live-Demo in Teil 3 l\u00e4uft auf *Fable 5*.", source: "Anthropic (2026). Claude Fable 5 and Claude Mythos 5. anthropic.com/news/claude-fable-5-mythos-5", notes: "Die Mythos-Modelle fanden Anfang 2026 Sicherheitsluecken auf einem Niveau, das die Cybersecurity-Branche alarmierte. Das volle Modell Mythos 5 erhaelt deshalb nur ein kleiner Kreis von Cyberverteidigern und Infrastrukturbetreibern im Rahmen von Project Glasswing in Kooperation mit der US-Regierung. Das oeffentliche Fable 5 basiert auf derselben Technologie. Klassifikatoren erkennen Anfragen zu Cybersecurity, Biologie und Chemie sowie Modell-Destillation und uebergeben sie automatisch an das schwaechere Modell Opus 4.8. Die Schutzschicht liegt damit beim Anbieter, die fachliche Pruefung der Ergebnisse bleibt Aufgabe der Nutzerinnen und Nutzer. Die Live-Demo in Teil 3 laeuft auf Fable 5." },

    { type: "learning", title: "Lernziele", body: "1. Tabellarische **Verwaltungsdaten** (*Excel*, *CSV*) mit *LLM*-Unterst\u00fctzung auswerten und visualisieren\n\n2. **Code-Ausf\u00fchrung** f\u00fcr zuverl\u00e4ssige Berechnungen nutzen und von reiner Textantwort unterscheiden\n\n3. Ergebnisse **kritisch verifizieren**: Datenqualit\u00e4t, Quersummen, Fachwissen (*Critical Expert in the Loop*)\n\n4. **Grenzen** und datenschutzkonformen Einsatz (*Academic AI*) einordnen" },

    { type: "section", title: "Teil 1", subtitle: "Was ist Datenanalyse mit LLMs? Eine kurze Geschichte" },

    { type: "content", title: "2023: Das Ausgangsexperiment", body: "Eine *Excel*-Tabelle mit ausgewerteten Frageb\u00f6gen. Die Frage: Wer w\u00fcrde die eigenen kognitiven F\u00e4higkeiten verbessern, und mit welchen Methoden?\n\n\u2022 Saubere Variablen, gute Datengrundlage\n\u2022 Werkzeug: *GPT-4* mit *Advanced Data Analysis*\n\u2022 Ergebnis in rund eineinhalb Tagen\n\nDamals eher zuf\u00e4llig schon **richtig** verwendet: erst die Daten lesen, dann analysieren, dann visualisieren.", source: "Daten: Grinschgl et al., OSF-Projekt, Erhebung 2022.", notes: "Das Beispiel stammt aus einem realen Projekt zu kognitivem Enhancement. Die Teilnehmenden beantworteten Frageboegen dazu, ob sie aktive oder passive Methoden zur Steigerung ihrer kognitiven Faehigkeiten akzeptieren. Entscheidend war die saubere Datengrundlage mit klar definierten Variablen. GPT-4 mit Advanced Data Analysis fuehrte echten Python-Code aus und lieferte die Auswertung in etwa eineinhalb Tagen." },

    { type: "handson", title: "Der Prompt von 2023", body: "Bausteine, die man damals brauchte:\n\n\u2022 **Persona Modelling**\n\u2022 **Kontext** und **Aufgabe** in Schritten\n\u2022 *Chain-of-Thought*: Schritt f\u00fcr Schritt denken\n\u2022 *Emotional Prompting*: \"important to my career\"\n\nHeute ist das meiste davon **nicht mehr n\u00f6tig**.", prompt: "You are an expert in psychology\nand data visualization. Here is a\ndataset ...\n\n* Read the csv very carefully\n* Define user stories based on the\n  data and research questions\n* Implement the data visualizations\n\nTake a deep breath and work on this\nstep-by-step. This is very important\nto my career!", notes: "Der Originalprompt kombinierte Persona Modelling, Kontext, Arbeitsschritte und zwei Techniken, die heute Zeitgeschichte sind. Chain-of-Thought wurde damals in den OpenAI-Discord-Channels aufgeschnappt, Emotional Prompting sollte das Modell zu mehr Sorgfalt bewegen. Aktuelle Modelle koennen das von sich aus, der Aufwand entfaellt." },

    { type: "content", title: "Was sich ver\u00e4ndert hat", body: "***Prompt Engineering* verliert, *Context Engineering* gewinnt.**\n\n\u2022 2023: Die Kunst lag im **Bedienen** des Modells\n\u2022 Heute: Die Arbeit liegt im pr\u00e4zisen **Bereitstellen** von Aufgabe, Prozess und Daten\n\nDie Verbesserung in drei Jahren war **kategorisch**, nicht graduell. Am st\u00e4rksten dort, wo eine gute Datengrundlage vorliegt.", notes: "Der Kompetenzschwerpunkt hat sich verschoben. Frueher ging es darum, das Modell mit Tricks zu bedienen. Heute liegt die Arbeit darin, Aufgabe, Prozess und Daten praezise bereitzustellen. Diese Verschiebung ist die zentrale Botschaft des ersten Teils." },

    { type: "handson", title: "Heute: ein Satz gen\u00fcgt", body: "Derselbe Datensatz, heute in *Claude Code*:\n\n1. Daten und Codebook selbst herunterladen lassen\n2. Passende statistische Verfahren eigenst\u00e4ndig w\u00e4hlen\n3. Visualisierungen erzeugen\n4. Forschungsfragen beantworten\n\nStatt *Persona* und Tricks: eine **pr\u00e4zise Aufgabe** mit guter Datengrundlage.", prompt: "Lies Daten und Codebook unter <URL>\nund analysiere sie sorgf\u00e4ltig.\n\nForschungsfrage: Korreliert\nIntelligenz mit der Akzeptanz von\nEnhancement-Methoden?\n\nW\u00e4hle eigenst\u00e4ndig die passenden\nVerfahren und Visualisierungen,\nbegr\u00fcnde deine Wahl, dokumentiere\ndie Schritte.", notes: "Derselbe Anwendungsfall wie 2023, aber heute genuegt eine praezise Aufgabe. Claude Code laedt die Daten selbst herunter, liest das Codebook, waehlt die statistischen Verfahren und beantwortet die Forschungsfragen weitgehend autonom. Der Mensch nennt nur noch Frage und Datengrundlage." },

    { type: "content", title: "*Claude Code*: was man dabei sieht", body: "\u2022 **Terminal und *Tool Use***: das Modell l\u00e4dt die Daten selbst herunter und f\u00fchrt Code aus\n\u2022 **Permissions**: vor jeder eingreifenden Aktion fragt es nach\n\u2022 ***Read***: es liest das Codebook-PDF direkt, nichts wird abgetippt\n\u2022 **Sichtbares *Reasoning***: man sieht, was es vorhat, und kann eingreifen\n\nDas sichtbare Denken ist der **Feedback-Kanal** f\u00fcr den Menschen.", notes: "Vier Funktionen von Claude Code werden am Enhancement-Lauf sichtbar. Das Modell baut sich selbst einen Befehl, um die Daten herunterzuladen, fragt vor der Ausfuehrung um Erlaubnis, liest das Codebook-PDF direkt und zeigt sein Reasoning. Das sichtbare Denken erlaubt es, einzugreifen bevor eine falsche Richtung eingeschlagen wird." },

    { type: "content_with_image", title: "Das Ergebnis: ein \u00dcberblick", body: "Die Korrelationsmatrix zeigt:\n\n\u2022 Tats\u00e4chliche und selbsteingesch\u00e4tzte Intelligenz h\u00e4ngen moderat zusammen (*r* = 0,47)\n\u2022 Intelligenz und Akzeptanz von Enhancement: durchgehend **schwach**\n\u2022 Aktive Methoden *r* = 0,14, passive praktisch null\n\nN = 257.", placeholder: "fig3_heatmap.png\nKorrelationsmatrix der fokalen Variablen", source: "Eigene Analyse, Claude Code (2026)." },

    { type: "content_with_image", title: "Die Falle: signifikant, aber nicht haltbar", body: "Aktive Methode \u00d7 tats\u00e4chliche Intelligenz:\n\n\u2022 rohes *p* = **0,027**, sieht signifikant aus\n\u2022 nach **Holm-Korrektur**: *p* = 0,109, **n.s.**\n\nBei vier Tests muss man f\u00fcr multiples Testen korrigieren. Danach h\u00e4lt **keiner** der vier Zusammenh\u00e4nge.\n\n2023 w\u00e4re man hier in die Falle gelaufen: ein Effekt, den es nicht gibt.", placeholder: "fig1_scatter_grid.png\nVier Streudiagramme mit r, CI, p, Holm", source: "Holm (1979). Scand. J. of Statistics.", notes: "Das ist der didaktische Kern des ersten Teils. Das rohe p von 0,027 wirkt signifikant. Nach der Holm-Korrektur fuer multiples Testen steht 0,109 und der Zusammenhang haelt nicht mehr. Wer nur das rohe p liest, berichtet einen Effekt, den es nicht gibt. Das Modell hat hier korrekt korrigiert, aber verlassen darf man sich darauf nicht." },

    { type: "content", title: "*Critical Expert in the Loop*", body: "Das Modell hat hier richtig korrigiert. **Verlassen** darf man sich darauf nicht.\n\nDie menschliche Rolle verschiebt sich von **Bedienung** zu **Validierung**:\n\u2022 Wissen, *dass* man bei vier Tests korrigieren muss\n\u2022 Das Ergebnis im Output **gegenpr\u00fcfen**\n\u2022 Fachlich verantworten, was berichtet wird\n\nKonstant von 2023 bis heute: die **fachliche Validierung**.", notes: "Die Verantwortung bleibt beim Menschen. Das Modell schlaegt vor und rechnet, die Fachperson entscheidet, ob das Ergebnis traegt. Diese Rolle bleibt von 2023 bis heute konstant, waehrend sich die Werkzeuge stark veraendert haben. Damit leitet der erste Teil zum Verwaltungsfall ueber." },

    { type: "section", title: "Teil 2", subtitle: "Datenanalyse im Verwaltungsalltag" },

    { type: "content", title: "Der Anwendungsfall: Wissensbilanz", body: "Die **Wissensbilanz** braucht Personalkennzahlen je Organisationseinheit, dazu die Geschlechterverteilung.\n\n\u2022 Bisher: manuell in *Excel* zusammengetragen\n\u2022 Jetzt: im Dialog mit dem Modell, mit Kontrolle\n\nAnschluss an **Use Case 1** (Wissensbilanz-Dashboard), den Sie bereits kennen.", notes: "Der Hauptteil arbeitet mit einem echten Verwaltungsfall. Die Wissensbilanz der Universitaet braucht Personalkennzahlen je Organisationseinheit und die Geschlechterverteilung. Bisher wurde das manuell in Excel zusammengetragen. Der Fall knuepft an Use Case 1 des Projekts an, das Wissensbilanz-Dashboard." },

    { type: "content", title: "Das Werkzeug: niederschwellig", body: "*ChatGPT* oder *Claude* mit **Datei-Upload** und *Code-Interpreter*. Kein Terminal, kein Code-Schreiben.\n\n\u2022 *Excel* hochladen, Frage stellen, rechnen lassen, visualisieren\n\n**Datenschutz:** Echte Personaldaten geh\u00f6ren nicht in \u00f6ffentliche Tools. Daf\u00fcr die *Academic AI* der VetMed nutzen. Heute arbeiten wir mit **synthetischen** Daten.", notes: "Anders als die Claude-Code-Hinfuehrung laeuft der Hauptteil ueber ein niederschwelliges Werkzeug. Eine Excel-Datei wird in ChatGPT oder Claude hochgeladen, der Code-Interpreter rechnet. Fuer echte Personaldaten ist die Academic AI der VetMed der datenschutzkonforme Weg. Die heutige Demo nutzt bewusst synthetische Daten." },

    { type: "handson", title: "Schritt 1: \u00dcberblick verschaffen", body: "1. *Excel*-Datei hochladen (Blatt \"Personal\", 150 Zeilen)\n2. Das Modell den Aufbau beschreiben lassen\n3. Nach **Datenqualit\u00e4tsproblemen** fragen\n\nEin gutes Modell meldet schon hier: gemischte Zahlenformate, fehlende Werte.", prompt: "Ich habe eine Excel-Datei mit\nPersonaldaten hochgeladen (Blatt\n\"Personal\"). Verschaff dir einen\n\u00dcberblick: Zeilen, Spalten, und\nwelche Datenqualit\u00e4tsprobleme\nfallen dir auf? Noch keine\nAuswertung." },

    { type: "content_with_image", title: "Schritt 2: Z\u00e4hlen, und die Falle", body: "Frage: Personen je Organisationseinheit.\n\nDas Modell listet **zwei** Kleintierkliniken getrennt: \"Universit\u00e4tsklinik f\u00fcr Kleintiere\" (12) und \"Univ.-Klinik f. Kleintiere\" (8).\n\n**Dieselbe Klinik, zwei Schreibweisen.** Korrekt zusammengef\u00fchrt: **20**.\n\nDie Zahl sieht sauber aus und ist trotzdem falsch.", placeholder: "admin_falle_schreibvariante.png\nBalken: 8 + 12 gespalten vs. 20 korrekt", notes: "Genau dieselbe Klasse Fehler wie die Holm-Geschichte, nur im Verwaltungsfeld. Das Modell zaehlt zwei Schreibweisen derselben Klinik als getrennte Einheiten. Die korrekte Zahl ist 20, nicht 12. Die Fachperson erkennt, dass zwei Labels eine Einheit sind, das Modell nicht zuverlaessig." },

    { type: "content", title: "Schritt 3: Rechnen lassen, nicht raten", body: "Die Summe der Vollzeit\u00e4quivalente (VZ\u00c4):\n\n\u2022 **Aus dem Bauch gesch\u00e4tzt**: das Modell nennt irgendeine plausible Zahl, unzuverl\u00e4ssig\n\u2022 **Mit *Code-Interpreter***: exakt **110,00**, aber nur, wenn die Komma-Werte (\"0,75\") sauber bereinigt werden\n\nReine Textantwort bei Zahlen ist riskant. **Code-Ausf\u00fchrung erzwingen** und die Aufbereitung pr\u00fcfen.", notes: "Der Kontrast zeigt, warum Code-Ausfuehrung zaehlt. Eine reine Sprachmodell-Schaetzung von Zahlen ist unzuverlaessig. Der Code-Interpreter liefert exakt 110,00 Vollzeitaequivalente, aber nur wenn die als Text gespeicherten Komma-Werte vorher bereinigt werden. Verlaesslichkeit haengt an Code-Ausfuehrung und sauberer Aufbereitung zugleich." },

    { type: "content_with_image", title: "Schritt 4: Visualisieren", body: "Geschlechterverteilung, gesamt und je Funktionsgruppe:\n\n\u2022 gesamt 69 w, 80 m, 1 d, **Frauenanteil 46 %**\n\u2022 je Funktionsgruppe direkt als Balkendiagramm\n\n**Verifikation:** Quersumme pr\u00fcfen. 69 + 80 + 1 = 150 = Zeilenzahl. Stimmt sie nicht, hat das Modell stillschweigend Zeilen verloren.", placeholder: "admin_geschlecht.png\nGeschlecht gesamt und je Funktionsgruppe" },

    { type: "content", title: "Schritt 5: F\u00fcr den Bericht aufbereiten", body: "Eine Tabelle je Organisationseinheit mit Kopfzahl und VZ\u00c4, dazu drei S\u00e4tze Flie\u00dftext f\u00fcr die Entscheidungsvorlage.\n\n**Verifikation:**\n\u2022 Gesamt-Kopfzahl muss 150 sein, Gesamt-VZ\u00c4 110,00\n\u2022 Der Text darf nur behaupten, was die Tabelle zeigt\n\u2022 Kein \"deutlicher Anstieg\" ohne Zeitreihe", notes: "Am Ende steht ein berichtsfertiges Ergebnis. Eine Tabelle je Organisationseinheit mit Kopfzahl und Vollzeitaequivalenten plus ein kurzer Fliesstext fuer die Entscheidungsvorlage. Die Verifikation prueft, ob die Gesamtsummen stimmen und ob der Text nur behauptet, was die Tabelle belegt." },

    { type: "content", title: "Die Grenzen kennen", body: "\u2022 **Rechenfehler ohne Code**: Textantworten zu Zahlen sind unzuverl\u00e4ssig\n\u2022 **Halluzination bei Zahlen**: plausibel, aber falsch\n\u2022 **Dom\u00e4nenfehler**: zwei Schreibweisen als eine Einheit erkennt das Modell nicht zuverl\u00e4ssig\n\u2022 **Gr\u00f6\u00dfenlimits**: sehr gro\u00dfe Dateien werden gek\u00fcrzt oder gesampelt\n\u2022 **Datenschutz**: keine echten Personaldaten in \u00f6ffentliche Tools" },

    { type: "content", title: "Verifikations-Checkliste Verwaltung", body: "1. Stimmt die **Quersumme** mit der Zeilenzahl \u00fcberein?\n2. Wurde mit **Code** gerechnet, nicht gesch\u00e4tzt?\n3. Sind Kategorien **konsolidiert** (Schreibvarianten, Tippfehler, Einheiten)?\n4. Behauptet der **Text** nur, was die Tabelle zeigt?\n5. Bei echten Daten: **datenschutzkonformes** Werkzeug?", notes: "Die Checkliste fasst die Verifikationsschritte zusammen, die im Verwaltungsalltag tragen. Quersumme gegen Zeilenzahl, Rechnen mit Code statt Schaetzung, konsolidierte Kategorien, Deckung von Text und Tabelle, und bei echten Daten ein datenschutzkonformes Werkzeug." },

    { type: "section", title: "Teil 3", subtitle: "Live-Demo Claude Code und Einordnung" },

    { type: "content", title: "Live: vom Bericht zum Dashboard", body: "Der dritte Teil wechselt zu **echten Daten**: den \u00f6ffentlichen **Wissensbilanzen** der Vetmeduni 2012 bis 2025 (vierzehn PDFs).\n\n\u2022 Referenzprojekt: PDFs, daraus gepr\u00fcfte Kennzahlen, daraus ein **Dashboard**\n\u2022 Methode **Promptotyping**: erst Wissen in Dokumente (*DATA.md*, *SPECIFICATION.md*), dann Code\n\u2022 \u00d6ffentliche Daten, daher ist ein *Cloud*-Agent wie *Claude Code* hier unbedenklich\n\nLive arbeiten wir mit der fertigen Kennzahlen-Datei; die fragile PDF-Extraktion ist vorbereitet.", source: "Wissensbilanzen der Veterin\u00e4rmedizinischen Universit\u00e4t Wien (vetmeduni.ac.at, Berichte) \u00b7 Repo: vetmed-datenanalyse", notes: "Der dritte Teil arbeitet mit echten oeffentlichen Daten. Universitaeten muessen ihre Wissensbilanz jaehrlich veroeffentlichen, die Kennzahlen folgen der Wissensbilanz-Verordnung. Das Referenzprojekt vetmed-datenanalyse extrahiert aus den vierzehn PDFs der Jahrgaenge 2012 bis 2025 die Personal- und Drittmittelkennzahlen und baut daraus ein Dashboard. Die Methode ist Promptotyping, also Wissen in Dokumenten vor Code. Weil alle Daten oeffentlich sind, ist der Einsatz eines Cloud-Agenten unbedenklich. Fuer interne oder personenbezogene Daten gilt das nicht, dort bleibt die Academic AI der Weg. Die PDF-Extraktion ist vorbereitet, weil sie auf echten Quellen fragil ist. Die Live-Demo arbeitet mit der fertigen Kennzahlen-Datei." },

    { type: "handson", title: "Der Arbeitsauftrag", body: "Worauf Sie live achten k\u00f6nnen:\n\n1. **Kontext zuerst**: das Modell liest *DATA.md*, bevor es rechnet\n2. **Permissions**: vor jeder Ausf\u00fchrung kommt die Nachfrage\n3. **Tests als Gate**: der **Datenvertrag** muss gr\u00fcn bleiben\n4. Ergebnis: das **Dashboard** im Browser", prompt: "Lies knowledge/DATA.md und\nknowledge/SPECIFICATION.md.\nArbeite mit den Kennzahlen in\ndata/kennzahlen/.\nPr\u00fcfe zuerst den Datenvertrag\n(python -m pytest -q).\nBaue dann das Dashboard neu und\nfasse die wichtigsten Befunde zu\nPersonal, Frauenanteil und\nDrittmitteln zusammen.", notes: "Der Auftrag wird live in Claude Code ausgefuehrt. Das Modell liest zuerst die Wissensdokumente DATA.md und SPECIFICATION.md, das ist der Kern von Promptotyping. Vor jeder Skript-Ausfuehrung kommt die Permission-Nachfrage. Der Datenvertrag in tests/test_datenvertrag.py prueft zwanzig Bedingungen, darunter Quersummen, Frauenanteile und verankerte Sollwerte aus den PDFs. Erst wenn die Tests gruen sind, wird das Dashboard gebaut und im Browser geoeffnet." },

    { type: "content_with_image", title: "Befund: Frauenanteil 2012 bis 2025", body: "\u2022 Wissenschaftliches Personal: Frauenanteil von **59 auf 66 %**\n\u2022 Professor:innen (ab 2021 berichtet): von **32 auf 53 %**, von 12 auf 25 Personen\n\u2022 Kleine Grundgesamtheit bei Professuren: einzelne Berufungen bewegen die Kurve stark\n\nLesehinweis: Die Werte sind **Kopfzahlen**, nicht *Vollzeit\u00e4quivalente*.", placeholder: "wb_frauenanteil.png\nFrauenanteil wiss. Personal und Professor:innen", source: "Wissensbilanzen Vetmeduni 2012\u20132025, Kennzahl 1.A.1; eigene Aufbereitung (vetmed-datenanalyse).", notes: "Die Abbildung zeigt den Frauenanteil nach Kopfzahl aus vierzehn Jahrgaengen. Im wissenschaftlichen Personal stieg der Anteil von 59,3 auf 66,4 Prozent. Bei den Professuren, die erst ab 2021 getrennt berichtet werden, stieg er von 31,6 auf 53,2 Prozent, in absoluten Zahlen von 12 auf 25 Professorinnen. Bei kleinen Grundgesamtheiten bewegen einzelne Berufungen die Kurve stark, das gehoert zur Interpretation dazu. Die Werte beziehen sich auf Kopfzahlen, nicht auf Vollzeitaequivalente." },

    { type: "content_with_image", title: "Befund: Personal und Drittmittel", body: "\u2022 Wissenschaftliches Personal: von 648 K\u00f6pfen (2012) zum H\u00f6chststand 2019, zuletzt 777\n\u2022 Drittmittelerl\u00f6se (F&E) schwanken deutlich: Spitze **21,7 Mio Euro** (2019), danach R\u00fcckgang und Erholung\n\u2022 Einzelne Gro\u00dfprojekte pr\u00e4gen die Jahressumme; die Schwankung selbst ist kein Alarmsignal", placeholder: "wb_personal_drittmittel.png\nPersonalstand und Drittmittelerl\u00f6se", source: "Wissensbilanzen Vetmeduni, Kennzahlen 1.A.1 und 1.C.1; eigene Aufbereitung (vetmed-datenanalyse).", notes: "Das wissenschaftliche Personal waechst von 648 Koepfen im Jahr 2012 auf einen Hoechststand um 2019 und liegt zuletzt bei 777. Das allgemeine Personal verlaeuft parallel auf niedrigerem Niveau. Die Drittmittelerloese aus Forschung und Entwicklung schwanken zwischen rund 10 und 21,7 Millionen Euro, das Spitzenjahr ist 2019. Einzelne Grossprojekte praegen die Jahressumme, deshalb ist die Schwankung selbst kein Alarmsignal. Beide Reihen stammen aus denselben oeffentlichen Berichten." },

    { type: "content_with_image", title: "Das Dashboard", body: "Eine einzige *HTML*-Datei, offline lauff\u00e4hig:\n\n\u2022 Kennzahlen-Karten mit Vorjahresvergleich\n\u2022 Diagramme zu Frauenanteil, Personalstand, Drittmitteln\n\u2022 Umschalter Kopfzahl/*VZ\u00c4*, Jahresfilter, *PNG*- und *CSV*-Export\n\nGebaut im Dialog mit *Claude Code*, gesichert durch den **Datenvertrag**.", placeholder: "wb_dashboard.png\nDashboard mit Kennzahlen-Karten und Frauenanteil", source: "vetmed-datenanalyse, dashboard/index.html.", notes: "Das Dashboard ist eine einzelne HTML-Datei ohne externe Abhaengigkeiten und laeuft offline per Doppelklick. Es zeigt Kennzahlen-Karten mit Vorjahresvergleich, Diagramme zu Frauenanteil, Personalstand und Drittmitteln, einen Umschalter zwischen Kopfzahl und Vollzeitaequivalenten, Jahresfilter sowie Export als PNG und CSV. Gebaut wurde es im Dialog mit Claude Code, die Datenbasis sichert der Datenvertrag mit zwanzig Pruefungen." },

    { type: "content", title: "Verifikation: der Datenvertrag", body: "Bei echten Daten pr\u00fcfen **Tests** statt bekannter Sollwerte:\n\n\u2022 **Konsistenz**: Frauen plus M\u00e4nner ergibt Gesamt, keine L\u00fccken, Frauenanteil korrekt berechnet\n\u2022 **Quellbindung**: verankerte Werte aus den PDFs (*Golden Values*), \u00dcberlappung benachbarter Jahrg\u00e4nge\n\nKonsistenz allein sichert keine Korrektheit gegen die Quelle. Die Anker setzt der Mensch: *Critical Expert in the Loop*.\n\n**Mehr Autonomie hei\u00dft mehr Verifikation, nicht weniger.** Vertiefung: *VetMed Winter School*.", notes: "Bei echten Daten gibt es keine vorab bekannten Sollwerte wie beim synthetischen Datensatz in Teil 2. An ihre Stelle tritt der Datenvertrag mit zwanzig Pruefungen auf zwei Ebenen. Die Konsistenzebene prueft, dass Frauen plus Maenner Gesamt ergibt, dass keine Jahrgaenge fehlen und dass der Frauenanteil korrekt berechnet ist. Die Quellbindungsebene verankert einzelne Werte direkt aus den PDFs und prueft die Ueberlappung benachbarter Jahrgaenge. Konsistenz allein sichert keine Korrektheit gegen die Quelle, erst beide Ebenen zusammen. Die verankerten Werte hat der Mensch aus den Quellen gesetzt. Je autonomer das Werkzeug arbeitet, desto wichtiger wird diese Pruefung. Die VetMed Winter School vertieft den Arbeitsmodus." },

    { type: "content", title: "Welches Werkzeug wann?", body: "\u2022 **Schnell und niederschwellig**: *ChatGPT* oder *Claude* mit Datei-Upload, f\u00fcr einmalige Auswertungen\n\u2022 **Datenschutzkonform**: *Academic AI* der VetMed, f\u00fcr echte Personal- und Verwaltungsdaten\n\u2022 **M\u00e4chtig und wiederholbar**: *Claude Code*, f\u00fcr wiederkehrende oder komplexe Auswertungen\n\nDie Frage ist nicht \"welches Tool\", sondern \"welche Aufgabe\".", notes: "Die drei Werkzeuge decken unterschiedliche Beduerfnisse ab. Datei-Upload fuer schnelle Einzelauswertungen, Academic AI fuer echte Verwaltungsdaten, Claude Code fuer wiederkehrende oder komplexe Aufgaben. Der Ausgangspunkt ist immer die Aufgabe, nicht das Werkzeug." },

    { type: "discussion", question: "Welche wiederkehrende Auswertung aus Ihrem Arbeitsalltag w\u00fcrden Sie als Erstes mit einem *LLM* ausprobieren, und welche Datenqualit\u00e4tsfalle erwarten Sie dabei?" },

    { type: "content", title: "Zusammenfassung", body: "Die durchgehende Linie:\n\n\u2022 2023: Kompetenz war **Prompt Engineering** (Persona, *Chain-of-Thought*, Tricks)\n\u2022 Heute: Kompetenz ist **Context Engineering** (Aufgabe, Prozess, Daten pr\u00e4zise bereitstellen)\n\u2022 Konstant: die **fachliche Validierung**\n\nDas Werkzeug rechnet. **Der Mensch verantwortet.**", notes: "Die Zusammenfassung spannt den Bogen ueber beide Teile. Frueher lag die Kompetenz im Prompt Engineering, heute im Context Engineering. Konstant bleibt die fachliche Validierung. Das Werkzeug rechnet, der Mensch verantwortet das Ergebnis." }
  ];
}


// ============================================================
// WS5 Delta \u2014 Fable-5-Opener + Teil-3-Live-Demo (10.06.2026)
// Generiert aus build_content.py \u2014 nicht von Hand editieren.
// Fuer generateAppend(): haengt hinten an, danach manuell
// einsortieren (Opener nach Folie 1, Live-Demo nach Section Teil 3).
// ============================================================

function getWs5DeltaContent() {
  return [
    { type: "content", title: "Claude Fable 5", body: "Anthropic ver\u00f6ffentlicht am 9. Juni 2026 **Claude Fable 5**, das erste \u00f6ffentliche Modell der **Mythos-Klasse**.\n\n\u2022 Eigene Leistungsstufe \u00fcber den bisherigen Spitzenmodellen (*Opus*)\n\u2022 Stand der Technik auf nahezu allen *Benchmarks*, darunter *Software Engineering* und Wissensarbeit\n\u2022 Arbeitet **l\u00e4nger autonom** an komplexen Aufgaben als jedes fr\u00fchere Modell\n\nDrei Jahre nach dem *GPT-4*-Beispiel von 2023 (Teil 1) setzt sich die Entwicklung unvermindert fort.", source: "Anthropic (2026). Claude Fable 5 and Claude Mythos 5. anthropic.com/news/claude-fable-5-mythos-5 \u00b7 Video: \"Claude Fable is Live...and its WILD!\", youtube.com/watch?v=KwQXyyVl2cM", notes: "Anthropic hat am 9. Juni 2026 Claude Fable 5 veroeffentlicht, das erste oeffentlich zugaengliche Modell der Mythos-Klasse. Fable 5 uebertrifft die Opus-Modelle bei laengeren, komplexeren Aufgaben und arbeitet laenger autonom als alle frueheren Claude-Modelle. Anthropic berichtet Bestwerte unter anderem in Software Engineering, Wissensarbeit, Bildverstehen und wissenschaftlicher Recherche. Das Kontextfenster umfasst eine Million Token, der Preis liegt bei 10 Dollar pro Million Eingabe-Token und 50 Dollar pro Million Ausgabe-Token. Fuer den Workshop zaehlt der Befund, dass die Modellentwicklung seit dem GPT-4-Beispiel von 2023 nicht stagniert." },

    { type: "content", title: "Fable 5 und Mythos 5: gestufte Freigabe", body: "**Mythos 5** (volles Modell) erh\u00e4lt nur ein kleiner Kreis von Cyberverteidigern und Infrastrukturbetreibern (*Project Glasswing*, mit der US-Regierung).\n\n**Fable 5** (\u00f6ffentlich) nutzt dieselbe Technologie mit **Klassifikatoren**: Anfragen zu *Cybersecurity*, Bio/Chemie oder Modell-*Destillation* \u00fcbernimmt automatisch das schw\u00e4chere Modell *Opus 4.8*.\n\nDie Schutzschicht liegt beim Anbieter, die fachliche Pr\u00fcfung der Ergebnisse beim Nutzer: **Das Werkzeug rechnet, der Mensch verantwortet.**\n\nDie Live-Demo in Teil 3 l\u00e4uft auf *Fable 5*.", source: "Anthropic (2026). Claude Fable 5 and Claude Mythos 5. anthropic.com/news/claude-fable-5-mythos-5", notes: "Die Mythos-Modelle fanden Anfang 2026 Sicherheitsluecken auf einem Niveau, das die Cybersecurity-Branche alarmierte. Das volle Modell Mythos 5 erhaelt deshalb nur ein kleiner Kreis von Cyberverteidigern und Infrastrukturbetreibern im Rahmen von Project Glasswing in Kooperation mit der US-Regierung. Das oeffentliche Fable 5 basiert auf derselben Technologie. Klassifikatoren erkennen Anfragen zu Cybersecurity, Biologie und Chemie sowie Modell-Destillation und uebergeben sie automatisch an das schwaechere Modell Opus 4.8. Die Schutzschicht liegt damit beim Anbieter, die fachliche Pruefung der Ergebnisse bleibt Aufgabe der Nutzerinnen und Nutzer. Die Live-Demo in Teil 3 laeuft auf Fable 5." },

    { type: "content", title: "Live: vom Bericht zum Dashboard", body: "Der dritte Teil wechselt zu **echten Daten**: den \u00f6ffentlichen **Wissensbilanzen** der Vetmeduni 2012 bis 2025 (vierzehn PDFs).\n\n\u2022 Referenzprojekt: PDFs, daraus gepr\u00fcfte Kennzahlen, daraus ein **Dashboard**\n\u2022 Methode **Promptotyping**: erst Wissen in Dokumente (*DATA.md*, *SPECIFICATION.md*), dann Code\n\u2022 \u00d6ffentliche Daten, daher ist ein *Cloud*-Agent wie *Claude Code* hier unbedenklich\n\nLive arbeiten wir mit der fertigen Kennzahlen-Datei; die fragile PDF-Extraktion ist vorbereitet.", source: "Wissensbilanzen der Veterin\u00e4rmedizinischen Universit\u00e4t Wien (vetmeduni.ac.at, Berichte) \u00b7 Repo: vetmed-datenanalyse", notes: "Der dritte Teil arbeitet mit echten oeffentlichen Daten. Universitaeten muessen ihre Wissensbilanz jaehrlich veroeffentlichen, die Kennzahlen folgen der Wissensbilanz-Verordnung. Das Referenzprojekt vetmed-datenanalyse extrahiert aus den vierzehn PDFs der Jahrgaenge 2012 bis 2025 die Personal- und Drittmittelkennzahlen und baut daraus ein Dashboard. Die Methode ist Promptotyping, also Wissen in Dokumenten vor Code. Weil alle Daten oeffentlich sind, ist der Einsatz eines Cloud-Agenten unbedenklich. Fuer interne oder personenbezogene Daten gilt das nicht, dort bleibt die Academic AI der Weg. Die PDF-Extraktion ist vorbereitet, weil sie auf echten Quellen fragil ist. Die Live-Demo arbeitet mit der fertigen Kennzahlen-Datei." },

    { type: "handson", title: "Der Arbeitsauftrag", body: "Worauf Sie live achten k\u00f6nnen:\n\n1. **Kontext zuerst**: das Modell liest *DATA.md*, bevor es rechnet\n2. **Permissions**: vor jeder Ausf\u00fchrung kommt die Nachfrage\n3. **Tests als Gate**: der **Datenvertrag** muss gr\u00fcn bleiben\n4. Ergebnis: das **Dashboard** im Browser", prompt: "Lies knowledge/DATA.md und\nknowledge/SPECIFICATION.md.\nArbeite mit den Kennzahlen in\ndata/kennzahlen/.\nPr\u00fcfe zuerst den Datenvertrag\n(python -m pytest -q).\nBaue dann das Dashboard neu und\nfasse die wichtigsten Befunde zu\nPersonal, Frauenanteil und\nDrittmitteln zusammen.", notes: "Der Auftrag wird live in Claude Code ausgefuehrt. Das Modell liest zuerst die Wissensdokumente DATA.md und SPECIFICATION.md, das ist der Kern von Promptotyping. Vor jeder Skript-Ausfuehrung kommt die Permission-Nachfrage. Der Datenvertrag in tests/test_datenvertrag.py prueft zwanzig Bedingungen, darunter Quersummen, Frauenanteile und verankerte Sollwerte aus den PDFs. Erst wenn die Tests gruen sind, wird das Dashboard gebaut und im Browser geoeffnet." },

    { type: "content_with_image", title: "Befund: Frauenanteil 2012 bis 2025", body: "\u2022 Wissenschaftliches Personal: Frauenanteil von **59 auf 66 %**\n\u2022 Professor:innen (ab 2021 berichtet): von **32 auf 53 %**, von 12 auf 25 Personen\n\u2022 Kleine Grundgesamtheit bei Professuren: einzelne Berufungen bewegen die Kurve stark\n\nLesehinweis: Die Werte sind **Kopfzahlen**, nicht *Vollzeit\u00e4quivalente*.", placeholder: "wb_frauenanteil.png\nFrauenanteil wiss. Personal und Professor:innen", source: "Wissensbilanzen Vetmeduni 2012\u20132025, Kennzahl 1.A.1; eigene Aufbereitung (vetmed-datenanalyse).", notes: "Die Abbildung zeigt den Frauenanteil nach Kopfzahl aus vierzehn Jahrgaengen. Im wissenschaftlichen Personal stieg der Anteil von 59,3 auf 66,4 Prozent. Bei den Professuren, die erst ab 2021 getrennt berichtet werden, stieg er von 31,6 auf 53,2 Prozent, in absoluten Zahlen von 12 auf 25 Professorinnen. Bei kleinen Grundgesamtheiten bewegen einzelne Berufungen die Kurve stark, das gehoert zur Interpretation dazu. Die Werte beziehen sich auf Kopfzahlen, nicht auf Vollzeitaequivalente." },

    { type: "content_with_image", title: "Befund: Personal und Drittmittel", body: "\u2022 Wissenschaftliches Personal: von 648 K\u00f6pfen (2012) zum H\u00f6chststand 2019, zuletzt 777\n\u2022 Drittmittelerl\u00f6se (F&E) schwanken deutlich: Spitze **21,7 Mio Euro** (2019), danach R\u00fcckgang und Erholung\n\u2022 Einzelne Gro\u00dfprojekte pr\u00e4gen die Jahressumme; die Schwankung selbst ist kein Alarmsignal", placeholder: "wb_personal_drittmittel.png\nPersonalstand und Drittmittelerl\u00f6se", source: "Wissensbilanzen Vetmeduni, Kennzahlen 1.A.1 und 1.C.1; eigene Aufbereitung (vetmed-datenanalyse).", notes: "Das wissenschaftliche Personal waechst von 648 Koepfen im Jahr 2012 auf einen Hoechststand um 2019 und liegt zuletzt bei 777. Das allgemeine Personal verlaeuft parallel auf niedrigerem Niveau. Die Drittmittelerloese aus Forschung und Entwicklung schwanken zwischen rund 10 und 21,7 Millionen Euro, das Spitzenjahr ist 2019. Einzelne Grossprojekte praegen die Jahressumme, deshalb ist die Schwankung selbst kein Alarmsignal. Beide Reihen stammen aus denselben oeffentlichen Berichten." },

    { type: "content_with_image", title: "Das Dashboard", body: "Eine einzige *HTML*-Datei, offline lauff\u00e4hig:\n\n\u2022 Kennzahlen-Karten mit Vorjahresvergleich\n\u2022 Diagramme zu Frauenanteil, Personalstand, Drittmitteln\n\u2022 Umschalter Kopfzahl/*VZ\u00c4*, Jahresfilter, *PNG*- und *CSV*-Export\n\nGebaut im Dialog mit *Claude Code*, gesichert durch den **Datenvertrag**.", placeholder: "wb_dashboard.png\nDashboard mit Kennzahlen-Karten und Frauenanteil", source: "vetmed-datenanalyse, dashboard/index.html.", notes: "Das Dashboard ist eine einzelne HTML-Datei ohne externe Abhaengigkeiten und laeuft offline per Doppelklick. Es zeigt Kennzahlen-Karten mit Vorjahresvergleich, Diagramme zu Frauenanteil, Personalstand und Drittmitteln, einen Umschalter zwischen Kopfzahl und Vollzeitaequivalenten, Jahresfilter sowie Export als PNG und CSV. Gebaut wurde es im Dialog mit Claude Code, die Datenbasis sichert der Datenvertrag mit zwanzig Pruefungen." },

    { type: "content", title: "Verifikation: der Datenvertrag", body: "Bei echten Daten pr\u00fcfen **Tests** statt bekannter Sollwerte:\n\n\u2022 **Konsistenz**: Frauen plus M\u00e4nner ergibt Gesamt, keine L\u00fccken, Frauenanteil korrekt berechnet\n\u2022 **Quellbindung**: verankerte Werte aus den PDFs (*Golden Values*), \u00dcberlappung benachbarter Jahrg\u00e4nge\n\nKonsistenz allein sichert keine Korrektheit gegen die Quelle. Die Anker setzt der Mensch: *Critical Expert in the Loop*.\n\n**Mehr Autonomie hei\u00dft mehr Verifikation, nicht weniger.** Vertiefung: *VetMed Winter School*.", notes: "Bei echten Daten gibt es keine vorab bekannten Sollwerte wie beim synthetischen Datensatz in Teil 2. An ihre Stelle tritt der Datenvertrag mit zwanzig Pruefungen auf zwei Ebenen. Die Konsistenzebene prueft, dass Frauen plus Maenner Gesamt ergibt, dass keine Jahrgaenge fehlen und dass der Frauenanteil korrekt berechnet ist. Die Quellbindungsebene verankert einzelne Werte direkt aus den PDFs und prueft die Ueberlappung benachbarter Jahrgaenge. Konsistenz allein sichert keine Korrektheit gegen die Quelle, erst beide Ebenen zusammen. Die verankerten Werte hat der Mensch aus den Quellen gesetzt. Je autonomer das Werkzeug arbeitet, desto wichtiger wird diese Pruefung. Die VetMed Winter School vertieft den Arbeitsmodus." }
  ];
}

/**
 * vetmed-ws5 — Entry Point
 *
 * In Apps Script ausfuehren: generateWs5().
 * Voraussetzung: Slides API v1 als Dienst aktiviert, DHCraft-Master eingerichtet.
 */

function generateWs5() { generate(PRES_WS5, getWs5Content()); }

// Delta 10.06.2026: haengt Fable-5-Opener + Teil-3-Live-Demo hinten an,
// ohne bestehende Folien (mit manuell eingefuegten Bildern) anzutasten.
function generateWs5Delta() { generateAppend(PRES_WS5, getWs5DeltaContent()); }

