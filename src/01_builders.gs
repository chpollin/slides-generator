/**
 * BUILDERS — eine Render-Funktion pro Folientyp
 *
 * Jeder Builder erhält (slide, item) und baut das Layout auf.
 * Content-Builder setzen weiß (`setSolidFill('#ffffff')`), damit der
 * Master-Gradient dort NICHT durchscheint. Der title-Builder lässt
 * den Hintergrund unberührt — dort soll der Master-Gradient sichtbar sein.
 */

var BUILDERS = {

  // Titelfolie: Gradient + Logos kommen aus Master.
  // Text, Meta und Kontakt auf rechter Seite — linke Hälfte bleibt frei für thematisches Bild.
  // AI-Badge unten links.
  title: function(slide, item) {
    // KEIN setSolidFill — Master-Gradient soll durchscheinen
    var textX = 325;
    var textW = D.W - textX - D.MR;
    addRichText(slide, item.title,    { x: textX, y: 130, w: textW, h: 75,  font: D.FONT, size: D.S_TITLE,    bold: true, color: D.TEXT_BLACK });
    addRichText(slide, item.subtitle, { x: textX, y: 210, w: textW, h: 40,  font: D.FONT, size: D.S_SUBTITLE,             color: D.TEXT_DARK  });
    addRichText(slide, item.meta,     { x: textX, y: 260, w: textW, h: 40,  font: D.FONT, size: D.S_META,                 color: D.TEXT_DARK, lineSpacing: 140 });
    // Kontaktdaten rechts, aligned mit Text-Spalte (linke Hälfte bleibt für Bild)
    addRichText(slide,
      'Dr. Christopher Pollin MA MA\nchpollin.github.io \u00b7 christopher.pollin@dhcraft.org\nDigital Humanities Craft OG \u00b7 www.dhcraft.org',
      { x: textX, y: 345, w: 225, h: 55, font: D.FONT, size: 8, color: D.TEXT_GRAY,
        links: [
          { find: 'chpollin.github.io',           url: 'https://chpollin.github.io' },
          { find: 'christopher.pollin@dhcraft.org', url: 'mailto:christopher.pollin@dhcraft.org' },
          { find: 'www.dhcraft.org',              url: 'https://www.dhcraft.org' }
        ]
      });
    // AI-Badge: direkt über dem CC-BY-Logo (unten rechts, aus Master)
    addAiBadge(slide, D.W - D.MR - 115, 340);
  },

  // Section: großer fetter Titel, Untertitel grau
  section: function(slide, item) {
    slide.getBackground().setSolidFill(D.BG);
    addRichText(slide, item.title, { x: D.ML, y: 140, w: D.CW, h: 55, font: D.FONT, size: D.S_SECTION, bold: true, color: D.TEXT_BLACK });
    if (item.subtitle) addRichText(slide, item.subtitle, { x: D.ML, y: 205, w: D.CW, h: 35, font: D.FONT, size: D.S_SUBTITLE, color: D.TEXT_GRAY });
  },

  // Lernziele: Titel zentriert und fett, Body linksbündig
  learning: function(slide, item) {
    slide.getBackground().setSolidFill(D.BG);
    addRichText(slide, item.title, { x: D.ML, y: D.MT, w: D.CW, h: 35, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK, align: 'CENTER' });
    addRichText(slide, item.body, { x: D.ML, y: 85, w: D.CW, h: 295, font: D.FONT, size: D.S_LEARNING, color: D.TEXT_DARK, lineSpacing: 150 });
  },

  // Content: Titel fett zentriert, Body linksbündig, Quelle am Fuß
  content: function(slide, item) {
    slide.getBackground().setSolidFill(D.BG);
    addRichText(slide, item.title, { x: D.ML, y: D.MT, w: D.CW, h: 35, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK, align: 'CENTER' });
    var bH = item.source ? 260 : 295;
    var sz = item.small ? D.S_BODY_SM : D.S_BODY;
    addRichText(slide, item.body, { x: D.ML, y: 85, w: D.CW, h: bH, font: D.FONT, size: sz, color: D.TEXT_DARK, lineSpacing: 140 });
    if (item.source) addRichText(slide, item.source, { x: D.ML, y: 370, w: D.CW, h: 25, font: D.FONT, size: D.S_SOURCE, italic: true, color: D.TEXT_GRAY});
  },

  // Diskussion: Großes ? als visueller Anker, Frage zentriert
  discussion: function(slide, item) {
    slide.getBackground().setSolidFill(D.BG);
    addRichText(slide, '?', { x: D.W - 140, y: 30, w: 100, h: 120, font: D.FONT, size: 96, bold: true, color: '#e0e0e0' });
    addRichText(slide, 'Leitfrage zur Diskussion', { x: D.ML, y: 50, w: D.CW - 120, h: 22, font: D.FONT, size: D.S_LABEL, bold: true, color: D.TEXT_DARK });
    addRichText(slide, item.question, { x: D.ML, y: 110, w: D.CW - 80, h: 250, font: D.FONT, size: D.S_QUESTION, bold: true, color: D.TEXT_BLACK, lineSpacing: 170 });
  },

  // Übung: Label "Übung" + Titel fett, Body normal
  exercise: function(slide, item) {
    slide.getBackground().setSolidFill(D.BG);
    addRichText(slide, '\u00dcbung', { x: D.ML, y: D.MT, w: D.CW, h: 20, font: D.FONT, size: D.S_LABEL, bold: true, color: D.TEXT_DARK });
    addRichText(slide, item.title, { x: D.ML, y: 62, w: D.CW, h: 30, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK });
    addRichText(slide, item.body, { x: D.ML, y: 105, w: D.CW, h: 275, font: D.FONT, size: D.S_BODY, color: D.TEXT_DARK, lineSpacing: 140 });
  },

  // Hands-On: Nummerierte Anleitung + gestrichelte Prompt-Box (Consolas)
  handson: function(slide, item) {
    slide.getBackground().setSolidFill(D.BG);
    addRichText(slide, 'Hands-On', { x: D.ML, y: D.MT, w: D.CW, h: 20, font: D.FONT, size: D.S_LABEL, bold: true, color: D.TEXT_DARK });
    addRichText(slide, item.title, { x: D.ML, y: 62, w: D.CW, h: 30, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK });
    var leftW = item.prompt ? (D.CW / 2) - 15 : D.CW;
    addRichText(slide, item.body, { x: D.ML, y: 105, w: leftW, h: 240, font: D.FONT, size: D.S_BODY, color: D.TEXT_DARK, lineSpacing: 140 });
    if (item.prompt) {
      var boxX = D.ML + leftW + 20;
      var boxW = D.CW - leftW - 20;
      addPromptBox(slide, item.prompt, boxX, 105, boxW, 240);
    }
    if (item.source) addRichText(slide, item.source, { x: D.ML, y: 370, w: D.CW, h: 25, font: D.FONT, size: D.S_SOURCE, italic: true, color: D.TEXT_GRAY});
  },

  // Bildplatzhalter
  image_placeholder: function(slide, item) {
    slide.getBackground().setSolidFill(D.BG);
    addRichText(slide, item.title, { x: D.ML, y: D.MT, w: D.CW, h: 35, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK, align: 'CENTER' });
    addPlaceholderBox(slide, item.placeholder, D.ML, 85, D.CW, 250);
    if (item.source) addRichText(slide, item.source, { x: D.ML, y: 370, w: D.CW, h: 25, font: D.FONT, size: D.S_SOURCE, italic: true, color: D.TEXT_GRAY});
  },

  // Split: Text links, Bildplatzhalter rechts
  content_with_image: function(slide, item) {
    slide.getBackground().setSolidFill(D.BG);
    addRichText(slide, item.title, { x: D.ML, y: D.MT, w: D.CW, h: 35, font: D.FONT, size: D.S_HEADING, bold: true, color: D.TEXT_BLACK });
    var halfW = (D.CW / 2) - 12;
    addRichText(slide, item.body, { x: D.ML, y: 85, w: halfW, h: 260, font: D.FONT, size: D.S_BODY_SM, color: D.TEXT_DARK, lineSpacing: 140 });
    addPlaceholderBox(slide, item.placeholder, D.ML + halfW + 24, 85, halfW, 260);
    if (item.source) addRichText(slide, item.source, { x: D.ML, y: 370, w: D.CW, h: 25, font: D.FONT, size: D.S_SOURCE, italic: true, color: D.TEXT_GRAY});
  }
};
