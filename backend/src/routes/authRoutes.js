const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Route Login (untuk Admin dan Petugas)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (rows.length > 0) {
            const user = rows[0];
            console.log(`✅ LOGIN SUCCESS: ${user.email} (${user.role})`);
            res.status(200).json({
                success: true,
                message: "Login Berhasil",
                data: {
                    id: user.id,
                    nama: user.nama,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            console.log(`❌ LOGIN FAILED: ${email} - Email atau Password salah`);
            res.status(401).json({
                success: false,
                message: "Email atau Password salah!"
            });
        }
    } catch (error) {
        console.error("❌ Auth Error:", error);
        res.status(500).json({ success: false, message: "Kesalahan Server" });
    }
});

// Route Login Petugas (alias, gunakan route /login untuk kedua role)
router.post('/login-petugas', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (rows.length > 0) {
            const user = rows[0];
            // Accept role: mandor, petugas, or PETUGAS
            if (user.role.toLowerCase() === 'mandor' || user.role.toLowerCase() === 'petugas') {
                console.log(`✅ LOGIN SUCCESS (PETUGAS/MANDOR): ${user.email} - Role: ${user.role}`);
                res.status(200).json({
                    success: true,
                    message: "Login Berhasil",
                    data: {
                        id: user.id,
                        nama: user.nama,
                        email: user.email,
                        role: user.role
                    }
                });
            } else {
                console.log(`❌ LOGIN FAILED (PETUGAS): ${email} - Role tidak sesuai (${user.role})`);
                res.status(401).json({
                    success: false,
                    message: "Akun ini bukan Petugas Scan!"
                });
            }
        } else {
            console.log(`❌ LOGIN FAILED (PETUGAS): ${email}`);
            res.status(401).json({
                success: false,
                message: "Email atau Password salah!"
            });
        }
    } catch (error) {
        console.error("❌ Auth Error (Petugas):", error);
        res.status(500).json({ success: false, message: "Kesalahan Server" });
    }
});

module.exports = router;