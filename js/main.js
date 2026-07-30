// ═══════════════════════════════════════════════════
//  VOLTMATCH — main.js (recommandation.html)
// ═══════════════════════════════════════════════════

// ── Stepper state ──────────────────────────────────
// Note: step2 in HTML = dimensionnement + results combined panel
let currentStep = 1;

function goToStep(n) {
  // step1 = form; step2 = results panel (sizing + results + restart)
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');

  if (n === 1) {
    if (step1) { step1.classList.remove('hidden'); step1.classList.add('fade-in'); }
    if (step2) step2.classList.add('hidden');
  } else {
    if (step1) step1.classList.add('hidden');
    if (step2) { step2.classList.remove('hidden'); step2.classList.add('fade-in'); }
  }

  // Update step dots
  // dot1 = form, dot2 = dimensionnement, dot3 = résultats
  // When showing results: all 3 dots are active/done
  const dotStep = n === 1 ? 1 : 3; // results = all 3 filled
  [1, 2, 3].forEach(i => {
    const dot = document.getElementById('dot' + i);
    if (!dot) return;
    dot.classList.remove('active', 'done');
    if (i < dotStep)    dot.classList.add('done');
    if (i === dotStep)  dot.classList.add('active');
  });

  // Connector fill
  const c1 = document.getElementById('connector1');
  const c2 = document.getElementById('connector2');
  if (c1) c1.querySelector('.step-connector-fill').style.width = n >= 2 ? '100%' : '0%';
  if (c2) c2.querySelector('.step-connector-fill').style.width = n >= 2 ? '100%' : '0%';

  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Toggle buttons (tension, portability, environment) ──
function setupToggleGroup(groupId, inputId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (inputId) {
        const input = document.getElementById(inputId);
        if (input) input.value = btn.dataset.value;
      }
    });
  });
}

function setupRadioGroup(groupId, inputId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      group.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const input = document.getElementById(inputId);
      if (input) input.value = card.dataset.value;
    });
  });
}

// ── Autonomy contextual hints per application type ─────────
const AUTONOMY_HINTS = {
  fr: {
    'backup':        '⚡️ Autonomie typique : 1 à 4 h (couvre les coupures courtes)',
    'powerbank':     '🔋 Autonomie typique : 4 à 12 h (nomade ou dépannage)',
    'solaire-resi':  '🏠 Autonomie typique : 4 à 12 h (couvre la nuit)',
    'solaire-indus': '🏥 Autonomie typique : 8 à 24 h (stockage nuit + tampon)',
    'peak-shaving':  '📈 Autonomie typique : 1 à 4 h (lissé des pics de demande)',
    'camping-car':   '🚐 Autonomie typique : 8 à 24 h (nuit + usage quotidien van)',
    'autre':         '⚙️ Saisissez l\'autonomie adaptée à votre cas d\'usage',
  },
  en: {
    'backup':        '⚡️ Typical autonomy: 1 to 4 h (covers short outages)',
    'powerbank':     '🔋 Typical autonomy: 4 to 12 h (mobile or rescue use)',
    'solaire-resi':  '🏠 Typical autonomy: 4 to 12 h (overnight coverage)',
    'solaire-indus': '🏠 Typical autonomy: 8 to 24 h (night storage + buffer)',
    'peak-shaving':  '📈 Typical autonomy: 1 to 4 h (demand-peak smoothing)',
    'camping-car':   '🚐 Typical autonomy: 8 to 24 h (overnight + daily van use)',
    'autre':         '⚙️ Enter the autonomy suited to your use case',
  },
};

function updateAutonomyHint() {
  const hintEl = document.getElementById('autonomieContextHint');
  const typeEl = document.getElementById('typeApp');
  if (!hintEl || !typeEl) return;

  const appType = typeEl.value;
  const lang    = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'fr';
  const map     = AUTONOMY_HINTS[lang] || AUTONOMY_HINTS.fr;
  const hint    = map[appType];

  if (hint) {
    hintEl.textContent = hint;
    hintEl.style.display = 'block';
  } else {
    hintEl.textContent = '';
    hintEl.style.display = 'none';
  }
}

