const express = require('express');
const cors = require('cors');
const db = require('./config/database'); // Pastikan path ini benar (database.js)

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const armadaRoutes = require('./routes/armadaRoutes');

// --- Registrasi Endpoints ---
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/armada', armadaRoutes);

// --- Fungsi Pengecekan Database ---
// Fungsi ini diekspor agar bisa dipanggil oleh server.js saat start
app.checkDatabaseConnection = async () => {
    try {
        // Melakukan query sederhana untuk mengetes koneksi
        await db.query('SELECT 1');
        console.log('✅ DATABASE: Terhubung ke MySQL (dlh_ecoscan)');
        return true;
    } catch (err) {
        console.error('❌ DATABASE: Gagal terhubung!');
        console.error('   Pesan Error:', err.message);
        return false;
    }
};

// Route default untuk cek status API di browser
app.get('/', (req, res) => {
    res.json({ message: "EcoScan DLH API is Active" });
});

module.exports = app;