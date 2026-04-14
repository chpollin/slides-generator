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
