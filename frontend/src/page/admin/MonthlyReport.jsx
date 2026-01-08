import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

const MonthlyReport = () => {
    const [reports, setReports] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(2026);
    const [loading, setLoading] = useState(false);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/admin/reports?month=${selectedMonth}&year=${selectedYear}`);
            const result = await response.json();
            if (result.success) {
                setReports(result.data);
            }
        } catch (error) {
            console.error("Gagal mengambil laporan:", error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [selectedMonth, selectedYear]);

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">REKAPAN <span className="text-green-600 italic">BULANAN</span></h1>
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Laporan Sampah TPS Jalingkos</p>
                        </div>

                        <div className="flex gap-3 bg-slate-100 p-2 rounded-2xl">
                            <select className="bg-white px-4 py-2 rounded-xl font-bold text-slate-700 outline-none shadow-sm"
                                value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                <option value="1">Januari</option>
                                <option value="2">Februari</option>
                                <option value="3">Maret</option>
                                {/* Tambahkan bulan lainnya */}
                            </select>
                            <select className="bg-white px-4 py-2 rounded-xl font-bold text-slate-700 outline-none shadow-sm"
                                value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-inner">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                                <tr>
                                    <th className="p-6">No</th>
                                    <th className="p-6">Waktu Scan</th>
                                    <th className="p-6">Armada</th>
                                    <th className="p-6">Petugas Mandor</th>
                                    <th className="p-6">Lokasi</th>
                                    <th className="p-6">Ke-</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold text-slate-600">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-20 text-center animate-pulse">Memproses Data...</td></tr>
                                ) : reports.length > 0 ? (
                                    reports.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-50 hover:bg-green-50/50 transition-all">
                                            <td className="p-6 text-slate-400">{index + 1}</td>
                                            <td className="p-6 font-mono">{new Date(item.tanggal).toLocaleString('id-ID')}</td>
                                            <td className="p-6">
                                                <span className="block text-slate-900 uppercase font-black">{item.nama_pengendara}</span>
                                                <span className="text-[10px] text-green-600 uppercase italic">{item.jenis_armada} - {item.wilayah}</span>
                                            </td>
                                            <td className="p-6 italic">{item.nama_mandor}</td>
                                            <td className="p-6">{item.lokasi}</td>
                                            <td className="p-6">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">
                                                    {item.kedatangan_ke}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">Tidak ada data untuk periode ini</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyReport;