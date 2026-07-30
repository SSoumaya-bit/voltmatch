// ═══════════════════════════════════════════════════
//  VOLTMATCH — Translations Dictionary (FR / EN)
// ═══════════════════════════════════════════════════

const TRANSLATIONS = {
  fr: {
    // Nav & Common
    nav_home: "Accueil",
    nav_reco: "Recommandation",
    nav_db: "Base de données",
    nav_login: "Connexion",
    nav_start: "Démarrer",
    footer_desc: "Plateforme de dimensionnement et de recommandation de batteries. Comparaison objective multi-fournisseurs, seconde vie incluse.",
    footer_nav_title: "Navigation",
    footer_info_title: "Informations",
    footer_link_methodology: "Méthodologie de scoring",
    footer_link_about: "À propos",
    footer_link_legal: "Mentions légales",
    footer_copyright: "© 2025 VoltMatch. Plateforme de recommandation énergétique.",
    footer_disclaimer: "Estimations indicatives — à valider par un ingénieur",

    // Modal
    modal_title: "Connexion",
    modal_subtitle: "Accédez à votre historique de recommandations.",
    modal_label_email: "Email",
    modal_placeholder_email: "vous@exemple.com",
    modal_label_pass: "Mot de passe",
    modal_btn_submit: "Se connecter",
    modal_no_account: "Pas de compte ?",
    modal_link_continue: "Continuer sans compte",

    // Index / Hero
    hero_badge: "Plateforme de dimensionnement intelligent",
    hero_title_1: "Trouvez la batterie",
    hero_title_accent: "exactement",
    hero_title_2: "adaptée à votre besoin",
    hero_subtitle: "VoltMatch calcule votre configuration optimale en quelques secondes, puis compare objectivement les batteries seconde vie Renault EZ1 aux meilleures alternatives commerciales du marché mondial.",
    hero_btn_start: "Lancer une recommandation",
    hero_btn_db: "Parcourir la base de données",
    hero_trust_models: "modèles comparés",
    hero_trust_branches: "Filières : seconde vie & neuf",
    hero_trust_criteria: "Critères de scoring",
    trust_stat1_label: "Modèles de batteries comparés",
    trust_stat2_label: "Filières : seconde vie & neuf",
    trust_stat3_label: "Critères de scoring objectifs",
    steps_tag: "Fonctionnement",
    steps_title: "Trois étapes vers la solution idéale",
    steps_subtitle: "Un moteur de recommandation objectif, sans favoritisme pour aucun fabricant.",
    step1_title: "Exprimez votre besoin",
    step1_desc: "Puissance, autonomie, type d'usage, tension cible, budget — notre formulaire intelligent s'adapte à votre contexte.",
    step2_title: "Dimensionnement calculé",
    step2_desc: "Le moteur calcule l'énergie réelle (avec marge de sécurité), recommande une chimie LFP ou NMC, et détermine la configuration en cellules optimale.",
    step3_title: "Comparaison objective",
    step3_desc: "Les batteries compatibles sont scorées et classées selon 8 critères. Renault EZ1 n'est jamais favorisée artificiellement : elle remonte si son score le justifie.",
    criteria_tag: "Scoring",
    criteria_title: "8 critères de classement transparents",
    criteria_subtitle: "Chaque batterie est évaluée sur ces dimensions, normalisées sur l'ensemble des candidats.",
    crit_energy_title: "Énergie",
    crit_energy_desc: "Adéquation avec le besoin calculé — critère le plus pondéré",
    crit_price_title: "Prix total",
    crit_price_desc: "Coût de la solution complète (unité × quantité)",
    crit_stock_title: "Disponibilité",
    crit_stock_desc: "Niveau de stock pour couvrir le besoin immédiatement",
    crit_warranty_title: "Garantie",
    crit_warranty_desc: "Durée de garantie constructeur (en années)",
    crit_cycles_title: "Cycles",
    crit_cycles_desc: "Nombre de cycles de charge/décharge garanti",
    crit_density_title: "Densité massique",
    crit_density_desc: "Énergie par kg — crucial pour les applications portables",
    crit_weight_title: "Poids solution",
    crit_weight_desc: "Poids total de la solution (toutes unités confondues)",
    crit_chem_title: "Chimie",
    crit_chem_desc: "Correspondance avec la chimie LFP/NMC recommandée",
    cta_tag: "Prêt à commencer ?",
    cta_title: "Obtenez votre recommandation personnalisée",
    cta_subtitle: "En moins de 2 minutes, notre moteur calcule le dimensionnement exact et classe les meilleures batteries disponibles pour votre usage.",
    cta_btn: "Démarrer le dimensionnement",

    // Recommandation / Form
    reco_header_tag: "Moteur de recommandation",
    reco_header_title_1: "Dimensionnement & ",
    reco_header_title_accent: "recommandation",
    reco_header_title_2: " de batterie",
    reco_header_subtitle: "Complétez les informations ci-dessous pour obtenir votre configuration optimale et un classement objectif des batteries disponibles.",
    step_dot1: "Besoin énergétique",
    step_dot2: "Dimensionnement",
    step_dot3: "Batteries recommandées",
    form_sec1_title: "Type d'application",
    form_sec1_subtitle: "Détermine la chimie recommandée et les priorités de scoring",
    form_app_label: "Application cible",
    form_app_opt_select: "Sélectionner un type d'application…",
    form_app_opt_backup: "⚡ Alimentation de secours / UPS",
    form_app_opt_powerbank: "🔋 Powerbank mobile / dépannage",
    form_app_opt_sol_resi: "🏠 Stockage solaire résidentiel",
    form_app_opt_camping_car: "🚐 Camping-car / Van aménagé",
    form_app_opt_sol_indus: "🏭 Stockage solaire industriel",
    form_app_opt_peak: "📈 Écrêtage de pics (peak shaving)",
    form_app_opt_autre: "⋯ Autre",
    form_sec2_title: "Puissance et autonomie",
    form_sec2_subtitle: "Énergie = Puissance × Autonomie — avec marge de sécurité 25%",
    form_power_label: "Puissance requise",
    form_power_hint: "Puissance de crête à soutenir",
    form_auton_label: "Autonomie souhaitée",
    form_auton_hint: "Durée souhaitée sans recharge",
    unit_hours: "heures",
    unit_minutes: "minutes",
    unit_days: "jours",
    form_sec3_title: "Tension du système cible",
    form_sec3_subtitle: "Sélectionnez ou saisissez — si incertain, laissez 48V (valeur par défaut)",
    form_volt_label: "Tension nominale",
    form_volt_unsure: "Je ne sais pas",
    form_volt_placeholder: "Ou saisir une tension personnalisée (V)…",
    form_sec4_title: "Contraintes physiques et d'environnement",
    form_sec4_subtitle: "Influence la chimie recommandée et le classement",
    form_constraint_label: "Contrainte de poids / encombrement",
    form_constraint_fixe: "Usage fixe",
    form_constraint_fixe_sub: "Poids peu important",
    form_constraint_portable: "Portable et léger",
    form_constraint_portable_sub: "Mobilité prioritaire → NMC",
    form_env_label: "Environnement d'utilisation",
    form_env_indoor: "Intérieur",
    form_env_indoor_sub: "Température contrôlée",
    form_env_outdoor: "Extérieur",
    form_env_outdoor_sub: "Variations thermiques fortes",
    form_env_both: "Les deux",
    form_env_both_sub: "Usage mixte",
    form_sec5_title: "Budget indicatif",
    form_sec5_subtitle: "Filtre les batteries hors budget — laissez vide pour ne pas filtrer",
    form_budget_label: "Budget maximum",
    form_info_note: "Tous les calculs incluent une marge de sécurité de 25% sur l'énergie. Les batteries seconde vie sont comptabilisées à 80% de leur capacité nominale pour tenir compte de la dégradation.",
    form_local_note: "Calcul 100% local, aucune donnée transmise",
    form_btn_submit: "Calculer ma recommandation",

    // Dynamic Sizing & Results
    sizing_title: "Résultat du dimensionnement",
    sizing_energy_label: "Énergie nécessaire",
    sizing_energy_base: "Base : ",
    sizing_energy_margin: " Wh + 25% marge",
    sizing_voltage_label: "Tension système",
    sizing_capacity_label: "Capacité",
    sizing_weight_label: "Poids / Volume estimés",
    warning_title: "Estimation indicative",
    warning_desc: "Ces résultats sont générés automatiquement à des fins d'orientation. Ils doivent être validés par un ingénieur avant toute réalisation. Les prix et disponibilités sont indicatifs.",
    results_title: "Batteries recommandées",
    badge_second_life: "♻ Seconde vie",
    badge_new: "✦ Neuf",
    badge_rank_best: "🏆 Meilleur score",
    stock_in: "En stock",
    stock_limited: "Stock limité",
    stock_out: "Rupture de stock",
    btn_see_product: "Voir le produit",
    btn_restart: "Recommencer avec d'autres paramètres",
    btn_download_pdf: "Télécharger le rapport",
    modal_link_signup: "Créer un compte",

    // Database Page
    db_header_tag: "Catalogue",
    db_header_title: "Base de données de batteries",
    db_header_subtitle: "26 modèles référencés de 8 fabricants. Données constructeur vérifiées ou estimées depuis les fiches techniques publiques.",
    db_filter_label: "Filtrer :",
    db_filter_all: "Tous",
    db_filter_secondlife: "♻ Seconde vie",
    db_filter_new: "✦ Neuf",
    db_search_placeholder: "🔍  Rechercher fabricant ou modèle…",
    db_th_manufacturer: "Fabricant",
    db_th_model: "Modèle",
    db_th_type: "Type",
    db_th_chemistry: "Chimie",
    db_th_energy: "Énergie",
    db_th_voltage: "Tension",
    db_th_cycles: "Cycles",
    db_th_warranty: "Garantie",
    db_th_weight: "Poids",
    db_th_price: "Prix indicatif",
    db_th_stock: "Stock",
    db_empty_title: "Aucun résultat",
    db_empty_desc: "Modifiez les filtres ou la recherche.",
    db_note_title: "Note sur les données :",
    db_note_desc: "Les prix sont indicatifs (marché 2024-2025, hors installation et taxes locales). Les batteries Renault EZ1 sont des modules de seconde vie issus de véhicules électriques, reconditionnés et testés — capacité comptabilisée à 80% du nominal. Toutes les données sont à valider avant toute décision d'achat."
  },

  en: {
    // Nav & Common
    nav_home: "Home",
    nav_reco: "Recommendation",
    nav_db: "Database",
    nav_login: "Login",
    nav_start: "Start",
    footer_desc: "Battery sizing and recommendation platform. Objective multi-supplier comparison, second-life included.",
    footer_nav_title: "Navigation",
    footer_info_title: "Information",
    footer_link_methodology: "Scoring methodology",
    footer_link_about: "About us",
    footer_link_legal: "Legal notice",
    footer_copyright: "© 2025 VoltMatch. Energy recommendation platform.",
    footer_disclaimer: "Indicative estimates — to be validated by an engineer",

    // Modal
    modal_title: "Login",
    modal_subtitle: "Access your recommendation history.",
    modal_label_email: "Email",
    modal_placeholder_email: "you@example.com",
    modal_label_pass: "Password",
    modal_btn_submit: "Log in",
    modal_no_account: "No account?",
    modal_link_continue: "Continue without account",

    // Index / Hero
    hero_badge: "Intelligent sizing platform",
    hero_title_1: "Find the battery",
    hero_title_accent: "perfectly",
    hero_title_2: "suited to your needs",
    hero_subtitle: "VoltMatch calculates your optimal configuration in seconds, then objectively compares second-life Renault EZ1 batteries against the best commercial alternatives on the global market.",
    hero_btn_start: "Start a recommendation",
    hero_btn_db: "Browse the database",
    hero_trust_models: "models compared",
    hero_trust_branches: "Channels: second-life & new",
    hero_trust_criteria: "Scoring criteria",
    trust_stat1_label: "Battery models compared",
    trust_stat2_label: "Channels: second-life & new",
    trust_stat3_label: "Objective scoring criteria",
    steps_tag: "How it works",
    steps_title: "Three steps to your ideal solution",
    steps_subtitle: "An objective recommendation engine, with no favoritism for any manufacturer.",
    step1_title: "Express your needs",
    step1_desc: "Power, autonomy, usage type, target voltage, budget — our smart form adapts to your context.",
    step2_title: "Calculated sizing",
    step2_desc: "The engine calculates real energy requirements (with a safety margin), recommends LFP or NMC chemistry, and determines optimal cell configuration.",
    step3_title: "Objective comparison",
    step3_desc: "Compatible batteries are scored and ranked based on 8 criteria. Renault EZ1 is never artificially favored: it ranks high only if its score justifies it.",
    criteria_tag: "Scoring",
    criteria_title: "8 transparent ranking criteria",
    criteria_subtitle: "Each battery is evaluated on these dimensions, normalized across all candidates.",
    crit_energy_title: "Energy",
    crit_energy_desc: "Fit with calculated requirement — highest weighted criterion",
    crit_price_title: "Total price",
    crit_price_desc: "Cost of complete solution (unit × quantity)",
    crit_stock_title: "Availability",
    crit_stock_desc: "Stock level to cover requirements immediately",
    crit_warranty_title: "Warranty",
    crit_warranty_desc: "Manufacturer warranty duration (in years)",
    crit_cycles_title: "Cycles",
    crit_cycles_desc: "Guaranteed charge/discharge cycle count",
    crit_density_title: "Energy density",
    crit_density_desc: "Energy per kg — crucial for portable applications",
    crit_weight_title: "Solution weight",
    crit_weight_desc: "Total solution weight (all units combined)",
    crit_chem_title: "Chemistry",
    crit_chem_desc: "Match with recommended LFP/NMC chemistry",
    cta_tag: "Ready to start?",
    cta_title: "Get your personalized recommendation",
    cta_subtitle: "In under 2 minutes, our engine calculates exact sizing and ranks the best available batteries for your usage.",
    cta_btn: "Start sizing",

    // Recommandation / Form
    reco_header_tag: "Recommendation engine",
    reco_header_title_1: "Sizing & ",
    reco_header_title_accent: "recommendation",
    reco_header_title_2: " of battery",
    reco_header_subtitle: "Fill out the information below to get your optimal configuration and an objective ranking of available batteries.",
    step_dot1: "Energy requirements",
    step_dot2: "Sizing",
    step_dot3: "Recommended batteries",
    form_sec1_title: "Application type",
    form_sec1_subtitle: "Determines recommended chemistry and scoring priorities",
    form_app_label: "Target application",
    form_app_opt_select: "Select an application type…",
    form_app_opt_backup: "⚡ Emergency backup / UPS",
    form_app_opt_powerbank: "🔋 Mobile powerbank / emergency",
    form_app_opt_sol_resi: "🏠 Residential solar storage",
    form_app_opt_camping_car: "🚐 Camper van / Van build",
    form_app_opt_sol_indus: "🏭 Industrial solar storage",
    form_app_opt_peak: "📈 Peak shaving",
    form_app_opt_autre: "⋯ Other",
    form_sec2_title: "Power and autonomy",
    form_sec2_subtitle: "Energy = Power × Autonomy — with 25% safety margin",
    form_power_label: "Required power",
    form_power_hint: "Peak power to sustain",
    form_auton_label: "Desired autonomy",
    form_auton_hint: "Desired duration without recharge",
    unit_hours: "hours",
    unit_minutes: "minutes",
    unit_days: "days",
    form_sec3_title: "Target system voltage",
    form_sec3_subtitle: "Select or enter — if unsure, leave 48V (default value)",
    form_volt_label: "Nominal voltage",
    form_volt_unsure: "I don't know",
    form_volt_placeholder: "Or enter a custom voltage (V)…",
    form_sec4_title: "Physical and environmental constraints",
    form_sec4_subtitle: "Influences recommended chemistry and ranking",
    form_constraint_label: "Weight / size constraint",
    form_constraint_fixe: "Stationary use",
    form_constraint_fixe_sub: "Weight is not important",
    form_constraint_portable: "Portable and lightweight",
    form_constraint_portable_sub: "Mobility is priority → NMC",
    form_env_label: "Operating environment",
    form_env_indoor: "Indoor",
    form_env_indoor_sub: "Temperature-controlled",
    form_env_outdoor: "Outdoor",
    form_env_outdoor_sub: "High thermal variations",
    form_env_both: "Both",
    form_env_both_sub: "Mixed usage",
    form_sec5_title: "Indicative budget",
    form_sec5_subtitle: "Filters batteries over budget — leave empty to skip filtering",
    form_budget_label: "Maximum budget",
    form_info_note: "All calculations include a 25% safety margin on energy. Second-life batteries are accounted at 80% of nominal capacity to allow for degradation.",
    form_local_note: "100% local calculation, no data transmitted",
    form_btn_submit: "Calculate recommendation",

    // Dynamic Sizing & Results
    sizing_title: "Sizing result",
    sizing_energy_label: "Required energy",
    sizing_energy_base: "Base: ",
    sizing_energy_margin: " Wh + 25% margin",
    sizing_voltage_label: "System voltage",
    sizing_capacity_label: "Capacity",
    sizing_weight_label: "Estimated weight / volume",
    warning_title: "Indicative estimate",
    warning_desc: "These results are automatically generated for guidance purposes. They must be validated by an engineer before any implementation. Prices and availability are indicative.",
    results_title: "Recommended batteries",
    badge_second_life: "♻ Second life",
    badge_new: "✦ New",
    badge_rank_best: "🏆 Best score",
    stock_in: "In stock",
    stock_limited: "Limited stock",
    stock_out: "Out of stock",
    btn_see_product: "View product",
    btn_restart: "Start over with different parameters",
    btn_download_pdf: "Download report",
    modal_link_signup: "Create an account",

    // Database Page
    db_header_tag: "Catalog",
    db_header_title: "Battery database",
    db_header_subtitle: "26 referenced models from 8 manufacturers. Manufacturer data verified or estimated from public datasheets.",
    db_filter_label: "Filter:",
    db_filter_all: "All",
    db_filter_secondlife: "♻ Second life",
    db_filter_new: "✦ New",
    db_search_placeholder: "🔍  Search manufacturer or model…",
    db_th_manufacturer: "Manufacturer",
    db_th_model: "Model",
    db_th_type: "Type",
    db_th_chemistry: "Chemistry",
    db_th_energy: "Energy",
    db_th_voltage: "Voltage",
    db_th_cycles: "Cycles",
    db_th_warranty: "Warranty",
    db_th_weight: "Weight",
    db_th_price: "Indicative price",
    db_th_stock: "Stock",
    db_empty_title: "No results found",
    db_empty_desc: "Modify filters or search query.",
    db_note_title: "Note on data:",
    db_note_desc: "Prices are indicative (2024-2025 market, excluding installation and local taxes). Renault EZ1 batteries are second-life modules from electric vehicles, reconditioned and tested — capacity accounted at 80% of nominal. All data must be validated before any purchase decision."
  }
};

