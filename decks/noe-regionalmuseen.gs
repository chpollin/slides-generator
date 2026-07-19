/**
 * slides-generator — combined build for presentation: noe-regionalmuseen
 * Generated 2026-06-16 14:31 from 1344aa6
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
 * noe-regionalmuseen — Konfiguration
 *
 * Workshop "Sammlung online: was nun? Von der Datenbank zum Publikum",
 * NOe Regionalmuseen, 26.06.2026, Schloss Atzenbrugg. Demo-Vortrag.
 * Ziel-Praesentation und Sprecher-Daten.
 */

// Ziel-Praesentation. Master-Template (DHCraft) muss eingerichtet sein.
var PRES_NOE = '1oVPQzDYS7-UBVUP0FWNyuTOC_6ZQKBhYd3-N8_P8UzI';

// Kontaktdaten fuer die Titelfolie. Engine wirft Fehler, wenn PRESENTER fehlt.
var PRESENTER = {
  name:    'Dr. Christopher Pollin',
  github:  'chpollin.github.io',
  email:   'office@dhcraft.org',
  org:     'Digital Humanities Craft OG',
  website: 'www.dhcraft.org'
};

// Keine kopierten Bibliotheks-Folien in diesem Deck.
var COPY_SLIDES = {};

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

/**
 * noe-regionalmuseen — Entry Point
 *
 * In Apps Script ausfuehren: generateNoe().
 * Voraussetzung: Slides API v1 als Dienst aktiviert, DHCraft-Master eingerichtet.
 */

function generateNoe() { generate(PRES_NOE, getNoeContent()); }

