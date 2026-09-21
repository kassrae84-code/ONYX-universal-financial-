require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors());

// ONYX ONE: ANTI-SCRAPE SHIELD
const blockedBots = [
    'GPTBot', 'ClaudeBot', 'Bytespider', 'CCBot', 
    'Meta-ExternalAgent', 'Applebot-Extended', 'Google-Extended'
];

app.use((req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    const isBot = blockedBots.some(bot => userAgent.includes(bot));
    
    if (isBot) {
        console.log(`[SECURITY] Blocked scraping attempt from: ${userAgent}`);
        return res.status(403).json({ error: 'Access Denied. Sovereign IP Protected.' });
    }
    next();
});

// SYSTEM LOCK: Initialize Supabase Vault
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.post('/api/finance/invoice/process', async (req, res) => {
    try {
        const { clientId, amount, description } = req.body;
        const hmrcReserve = amount * 0.20;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'gbp',
            metadata: { clientId, hmrcReserve, type: 'elite_invoice' }
        });

        await supabase.from('financial_ledger').insert([
            { client_id: clientId, gross_revenue: amount, hmrc_tax_reserve: hmrcReserve }
        ]);

        res.json({ success: true, clientSecret: paymentIntent.client_secret, hmrcReserve });
    } catch (error) {
        res.status(500).json({ error: 'Financial routing error. Vault secured.' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`[ONYX ONE] Sovereign Engine Online - Port ${PORT}`));
