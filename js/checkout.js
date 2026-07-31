// ═══════════════════════════════════════════════════
//  VOLTMATCH — js/checkout.js
//  Gestion de la commande depuis panier.html (sans paiement en ligne)
//
//  Flux :
//  1. Utilisateur remplit ses infos + choisit son mode de paiement
//  2. fetch → POST /api/order (serveur)
//  3. Le serveur envoie l'email de confirmation au client + notif à l'admin
//  4. Succès → vider panier, afficher confirmation
// ═══════════════════════════════════════════════════

// URL du backend (mettre l'URL de prod en production)
const API_BASE_URL = '/.netlify/functions';

// ── Soumission du formulaire ─────────────────────────
async function handleCheckoutSubmit(event) {
  event.preventDefault();

  const errorEl = document.getElementById('checkout-global-error');
  const formData = getFormData();
  const cart = getCart();

  if (!formData || cart.length === 0) return;

  setSubmitLoading(true);
  if (errorEl) errorEl.textContent = '';

  try {
    const { totalAmount, currency } = computeTotal(cart);
    const items = buildItemsSummary(cart);

    const res = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: formData.name,
        customerEmail: formData.email,
        customerAddress: formData.address,
        customerPhone: formData.phone,
        paymentMethod: formData.paymentMethod,
        items,
        totalAmount,
        currency,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Impossible d\'enregistrer la commande.');
    }

    const { orderRef } = await res.json();

    clearCart();
    showOrderConfirmation(formData.name, formData.email, orderRef);

  } catch (err) {
    console.error('[Checkout] Erreur :', err.message);
    if (errorEl) {
      errorEl.textContent = err.message || 'Une erreur est survenue. Veuillez réessayer.';
    }
    setSubmitLoading(false);
  }
}

// ── Helpers ───────────────────────────────────────────

function getFormData() {
  const name = document.getElementById('orderName')?.value.trim();
  const email = document.getElementById('orderEmail')?.value.trim();
  const address = document.getElementById('orderAddress')?.value.trim();
  const phone = document.getElementById('orderPhone')?.value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;

  if (!name || !email || !address) {
    alert('Veuillez remplir tous les champs obligatoires.');
    return null;
  }
  if (!paymentMethod) {
    alert('Veuillez choisir un mode de paiement.');
    return null;
  }
  return { name, email, address, phone, paymentMethod };
}

function computeTotal(cart) {
  const activeCurrency = localStorage.getItem('voltmatch_currency') || 'EUR';
  const rates = { EUR: 1.0, USD: 1.09, MAD: 10.85 };
  const rate = rates[activeCurrency] || 1.0;

  let totalEUR = 0;
  (cart || []).forEach(item => {
    const b = (typeof BATTERIES !== 'undefined') ? BATTERIES.find(x => x.id === item.id) : null;
    if (b) totalEUR += b.price * item.quantite;
  });

  const totalInActive = totalEUR * rate;

  return { totalAmount: Math.round(totalInActive * 100) / 100, currency: activeCurrency };
}

function buildItemsSummary(cart) {
  return (cart || []).map(item => {
    const b = (typeof BATTERIES !== 'undefined') ? BATTERIES.find(x => x.id === item.id) : null;
    if (!b) return null;
    return {
      id: b.id,
      name: `${b.manufacturer} ${b.model}`,
      qty: item.quantite,
      unitPrice: b.price,
      currency: b.currency || 'EUR',
    };
  }).filter(Boolean);
}

function setSubmitLoading(isLoading) {
  const btn = document.getElementById('checkoutSubmitBtn');
  if (!btn) return;
  btn.disabled = isLoading;
  btn.innerHTML = isLoading
    ? '<span class="btn-spinner"></span> Envoi en cours…'
    : `✓ Confirmer la commande (<span id="confirmBtnTotal">—</span>)`;

  if (!isLoading) {
    const totalEl = document.getElementById('confirmBtnTotal');
    if (totalEl && typeof formatPrice === 'function') {
      const { totalAmount, currency } = computeTotal(getCart());
      totalEl.textContent = formatPrice(totalAmount, currency);
    }
  }
}

function showOrderConfirmation(name, email, orderRef) {
  const checkoutSection = document.getElementById('checkoutSection');
  const confirmSection = document.getElementById('cartConfirmSection');
  const summarySection = document.getElementById('cartSummarySection');

  if (summarySection) summarySection.style.display = 'none';
  if (checkoutSection) checkoutSection.style.display = 'none';
  if (confirmSection) {
    confirmSection.style.display = 'block';
    const nameEl = document.getElementById('confirmName');
    const emailEl = document.getElementById('confirmEmail');
    const refEl = document.getElementById('confirmOrderRef');
    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = email;
    if (refEl) refEl.textContent = orderRef;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Init au chargement (sur panier.html uniquement) ──
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('checkoutForm')) return;

  injectPaymentMethodSection();

  const form = document.getElementById('checkoutForm');
  if (form) {
    form.onsubmit = null;
    form.addEventListener('submit', handleCheckoutSubmit);
  }
});

function injectPaymentMethodSection() {
  const submitBtn = document.getElementById('checkoutSubmitBtn');
  if (!submitBtn) return;

  const section = document.createElement('div');
  section.className = 'checkout-field';
  section.innerHTML = `
    <label class="checkout-label">Mode de paiement *</label>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:6px">
      <label style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:1.5px solid #E2E8F0;border-radius:8px;background:#F8FAFC;cursor:pointer">
        <input type="radio" name="paymentMethod" value="cash" checked>
        <span>💵 Cash à la livraison</span>
      </label>
      <label style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:1.5px solid #E2E8F0;border-radius:8px;background:#F8FAFC;cursor:pointer">
        <input type="radio" name="paymentMethod" value="virement">
        <span>🏦 Virement bancaire</span>
      </label>
    </div>
    <div id="checkout-global-error" style="
      color: #ef4444;
      font-size: 0.8125rem;
      margin-top: 10px;
      min-height: 1.2em;
      font-weight: 600;
    "></div>
  `;
  submitBtn.parentNode.insertBefore(section, submitBtn);
}