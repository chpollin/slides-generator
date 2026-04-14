/**
 * Core Engine — Slide-Clear + Dispatch
 *
 * generate(presId, content) wird aus presentations/.../99_run.gs aufgerufen.
 * Löscht alle Folien außer Folie 1, rendert dann Content-Array:
 *   - i=0: erste Folie behalten (Master-Titel-Layout mit Gradient/Logos),
 *     vorhandene Elemente löschen, neu bauen
 *   - i>0: neue BLANK-Folie anhängen, Builder ausführen
 */

function generate(presId, content) {
  var pres = SlidesApp.openById(presId);
  var slides = pres.getSlides();
  for (var i = slides.length - 1; i >= 1; i--) slides[i].remove();

  var slideNum = 0;
  for (var i = 0; i < content.length; i++) {
    var item = content[i];
    var slide;
    slideNum++;
    if (i === 0) {
      slide = slides[0];
      var els = slide.getPageElements();
      for (var e = els.length - 1; e >= 0; e--) els[e].remove();
    } else {
      slide = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    }

    if (item.type === 'copy') {
      var config = COPY_SLIDES[item.ref];
      if (config) {
        try { copySlideInto(pres, config, slide); }
        catch (err) {
          BUILDERS.image_placeholder(slide, {
            title: item.fallbackTitle || 'Folie manuell kopieren',
            placeholder: 'Manuell kopieren:\n' + (item.fallbackDesc || item.ref)
          });
        }
      }
    } else {
      BUILDERS[item.type](slide, item);
    }

    // Foliennummern auf Content-Folien (nicht auf Titel, Section, Copy)
    if (item.type !== 'title' && item.type !== 'section' && item.type !== 'copy') {
      addSlideNumber(slide, slideNum);
    }
  }
}
