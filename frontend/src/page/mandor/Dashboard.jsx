import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, QrCode, Clock, Truck, User, Calendar } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalScan: 0,
        armadaUnik: 0,
        recentActivity: []
    });
    
    // State untuk Filter (Meniru fitur Admin)
    const [filterTanggal, setFilterTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [filterBulan, setFilterBulan] = useState(new Date().toISOString().slice(0, 7));
    const [modeFilter, setModeFilter] = useState("hari"); // "hari" atau "bulan"
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Menggunakan logic filter yang sama dengan Admin
            const query = modeFilter === "hari" 
                ? `tanggal=${filterTanggal}` 
                : `bulan=${filterBulan}`;

            const res = await axios.get(`http://localhost:5000/api/scan/laporan?${query}`);
            
            // Hitung statistik berdasarkan data yang difilter
            const uniqueArmada = [...new Set(res.data.map(item => item.namaPengendara))].length;

            setStats({
                totalScan: res.data.length,
                armadaUnik: uniqueArmada,
                recentActivity: res.data.slice(0, 15) // Ambil 15 terbaru
            });
        } catch (err) {
            console.error("Gagal sinkronisasi dashboard mandor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [filterTanggal, filterBulan, modeFilter]);

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            
            {/* HEADER & MULTI-FILTER (Identik dengan Admin) */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-green-600 rounded-2xl text-white shadow-lg shadow-green-200">
                        <LayoutDashboard size={28} />
                    </div>
                    <div>
                        <h2 className="font-black italic uppercase text-3xl text-slate-900 tracking-tighter leading-none">
                            DASHBOARD <span className="text-green-600">MANDOR</span>
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Monitoring Scan Lapangan</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] shadow-xl border border-slate-100">
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button 
                            onClick={() => setModeFilter("hari")}
                            className={`px-4 py-1.5 rounded-lg font-black text-[9px] transition-all ${modeFilter === 'hari' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            HARIAN
                        </button>
                        <button 
                            onClick={() => setModeFilter("bulan")}
                            className={`px-4 py-1.5 rounded-lg font-black text-[9px] transition-all ${modeFilter === 'bulan' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            BULANAN
                        </button>
                    </div>

                    <div className="flex items-center gap-2 px-4 border-l border-slate-100">
                        <Calendar size={16} className="text-green-600" />
                        {modeFilter === "hari" ? (
                            <input 
                                type="date" 
                                value={filterTanggal}
                                onChange={(e) => setFilterTanggal(e.target.value)}
                                className="outline-none font-black text-xs text-slate-700 bg-transparent uppercase cursor-pointer"
                            />
                        ) : (
                            <input 
                                type="month" 
                                value={filterBulan}
                                onChange={(e) => setFilterBulan(e.target.value)}
                                className="outline-none font-black text-xs text-slate-700 bg-transparent uppercase cursor-pointer"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* STATS AREA (KOTAK BESAR SEPERTI ADMIN) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Total Scan */}
                <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900 group-hover:scale-110 transition-transform">
                        <QrCode size={100}/>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-4">Total Scan Masuk</p>
                    <h2 className="text-9xl font-black text-slate-900 tabular-nums leading-none">{stats.totalScan}</h2>
                </div>

                {/* Armada Unik */}
                <div className="bg-green-600 p-12 rounded-[3.5rem] shadow-xl text-white text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                        <Truck size={100}/>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-200 mb-4">Armada Terlayani</p>
                    <h2 className="text-9xl font-black tabular-nums leading-none">{stats.armadaUnik}</h2>
                </div>
            </div>

            {/* TABEL AKTIVITAS (GAYA ADMIN) */}
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white">
                    <h3 className="font-black italic uppercase text-2xl text-slate-900 tracking-tighter">
                        Riwayat <span className="text-green-600">Aktivitas</span>
                    </h3>
                    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full text-green-600 font-bold text-[9px] tracking-widest animate-pulse uppercase">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div> Monitoring Active
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-10 py-7"><div className="flex items-center gap-2"><Clock size={14}/> WAKTU</div></th>
                                <th className="px-10 py-7">ARMADA</th>
                                <th className="px-10 py-7">MANDOR</th>
                                <th className="px-10 py-7 text-center">TOTAL MASUK</th>
                                <th className="px-10 py-7 text-right">TARIF</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center font-bold text-slate-300 animate-pulse">MEMUAT DATA...</td>
                                </tr>
                            ) : stats.recentActivity.length > 0 ? stats.recentActivity.map((log, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-10 py-7 text-slate-400 font-bold tabular-nums text-sm">
                                        {log.waktu}
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="font-black text-slate-900 uppercase text-base group-hover:text-green-700 transition-colors">
                                            {log.namaPengendara}
                                        </div>
                                        <div className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">
                                            {log.jenisKendaraan} — <span className="text-slate-400 italic font-medium">{log.wilayah}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase">
                                            <User size={12} className="text-slate-300" /> {log.mandor}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-center">
                                        <span className="inline-block px-5 py-2 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors rounded-2xl font-black text-[10px] italic">
                                            KE-{log.kedatanganKe}
                                        </span>
                                    </td>
                                    <td className="px-10 py-7 text-right font-black text-slate-900 text-xl tracking-tighter">
                                        <span className="text-green-600 text-[10px] mr-1 font-bold italic">Rp</span>
                                        {Number(log.tarif).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center font-black text-slate-200 uppercase text-2xl tracking-[0.5em]">
                                        Tidak Ada Aktivitas
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;