// ── Init ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupToggleGroup('voltageGroup', 'tensionInput');
  setupRadioGroup('contrainteGroup', 'contrainteInput');
  setupRadioGroup('envGroup', 'envInput');
  goToStep(1);
  updateLucideIcons();

  // Attach autonomy hint listener
  const typeAppSel = document.getElementById('typeApp');
  if (typeAppSel) {
    typeAppSel.addEventListener('change', updateAutonomyHint);
  }
});

// ── Unit conversions ───────────────────────────────
function getPuissanceW() {
  const val  = parseFloat(document.getElementById('puissanceVal').value) || 0;
  const unit = document.getElementById('puissanceUnit').value;
  return unit === 'kW' ? val * 1000 : val;
}

function getAutonomieH() {
  const val  = parseFloat(document.getElementById('autonomieVal').value) || 0;
  const unit = document.getElementById('autonomieUnit').value;
  if (unit === 'minutes') return val / 60;
  if (unit === 'jours')   return val * 24;
  return val; // heures
}

// ── Form submit ────────────────────────────────────
const form = document.getElementById('besoinForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> Calcul en cours…`;

    setTimeout(() => {
      try {
        const puissanceW   = getPuissanceW();
        const autonomieH   = getAutonomieH();
        const tensionCible = parseFloat(document.getElementById('tensionInput').value) || 48;
        const typeApp      = document.getElementById('typeApp').value;
        const contrainte   = document.getElementById('contrainteInput').value || 'fixe';
        const budgetMax    = parseFloat(document.getElementById('budgetVal').value) || null;
        const budgetCurrency = document.getElementById('budgetCurrency').value || 'EUR';
        const poidsMaxKg   = null;

        if (puissanceW <= 0) { alert('Veuillez saisir une puissance valide.'); submitBtn.disabled = false; submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Calculer ma recommandation`; return; }
        if (autonomieH <= 0) { alert('Veuillez saisir une autonomie valide.'); submitBtn.disabled = false; submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Calculer ma recommandation`; return; }

        const besoin = calculerDimensionnement({ puissanceW, autonomieH, tensionCible, typeApp, contrainte });
        const recommandations = recommanderBatteries(besoin, { budgetMax, budgetCurrency, poidsMaxKg });

        window.currentBesoin = besoin;
        window.currentRecommandations = recommandations;
        renderSizingCard(besoin);
        renderResults(recommandations, besoin);

        submitBtn.disabled = false;
        const btnSubmitText = (typeof getCurrentLang === 'function' && getCurrentLang() === 'en') ? 'Calculate recommendation' : 'Calculer ma recommandation';
        submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> ${btnSubmitText}`;

        goToStep(2);
      } catch(err) {
        console.error(err);
        submitBtn.disabled = false;
        const btnSubmitText = (typeof getCurrentLang === 'function' && getCurrentLang() === 'en') ? 'Calculate recommendation' : 'Calculer ma recommandation';
        submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> ${btnSubmitText}`;
      }
    }, 700);
  });
}

