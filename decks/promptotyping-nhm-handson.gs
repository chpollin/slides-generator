/**
 * slides-generator — combined build for presentation: promptotyping-nhm-handson
 * Generated 2026-04-19 14:59 from d64bc07
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
  S_PROMPT:     11,

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

  // Prioritaet: Container-gebundene Praesentation vor openById.
  // Container-Bindung (Extensions -> Apps Script im Ziel-Deck) ist eindeutig
  // und umgeht Permission-Probleme, die openById gelegentlich hat.
  var pres = SlidesApp.getActivePresentation();
  if (!pres) {
    try {
      pres = SlidesApp.openById(presId);
    } catch (err) {
      throw new Error('Keine Praesentation verfuegbar. Script weder container-gebunden noch kann es openById("' + presId + '") ausfuehren. Loesung: Script unter Extensions -> Apps Script im Ziel-Deck anlegen. Original: ' + err.message);
    }
  }
  if (!pres || typeof pres.getSlides !== 'function') {
    throw new Error('Praesentationsobjekt ungueltig. pres=' + pres);
  }
  CURRENT_PRES = pres;

  Logger.log('=== generate() target ===');
  Logger.log('Deck: ' + pres.getName() + ' (' + pres.getId() + ')');
  Logger.log('URL:  ' + pres.getUrl());
  Logger.log('Folien vor Clear: ' + pres.getSlides().length);
  Logger.log('Content-Array Laenge: ' + (content ? content.length : 'undefined'));

  var slides = pres.getSlides();
  for (var i = slides.length - 1; i >= 1; i--) slides[i].remove();

  var slideNum = 0;
  for (var i = 0; i < content.length; i++) {
    var item = content[i];
    slideNum++;

    try {
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
        Logger.log('FEHLER Folie ' + (i+1) + ': Unbekannter Typ "' + item.type + '"');
        continue;
      }
      builder(slide, item);

      if (item.type !== 'title' && item.type !== 'section' && item.type !== 'copy') {
        addSlideNumber(slide, slideNum);
      }
      Logger.log('Folie ' + (i+1) + ' ok: type=' + item.type + (item.title ? ', title=' + String(item.title).substring(0, 40) : ''));
    } catch (err) {
      Logger.log('FEHLER Folie ' + (i+1) + ' (type=' + item.type + '): ' + err.message);
      Logger.log('Stack: ' + err.stack);
    }
  }
  Logger.log('generate() fertig. Folien im Deck jetzt: ' + pres.getSlides().length);
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
  tf.getTextStyle().setFontFamily(D.FONT_MONO).setFontSize(D.S_PROMPT).setForegroundColor(D.TEXT_DARK);
  tf.getParagraphStyle().setLineSpacing(115);
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
 * Promptotyping Workshop NHM Wien — Hands-On-Teil
 *
 * Workshop 1 des Doppelworkshops Museumsbund Österreich,
 * 24.04.2026, 10:00–13:00, Kurssaal Naturhistorisches Museum Wien.
 * Dieses Deck deckt den zweiten Workshop-Teil ab: Arbeit am eigenen Promptotype.
 */

var PRES_HANDSON = '1ykEK9kFesLtQPI9Ql1fVrVpJV73ixNLdVDbd72PMnJo';

var PRESENTER = {
  name:    'Dr. Christopher Pollin',
  github:  'chpollin.github.io',
  email:   'christopher.pollin@dhcraft.org',
  org:     'Digital Humanities Craft OG',
  website: 'www.dhcraft.org'
};

// Keine Slide-Library-Refs in diesem Deck.
var COPY_SLIDES = {};

// PROMPTOTYPING HANDS-ON v2 — ca. 22 Folien
// ============================================================
// Struktur: keine Schritt-Nummern in Titeln, Flow-Diagramm vorweg,
// journal.md frueh, Datenschutz + synthetische Daten direkt an data.md,
// Fehlerdiagnose und MS2-Uebergang neu, Pitch als discussion am Ende.

