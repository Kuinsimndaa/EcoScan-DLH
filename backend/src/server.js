const app = require('./app');

const PORT = 5000;

// Menjalankan server
app.listen(PORT, async () => {
    console.log(`-----------------------------------------`);
    console.log(`✅ SERVER: Berjalan di http://localhost:${PORT}`);
    
    // Memanggil fungsi cek database yang didefinisikan di app.js
    if (app.checkDatabaseConnection) {
        await app.checkDatabaseConnection();
    }
    
    console.log(`-----------------------------------------`);
});