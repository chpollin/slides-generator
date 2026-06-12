/**
 * slides-generator — combined build for presentation: femprompt-sozarb
 * Generated 2026-04-22 09:04 from d64bc07
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
 * FemPrompt SozArb, Internes Team-Update
 * Thema: Deep-Research-gestützte Literature-Reviews, Epistemische Infrastruktur als Praxis
 */

var PRES_FEMPROMPT = '1Ys1ZU53AiClV1eN_vVd3y1Q48LWjS2yiQ7bEGUVQTTI';

// Kontaktdaten, die der Title-Builder auf die Titelfolie setzt.
var PRESENTER = {
  name:    'Dr. Christopher Pollin MA MA',
  github:  'chpollin.github.io',
  email:   'christopher.pollin@dhcraft.org',
  org:     'Digital Humanities Craft OG',
  website: 'www.dhcraft.org'
};

// Keine Slide-Kopien für dieses Deck.
var COPY_SLIDES = {};

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

/**
 * FemPrompt SozArb, Entry Point
 * In Apps Script ausführen: generateFemPrompt()
 */

function generateFemPrompt() {
  generate(PRES_FEMPROMPT, getFemPromptContent());
}

