/**
 * Bibliotheksinformatik — Konfiguration
 *
 * VU Künstliche Intelligenz in Bibliotheken, 3 Tage, Juni 2026.
 * Ziel-Präsentationen, Sprecher-Daten und Slide-Copy-Konfiguration.
 */

var PRES_TAG1 = '1p6oRuF2NBqXm3jZ_VuNyST7qzpzbG1AFWuXUswbMmCQ';
var PRES_TAG2 = '1TDVFRRuh4xNx-SeZRSC1NcRgzWv-6EOZTIzRQ6_wZy0';
var PRES_TAG3 = '17RUPp3cDkwGM2CLISMbRu6uRKI0XSTxC0-qaaHkNCic';

// Kontaktdaten, die der Title-Builder in die Titelfolien einsetzt.
// Engine wirft Fehler, wenn PRESENTER fehlt.
var PRESENTER = {
  name:    'Dr. Christopher Pollin MA MA',
  github:  'chpollin.github.io',
  email:   'christopher.pollin@dhcraft.org',
  org:     'Digital Humanities Craft OG',
  website: 'www.dhcraft.org'
};

// Ausgewählte Slides aus lib/slide-library.gs. Keys sind die refs,
// die im Content-Array als { type: 'copy', ref: '...' } erscheinen.
var COPY_SLIDES = {
  wissenspyramide:  SLIDE_REGISTRY.wissenspyramide,
  dikw_network:     SLIDE_REGISTRY.dikw_network,
  wie_llms:         SLIDE_REGISTRY.wie_llms,
  transformer:      SLIDE_REGISTRY.transformer,
  training_phases:  SLIDE_REGISTRY.training_phases
};
