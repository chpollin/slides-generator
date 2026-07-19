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
