/**
 * slides-generator — combined build for presentation: sugw-frontend-provenienz
 * Generated 2026-04-15 20:45 from 47f0cfd
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
 * SuGW Frontend — Datenbasis und Provenienz (17.04.2026)
 *
 * Vorbesprechung zu dritt vor dem Wien-Block 23./24.04.
 * Ziel-Praesentation und Sprecher-Daten.
 */

var PRES_PROVENIENZ = '1fMHIIMtkekDje0XTk-Ro-8nB_qXBqg6Mgqy4qWhX1DI';

var PRESENTER = {
  name:    'Dr. Christopher Pollin MA MA',
  github:  'chpollin.github.io',
  email:   'christopher.pollin@dhcraft.org',
  org:     'Digital Humanities Craft OG',
  website: 'www.dhcraft.org'
};

// Keine COPY_SLIDES fuer dieses Deck.
var COPY_SLIDES = {};

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

/**
 * SuGW Frontend Provenienz — Entry Point
 *
 * In Apps Script ausfuehren. 6-Minuten-Limit pro Run beachten.
 */

function generateProvenienz() {
  generate(PRES_PROVENIENZ, getProvenienzContent());
}

