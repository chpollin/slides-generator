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
