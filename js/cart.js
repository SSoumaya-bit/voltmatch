// ═══════════════════════════════════════════════════
//  VOLTMATCH — cart.js
//  Gestion du panier (Batteries Renault EZ1 uniquement)
//  Persistance localStorage 'voltmatch_cart'
//
//  Ce module est chargé sur TOUTES les pages avec navbar
//  pour synchroniser le badge panier.
//  renderCartPage() ne s'exécute que sur panier.html.
// ═══════════════════════════════════════════════════

// ── Lecture / écriture ──────────────────────────────

function getCart() {
  try {
    const data = localStorage.getItem('voltmatch_cart');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('voltmatch_cart', JSON.stringify(cart));
  updateCartBadge();
  // Si on est sur panier.html, re-rendre la page panier
  if (document.getElementById('cartPageItems')) {
    renderCartPage();
  }
}

function isInCart(id) {
  return getCart().some(item => item.id === id);
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantite, 0);
}

// ── Ajout / suppression ─────────────────────────────

function addToCart(id, quantite = 1) {
  // Restriction stricte : seules les batteries Renault EZ1 sont commandables
  const battery = (typeof BATTERIES !== 'undefined') ? BATTERIES.find(b => b.id === id) : null;
  if (battery && battery.manufacturer !== 'Renault') {
    alert('Seules les batteries Renault EZ1 seconde vie peuvent être commandées directement dans le panier.');
    return;
  }

  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantite += quantite;
  } else {
    cart.push({ id, quantite });
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
}

function updateCartItemQuantity(id, newQty) {
  const qty = parseInt(newQty, 10);
  if (isNaN(qty) || qty <= 0) {
    removeFromCart(id);
    return;
  }
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantite = qty;
    saveCart(cart);
  }
}

function clearCart() {
  localStorage.removeItem('voltmatch_cart');
  updateCartBadge();
  if (document.getElementById('cartPageItems')) {
    renderCartPage();
  }
}

// ── Badge navbar (synchronisé sur toutes les pages) ──

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });

  // Si on est sur recommandation.html, mettre à jour les boutons des cartes
  if (typeof window.currentRecommandations !== 'undefined'
      && typeof renderResults === 'function'
      && window.currentBesoin) {
    renderResults(window.currentRecommandations, window.currentBesoin);
  }
}

// Alias pour compatibilité (currency.js peut appeler updateCartUI)
function updateCartUI() { updateCartBadge(); }

// ── Page Panier (panier.html uniquement) ────────────

function renderCartPage() {
  const itemsContainer = document.getElementById('cartPageItems');
  const totalEl        = document.getElementById('cartPageTotal');
  const summarySection = document.getElementById('cartSummarySection');
  const emptySection   = document.getElementById('cartEmptySection');
  const checkoutSection = document.getElementById('checkoutSection');

  if (!itemsContainer) return; // pas sur panier.html

  const cart = getCart();
  const lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'fr';
  const isEn = lang === 'en';

  if (cart.length === 0) {
    if (emptySection)   emptySection.style.display   = 'block';
    if (summarySection) summarySection.style.display  = 'none';
    if (checkoutSection) checkoutSection.style.display = 'none';
    return;
  }

  if (emptySection)   emptySection.style.display   = 'none';
  if (summarySection) summarySection.style.display  = 'block';
  if (checkoutSection) checkoutSection.style.display = 'block';

  let grandTotalEUR = 0;

  const html = cart.map(item => {
    const b = (typeof BATTERIES !== 'undefined') ? BATTERIES.find(x => x.id === item.id) : null;
    if (!b) return '';

    const itemTotal       = b.price * item.quantite;
    grandTotalEUR        += itemTotal;
    const formattedUnit   = (typeof formatPrice === 'function') ? formatPrice(b.price, b.currency || 'EUR')    : `${b.price} €`;
    const formattedSub    = (typeof formatPrice === 'function') ? formatPrice(itemTotal, b.currency || 'EUR') : `${itemTotal} €`;

    return `
      <div class="cart-page-item">
        <div class="cart-page-item-left">
          <div class="cart-page-item-badge">♻ Second Life</div>
          <div class="cart-page-item-name">${b.manufacturer} ${b.model}</div>
          <div class="cart-page-item-meta">${b.energyKwh} kWh / unité &bull; ${formattedUnit} / unité</div>
          <div class="cart-page-qty-row">
            <label class="cart-page-qty-label">${isEn ? 'Qty:' : 'Quantité :'}</label>
            <input type="number" min="1" value="${item.quantite}"
                   onchange="updateCartItemQuantity('${b.id}', this.value)"
                   class="cart-page-qty-input">
          </div>
        </div>
        <div class="cart-page-item-right">
          <button onclick="removeFromCart('${b.id}')" class="cart-page-remove-btn"
                  title="${isEn ? 'Remove' : 'Supprimer'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
          <div class="cart-page-item-subtotal">${formattedSub}</div>
        </div>
      </div>
    `;
  }).join('');

  itemsContainer.innerHTML = html;

  const formattedGrand = (typeof formatPrice === 'function')
    ? formatPrice(grandTotalEUR, 'EUR')
    : `${grandTotalEUR} €`;

  if (totalEl) totalEl.textContent = formattedGrand;

  // Mettre à jour le total dans le bouton de confirmation
  const confirmTotal = document.getElementById('confirmBtnTotal');
  if (confirmTotal) confirmTotal.textContent = formattedGrand;
}

// ── Soumission formulaire de commande ───────────────

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById('orderName').value.trim();
  const email   = document.getElementById('orderEmail').value.trim();
  const address = document.getElementById('orderAddress').value.trim();

  if (!name || !email || !address) return;

  clearCart();

  // Afficher confirmation
  const checkoutSection = document.getElementById('checkoutSection');
  const confirmSection  = document.getElementById('cartConfirmSection');

  if (checkoutSection) checkoutSection.style.display = 'none';
  if (confirmSection)  {
    confirmSection.style.display = 'block';
    const nameEl = document.getElementById('confirmName');
    const emailEl = document.getElementById('confirmEmail');
    if (nameEl)  nameEl.textContent  = name;
    if (emailEl) emailEl.textContent = email;
  }
}

// ── Init au chargement ──────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  // Sur panier.html uniquement, rendre la page panier
  if (document.getElementById('cartPageItems')) {
    renderCartPage();
  }
});
