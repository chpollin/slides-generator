/**
 * slides-generator — combined build for presentation: bibliotheksinformatik
 * Generated 2026-04-14 09:54 from d17afcd
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

  TEXT_BLACK:     '#1a1a1a',
  TEXT_DARK:      '#333333',
  TEXT_GRAY:      '#666666',
  TEXT_MUTED:     '#888888',
  TEXT_TEAL:      '#2a7a7a',  // nur für Hyperlinks (via opts.links)

  BORDER_PLACEHOLDER: '#aaaaaa',

  FONT:      'Helvetica Neue',
  FONT_MONO: 'Consolas',

  S_TITLE:      28,
  S_SUBTITLE:   16,
  S_META:       11,
  S_HEADING:    22,
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
  DATA_LIB:   '11PAq52of5siHNYDwC7ksu5S-7EzJKFB1rcxSOlqe3Z8', // Data Librarian Wien 2023
  BIBLIOTHEK: '1BmPZTnL2JULg_nXrU8mx2EBfmhaDPaVnoiaZU8G1rjI'  // Bibliotheksinformatik (Quelle)
};

// Flach — keine thematische Zwischenebene. Neue Einträge hier, nach Bedarf sortiert.
var SLIDE_REGISTRY = {
  wissenspyramide:  { pres: SOURCE_PRES.DATA_LIB,   id: 'gc43cc7a388_0_7'   },
  dikw_network:     { pres: SOURCE_PRES.DATA_LIB,   id: 'gc43cc7a388_0_248' },
  wie_llms:         { pres: SOURCE_PRES.BIBLIOTHEK, id: 'g3972826d70a_0_278' },
  transformer:      { pres: SOURCE_PRES.BIBLIOTHEK, id: 'g3972826d70a_0_348' },
  training_phases:  { pres: SOURCE_PRES.BIBLIOTHEK, id: 'g3972826d70a_0_359' }
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
    builder(slide, item);

    // Foliennummern auf Content-Folien (nicht auf Titel, Section, Copy).
    if (item.type !== 'title' && item.type !== 'section' && item.type !== 'copy') {
      addSlideNumber(slide, slideNum);
    }
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
      copySlideInto(CURRENT_PRES, config, slide);
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
 * Kopiert eine Folie aus einer Quell-Präsentation in die Ziel-Präsentation.
 * Arbeitet über temporäre Drive-Kopie der Quell-Präsentation, reduziert auf
 * die Ziel-Folie, hängt sie an und löscht die temporäre Datei.
 *
 * Voraussetzungen: Google Slides API als Dienst aktiviert, DriveApp-Berechtigung.
 */

function copySlideInto(targetPres, config, placeholderSlide) {
  var tempFile = DriveApp.getFileById(config.pres).makeCopy('_temp_slide_copy');
  var tempPres = SlidesApp.openById(tempFile.getId());
  var tempSlides = tempPres.getSlides();
  var sourceSlide = null;
  for (var i = 0; i < tempSlides.length; i++) {
    if (tempSlides[i].getObjectId() === config.id) { sourceSlide = tempSlides[i]; break; }
  }
  if (!sourceSlide) { tempFile.setTrashed(true); throw new Error('Slide not found: ' + config.id); }
  for (var i = tempSlides.length - 1; i >= 0; i--) {
    if (tempSlides[i].getObjectId() !== config.id) tempSlides[i].remove();
  }
  targetPres.appendSlide(sourceSlide, SlidesApp.SlideLinkingMode.NOT_LINKED);
  placeholderSlide.remove();
  tempFile.setTrashed(true);
}

/**
 * Bibliotheksinformatik — Konfiguration
 *
 * VU Künstliche Intelligenz in Bibliotheken, 3 Tage, Juni 2026.
 * Ziel-Präsentationen, Sprecher-Daten und Slide-Copy-Konfiguration.
 */

var PRES_TAG1 = '1p6oRuF2NBqXm3jZ_VuNyST7qzpzbG1AFWuXUswbMmCQ';
var PRES_TAG2 = '1TDVFRRuh4xNx-SeZRSC1NcRgzWv-6EOZTIzRQ6_wZy0';
var PRES_TAG3 = '17RUPp3cDkwGM2CLISMbRu6uRKI0XSTxC0-qaaHkNCic';

// Kontaktdaten, die der Title-Builder in die Titelfolien einsetzt.
// Engine wirft Fehler, wenn PRESENTER fehlt.
var PRESENTER = {
  name:    'Dr. Christopher Pollin MA MA',
  github:  'chpollin.github.io',
  email:   'christopher.pollin@dhcraft.org',
  org:     'Digital Humanities Craft OG',
  website: 'www.dhcraft.org'
};

