// ═══════════════════════════════════════════════════
//  VOLTMATCH — currency.js
//  Gestion centralisée de la devise d'affichage
//  Taux de change indicatifs — mise à jour : juillet 2025
// ═══════════════════════════════════════════════════

/**
 * Taux de change (base EUR = 1).
 * Mise à jour manuelle recommandée chaque trimestre.
 * Les prix affichés restent INDICATIFS — voir dataNote de chaque batterie.
 */
const EXCHANGE_RATES = {
  EUR: 1.000,
  USD: 1.090,   // 1 EUR = 1.09 USD  (juil. 2025)
  MAD: 10.850,  // 1 EUR = 10.85 MAD (juil. 2025 — Dirham marocain, ancré EUR/USD)
};

/** Date de référence des taux (affichée dans l'UI) */
const RATES_DATE = 'juillet 2025';

/** Devises supportées (ordre d'affichage dans le sélecteur) */
const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'MAD'];

/** Symboles courts pour l'affichage compact */
const CURRENCY_SYMBOLS = {
  EUR: '€',
  USD: '$',
  MAD: 'DH',
};

/** Locales Intl par devise */
const CURRENCY_LOCALES = {
  EUR: 'fr-FR',
  USD: 'en-US',
  MAD: 'fr-MA',
};

// ── Persistance (localStorage) ──────────────────────

function getCurrentCurrency() {
  const stored = localStorage.getItem('voltmatch_currency');
  return SUPPORTED_CURRENCIES.includes(stored) ? stored : 'EUR';
}

function setCurrency(currency) {
  if (!SUPPORTED_CURRENCIES.includes(currency)) return;
  localStorage.setItem('voltmatch_currency', currency);
  _updateCurrencySelector(currency);
  _triggerPriceRefresh();
}

// ── Conversion & formatage ───────────────────────────

/**
 * Convertit un montant depuis sa devise d'origine vers la devise active.
 * @param {number} amount       Montant dans la devise d'origine
 * @param {string} fromCurrency Devise d'origine ('EUR', 'USD', …)
 * @returns {number}            Montant converti
 */
function convertPrice(amount, fromCurrency) {
  const displayCurrency = getCurrentCurrency();
  if (fromCurrency === displayCurrency) return amount;
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate   = EXCHANGE_RATES[displayCurrency] || 1;
  return amount * (toRate / fromRate);
}

/**
 * Convertit ET formate un prix pour l'affichage.
 * @param {number} amount       Montant dans la devise d'origine
 * @param {string} fromCurrency Devise d'origine ('EUR', 'USD', …)
 * @param {number} [fractionDigits=0] Décimales
 * @returns {string}            Chaîne formatée, ex: "14 500 €" / "$1,450" / "14 500 DH"
 */
function formatPrice(amount, fromCurrency, fractionDigits = 0) {
  const displayCurrency = getCurrentCurrency();
  const converted = convertPrice(amount, fromCurrency);

  // MAD n'est pas toujours bien supporté par Intl sur tous les navigateurs ;
  // on formate manuellement avec le symbole DH.
  if (displayCurrency === 'MAD') {
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(converted);
    return `${formatted} DH`;
  }

  return new Intl.NumberFormat(CURRENCY_LOCALES[displayCurrency], {
    style: 'currency',
    currency: displayCurrency,
    maximumFractionDigits: fractionDigits,
  }).format(converted);
}

// ── UI : sélecteur dans le header ───────────────────

/**
 * Met à jour l'état visuel du sélecteur de devise (boutons actifs).
 */
function _updateCurrencySelector(activeCurrency) {
  document.querySelectorAll('.currency-btn').forEach(btn => {
    const isActive = btn.dataset.currency === activeCurrency;
    btn.classList.toggle('active', isActive);
  });
}

/**
 * Déclenche le re-rendu des prix sur la page courante.
 * Réutilise les hooks déjà en place pour la langue.
 */
function _triggerPriceRefresh() {
  // recommandation.html — re-render les résultats si disponibles
  if (typeof renderResults === 'function' && window.currentRecommandations && window.currentBesoin) {
    renderResults(window.currentRecommandations, window.currentBesoin);
  }
  // database.html — re-render le tableau
  if (typeof renderTable === 'function') {
    renderTable();
  }
  // Panier — re-render les prix et le total du panier
  if (typeof updateCartUI === 'function') {
    updateCartUI();
  }
}

/**
 * Initialise les boutons de devise dans le header.
 * Appelé une fois par page au DOMContentLoaded.
 */
function initCurrencySelector() {
  const activeCurrency = getCurrentCurrency();
  _updateCurrencySelector(activeCurrency);
}

// Auto-init au chargement
document.addEventListener('DOMContentLoaded', () => {
  initCurrencySelector();
});
