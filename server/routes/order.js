// ═══════════════════════════════════════════════════
//  VOLTMATCH — routes/order.js
//  POST /api/order
//  Reçoit une commande (sans paiement en ligne) et envoie les emails.
// ═══════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { sendOrderConfirmationEmail } = require('./email');

router.post('/order', async (req, res) => {
    try {
        const {
            customerName, customerEmail, customerAddress, customerPhone,
            items, totalAmount, currency, paymentMethod,
        } = req.body;

        // Validation minimale
        if (!customerName || !customerEmail || !customerAddress || !items?.length) {
            return res.status(400).json({ error: 'Champs obligatoires manquants.' });
        }
        if (!['cash', 'virement'].includes(paymentMethod)) {
            return res.status(400).json({ error: 'Mode de paiement invalide.' });
        }

        // Référence de commande simple (horodatage + aléatoire)
        const orderRef = `VM-${Date.now().toString(36).toUpperCase()}`;

        const orderData = {
            customerName,
            customerEmail,
            customerAddress,
            customerPhone,
            items,
            totalAmount,
            currency: currency || 'EUR',
            paymentMethod,
            orderRef,
        };

        await sendOrderConfirmationEmail(orderData);

        res.json({ success: true, orderRef });
    } catch (err) {
        console.error('[Order] Erreur :', err.message);
        res.status(500).json({ error: 'Échec de la création de la commande.', details: err.message });
    }
});

module.exports = router;