// ═══════════════════════════════════════════════════
//  VOLTMATCH — Moteur de calcul et dimensionnement
// ═══════════════════════════════════════════════════

/**
 * Calcule le dimensionnement énergétique complet
 * @param {object} params
 * @returns {object} besoin
 */
function calculerDimensionnement(params) {
  const {
    puissanceW,    // W
    autonomieH,    // heures
    tensionCible,  // V (12, 24, 48, ou null = "je ne sais pas")
    typeApp,       // string
    contrainte     // 'portable' | 'fixe'
  } = params;

  // ── a) Énergie totale avec marge de sécurité 25% ──
  const energieBaseWh = puissanceW * autonomieH;
  const energieWh     = energieBaseWh * 1.25;

  // ── b) Chimie recommandée ──
  let chimie = 'LFP';
  let chimieRaison = 'LFP recommandé pour usage stationnaire : sécurité thermique maximale et longue durée de vie.';

  if (contrainte === 'portable' && typeApp === 'powerbank') {
    chimie = 'NMC';
    chimieRaison = 'NMC recommandé : meilleure densité énergétique massique pour un usage nomade/portable.';
  }

  // ── c) Tension effective du système ──
  let tensionEffective = tensionCible;
  if (!tensionEffective || tensionEffective === 0) {
    // Auto-select selon puissance
    if      (puissanceW <= 1500)  tensionEffective = 12;
    else if (puissanceW <= 5000)  tensionEffective = 24;
    else if (puissanceW <= 20000) tensionEffective = 48;
    else                          tensionEffective = 96;
  }

  // ── c) Configuration en cellules ──
  const tensionCellule = chimie === 'LFP' ? 3.2 : 3.6; // V / cellule
  const cellsS = Math.round(tensionEffective / tensionCellule);       // série
  const tensionReelle = cellsS * tensionCellule;
  const capaciteAh    = energieWh / tensionReelle;                    // Ah total
  const cellRefAh     = 50;
  const cellsP        = Math.ceil(capaciteAh / cellRefAh);            // parallèle

  const configLabel   = `${cellsS}S${cellsP}P — ${cellsS * cellsP} cellules`;

  // ── d) Poids et volume estimés ──
  const densMassique  = chimie === 'LFP' ? 110 : 160; // Wh/kg
  const densVolumique = chimie === 'LFP' ? 150 : 250; // Wh/L
  const poidsKg       = energieWh / densMassique;
  const volumeL       = energieWh / densVolumique;

  return {
    // Énergie
    energieBaseWh,
    energieWh,
    // Chimie
    chimie,
    chimieRaison,
    // Tension
    tensionCible:    tensionEffective,
    tensionReelle:   Math.round(tensionReelle * 10) / 10,
    // Capacité
    capaciteAh:      Math.round(capaciteAh),
    // Config cellules
    cellsS,
    cellsP,
    configLabel,
    // Poids / volume
    poidsKg:         Math.round(poidsKg * 10) / 10,
    volumeL:         Math.round(volumeL * 10) / 10,
    // Power
    puissanceW,
    autonomieH
  };
}