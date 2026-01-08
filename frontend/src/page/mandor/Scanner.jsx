import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { useNavigate } from 'react-router-dom';

const Scanner = () => {
  const [loading, setLoading] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const navigate = useNavigate();

  const handleScan = async (data) => {
    // 1. Validasi: data harus ada, tidak sedang loading, dan bukan token yang sama berturut-turut
    if (data && !loading) {
      const token = typeof data === 'string' ? data : data.text;

      if (!token || token === lastScanned) return;

      console.log("Token Terdeteksi:", token);
      setLoading(true);
      setLastScanned(token); // Simpan token terakhir untuk mencegah double scan

      const userData = localStorage.getItem('user');
      if (!userData) {
        alert("Sesi berakhir, silakan login kembali.");
        navigate('/');
        return;
      }

      const user = JSON.parse(userData);

      try {
        const response = await fetch('http://localhost:5000/api/scan/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qr_token: token.trim(),
            id_user: user.id,
            lokasi: 'TPS Jalingkos'
          })
        });

        const result = await response.json();

        if (result.success) {
          alert("BERHASIL: " + result.message);
        } else {
          // Menangani pesan "QR Code Tidak Dikenali" dari backend
          alert("GAGAL: " + result.message);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Gagal terhubung ke server backend (Port 5000).");
      } finally {
        // Berikan jeda 3 detik sebelum memperbolehkan scan berikutnya
        setTimeout(() => {
          setLoading(false);
          setLastScanned('');
        }, 3000);
      }
    }
  };

  const handleError = (err) => {
    console.error("Camera Error:", err);
    alert("Masalah Kamera: Pastikan izin kamera diberikan dan gunakan HTTPS/Localhost.");
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md bg-slate-800 rounded-[3rem] p-8 shadow-2xl border border-slate-700 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-green-500/10 rounded-full mb-2">
            <span className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">Mode Mandor</span>
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            EcoScan<span className="text-green-500">Scanner</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Dinas Lingkungan Hidup
          </p>
        </div>

        {/* Scanner Container */}
        <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-slate-700 aspect-square bg-black shadow-inner">
          <QrScanner
            delay={500}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            constraints={{
              video: { facingMode: "environment" } // Prioritaskan kamera belakang
            }}
          />
          
          {/* Scanning Overlay UI */}
          <div className="absolute inset-0 border-[30px] border-black/30 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border-2 border-green-500/50 rounded-[2rem]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-scan-line"></div>
        </div>

        {/* Status Indicator */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2 text-green-500 font-bold animate-pulse text-xs uppercase tracking-widest">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Memproses Data...
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              Siap Memindai
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
           <button 
            onClick={handleLogout}
            className="w-full py-4 bg-slate-700/50 hover:bg-red-600/20 hover:text-red-500 border border-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all"
          >
            Keluar Sistem
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-line {
          0% { top: 20%; }
          100% { top: 80%; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}} />
      
      <p className="mt-8 text-slate-600 text-[9px] font-bold uppercase tracking-[0.4em]">
        Kabupaten Tegal
      </p>
    </div>
  );
};

export default Scanner;