// ── Language Manager ──
function getCurrentLang() {
  return localStorage.getItem('voltmatch_lang') || 'fr';
}

function setLanguage(lang) {
  if (lang !== 'fr' && lang !== 'en') lang = 'fr';
  localStorage.setItem('voltmatch_lang', lang);

  const dict = TRANSLATIONS[lang];
  if (!dict) return;

  // 1. Update text content for [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // 2. Update placeholders for [data-i18n-placeholder]
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // 3. Update header toggle button label (shows the OTHER language to switch to)
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    const targetLang = lang === 'fr' ? 'EN' : 'FR';
    langToggleBtn.textContent = targetLang;
    langToggleBtn.setAttribute('title', lang === 'fr' ? 'Switch to English' : 'Passer en français');
  }

  // 4. Update html lang attribute
  document.documentElement.setAttribute('lang', lang);
}

function toggleLanguage() {
  const current = getCurrentLang();
  const next = current === 'fr' ? 'en' : 'fr';
  setLanguage(next);

  // If on recommendation results step, re-render results to reflect language
  if (typeof renderSizingCard === 'function' && window.currentBesoin) {
    renderSizingCard(window.currentBesoin);
  }
  if (typeof renderResults === 'function' && window.currentRecommandations && window.currentBesoin) {
    renderResults(window.currentRecommandations, window.currentBesoin);
  }

  // If on database page, re-render table
  if (typeof renderTable === 'function') {
    renderTable();
  }
}

// Auto-initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(getCurrentLang());
});
