import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Activity, Clock, TrendingUp } from 'lucide-react';

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
        <div className="p-8 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 min-h-screen">
            
            {/* SEKSI JUDUL SCAN MONITORING */}
            <div className="mb-12 flex items-center gap-4">
                <div className="p-3.5 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl text-white shadow-lg shadow-green-300/50 animate-pulse">
                    <Activity size={28} />
                </div>
                <div>
                    <h2 className="font-black italic uppercase text-4xl text-slate-900 tracking-tighter leading-none">
                        SCAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">MONITORING</span>
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Real-Time Dashboard</p>
                </div>
            </div>

            {/* STATS AREA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Total Kedatangan */}
                <div className="relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-gradient-to-br from-white via-slate-50 to-slate-100 p-12 rounded-[3rem] shadow-xl border border-slate-200/50 text-center hover:shadow-2xl transition-all">
                        <div className="absolute top-6 right-6 p-4 opacity-8 text-slate-200 group-hover:scale-125 transition-transform duration-500">
                            <Activity size={80}/>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">Total Kedatangan Hari Ini</p>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp size={24} className="text-blue-600" />
                            <h2 className="text-8xl font-black text-slate-900 tabular-nums leading-none">
                                {stats.totalKedatangan}
                            </h2>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 mt-3">Armada masuk hari ini</p>
                    </div>
                </div>

                {/* Armada Beroperasi */}
                <div className="relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-400/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-gradient-to-br from-green-600 via-green-600 to-emerald-700 p-12 rounded-[3rem] shadow-xl text-white text-center hover:shadow-2xl transition-all border border-green-500/30">
                        <div className="absolute top-6 right-6 p-4 opacity-20 group-hover:scale-125 transition-transform duration-500">
                            <Truck size={80}/>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:opacity-100 transition-all"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-100 mb-3">Armada Beroperasi</p>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Truck size={24} className="text-green-100" />
                            <h2 className="text-8xl font-black tabular-nums leading-none">
                                {stats.armadaBeroperasi}
                            </h2>
                        </div>
                        <div className="inline-block mt-3 px-4 py-1.5 bg-white/20 rounded-full text-[11px] font-bold text-green-50 border border-white/30">
                            Sedang Beroperasi
                        </div>
                    </div>
                </div>
            </div>

            {/* LIVE FEED TABLE */}
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200/50 hover:shadow-3xl transition-all">
                <div className="p-10 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-gradient-to-br from-green-600 to-green-700 rounded-xl text-white">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-black italic uppercase text-3xl text-slate-900 tracking-tighter">
                                RIWAYAT <span className="text-green-600">SCAN REAL-TIME</span>
                            </h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">15 aktivitas terbaru</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-2.5 rounded-full text-green-600 font-black text-[10px] tracking-widest border border-green-200/50 shadow-md">
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full animate-pulse shadow-lg shadow-green-600/50"></div> LIVE MONITORING
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gradient-to-r from-slate-900 to-slate-800 sticky top-0">
                            <tr className="text-[11px] font-black text-slate-300 uppercase tracking-[0.15em]">
                                <th className="px-10 py-6"><div className="flex items-center gap-2"><Clock size={16}/> JAM</div></th>
                                <th className="px-10 py-6">PETUGAS / ARMADA</th>
                                <th className="px-10 py-6">MANDOR</th>
                                <th className="px-10 py-6 text-center">KEDATANGAN KE</th>
                                <th className="px-10 py-6 text-right">TARIF (RP)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats.recentActivity.length > 0 ? stats.recentActivity.map((log, idx) => (
                                <tr key={log.id} className={`hover:bg-gradient-to-r hover:from-green-50/50 hover:to-blue-50/50 transition-all group border-l-4 ${idx % 2 === 0 ? 'border-l-transparent' : 'border-l-green-200/30'}`}>
                                    <td className="px-10 py-7 text-slate-500 font-bold tabular-nums text-sm">
                                        <span className="px-3 py-1 bg-slate-100 group-hover:bg-green-100 rounded-lg transition-colors">{log.waktu}</span>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="font-black text-slate-900 uppercase text-base group-hover:text-green-700 transition-colors leading-tight">
                                            {log.namaPengendara}
                                        </div>
                                        <div className="text-[10px] font-bold text-green-600 uppercase tracking-tighter opacity-75 mt-0.5">
                                            {log.jenisKendaraan} — {log.wilayah}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 font-black text-slate-600 uppercase text-xs">
                                        {log.mandor}
                                    </td>
                                    <td className="px-10 py-7 text-center">
                                        <span className="inline-block px-5 py-2 bg-gradient-to-r from-blue-100 to-blue-50 group-hover:from-slate-900 group-hover:to-slate-800 group-hover:text-white transition-all rounded-xl font-black text-sm border border-blue-200/50 group-hover:border-slate-700">
                                            {log.kedatanganKe}
                                        </span>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <span className="font-black text-slate-900 text-lg tracking-tighter">
                                            <span className="text-green-600 text-xs mr-1 font-bold italic">Rp</span>
                                            {Number(log.tarif).toLocaleString('id-ID')}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="inline-block">
                                            <Activity size={48} className="text-slate-200 mx-auto mb-4" />
                                            <div className="font-black text-slate-300 uppercase text-2xl tracking-[0.4em]">Belum Ada Aktivitas</div>
                                            <p className="text-xs text-slate-400 mt-2">Tunggu armada masuk untuk melihat data scan</p>
                                        </div>
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