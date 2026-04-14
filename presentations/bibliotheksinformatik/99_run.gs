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
