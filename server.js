const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and handling static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from the current directory
app.use(express.static(path.join(__dirname)));

// Base route to serve the command center cockpit
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Endpoint placeholder for Supabase / Webhook sync
app.post('/api/sync-ledger', (req, res) => {
    try {
        const payload = req.body;
        // Placeholder for handling multi-account & crypto ledger ingestion
        console.log('Incoming sync payload received:', payload);
        res.status(200).json({ status: 'success', message: 'Ledger telemetry synchronized.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}); 

// Start the server
app.listen(PORT, () => {
    console.log(`[ONYX ONE] Sovereign Command Center online and running at http://localhost:${PORT}`);
});