// ── Render Sizing Card ─────────────────────────────
function renderSizingCard(besoin) {
  const el = document.getElementById('sizingCard');
  if (!el) return;

  const lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'fr';
  const isEn = lang === 'en';

  const chemClass = besoin.chimie === 'LFP' ? 'lfp' : 'nmc';
  const labelTitle = isEn ? "Sizing result" : "Résultat du dimensionnement";
  const labelEnergy = isEn ? "Required energy" : "Énergie nécessaire";
  const labelBase = isEn ? "Base: " : "Base : ";
  const labelMargin = isEn ? " Wh + 25% margin" : " Wh + 25% marge";
  const labelVoltage = isEn ? "System voltage" : "Tension système";
  const labelCapacity = isEn ? "Capacity" : "Capacité";
  const labelWeight = isEn ? "Estimated weight / volume" : "Poids / Volume estimés";

  el.innerHTML = `
    <div class="sizing-card fade-in">
      <div class="sizing-card-header">
        <div>
          <div class="sizing-card-title">${labelTitle}</div>
          <div class="sizing-card-subtitle">${besoin.configLabel}</div>
        </div>
        <div style="text-align:right">
          <div class="chemistry-badge ${chemClass}">${besoin.chimie}</div>
          <div style="font-size:0.75rem;color:rgba(255,255,255,0.45);margin-top:6px;max-width:220px;text-align:right">${besoin.chimieRaison}</div>
        </div>
      </div>
      <div class="sizing-grid">
        <div class="sizing-item">
          <div class="sizing-item-icon">
            ${iconSVG('zap', 18)}
          </div>
          <div class="sizing-item-label">${labelEnergy}</div>
          <div class="sizing-item-value">${Math.round(besoin.energieWh)}<span class="sizing-item-unit">Wh</span></div>
          <div style="font-size:0.75rem;color:rgba(255,255,255,0.35);margin-top:4px">${labelBase}${Math.round(besoin.energieBaseWh)}${labelMargin}</div>
        </div>
        <div class="sizing-item">
          <div class="sizing-item-icon">
            ${iconSVG('battery', 18)}
          </div>
          <div class="sizing-item-label">${labelVoltage}</div>
          <div class="sizing-item-value">${besoin.tensionReelle}<span class="sizing-item-unit">V</span></div>
          <div style="font-size:0.75rem;color:rgba(255,255,255,0.35);margin-top:4px">${besoin.cellsS}S × ${besoin.cellsP}P</div>
        </div>
        <div class="sizing-item">
          <div class="sizing-item-icon">
            ${iconSVG('gauge', 18)}
          </div>
          <div class="sizing-item-label">${labelCapacity}</div>
          <div class="sizing-item-value">${besoin.capaciteAh}<span class="sizing-item-unit">Ah</span></div>
          <div style="font-size:0.75rem;color:rgba(255,255,255,0.35);margin-top:4px">@ ${besoin.tensionReelle}V</div>
        </div>
        <div class="sizing-item">
          <div class="sizing-item-icon">
            ${iconSVG('weight', 18)}
          </div>
          <div class="sizing-item-label">${labelWeight}</div>
          <div class="sizing-item-value">${besoin.poidsKg}<span class="sizing-item-unit">kg</span></div>
          <div style="font-size:0.75rem;color:rgba(255,255,255,0.35);margin-top:4px">≈ ${besoin.volumeL} L</div>
        </div>
      </div>
    </div>
  `;
}

