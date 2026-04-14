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
