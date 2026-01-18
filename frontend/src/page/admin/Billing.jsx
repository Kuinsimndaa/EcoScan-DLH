import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { CreditCard, Calendar, Download, Search } from 'lucide-react';

const IdBilling = () => {
    const [billingData, setBillingData] = useState([]);
    const [filterTanggal, setFilterTanggal] = useState(""); 
    const [filterBulan, setFilterBulan] = useState(new Date().toISOString().slice(0, 7)); 
    const [modeFilter, setModeFilter] = useState("bulan"); 
    const [loading, setLoading] = useState(false);

    const fetchBillingData = async () => {
        setLoading(true);
        try {
            const query = modeFilter === "hari" 
                ? `tanggal=${filterTanggal}` 
                : `bulan=${filterBulan}`;
            
            // Menggunakan endpoint laporan yang sudah ada karena datanya serupa
            const res = await axios.get(`http://localhost:5000/api/scan/laporan?${query}`);
            
            // Grouping data berdasarkan Nama Petugas untuk menghitung akumulasi
            const grouped = res.data.reduce((acc, curr) => {
                const key = curr.namaPengendara;
                if (!acc[key]) {
                    acc[key] = {
                        nama: curr.namaPengendara,
                        armada: curr.jenisKendaraan,
                        wilayah: curr.wilayah,
                        mandor: curr.mandor,
                        tarif: Number(curr.tarif),
                        jumlahKedatangan: 0,
                        total: 0
                    };
                }
                acc[key].jumlahKedatangan += 1;
                acc[key].total += Number(curr.tarif);
                return acc;
            }, {});

            setBillingData(Object.values(grouped));
        } catch (err) {
            console.error("Error load billing data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (modeFilter === "hari" && !filterTanggal) return;
        fetchBillingData();
    }, [filterBulan, filterTanggal, modeFilter]);

    const handleExportExcel = () => {
        if (billingData.length === 0) return alert("Data kosong!");

        const dataExcel = billingData.map((item, index) => ({
            "No": index + 1,
            "Armada / Petugas": item.nama,
            "Jenis": item.armada,
            "Wilayah": item.wilayah,
            "Mandor": item.mandor,
            "Tarif Satuan": item.tarif,
            "Jumlah Kedatangan": item.jumlahKedatangan,
            "Total Tagihan": item.total
        }));

        const ws = XLSX.utils.json_to_sheet(dataExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ID Billing");
        const fileName = modeFilter === "hari" ? `Billing_Harian_${filterTanggal}` : `Billing_Bulanan_${filterBulan}`;
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    const handleGenerateBilling = async () => {
        if (billingData.length === 0) return alert("Data kosong! Tidak ada yang di-generate.");
        
        try {
            const query = modeFilter === "hari" 
                ? `tanggal=${filterTanggal}` 
                : `bulan=${filterBulan}`;
            
            const res = await axios.post(`http://localhost:5000/api/scan/generate-billing?${query}`);
            
            if (res.data.success) {
                alert(`✅ Billing berhasil di-generate!\n\nPeriode: ${res.data.data.periode}\nPetugas: ${res.data.data.jumlahPetugas}\nTotal Tagihan: Rp ${res.data.data.totalBilling.toLocaleString('id-ID')}`);
            }
        } catch (err) {
            alert("❌ Gagal generate billing: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-5 bg-green-600 rounded-[2rem] text-white shadow-2xl shadow-green-200">
                        <CreditCard size={35} />
                    </div>
                    <div>
                        <h2 className="font-black italic uppercase text-4xl text-slate-900 tracking-tighter leading-none">
                            ID <span className="text-green-600">BILLING</span>
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Akumulasi Tagihan Retribusi</p>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100">
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                        <button 
                            onClick={() => setModeFilter("hari")}
                            className={`px-4 py-2 rounded-xl font-black text-[10px] transition-all ${modeFilter === 'hari' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            HARIAN
                        </button>
                        <button 
                            onClick={() => setModeFilter("bulan")}
                            className={`px-4 py-2 rounded-xl font-black text-[10px] transition-all ${modeFilter === 'bulan' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            BULANAN
                        </button>
                    </div>

                    <div className="flex items-center gap-3 px-6 border-l border-slate-100">
                        <Calendar size={18} className="text-green-600" />
                        {modeFilter === "hari" ? (
                            <input 
                                type="date" 
                                value={filterTanggal}
                                onChange={(e) => setFilterTanggal(e.target.value)}
                                className="outline-none font-black text-slate-700 bg-transparent uppercase cursor-pointer text-sm"
                            />
                        ) : (
                            <input 
                                type="month" 
                                value={filterBulan}
                                onChange={(e) => setFilterBulan(e.target.value)}
                                className="outline-none font-black text-slate-700 bg-transparent uppercase cursor-pointer text-sm"
                            />
                        )}
                    </div>
                    
                    <button 
                        onClick={handleExportExcel}
                        className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-[1.5rem] font-black text-xs tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-lg"
                    >
                        <Download size={18} /> EKSPOR EXCEL
                    </button>

                    <button 
                        onClick={handleGenerateBilling}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-lg"
                    >
                        <CreditCard size={18} /> SIMPAN KE DATABASE
                    </button>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-max">
                        <thead>
                            <tr className="bg-slate-900 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-6 text-center">NO</th>
                                <th className="px-8 py-6 min-w-[200px]">ARMADA</th>
                                <th className="px-6 py-6 min-w-[130px]">MANDOR</th>
                                <th className="px-6 py-6 text-right min-w-[120px]">TARIF</th>
                                <th className="px-6 py-6 text-center min-w-[160px]">JUMLAH KEDATANGAN</th>
                                <th className="px-6 py-6 text-right min-w-[130px]">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-32 text-center animate-pulse font-black text-slate-300">MENGHITUNG BILLING...</td>
                                </tr>
                            ) : billingData.length > 0 ? billingData.map((item, index) => (
                                <tr key={index} className="hover:bg-green-50/30 transition-colors group">
                                    <td className="px-6 py-6 text-center font-black text-slate-400 text-sm">{index + 1}</td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-900 uppercase text-sm group-hover:text-green-700 transition-colors leading-tight">
                                            {item.nama}
                                        </div>
                                        <div className="text-[9px] font-bold text-green-600 uppercase tracking-tighter mt-0.5">
                                            {item.armada} — <span className="text-slate-400 italic font-medium">{item.wilayah}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="font-black text-slate-600 uppercase text-xs tracking-tight">
                                            {item.mandor}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right font-bold text-slate-600 text-sm">
                                        Rp {item.tarif.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className="inline-block px-5 py-1.5 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all rounded-xl font-black text-xs italic">
                                            {item.jumlahKedatangan}x
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right font-black text-slate-900 text-lg tracking-tighter">
                                        <span className="text-green-600 text-[10px] mr-1 font-bold italic">Rp</span>
                                        {item.total.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-40 text-center">
                                        <div className="font-black text-slate-200 uppercase text-3xl tracking-[0.5em]">Belum Ada Tagihan</div>
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

export default IdBilling;