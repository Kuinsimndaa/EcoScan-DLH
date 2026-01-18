const app = require('./app');

const PORT = process.env.PORT || 5000;

// Menjalankan server
app.listen(PORT, async () => {
    console.log(`-----------------------------------------`);
    console.log(`✅ SERVER: Berjalan di http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Memanggil fungsi cek database yang didefinisikan di app.js
    if (app.checkDatabaseConnection) {
        await app.checkDatabaseConnection();
    }
    
    console.log(`-----------------------------------------`);
});