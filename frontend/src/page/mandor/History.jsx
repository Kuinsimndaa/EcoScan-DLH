import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';

const History = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyHistory();
  }, []);

  const fetchMyHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`http://localhost:5000/api/mandor/history/${user?.id}`);
      const data = await res.json();
      if (data.success) setLogs(data.data);
    } catch (err) {
      console.error("Gagal mengambil history", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-md mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Riwayat <span className="text-green-600">Scan</span></h1>
          <p className="text-slate-500 text-sm font-medium">Monitoring armada Tossa & Gerobak hari ini.</p>
        </header>

        {loading ? (
          <div className="flex justify-center p-10 text-slate-400">Memuat data...</div>
        ) : (
          <div className="space-y-4">
            {logs.length > 0 ? logs.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4"
              >
                {/* Ikon spesifik: Tossa atau Gerobak */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                  item.jenis_kendaraan === 'Tossa' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.jenis_kendaraan === 'Tossa' ? '🛵' : '🛒'}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 leading-none mb-1">{item.nama_pengendara}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    {item.jenis_kendaraan} • {item.wilayah}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-green-600">#{item.kedatangan_ke}</p>
                  <p className="text-[10px] font-bold text-slate-400">
                    {new Date(item.waktu_scan).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Belum ada armada yang di-scan.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;