function getHandsOnContent() {
  return [

    // 1 — Titel
    {
      type: 'title',
      title: 'Promptotyping\nHands-On',
      subtitle: 'Vom eigenen Datensatz zum Prototyp',
      meta: 'Workshop Museumsbund \u00d6sterreich \u00b7 24. April 2026 \u00b7 Kurssaal NHM Wien\nPromptotyping-Workshop, Teil 2'
    },

    // 2 — Vor dem Start
    {
      type: 'content',
      title: 'Vor dem Start',
      body: 'Modell **Claude Sonnet 4.6**. Opus w\u00fcrde das Usage-Limit im Workshop schnell sprengen, Sonnet 4.6 reicht f\u00fcr Prototyping-Aufgaben gut aus. In **Claude Code** wechseln mit dem Kommando `/model`.\n\n**So arbeiten wir.** Ich komme aktiv zu jedem Laptop. Fragen sofort stellen, auch die vermeintlich dummen. Fehlermeldungen in der Browser-Konsole sind Kontextinformation und kein Problem.'
    },

    // 3 — Am Ende der Pitch
    {
      type: 'content',
      title: 'Am Ende euer Pitch',
      body: 'Optional, aber erw\u00fcnscht. Circa 3 Minuten pro Person.\n\nDrei Leitfragen, die vorher im Kopf sein sollten.\n\n1. Was war die Idee, und was ist das Ergebnis geworden?\n2. Wo gab es Probleme, wo war die Arbeit bereichernd oder \u00fcberraschend?\n3. Welche Limitationen, Herausforderungen oder weiteren M\u00f6glichkeiten sind sichtbar?\n\nNicht fertig zu werden ist okay. Ein **MVP** zu erreichen ist ein valider Workshop-Ausgang.'
    },

    // 4 — One-Pager
    {
      type: 'content',
      title: 'Der One-Pager als Ausgangspunkt',
      body: 'Jeder hat einen **One-Pager** mitgebracht oder erstellt ihn jetzt in zehn Minuten.\n\n*Was willst du umsetzen? Das Projekt, die Idee, das Vorhaben, die Forschungsfrage.*\n\nEine Seite, Stichpunkte sind okay. Das **LLM** kann nicht wissen, was nicht formuliert wird.'
    },

    // 5 — Exercise: One-Pager schreiben (fuer alle ohne)
    {
      type: 'exercise',
      title: 'One-Pager in zehn Minuten',
      body: 'Wer noch keinen One-Pager hat, schreibt ihn jetzt.\n\n**Struktur als Merkliste.**\n\n\u2022 Ziel. Eine Zeile. Was soll am Ende stehen.\n\u2022 Leitfrage oder Forschungsfrage. Zwei bis drei S\u00e4tze.\n\u2022 Daten. Welche, in welchem Format, wie viele Records.\n\u2022 Zielgruppe. Wer nutzt den Prototypen.\n\u2022 Nicht-Ziele. Was explizit nicht gebaut wird.\n\nStichpunkte reichen. Perfektion nicht n\u00f6tig, das Dokument wird mit Claude Code gleich verfeinert.'
    },

    // 6 — Arbeitsstruktur (Ordnerbaum)
    {
      type: 'content',
      title: 'Arbeitsstruktur — drei Dokumente, zwei Ordner',
      small: true,
      body: '```\nworkshop-projekt/\n\u251c\u2500\u2500 knowledge/\n\u2502   \u251c\u2500\u2500 project.md      <- die Idee\n\u2502   \u251c\u2500\u2500 data.md         <- Wissen \u00fcber die Daten\n\u2502   \u251c\u2500\u2500 plan.md         <- Milestones und Tests\n\u2502   \u2514\u2500\u2500 journal.md      <- Arbeitstagebuch\n\u251c\u2500\u2500 data/\n\u2502   \u2514\u2500\u2500 [eure Rohdaten oder synthetische Daten]\n\u2514\u2500\u2500 [Code kommt sp\u00e4ter]\n```\n\n**Claude Code** hat Zugriff auf diesen Ordner. Alles in `knowledge/` ist Kontext f\u00fcr alle weiteren Prompts.'
    },

    // 7 — Flow-Diagramm VORWEG
    {
      type: 'content',
      title: 'Der Arbeitsfluss im \u00dcberblick',
      small: true,
      body: '```\n  One-Pager            (mitgebracht oder jetzt geschrieben)\n       \u2193\n  project.md           (Idee strukturieren)\n       \u2193\n  data.md              (Daten verstehen, kompakt)\n       \u2193\n  plan.md              (Milestones, Tests, Logging)\n       \u2193\n  Milestone 1          (Daten laden und anzeigen, MVP)\n       \u2193\n  Iteration            (Konsole, Screenshots, Ideen)\n       \u2193\n  Refactoring          (Code und Wissensdokumente)\n       \u2193\n  Pitch                (3 Minuten, 3 Leitfragen)\n```\n\n**Parallel dazu laufend** `journal.md`. Eine Zeile pro Arbeitsschritt.\n\nMilestone 1 reicht als Workshop-Ergebnis.'
    },

    // 8 — project.md erzeugen (handson)
    {
      type: 'handson',
      title: '`project.md` erzeugen',
      body: 'Die Projektidee in strukturiertes Markdown \u00fcberf\u00fchren.\n\nOne-Pager direkt in den Prompt einf\u00fcgen.\n\nFaustregel. `project.md` passt auf eine Bildschirmseite.',
      prompt: 'Hier ist mein One-Pager zum Projekt.\n---\n[One-Pager einfuegen]\n---\nErzeuge daraus knowledge/project.md mit\ndieser Struktur.\n- Ziel. Ein Satz.\n- Forschungsfrage oder Leitfrage.\n  Zwei bis drei Saetze.\n- Zielgruppe. Wer nutzt das Ergebnis.\n- Erwarteter Output. Was soll am Ende\n  konkret existieren.\n- Nicht-Ziele. Was explizit nicht\n  gebaut wird.\n\nKompakt, praezise, maximale Information\nbei wenig Tokens.\nFrage nach, wenn etwas unklar oder\nwiderspruechlich ist.'
    },

    // 9 — data.md erklaert
    {
      type: 'content',
      title: '`data.md` ist das wichtigste Dokument',
      body: '`data.md` ist das Wissen \u00fcber die eigenen Daten. Struktur ist zweitrangig, Markdown reicht. Was z\u00e4hlt ist **maximal konkret, maximal pr\u00e4zise, informationsdicht**.\n\nInhalt typischerweise\n\n\u2022 Quelle, Format, Lizenz, Anzahl Records\n\u2022 Felder mit Datentypen\n\u2022 Drei Beispiel-Records\n\u2022 Besonderheiten wie L\u00fccken, Inkonsistenzen, Kodierungen'
    },

    // 10 — Datenschutz + Synthetische Daten (ERWEITERT)
    {
      type: 'content',
      title: 'Datenschutz, Rechte, Daten hergeben',
      small: true,
      body: 'Was hochgeladen wird, verl\u00e4sst den eigenen Rechner. Drei Fragen kl\u00e4ren.\n\n\u2022 Darf ich diese Daten bei einem US-Anbieter verarbeiten? DSGVO, Nutzungsvereinbarung.\n\u2022 Sind Rechte Dritter betroffen? Lizenz der Quelle, Urheberrecht am Material.\n\u2022 Will ich diese Daten dem Anbieter zum Training oder f\u00fcr sp\u00e4tere Nutzung \u00fcberlassen? Keine Konsultations-AGB akzeptiert das pauschal aus.\n\n**Eleganter Ausweg: synthetische Daten.** `data.md` l\u00e4sst sich mit **Fake-Daten** oder einer reinen **Strukturbeschreibung** bauen. Der Code ist deterministisch und wird dann **lokal** gegen die echten Daten ausgef\u00fchrt. Das LLM sieht nur die Struktur, nicht die Inhalte.\n\nIm Zweifel anonymisieren, Teilmengen verwenden, keine sensiblen PDFs hochladen.'
    },

    // 11 — Drei Wege zu data.md (handson)
    {
      type: 'handson',
      title: 'Drei Wege zu einem guten `data.md`',
      body: '**Kleine Datens\u00e4tze** (wenige MB). Direkt in den Arbeitsordner legen, Claude Code liest sie.\n\n**Mittlere Datens\u00e4tze.** Python-Script erzeugen lassen, das die Struktur abbildet (Prompt rechts).\n\n**Grosse Datens\u00e4tze.** *Gemini* mit gr\u00f6sserem Context Window oder *ChatGPT Pro* nutzen, Ergebnis als Markdown in `data.md` \u00fcbernehmen.',
      prompt: 'Analysiere die Struktur von\ndata/[meine-datei.json].\nSchreibe ein Python-Script\ndata/inspect.py, das ausgibt.\n- Anzahl Records\n- Feldnamen mit Datentypen\n- Abdeckung pro Feld in Prozent\n- Drei repraesentative\n  Beispiel-Records\n- Auffaelligkeiten, leere Felder,\n  Encoding, Inkonsistenzen\nFuehre das Script aus.\nSchreibe das Ergebnis kompakt\nals knowledge/data.md.\nStrukturiere in. Quelle, Format,\nLizenz, Felder, Beispiele,\nBesonderheiten.'
    },

    // 12 — journal.md (handson, paralleler Begleitschritt)
    {
      type: 'handson',
      title: '`journal.md` als paralleler Begleiter',
      body: 'Eine Zeile pro Arbeitsschritt. Wer jetzt arbeitet, weiss in zwei Stunden nicht mehr, was vor zwei Stunden gemacht wurde.\n\nDas Journal ist **Kontextinformation** f\u00fcr einen selbst und f\u00fcr das LLM. Es wird w\u00e4hrend der Arbeit gepflegt, nicht am Ende.',
      prompt: 'Lege knowledge/journal.md an.\nFormat pro Eintrag.\n\n## YYYY-MM-DD\n- HH:MM Was getan\n- HH:MM Entscheidung. X weil Y\n- HH:MM Fehler. Z, Fix durch W\n- HH:MM Naechster Schritt\n\nTrage den ersten Eintrag ein\nmit Zeitstempel jetzt und einer\nZeile, was wir gerade begonnen\nhaben.\nNach jedem groesseren Schritt\nerinnere mich, eine Zeile zu\nergaenzen.'
    },

    // 13 — Plan fuer den Prototypen (handson)
    {
      type: 'handson',
      title: 'Plan f\u00fcr den Prototypen',
      body: 'Ziel ist ein statischer Prototyp mit **Vanilla HTML, CSS, JavaScript**. Theoretisch *GitHub-Pages*-f\u00e4hig. Keine Build-Tools, keine Dependencies.\n\nClaude Code soll den Plan entwickeln, bevor eine Zeile Code geschrieben wird.',
      prompt: 'Lies knowledge/project.md und\nknowledge/data.md.\nErstelle knowledge/plan.md fuer\neinen statischen Prototypen.\n- Tech-Stack. Vanilla HTML,\n  CSS, JavaScript. Keine Build-\n  Tools, GitHub-Pages-faehig.\n- Arbeite test-getrieben.\n  Definiere pro Milestone Tests\n  in der Browser-Konsole und in\n  einer Test-Datei.\n- Plane kompaktes Logging mit\n  sprechenden Prefixes.\n- Strukturiere in zwei bis drei\n  Milestones mit messbaren\n  Exit-Kriterien.\n\nMilestone 1 ist der MVP.\nDaten laden korrekt und werden\nangezeigt. Nicht mehr.\nSchreibe noch keinen Code.\nNur den Plan.'
    },

    // 14 — Warum MVP, warum Tests
    {
      type: 'content',
      title: 'Warum MVP zuerst, warum Tests vorher',
      body: '**MVP zuerst.** Wenn Daten nicht sauber laden, ist alles andere Kosmetik. Milestone 1 heisst ich sehe meine Daten im Browser.\n\n**Tests vorher.** Das LLM produziert Code, der aussehen kann, als w\u00fcrde er funktionieren, aber Fehler versteckt. Tests als Vertrag vorab zwingen zu Klarheit.\n\n**Logging.** Kompakt, strukturiert, sprechend. Die **Browser-Konsole** ist die wichtigste Diagnosequelle.'
    },

    // 15 — Exercise: MS1 in einem Satz definieren
    {
      type: 'exercise',
      title: 'Milestone 1 in einem Satz',
      body: 'Bevor Claude Code den Plan erstellt, formuliert ihr selbst.\n\n*Was soll der Browser am Ende der n\u00e4chsten 30 Minuten zeigen?*\n\nEin Satz, konkret und pr\u00fcfbar.\n\nBeispiele.\n\u2022 "Eine Liste aller 1.200 Inventarnummern mit Titel und Jahr, aus inventar.json geladen."\n\u2022 "Eine Karte mit Markern f\u00fcr alle 48 Ausstellungsorte aus orte.csv."\n\u2022 "Eine Tabelle aus bestand.xlsx mit Filter nach Objekttyp."\n\nDieser Satz wandert in den n\u00e4chsten Prompt.'
    },

    // 16 — Milestone 1 implementieren (handson)
    {
      type: 'handson',
      title: 'Milestone 1 implementieren',
      body: 'Nach dem Plan Milestone f\u00fcr Milestone umsetzen lassen.\n\nNach der Umsetzung **Live Server** starten, im Browser \u00f6ffnen, Konsole pr\u00fcfen.',
      prompt: 'Implementiere Milestone 1\nnach knowledge/plan.md.\n- Beginne mit den Tests.\n  Tests schreiben, erst dann\n  Code.\n- Logge kompakt mit Prefix\n  [MS1] in die Browser-Konsole.\n- Stoppe nach Milestone 1.\n  Kein Vorgriff auf MS2.\n- Schreibe nach Abschluss eine\n  Zeile in knowledge/journal.md.\n\nIch pruefe im Browser, ob die\nDaten korrekt laden, bevor\nwir weitermachen.'
    },

    // 17 — Fehlerdiagnose (NEU, handson)
    {
      type: 'handson',
      title: 'Wenn Milestone 1 nicht l\u00e4uft',
      body: 'Bevor der n\u00e4chste Code-Patch startet, Diagnose anfordern. Das LLM neigt sonst zu wildem Raten.\n\nBrowser-Konsole kopieren, Fehlermeldung sichtbar machen, dann fragen.',
      prompt: 'Milestone 1 laeuft nicht.\nKonsolen-Output unten.\n---\n[Konsolen-Output einfuegen]\n---\nDiagnose.\n- Nenne die wahrscheinlichste\n  Ursache mit Begruendung.\n- Schlage einen minimalen Fix\n  vor, bevor du ihn umsetzt.\n- Wenn mehrere Hypothesen\n  moeglich sind, erklaere wie\n  wir sie unterscheiden koennen.\n\nPatche erst, wenn ich die\nDiagnose bestaetigt habe.'
    },

    // 18 — Iteration mit drei Eingabekanaelen (handson)
    {
      type: 'handson',
      title: 'Iterieren mit drei Eingabekan\u00e4len',
      body: '**Konsolen-Output** (Daten, Fehler) per Copy-paste in den Prompt.\n\n**Screenshots** der Web-UI. Claude kann Bilder analysieren.\n\n**Eigene Meinung oder Idee als Text.** Mir gef\u00e4llt X nicht, weil ist ein valider Prompt.',
      prompt: 'Screenshots und Konsolen-Output\nvom aktuellen Stand unten.\nAnalysiere.\n- Was laeuft gut.\n- Was bricht. Konsolenfehler\n  pro Zeile nennen.\n- Wie koennen wir das Logging\n  kompakter und sprechender\n  machen.\n\nSchlage konkrete Aenderungen\nvor, bevor du sie umsetzt.'
    },

    // 19 — Experten-Personas (handson, Klawiter-Pattern)
    {
      type: 'handson',
      title: 'Experten-Personas als Denkwerkzeug',
      body: 'Personas schr\u00e4nken den Antwortraum sinnvoll ein. Statt generischer Vorschl\u00e4ge bekommt man zielgerichtete Kritik aus einer konkreten Sicht.',
      prompt: 'Wer waere die beste Experten-\nPersona oder -Gruppe, um uns\nkritisch zu reviewen.\n- Schlage drei Personas vor\n  mit Hintergrund, Perspektive\n  und typischer Kritik.\n- Ich waehle eine aus.\n- Du nimmst dann diese Rolle\n  an und gehst die letzten\n  Aenderungen durch, als waerest\n  du diese Person.\n- Nenne die drei wichtigsten\n  Verbesserungsvorschlaege aus\n  Sicht dieser Persona.'
    },

    // 20 — Refactoring Code (handson)
    {
      type: 'handson',
      title: 'Refactoring — Code pr\u00fcfen',
      body: 'Nach der ersten Iteration lohnt ein strukturierter Blick auf den Code. Claude soll vorschlagen, nicht sofort \u00e4ndern.',
      prompt: 'Pruefe den Code im Hinblick auf.\n- Namensgebung. Sprechend und\n  konsistent.\n- Redundanzen und tote Pfade.\n- Lesbarkeit. Wo wuerde ein\n  fremder Entwickler stolpern.\n- Logging-Qualitaet.\n\nSchlage konkrete Aenderungen\nals Liste vor.\nSetze sie erst um, nachdem\nich sie freigegeben habe.'
    },

    // 21 — Refactoring Wissensdokumente (handson)
    {
      type: 'handson',
      title: 'Refactoring — Wissensdokumente pflegen',
      body: 'Der `knowledge/`-Ordner ist kein Archiv, sondern **lebendiger Kontext**. Erkenntnisse aus den Iterationen fliessen zur\u00fcck.\n\nHistorie bleibt im `journal.md` und in *Git*.',
      prompt: 'Aktualisiere knowledge/project.md\nund knowledge/data.md auf Basis\nder letzten Arbeitsphasen.\n- Neue Erkenntnisse zu Daten-\n  struktur und Projektzielen\n  einpflegen.\n- Ueberholte Passagen kuerzen\n  oder loeschen.\n- Dokumente kompakt halten.\n  Maximal eine Bildschirmseite.\n\nHistorie bleibt in\nknowledge/journal.md, nicht\nin project.md oder data.md.'
    },

    // 22 — Uebergang Milestone 2 (NEU, handson)
    {
      type: 'handson',
      title: '\u00dcbergang zu Milestone 2',
      body: 'Wer MS1 stabil hat und weitergehen will, aktualisiert zuerst den Plan.\n\nDas verhindert, dass MS2 auf falschen Annahmen aus der urspr\u00fcnglichen Planung aufbaut.',
      prompt: 'Milestone 1 laeuft.\nBevor wir MS2 starten.\n- Was im Plan hat sich als\n  falsch oder unvollstaendig\n  erwiesen.\n- Welche Annahmen sind\n  bestaetigt, welche verworfen.\n- Aktualisiere knowledge/plan.md\n  fuer MS2 entsprechend.\n\nDann starten wir MS2 nach dem\naktualisierten Plan.\nGleicher Rhythmus wie MS1.\nTests zuerst, Logging, stoppen\nnach MS2.'
    },

    // 23 — Pitch-Leitfrage (discussion)
    {
      type: 'discussion',
      question: 'Was war das \u00dcberraschendste an deinem Prototypen, und was bleibt offen?'
    }
  ];
}

/**
 * Promptotyping NHM Hands-On — Entry Point
 *
 * Im Apps-Script-Editor generateHandsOn() ausw\u00e4hlen und ausf\u00fchren.
 */

function generateHandsOn() { generate(PRES_HANDSON, getHandsOnContent()); }

