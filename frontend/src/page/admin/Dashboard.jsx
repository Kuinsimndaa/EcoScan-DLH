import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Activity, Clock } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalKedatangan: 0,
        armadaBeroperasi: 0,
        recentActivity: []
    });

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/scan/dashboard-stats');
            setStats(res.data);
        } catch (err) {
            console.error("Gagal sinkronisasi dashboard");
        }
    };

    useEffect(() => {
        fetchStats();
        // Refresh data setiap 5 detik agar real-time
        const interval = setInterval(fetchStats, 5000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            
            {/* SEKSI JUDUL SCAN MONITORING (DISAMAKAN DENGAN RIWAYAT) */}
            <div className="mb-8 ml-2 flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-2xl text-white shadow-lg shadow-green-200 animate-pulse">
                    <Activity size={24} />
                </div>
                <h2 className="font-black italic uppercase text-3xl text-slate-900 tracking-tighter">
                    SCAN <span className="text-green-600">MONITORING</span>
                </h2>
            </div>

            {/* STATS AREA (KOTAK TOTAL KEDATANGAN & ARMADA) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Total Kedatangan */}
                <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 text-center relative overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900 group-hover:scale-110 transition-transform">
                        <Activity size={100}/>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 mb-4">Total Kedatangan Hari Ini</p>
                    <h2 className="text-9xl font-black text-slate-900 tabular-nums leading-none">
                        {stats.totalKedatangan}
                    </h2>
                </div>

                {/* Armada Beroperasi */}
                <div className="bg-green-600 p-12 rounded-[4rem] shadow-xl text-white text-center relative overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                        <Truck size={100}/>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-green-200 mb-4">Armada Beroperasi</p>
                    <h2 className="text-9xl font-black tabular-nums leading-none">
                        {stats.armadaBeroperasi}
                    </h2>
                </div>
            </div>

            {/* LIVE FEED TABLE */}
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-white">
                    <h3 className="font-black italic uppercase text-3xl text-slate-900 tracking-tighter">
                        RIWAYAT <span className="text-green-600">SCAN REAL-TIME</span>
                    </h3>
                    <div className="flex items-center gap-2 bg-green-50 px-5 py-2 rounded-full text-green-600 font-bold text-[10px] tracking-widest animate-pulse">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div> LIVE MONITORING
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-12 py-8"><div className="flex items-center gap-2"><Clock size={16}/> JAM</div></th>
                                <th className="px-12 py-8">PETUGAS / ARMADA</th>
                                <th className="px-12 py-8">MANDOR</th>
                                <th className="px-12 py-8 text-center">KEDATANGAN KE</th>
                                <th className="px-12 py-8 text-right">TARIF (RP)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.recentActivity.length > 0 ? stats.recentActivity.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-12 py-8 text-slate-400 font-bold tabular-nums text-sm">
                                        {log.waktu}
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="font-black text-slate-900 uppercase text-lg group-hover:text-green-700 transition-colors leading-tight">
                                            {log.namaPengendara}
                                        </div>
                                        <div className="text-[10px] font-bold text-green-600 uppercase tracking-tighter opacity-70">
                                            {log.jenisKendaraan} — {log.wilayah}
                                        </div>
                                    </td>
                                    <td className="px-12 py-8 font-black text-slate-500 uppercase text-xs">
                                        {log.mandor}
                                    </td>
                                    <td className="px-12 py-8 text-center">
                                        <span className="inline-block px-6 py-2 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors rounded-2xl font-black text-sm">
                                            {log.kedatanganKe}
                                        </span>
                                    </td>
                                    <td className="px-12 py-8 text-right font-black text-slate-900 text-2xl tracking-tighter">
                                        <span className="text-green-600 text-xs mr-1 font-bold italic">Rp</span>
                                        {Number(log.tarif).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-12 py-40 text-center">
                                        <div className="font-black text-slate-200 uppercase text-3xl tracking-[0.5em]">Belum Ada Aktivitas</div>
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