// ═══════════════════════════════════════════════════
//  VOLTMATCH — routes/email.js
//  Envoi de l'email de confirmation de commande (sans paiement en ligne)
// ═══════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@voltmatch.fr';
const EMAIL_FROM = process.env.EMAIL_FROM || 'VoltMatch <noreply@voltmatch.fr>';

function formatAmount(amount, currency) {
  const value = Number(amount).toFixed(2);
  const symbols = { EUR: '€', USD: '$', MAD: 'DH' };
  const sym = symbols[currency] || currency;
  return `${value} ${sym}`;
}

function paymentLabel(method) {
  return method === 'virement' ? 'Virement bancaire' : 'Cash à la livraison';
}

// ── Template email client ────────────────────────────
function buildClientEmailHtml({ customerName, customerAddress, customerPhone, items, totalAmount, currency, paymentMethod, orderRef }) {
  const formattedTotal = formatAmount(totalAmount, currency);
  const itemsRows = items.map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${i.name || i.id}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center">${i.qty}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${i.unitPrice} ${i.currency}</td>
    </tr>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:600px;margin:2rem auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

    <div style="background:linear-gradient(135deg,#1a2535 0%,#2d3f5e 100%);padding:2rem;text-align:center">
      <div style="display:inline-flex;align-items:center;gap:10px">
        <span style="font-size:1.5rem">⚡</span>
        <span style="font-weight:800;font-size:1.375rem;color:#fff;letter-spacing:-0.5px">VoltMatch</span>
      </div>
      <p style="color:rgba(255,255,255,0.7);margin:0.5rem 0 0;font-size:0.875rem">Plateforme de recommandation de batteries stationnaires</p>
    </div>

    <div style="padding:2rem">
      <div style="text-align:center;margin-bottom:1.5rem">
        <div style="font-size:2.5rem">📦</div>
        <h1 style="font-size:1.375rem;font-weight:800;color:#1a2535;margin:0.5rem 0 0.25rem">Commande bien reçue !</h1>
        <p style="color:#64748b;font-size:0.875rem;margin:0">Bonjour <strong>${customerName}</strong>, nous avons bien reçu votre commande.</p>
      </div>

      <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:1.5rem">
        <div style="padding:12px 16px;background:#1a2535;color:#fff;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">
          📦 Articles commandés
        </div>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f1f5f9">
              <th style="padding:8px 12px;text-align:left;font-size:0.75rem;color:#64748b;font-weight:700">Produit</th>
              <th style="padding:8px 12px;text-align:center;font-size:0.75rem;color:#64748b;font-weight:700">Qté</th>
              <th style="padding:8px 12px;text-align:right;font-size:0.75rem;color:#64748b;font-weight:700">Prix unit.</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <div style="padding:12px 16px;display:flex;justify-content:space-between;background:#1a2535;color:#fff">
          <span style="font-weight:600;font-size:0.875rem">Total à payer</span>
          <span style="font-weight:800;font-size:1rem">${formattedTotal}</span>
        </div>
      </div>

      <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:1rem;margin-bottom:1rem">
        <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;margin-bottom:8px">🚚 Adresse de livraison</div>
        <div style="font-size:0.875rem;color:#1a2535;white-space:pre-line">${customerAddress}</div>
        ${customerPhone ? `<div style="font-size:0.8125rem;color:#64748b;margin-top:6px">📞 ${customerPhone}</div>` : ''}
      </div>

      <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:12px;padding:1rem;margin-bottom:1.5rem">
        <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#c2410c;margin-bottom:4px">💳 Mode de paiement choisi</div>
        <div style="font-size:0.9375rem;color:#1a2535;font-weight:700">${paymentLabel(paymentMethod)}</div>
      </div>

      <p style="font-size:0.8125rem;color:#64748b;text-align:center">
        Référence de commande : <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:0.75rem">${orderRef}</code>
      </p>
      <p style="font-size:0.8125rem;color:#64748b;text-align:center">
        Notre équipe vous contactera sous <strong>24h ouvrées</strong> pour confirmer et coordonner la livraison.
      </p>
    </div>

    <div style="padding:1rem 2rem;background:#f8fafc;text-align:center;border-top:1px solid #e2e8f0">
      <p style="font-size:0.75rem;color:#94a3b8;margin:0">© 2026 VoltMatch — Estimations indicatives, à valider par un ingénieur.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Template email admin ─────────────────────────────
function buildAdminEmailHtml({ customerName, customerEmail, customerAddress, customerPhone, items, totalAmount, currency, paymentMethod, orderRef }) {
  const formattedTotal = formatAmount(totalAmount, currency);
  const itemsList = items.map(i => `• ${i.qty}x ${i.name || i.id} — ${i.unitPrice} ${i.currency}`).join('\n');

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;padding:2rem;background:#f1f5f9">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:1.5rem;border:2px solid #f97316">
    <h2 style="color:#1a2535;margin-top:0">🔔 Nouvelle commande VoltMatch</h2>
    <table style="width:100%;border-collapse:collapse;font-size:0.875rem">
      <tr><td style="padding:6px 0;color:#64748b;width:140px">Client</td><td style="padding:6px 0;font-weight:700">${customerName}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0"><a href="mailto:${customerEmail}">${customerEmail}</a></td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Téléphone</td><td style="padding:6px 0">${customerPhone || '—'}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;vertical-align:top">Adresse</td><td style="padding:6px 0;white-space:pre-line">${customerAddress}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Paiement</td><td style="padding:6px 0;font-weight:700">${paymentLabel(paymentMethod)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Total</td><td style="padding:6px 0;font-weight:800;font-size:1rem;color:#f97316">${formattedTotal}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Réf. commande</td><td style="padding:6px 0;font-family:monospace;font-size:0.8125rem">${orderRef}</td></tr>
    </table>
    <div style="background:#f8fafc;border-radius:8px;padding:0.875rem;margin-top:1rem">
      <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#64748b;margin-bottom:8px">Articles</div>
      <pre style="margin:0;font-size:0.8125rem;color:#1a2535;white-space:pre-wrap">${itemsList}</pre>
    </div>
    <p style="font-size:0.75rem;color:#94a3b8;margin-top:1rem;margin-bottom:0">
      Contacte le client pour confirmer la commande et le mode de paiement.
    </p>
  </div>
</body>
</html>`;
}

async function sendOrderConfirmationEmail(orderData) {
  const { customerName, customerEmail, totalAmount, currency } = orderData;
  const subject = `✅ Votre commande VoltMatch — ${formatAmount(totalAmount, currency)}`;

  const [clientResult, adminResult] = await Promise.allSettled([
    resend.emails.send({ from: EMAIL_FROM, to: [customerEmail], subject, html: buildClientEmailHtml(orderData) }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: [ADMIN_EMAIL],
      subject: `🔔 Nouvelle commande — ${customerName} — ${formatAmount(totalAmount, currency)}`,
      html: buildAdminEmailHtml(orderData),
    }),
  ]);

  const clientFailed = clientResult.status === 'rejected' || clientResult.value?.error;
  const adminFailed = adminResult.status === 'rejected' || adminResult.value?.error;

  if (clientFailed) {
    const reason = clientResult.status === 'rejected' ? clientResult.reason?.message : JSON.stringify(clientResult.value.error);
    console.error('[Email] Échec email client :', reason);
  } else {
    console.log('[Email] Email client envoyé :', clientResult.value?.data?.id);
  }

  if (adminFailed) {
    const reason = adminResult.status === 'rejected' ? adminResult.reason?.message : JSON.stringify(adminResult.value.error);
    console.error('[Email] Échec email admin :', reason);
  } else {
    console.log('[Email] Email admin envoyé :', adminResult.value?.data?.id);
  }

  if (clientFailed && adminFailed) {
    throw new Error('Échec total envoi emails (client + admin).');
  }
}

module.exports = router;
module.exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;