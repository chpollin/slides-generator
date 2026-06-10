/**
 * vetmed-ws5 — Entry Point
 *
 * In Apps Script ausfuehren: generateWs5().
 * Voraussetzung: Slides API v1 als Dienst aktiviert, DHCraft-Master eingerichtet.
 */

function generateWs5() { generate(PRES_WS5, getWs5Content()); }

// Delta 10.06.2026: haengt Fable-5-Opener + Teil-3-Live-Demo hinten an,
// ohne bestehende Folien (mit manuell eingefuegten Bildern) anzutasten.
function generateWs5Delta() { generateAppend(PRES_WS5, getWs5DeltaContent()); }
