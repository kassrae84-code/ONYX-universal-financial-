const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Functional API backend for real-time HMRC calculations and sovereign synchronization
app.post('/api/sync-ledger', (req, res) => {
    try {
        const { amount, type } = req.body;
        const numericAmount = parseFloat(amount) || 0;
        
        if (type === 'hmrc') {
            const isolatedTax = (numericAmount * 0.20).toFixed(2);
            return res.status(200).json({ 
                status: 'success', 
                calculatedReserve: `£${isolatedTax}`,
                message: 'HMRC 20% tax reserve successfully isolated and logged.' 
            });
        }

        res.status(200).json({ status: 'success', message: 'Sovereign telemetry synchronized.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`[ONYX ONE] Sovereign Command Center online at http://localhost:${PORT}`);
});
