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

app.post('/api/sync-ledger', (req, res) => {
    try {
        const payload = req.body;
        console.log('Incoming sync payload received:', payload);
        res.status(200).json({ status: 'success', message: 'Ledger telemetry synchronized.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`[ONYX ONE] Sovereign Command Center online and running at http://localhost:${PORT}`);
});
