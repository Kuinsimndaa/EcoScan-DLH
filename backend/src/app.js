const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dlh_ecoscan"
});

db.connect((err) => {
    if (err) {
        console.error("Gagal koneksi database:", err);
        return;
    }
    console.log("MySQL Connected...");
});

// ==========================================
// 1. AUTHENTICATION & LOGIN
// ==========================================
app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    const sql = "SELECT id, nama, email, role FROM users WHERE email = ? AND password = ? AND role = ?";
    db.query(sql, [email, password, role], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length > 0) res.json({ success: true, user: results[0] });
        else res.status(401).json({ success: false, message: "Kredensial salah!" });
    });
});

// ==========================================
// 2. MANAJEMEN MANDOR (PETUGAS)
// ==========================================
app.get('/api/admin/mandor', (req, res) => {
    db.query("SELECT id, nama, email FROM users WHERE role = 'mandor' ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: results });
    });
});

app.post('/api/admin/mandor/add', (req, res) => {
    const { nama, email, password } = req.body;
    const sql = "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, 'mandor')";
    db.query(sql, [nama, email, password], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Email sudah digunakan!" });
        res.json({ success: true, message: "Mandor berhasil ditambahkan!" });
    });
});

app.delete('/api/admin/mandor/:id', (req, res) => {
    db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Petugas mandor telah dihapus!" });
    });
});

// ==========================================
// 3. PENGELOLAAN ARMADA & QR TOKEN
// ==========================================

// Endpoint baru: Mengambil daftar armada untuk fitur Lihat QR
app.get('/api/admin/armada', (req, res) => {
    const sql = "SELECT * FROM armada ORDER BY id_armada DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: results });
    });
});

app.post('/api/admin/armada/save', (req, res) => {
    const { nama_pengendara, jenis_armada, wilayah } = req.body;
    // Generate token unik
    const qr_token = `${jenis_armada}-${nama_pengendara.replace(/\s+/g, '')}-${Date.now()}`;
    const sql = "INSERT INTO armada (nama_pengendara, jenis_armada, wilayah, qr_token) VALUES (?, ?, ?, ?)";
    db.query(sql, [nama_pengendara, jenis_armada, wilayah, qr_token], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, qr_token: qr_token });
    });
});

// ==========================================
// 4. LOGIKA SCANNING (MANDOR)
// ==========================================
app.post('/api/scan/save', (req, res) => {
    const { qr_token, id_user, lokasi } = req.body;
    
    // 1. Cari ID Armada berdasarkan token
    const sqlFind = "SELECT id_armada FROM armada WHERE qr_token = ?";
    db.query(sqlFind, [qr_token], (err, rows) => {
        if (err || rows.length === 0) return res.status(404).json({ success: false, message: "QR Tidak Dikenali" });
        
        const id_armada = rows[0].id_armada;
        
        // 2. Hitung jumlah kedatangan hari ini
        const sqlCount = "SELECT COUNT(*) as total FROM laporan WHERE id_armada = ? AND DATE(tanggal) = CURDATE()";
        db.query(sqlCount, [id_armada], (err, countResult) => {
            const kedatangan_ke = (countResult[0].total || 0) + 1;
            
            // 3. Simpan log laporan (Default Lokasi: TPS Jalingkos)
            const sqlInsert = "INSERT INTO laporan (id_armada, id_user, tanggal, lokasi, kedatangan_ke) VALUES (?, ?, NOW(), ?, ?)";
            db.query(sqlInsert, [id_armada, id_user, lokasi || 'TPS Jalingkos', kedatangan_ke], (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: `Scan Berhasil! Kedatangan ke-${kedatangan_ke}` });
            });
        });
    });
});

// ==========================================
// 5. MONITORING & BILLING
// ==========================================

// Data Scan Hari Ini (Dashboard)
app.get('/api/admin/scans-today', (req, res) => {
    const sql = `SELECT l.*, a.jenis_armada, a.nama_pengendara, a.wilayah FROM laporan l 
                 JOIN armada a ON l.id_armada = a.id_armada WHERE DATE(l.tanggal) = CURDATE() ORDER BY l.tanggal DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: results });
    });
});

// Laporan Rekapan Bulanan
app.get('/api/admin/reports', (req, res) => {
    const { month, year } = req.query;
    const sql = `SELECT l.*, a.nama_pengendara, a.jenis_armada, a.wilayah, u.nama as nama_mandor 
                 FROM laporan l JOIN armada a ON l.id_armada = a.id_armada 
                 JOIN users u ON l.id_user = u.id WHERE MONTH(l.tanggal) = ? AND YEAR(l.tanggal) = ? ORDER BY l.tanggal DESC`;
    db.query(sql, [month, year], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: results });
    });
});

// Fitur Tagihan (Billing)
app.get('/api/admin/billing', (req, res) => {
    const { month, year } = req.query;
    const sql = `
        SELECT 
            a.id_armada, a.nama_pengendara, a.jenis_armada, a.wilayah,
            COUNT(l.id_laporan) as total_kedatangan,
            SUM(CASE 
                WHEN a.jenis_armada = 'GEROBAK' THEN 40000 
                WHEN a.jenis_armada = 'TOSSA' THEN 60000 
                ELSE 0 END) as total_tagihan
        FROM armada a
        LEFT JOIN laporan l ON a.id_armada = l.id_armada 
            AND MONTH(l.tanggal) = ? AND YEAR(l.tanggal) = ?
        GROUP BY a.id_armada
    `;
    db.query(sql, [month, year], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: results });
    });
});

app.listen(5000, () => console.log("Backend EcoScan Running on port 5000"));