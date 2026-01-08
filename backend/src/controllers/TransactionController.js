class TransactionController {
    // Fungsi mencatat scan
    static async processScan(req, res) {
        const { armadaId, mandorId } = req.body;
        const today = new Date().toISOString().split('T')[0];

        try {
            // 1. Hitung kedatangan hari ini (Logic OOP)
            const count = await TransactionModel.countDailyArrival(armadaId, today);
            const nextArrival = count + 1;

            // 2. Simpan transaksi baru
            const transaction = await TransactionModel.create({
                armada_id: armadaId,
                mandor_id: mandorId,
                waktu_scan: new Date(),
                kedatangan_ke: nextArrival
            });

            return res.status(201).json({ 
                success: true, 
                message: `Berhasil! Kedatangan ke-${nextArrival}`,
                data: transaction 
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}