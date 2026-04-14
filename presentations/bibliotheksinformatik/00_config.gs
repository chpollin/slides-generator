/**
 * Bibliotheksinformatik — Konfiguration
 *
 * VU Künstliche Intelligenz in Bibliotheken, 3 Tage, Juni 2026.
 * Ziel-Präsentationen und Slide-Copy-Konfiguration.
 *
 * Schema wird aus src/schemas/dhcraft.gs geladen (D wird dort gesetzt).
 */

var PRES_TAG1 = '1p6oRuF2NBqXm3jZ_VuNyST7qzpzbG1AFWuXUswbMmCQ';
var PRES_TAG2 = '1TDVFRRuh4xNx-SeZRSC1NcRgzWv-6EOZTIzRQ6_wZy0';
var PRES_TAG3 = '17RUPp3cDkwGM2CLISMbRu6uRKI0XSTxC0-qaaHkNCic';

// COPY_SLIDES bezieht die registrierten Einträge aus lib/slide-library.gs
var COPY_SLIDES = {
  wissenspyramide:  SLIDE_REGISTRY.informationswissenschaft.wissenspyramide,
  dikw_network:     SLIDE_REGISTRY.informationswissenschaft.dikw_network,
  wie_llms:         SLIDE_REGISTRY.llms.wie_llms,
  transformer:      SLIDE_REGISTRY.llms.transformer,
  training_phases:  SLIDE_REGISTRY.llms.training_phases
};