// Ausgewählte Slides aus lib/slide-library.gs. Keys sind die refs,
// die im Content-Array als { type: 'copy', ref: '...' } erscheinen.
var COPY_SLIDES = {
  wissenspyramide:  SLIDE_REGISTRY.wissenspyramide,
  dikw_network:     SLIDE_REGISTRY.dikw_network,
  wie_llms:         SLIDE_REGISTRY.wie_llms,
  transformer:      SLIDE_REGISTRY.transformer,
  training_phases:  SLIDE_REGISTRY.training_phases
};

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


// ============================================================
// TAG 2 — Sprachmodelle und Grenzen (20 Folien)
// ============================================================

function getTag2Content() {
  return [
    { type: 'title', title: 'K\u00fcnstliche Intelligenz\nin Bibliotheken', subtitle: 'Wie Sprachmodelle funktionieren und wo sie scheitern', meta: 'Block 7a.4 Bibliotheksinformatik \u00b7 9. Juni 2026 \u00b7 Wien\nULG Library and Information Studies' },

    { type: 'learning', title: 'Lernziele', body: '1. Die Funktionsweise generativer **Sprachmodelle** erkl\u00e4ren und erste *Prompts* formulieren\n\n2. Systematische **Grenzen** von *LLMs* anhand konkreter Beispiele aus dem Bibliothekswesen identifizieren\n\n3. KI-Einsatzszenarien unter Gesichtspunkten der **Forschungsintegrit\u00e4t**, *Prozesstransparenz* und Modelloffenheit bewerten\n\n4. **Evaluierungsmethoden** f\u00fcr KI-Werkzeuge auf bibliothekarische Anwendungsf\u00e4lle anwenden' },

    { type: 'section', title: 'Block 1', subtitle: 'Grundlagen generativer KI' },

    { type: 'copy', ref: 'wie_llms', fallbackTitle: 'Wie LLMs funktionieren', fallbackDesc: 'Tokenisierung, Wahrscheinlichkeitsverteilung, autoregressive Generierung' },

    { type: 'content_with_image', title: 'Die "Gestalt" eines Wikipedia-Artikels', body: '*LLMs* k\u00f6nnen nicht direkt auf Wikipedia zugreifen. Sie haben die "**Gestalt**" des Textes (Karpathy): komprimierte statistische Muster aus dem *Pre-Training*.\n\nBei Text \u00fcber Zebras nutzt das Modell *Next-Token-Prediction*, nicht den gespeicherten Artikel. Deshalb: koh\u00e4rent \u00fcber Zebraarten sprechen, aber nicht den exakten Text reproduzieren.\n\n**Parametrisches Wissen** (in den Gewichten) vs. **kontextuelles Wissen** (im *Prompt*). Externe Quellen nur \u00fcber *Tool Use* (*RAG*, *MCP*).', placeholder: 'Wikipedia-Artikel "Zebras" (vollst\u00e4ndig)\nvs. komprimierte Gestalt im Parameterraum', source: 'Karpathy, A. (2024). Konzept via Pollin (2025), lecture-manuscript.' },

    { type: 'copy', ref: 'transformer', fallbackTitle: 'Transformer-Architektur', fallbackDesc: 'Attention-Mechanismus, Encoder-Decoder vs. Decoder-only' },
    { type: 'copy', ref: 'training_phases', fallbackTitle: 'Pre-Training / Post-Training / Embeddings', fallbackDesc: 'Pre-Training = Knowledge, Post-Training = Skills' },

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


// ============================================================
// TAG 3 — Vom Prompt zur Strategie (20 Folien)
// ============================================================

function getTag3Content() {
  return [
    { type: 'title', title: 'K\u00fcnstliche Intelligenz\nin Bibliotheken', subtitle: 'Vom Prompt zur Strategie', meta: 'Block 7a.4 Bibliotheksinformatik \u00b7 10. Juni 2026 \u00b7 Wien\nULG Library and Information Studies' },

    { type: 'learning', title: 'Lernziele', body: '1. *Best Practices* f\u00fcr *Prompts* in bibliographischen und erschlie\u00dfenden Aufgaben anwenden\n\n2. Eine mehrstufige **KI-Pipeline** von der *OCR* bis zur Metadatenanreicherung mit *Promptotyping* aufbauen\n\n3. *KI-Agenten* als Werkzeuge f\u00fcr bibliothekarische *Workflows* praktisch einsetzen\n\n4. Eine **KI-Einsatzstrategie** f\u00fcr den eigenen Arbeitskontext formulieren' },

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

/**
 * Bibliotheksinformatik — Entry Points
 *
 * Eine Funktion pro Tag. In Apps Script einzeln ausführen (6-Minuten-Limit pro Run).
 * generateAll() für alle drei nacheinander, mit Pausen.
 */

function generateTag1() { generate(PRES_TAG1, getTag1Content()); }
function generateTag2() { generate(PRES_TAG2, getTag2Content()); }
function generateTag3() { generate(PRES_TAG3, getTag3Content()); }

function generateAll() {
  generateTag1(); Utilities.sleep(2000);
  generateTag2(); Utilities.sleep(2000);
  generateTag3();
}