// ── Render Results ─────────────────────────────────
function renderResults(recommandations, besoin) {
  // Store for PDF export
  _lastBesoin          = besoin;
  _lastRecommandations = recommandations;
  const container = document.getElementById('resultsList');
  const countEl   = document.getElementById('resultsCount');
  if (!container) return;

  const lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'fr';
  const isEn = lang === 'en';

  if (countEl) {
    if (isEn) {
      countEl.textContent = `${recommandations.length} compatible battery${recommandations.length !== 1 ? 'ies' : ''}`;
    } else {
      countEl.textContent = `${recommandations.length} batterie${recommandations.length !== 1 ? 's' : ''} compatible${recommandations.length !== 1 ? 's' : ''}`;
    }
  }

  if (recommandations.length === 0) {
    const emptyTitle = isEn ? "No compatible battery found" : "Aucune batterie compatible trouvée";
    const emptyDesc  = isEn ? "Try relaxing budget or weight constraints." : "Essayez de relâcher les contraintes de budget ou de poids.";
    container.innerHTML = `
      <div style="text-align:center;padding:3rem;background:#fff;border-radius:16px;border:1px solid rgba(0,0,0,0.07)">
        <div style="font-size:2rem;margin-bottom:1rem">🔍</div>
        <p style="font-weight:700;color:#1a2535;margin-bottom:0.5rem">${emptyTitle}</p>
        <p style="font-size:0.875rem;color:var(--text-muted)">${emptyDesc}</p>
      </div>`;
    return;
  }

  const localeStr = isEn ? 'en-US' : 'fr-FR';

  container.innerHTML = recommandations.map((b, i) => {
    const isSecondLife = b.type === 'seconde vie';
    const borderClass  = isSecondLife ? 'second-life' : 'neuf';
    const badgeClass   = isSecondLife ? 'badge-second-life' : 'badge-neuf';
    const badgeLabel   = isSecondLife ? (isEn ? '♻ Second life' : '♻ Seconde vie') : (isEn ? '✦ New' : '✦ Neuf');
    const rankLabel    = i === 0 ? (isEn ? '🏆 Best score' : '🏆 Meilleur score') : i === 1 ? '🥈 2e' : i === 2 ? '🥉 3e' : `#${i+1}`;

    const stockHtml = b.stock > 10
      ? `<span class="result-stock-ok">${iconSVG('check-circle', 13)} ${isEn ? 'In stock' : 'En stock'}</span>`
      : b.stock > 0
      ? `<span class="result-stock-ok" style="color:#f59e0b">${iconSVG('alert-circle', 13)} ${isEn ? `Limited stock (${b.stock} units)` : `Stock limité (${b.stock} unités)`}</span>`
      : `<span class="result-stock-out">${iconSVG('x-circle', 13)} ${isEn ? 'Out of stock' : 'Rupture de stock'}</span>`;

    const prixFormate     = formatPrice(b.prixTotal, b.currency);
    const prixUnitFormate = formatPrice(b.price, b.currency);

    const uniteLabel = b.quantite > 1 
      ? (isEn ? `${b.quantite} units × ${prixUnitFormate}` : `${b.quantite} unités × ${prixUnitFormate}`)
      : (isEn ? `${prixUnitFormate} each` : `${prixUnitFormate} l'unité`);

    const warrantyLabel = isEn ? 'warranty' : 'garantie';
    const totalLabel    = isEn ? 'total' : 'total';
    const unitsLabel    = isEn ? `unit${b.quantite > 1 ? 's' : ''}` : `unité${b.quantite > 1 ? 's' : ''}`;
    const btnText       = isEn ? 'View product' : 'Voir le produit';

    return `
      <div class="result-card ${borderClass} fade-in" style="animation-delay:${i * 0.07}s">
        <div class="result-card-main">
          <div class="result-header-row">
            <span class="result-manufacturer">${b.manufacturer} <span style="font-weight:400;color:var(--text-muted)">${b.model}</span></span>
            <span class="badge-type ${badgeClass}">${badgeLabel}</span>
            ${i < 3 ? `<span class="badge-rank">${rankLabel}</span>` : ''}
          </div>

          <div class="result-specs">
            <span class="result-spec">${iconSVG('battery', 14)} <strong>${b.energyKwh} kWh</strong> / ${isEn ? 'unit' : 'unité'}</span>
            <span class="result-spec">${iconSVG('zap', 14)} <strong>${b.chemistry}</strong></span>
            <span class="result-spec">${iconSVG('rotate-ccw', 14)} <strong>${b.cycles.toLocaleString(localeStr)}</strong> cycles</span>
            <span class="result-spec">${iconSVG('shield-check', 14)} <strong>${b.warrantyYears} ${isEn ? 'years' : 'ans'}</strong> ${warrantyLabel}</span>
            <span class="result-spec">${iconSVG('weight', 14)} <strong>${b.poidsTotal.toFixed(0)} kg</strong> ${totalLabel}</span>
            <span class="result-spec">${iconSVG('layers', 14)} <strong>${b.quantite}</strong> ${unitsLabel}</span>
          </div>

          <div class="result-bottom">
            <div>
              <div class="result-price">${prixFormate}</div>
              <div class="result-price-detail">${uniteLabel}</div>
            </div>
            ${stockHtml}
          </div>
        </div>

        <div class="result-action">
          ${renderBatteryScore(b.score)}
          ${b.manufacturer === 'Renault'
            ? ((typeof isInCart === 'function' && isInCart(b.id))
                ? `<button onclick="removeFromCart('${b.id}')" class="btn-cart-action btn-cart-added" title="${isEn ? 'Click to remove' : 'Cliquer pour retirer'}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>${isEn ? 'In Cart' : 'Dans le panier'}</span>
                    <span class="cart-remove-cross">&times;</span>
                   </button>`
                : `<button onclick="addToCart('${b.id}', ${b.quantite || 1})" class="btn-cart-action btn-cart-add">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    <span>${isEn ? 'Add to Cart' : 'Ajouter au panier'}</span>
                   </button>`
              )
            : ((b.purchaseUrl && b.purchaseUrl !== '#')
                ? `<a href="${b.purchaseUrl}" target="_blank" rel="noopener" class="btn-voir" style="margin-top:14px">${btnText} ${iconSVG('external-link', 13)}</a>`
                : `<span class="btn-voir" style="margin-top:14px;opacity:0.38;cursor:default;pointer-events:none;display:inline-block">${isEn ? 'No link available' : 'Lien non disponible'}</span>`
              )
          }
        </div>
      </div>
    `;
  }).join('');

  // Smooth scroll to top of results
  setTimeout(() => {}, 100);
}

