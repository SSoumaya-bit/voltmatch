// ═══════════════════════════════════════════════════
//  VOLTMATCH — Moteur de scoring multi-critères
// ═══════════════════════════════════════════════════

/**
 * Recommande et classe les batteries selon le besoin calculé
 * Scoring objectif — aucune règle ne favorise Renault EZ1 par défaut.
 */
function recommanderBatteries(besoin, filters = {}) {
  const { budgetMax, budgetCurrency, poidsMaxKg } = filters;

  // ── Pré-calcul : énergie utile (seconde vie = 80% de capacité nominale) ──
  const candidats = BATTERIES.map(b => {
    const facteurDegradation = b.type === 'seconde vie' ? 0.80 : 1.0;
    const energieUtileKwh    = b.energyKwh * facteurDegradation;
    const energieUtileWh     = energieUtileKwh * 1000;

    // Nombre d'unités nécessaires pour couvrir le besoin
    const quantite   = Math.ceil(besoin.energieWh / energieUtileWh);
    const poidsTotal = quantite * b.weightKg;
    const prixUnit   = b.price;
    const prixTotal  = quantite * prixUnit;
    const energieTotaleWh = quantite * energieUtileWh;

    return { ...b, energieUtileWh, quantite, poidsTotal, prixTotal, energieTotaleWh };
  });

  // ── Filtres d'éligibilité (exclusion stricte) ──
  const eligibles = candidats.filter(b => {
    // Stock suffisant
    if (b.stock < b.quantite) return false;

    // Budget (optionnel) — comparaison brute en valeur numérique (même devise ignorée pour la démo)
    if (budgetMax && budgetMax > 0 && b.prixTotal > budgetMax) return false;

    // Poids (optionnel)
    if (poidsMaxKg && poidsMaxKg > 0 && b.poidsTotal > poidsMaxKg) return false;

    // Tension : doit être dans ±60% de la tension cible pour être compatible
    // (Certaines batteries ont des tensions très différentes — on est souple car on peut câbler en série)
    // → Simplification : on inclut tout sauf les tensions vraiment incompatibles (>4× écart)
    const ratio = b.voltage / besoin.tensionCible;
    if (ratio > 8 || ratio < 0.08) return false;

    return true;
  });

  // ── Normalisation des valeurs pour scoring ──
  if (eligibles.length === 0) return [];

  const prixMax    = Math.max(...eligibles.map(b => b.prixTotal));
  const prixMin    = Math.min(...eligibles.map(b => b.prixTotal));
  const cyclesMax  = Math.max(...eligibles.map(b => b.cycles));
  const stockMax   = Math.max(...eligibles.map(b => b.stock));
  const garantMax  = Math.max(...eligibles.map(b => b.warrantyYears));
  const densMassMax = Math.max(...eligibles.map(b => b.energyKwh / b.weightKg));
  const poidsMin   = Math.min(...eligibles.map(b => b.poidsTotal));
  const poidsMax2  = Math.max(...eligibles.map(b => b.poidsTotal));

  // ── Calcul du score pondéré (100 pts total) ──
  const scored = eligibles.map(b => {
    let score = 0;

    // 1. Compatibilité énergétique (30 pts) — ratio énergie fournie / énergie requise
    //    Idéal : énergie totale ≈ 100–130% du besoin. Malus si excès ou déficit.
    const ratioEnergie = b.energieTotaleWh / besoin.energieWh;
    const scoreEnergie = Math.max(0, 30 * (1 - Math.abs(ratioEnergie - 1.1) / 1.1));
    score += scoreEnergie;

    // 2. Prix (20 pts) — moins cher = mieux
    const scorePrix = prixMax > prixMin
      ? 20 * (1 - (b.prixTotal - prixMin) / (prixMax - prixMin))
      : 20;
    score += scorePrix;

    // 3. Disponibilité / stock (10 pts)
    const scoreStock = stockMax > 0
      ? 10 * Math.min(1, b.stock / stockMax)
      : 0;
    score += scoreStock;

    // 4. Garantie (10 pts)
    const scoreGarant = garantMax > 0 ? 10 * (b.warrantyYears / garantMax) : 0;
    score += scoreGarant;

    // 5. Cycles / durée de vie (10 pts)
    const scoreCycles = cyclesMax > 0 ? 10 * (b.cycles / cyclesMax) : 0;
    score += scoreCycles;

    // 6. Densité énergétique massique (8 pts)
    const densMass   = b.energyKwh / b.weightKg;
    const scoreDens  = densMassMax > 0 ? 8 * (densMass / densMassMax) : 0;
    score += scoreDens;

    // 7. Poids total de la solution (7 pts) — plus léger = mieux
    const scorePoids = (poidsMax2 > poidsMin)
      ? 7 * (1 - (b.poidsTotal - poidsMin) / (poidsMax2 - poidsMin))
      : 7;
    score += scorePoids;

    // 8. Correspondance chimie (5 pts)
    const scoreChimie = b.chemistry === besoin.chimie ? 5 : 0;
    score += scoreChimie;

    return {
      ...b,
      score: Math.min(100, Math.round(score)),
      scoreDetail: {
        energie:  Math.round(scoreEnergie),
        prix:     Math.round(scorePrix),
        stock:    Math.round(scoreStock),
        garantie: Math.round(scoreGarant),
        cycles:   Math.round(scoreCycles),
        densite:  Math.round(scoreDens),
        poids:    Math.round(scorePoids),
        chimie:   scoreChimie
      }
    };
  });

  // Tri décroissant par score, puis par prix croissant en cas d'égalité
  return scored.sort((a, b) => b.score - a.score || a.prixTotal - b.prixTotal);
}