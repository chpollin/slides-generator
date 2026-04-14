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