/**
 * Smooth 3-stop RGB color interpolation:
 * 0%   = Copper (#C97B4A)
 * 50%  = Gold/Yellow (#EAB308)
 * 100% = Green (#22C55E)
 * @param {number} score (0 - 100)
 * @returns {string} rgb(r, g, b)
 */
function getScoreColor(score) {
  const pct = Math.max(0, Math.min(100, score)) / 100;
  
  if (pct < 0.5) {
    // Interpolate from Copper (23, 56%, 54%) to Gold (45, 93%, 47%)
    const p = pct * 2; // Scale 0-0.5 to 0-1
    const h = Math.round(23 + (45 - 23) * p);
    const s = Math.round(56 + (93 - 56) * p);
    const l = Math.round(54 + (47 - 54) * p);
    return `hsl(${h}, ${s}%, ${l}%)`;
  } else {
    // Interpolate from Gold (45, 93%, 47%) to Green (142, 71%, 45%)
    const p = (pct - 0.5) * 2; // Scale 0.5-1 to 0-1
    const h = Math.round(45 + (142 - 45) * p);
    const s = Math.round(93 + (71 - 93) * p);
    const l = Math.round(47 + (45 - 47) * p);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
}

// ── Battery Score Indicator ────────────────────────
function renderBatteryScore(score) {
  const circumference = 88;
  const dashOffset = circumference - (score / 100) * circumference;
  const scoreColor = getScoreColor(score);

  return `
    <div class="score-rating-wrap">
      <span class="score-badge-pill" style="background: ${scoreColor};">${score}%</span>
      <div class="rating-circle" title="Score de compatibilité : ${score}%">
        <svg width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="3"/>
          <circle cx="18" cy="18" r="14" fill="none" stroke="${scoreColor}" stroke-width="3"
                  stroke-dasharray="88" stroke-dashoffset="${dashOffset.toFixed(1)}"
                  stroke-linecap="round" transform="rotate(-90 18 18)"/>
          <polygon points="18,10.5 20.2,15 25,15.6 21.5,18.9 22.4,23.5 18,21.1 13.6,23.5 14.5,18.9 11,15.6 15.8,15" fill="${scoreColor}"/>
        </svg>
      </div>
    </div>
  `;
}

// ── Last results store (for PDF export) ────────────
let _lastBesoin          = null;
let _lastRecommandations = [];

// ── PDF Export ─────────────────────────────────────
function generatePDF() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('jsPDF not loaded — please check your internet connection.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const lang  = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'fr';
  const isEn  = lang === 'en';
  const doc   = new jsPDF({ unit: 'mm', format: 'a4' });

  const margin  = 18;
  const pageW   = doc.internal.pageSize.getWidth();
  let   y       = margin;

  // ── Helper: small utils ────────────────────────────
  function checkPage(needed) {
    if (y + needed > 275) { doc.addPage(); y = margin; }
  }
  function line(color) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 4;
  }

  // ── 1. Header band ─────────────────────────────────
  doc.setFillColor(26, 37, 53);
  doc.rect(0, 0, pageW, 28, 'F');

  // Logo bolt unicode alt: draw a simple polygon
  doc.setFillColor(232, 98, 44);
  doc.rect(margin, 7, 2.5, 14, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('VoltMatch', margin + 6, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(201, 123, 74);
  const headerSub = isEn ? 'Battery Sizing & Recommendation Report' : 'Rapport de dimensionnement & recommandation';
  doc.text(headerSub, margin + 6, 23);

  const dateStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setTextColor(160, 160, 160);
  doc.setFontSize(8);
  doc.text(dateStr, pageW - margin, 17, { align: 'right' });

  y = 36;

  // ── 2. Sizing section ──────────────────────────────
  if (_lastBesoin) {
    const b = _lastBesoin;
    doc.setTextColor(26, 37, 53);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const sizingTitle = isEn ? '1. Energy Sizing Result' : '1. Résultat du dimensionnement';
    doc.text(sizingTitle, margin, y); y += 2;
    line([232, 98, 44]);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 60, 75);

    const rows = [
      [isEn ? 'Required energy (with 25% margin)' : 'Énergie nécessaire (marge 25%)',
       `${Math.round(b.energieWh)} Wh`],
      [isEn ? 'Base energy' : 'Énergie de base',
       `${Math.round(b.energieBaseWh)} Wh`],
      [isEn ? 'Target voltage' : 'Tension cible',
       `${b.tensionReelle} V`],
      [isEn ? 'Cell configuration' : 'Configuration cellules',
       `${b.cellsS}S × ${b.cellsP}P`],
      [isEn ? 'Required capacity' : 'Capacité requise',
       `${b.capaciteAh} Ah @ ${b.tensionReelle}V`],
      [isEn ? 'Estimated weight' : 'Poids estimé',
       `${b.poidsKg} kg`],
      [isEn ? 'Estimated volume' : 'Volume estimé',
       `${b.volumeL} L`],
      [isEn ? 'Recommended chemistry' : 'Chimie recommandée',
       b.chimie],
    ];

    rows.forEach(([label, value]) => {
      checkPage(7);
      doc.setFont('helvetica', 'bold');
      doc.text(label + ' :', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, pageW - margin, y, { align: 'right' });
      y += 6.5;
    });

    y += 4;
  }

  // ── 3. Recommended batteries ───────────────────────
  checkPage(14);
  doc.setTextColor(26, 37, 53);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const recoTitle = isEn ? '2. Recommended Batteries' : '2. Batteries recommandées';
  doc.text(recoTitle, margin, y); y += 2;
  line([232, 98, 44]);

  if (_lastRecommandations.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(120, 120, 120);
    const noResult = isEn ? 'No compatible battery found for these parameters.' : 'Aucune batterie compatible trouvée pour ces paramètres.';
    doc.text(noResult, margin, y);
    y += 8;
  }

  _lastRecommandations.forEach((bat, idx) => {
    checkPage(36);

    const rankLabel = idx === 0 ? (isEn ? '🏆 Best score' : '🏆 Meilleur score')
                    : idx === 1 ? '🥈 #2'
                    : idx === 2 ? '🥉 #3'
                    : `#${idx + 1}`;

    // Card background
    doc.setFillColor(247, 249, 252);
    const cardH = 34;
    doc.roundedRect(margin, y - 2, pageW - 2 * margin, cardH, 3, 3, 'F');

    // Left accent bar
    const rgb = _getScoreRgb(bat.score);
    doc.setFillColor(...rgb);
    doc.roundedRect(margin, y - 2, 3, cardH, 1.5, 1.5, 'F');

    // Rank
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...rgb);
    doc.text(rankLabel, margin + 6, y + 3);

    // Manufacturer + model
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(26, 37, 53);
    doc.text(`${bat.manufacturer} ${bat.model}`, margin + 6, y + 10);

    // Score badge
    doc.setFillColor(...rgb);
    doc.roundedRect(pageW - margin - 22, y + 3, 20, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`${bat.score}%`, pageW - margin - 12, y + 9, { align: 'center' });

    // Specs row
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 95, 110);
    const locStr = isEn ? 'en-US' : 'fr-FR';
    const prixTxt = new Intl.NumberFormat(locStr, { style: 'currency', currency: bat.currency, maximumFractionDigits: 0 }).format(bat.prixTotal);
    const qtyLabel  = isEn ? `${bat.quantite} unit${bat.quantite > 1 ? 's' : ''}` : `${bat.quantite} unité${bat.quantite > 1 ? 's' : ''}`;
    const specLine  = `${bat.energyKwh} kWh/unit  •  ${bat.chemistry}  •  ${bat.cycles.toLocaleString(locStr)} cycles  •  ${bat.warrantyYears}${isEn ? 'yr warranty' : 'ans garantie'}  •  ${qtyLabel}`;
    doc.text(specLine, margin + 6, y + 17);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(26, 37, 53);
    doc.text(prixTxt + (isEn ? ' total' : ' total TTC'), margin + 6, y + 25);

    y += cardH + 5;
  });

  // ── 4. Footer note ─────────────────────────────────
  checkPage(14);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  const note = isEn
    ? 'These results are indicative estimates generated automatically. They must be validated by a qualified engineer before any implementation. Prices and availability are for guidance only.'
    : 'Ces résultats sont des estimations indicatives générées automatiquement. Ils doivent être validés par un ingénieur qualifié avant toute réalisation. Les prix et disponibilités sont indicatifs.';
  const split = doc.splitTextToSize(note, pageW - 2 * margin);
  doc.text(split, margin, y);

  // ── Save ───────────────────────────────────────────
  const filename = `VoltMatch_rapport_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(filename);
}

// Helper: return [r,g,b] from score (same interpolation as CSS)
function _getScoreRgb(score) {
  const pct = Math.max(0, Math.min(100, score)) / 100;
  return [
    Math.round(201 + (34  - 201) * pct),
    Math.round(123 + (197 - 123) * pct),
    Math.round(74  + (94  -  74) * pct),
  ];
}

// ── Restart button ─────────────────────────────────
const restartBtn = document.getElementById('restartBtn');
if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    document.getElementById('besoinForm').reset();
    // Reset toggles
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('tensionInput').value = '48';
    document.getElementById('contrainteInput').value = '';
    document.getElementById('envInput').value = '';
    goToStep(1);
  });
}

// ── SVG icon helper ────────────────────────────────
function iconSVG(name, size = 16) {
  const icons = {
    'zap': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    'battery': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>`,
    'weight': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><path d="M6.5 8a2 2 0 00-1.905 1.46L2.1 18.5A2 2 0 004 21h16a2 2 0 001.925-2.54L19.4 9.5A2 2 0 0017.48 8z"/></svg>`,
    'gauge': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1117.32 0"/></svg>`,
    'check-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    'x-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    'alert-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    'external-link': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    'rotate-ccw': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>`,
    'shield-check': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
    'layers': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    'triangle-alert': `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  };
  return icons[name] || '';
}

function updateLucideIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}