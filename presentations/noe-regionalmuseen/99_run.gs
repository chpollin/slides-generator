/**
 * noe-regionalmuseen — Entry Point
 *
 * In Apps Script ausfuehren: generateNoe().
 * Voraussetzung: Slides API v1 als Dienst aktiviert, DHCraft-Master eingerichtet.
 */

function generateNoe() { generate(PRES_NOE, getNoeContent()); }
