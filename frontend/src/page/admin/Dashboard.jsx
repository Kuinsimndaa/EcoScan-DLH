import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalHariIni: 0, armadaUnik: 0 });
    const [recentScans, setRecentScans] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/scans-today');
            const result = await res.json();
            if (result.success) {
                setRecentScans(result.data);
                // Hitung statistik sederhana
                const unik = [...new Set(result.data.map(item => item.nama_pengendara))].length;
                setStats({ totalHariIni: result.data.length, armadaUnik: unik });
            }
        } catch (error) {
            console.error("Gagal memuat dashboard:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000); // Auto refresh tiap 30 detik
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                                EcoScan <span className="text-green-600 italic">Monitoring</span>
                            </h1>
                            <p className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase">Dinas Lingkungan Hidup Kab. Tegal</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Total Kedatangan Hari Ini</p>
                            <h3 className="text-6xl font-black text-slate-900">{stats.totalHariIni}</h3>
                            <p className="text-slate-400 text-xs mt-2 font-bold italic">Armada yang telah membuang sampah</p>
                        </div>
                        <div className="bg-green-600 p-8 rounded-[2.5rem] shadow-xl shadow-green-200 text-white">
                            <p className="text-green-100 font-black text-[10px] uppercase tracking-widest mb-2">Armada Beroperasi</p>
                            <h3 className="text-6xl font-black">{stats.armadaUnik}</h3>
                            <p className="text-green-100 text-xs mt-2 font-bold italic">Jumlah orang/pengendara unik</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="font-black text-slate-900 uppercase tracking-tighter">Sistem Terhubung</p>
                            </div>
                            <p className="text-slate-400 text-[10px] font-mono mt-1">DATABASE: DLH_ECOSCAN</p>
                        </div>
                    </div>

                    {/* Recent Activity Table */}
                    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h2 className="font-black uppercase tracking-widest text-sm text-slate-900">Aktivitas Scan Terbaru</h2>
                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-4 py-1 rounded-full animate-pulse">● LIVE UPDATES</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="p-6">Jam</th>
                                        <th className="p-6">Armada</th>
                                        <th className="p-6">Pengendara</th>
                                        <th className="p-6">Wilayah</th>
                                        <th className="p-6">Lokasi</th>
                                        <th className="p-6">Ke-</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold text-slate-600">
                                    {recentScans.length > 0 ? recentScans.map((scan, i) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                                            <td className="p-6 text-slate-900 font-mono">
                                                {new Date(scan.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-6 text-green-600 italic uppercase">{scan.jenis_armada}</td>
                                            <td className="p-6 uppercase text-slate-900">{scan.nama_pengendara}</td>
                                            <td className="p-6 text-slate-400 font-normal">{scan.wilayah}</td>
                                            <td className="p-6">{scan.lokasi}</td>
                                            <td className="p-6">
                                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black">{scan.kedatangan_ke}</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">Belum ada aktivitas scan</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;