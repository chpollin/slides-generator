/**
 * Slide Library — Registry wiederverwendbarer Folien aus DHCraft-Präsentationen.
 *
 * Jede Präsentation definiert ihr eigenes COPY_SLIDES (in presentations/<name>/00_config.gs)
 * und referenziert darin Einträge aus SLIDE_REGISTRY.
 *
 * Siehe auch: Teaching/Slide Library.md im Obsidian-Vault.
 */

var SOURCE_PRES = {
  DATA_LIB:   '11PAq52of5siHNYDwC7ksu5S-7EzJKFB1rcxSOlqe3Z8', // Data Librarian Wien 2023
  BIBLIOTHEK: '1BmPZTnL2JULg_nXrU8mx2EBfmhaDPaVnoiaZU8G1rjI'  // Bibliotheksinformatik (Quelle)
};

// Flach — keine thematische Zwischenebene. Neue Einträge hier, nach Bedarf sortiert.
var SLIDE_REGISTRY = {
  wissenspyramide:  { pres: SOURCE_PRES.DATA_LIB,   id: 'gc43cc7a388_0_7'   },
  dikw_network:     { pres: SOURCE_PRES.DATA_LIB,   id: 'gc43cc7a388_0_248' },
  wie_llms:         { pres: SOURCE_PRES.BIBLIOTHEK, id: 'g3972826d70a_0_278' },
  transformer:      { pres: SOURCE_PRES.BIBLIOTHEK, id: 'g3972826d70a_0_348' },
  training_phases:  { pres: SOURCE_PRES.BIBLIOTHEK, id: 'g3972826d70a_0_359' }
};
