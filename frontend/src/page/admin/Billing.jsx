import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Billing = () => {
    const [billings, setBillings] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(2026);

    const fetchBilling = async () => {
        const res = await fetch(`http://localhost:5000/api/admin/billing?month=${month}&year=${year}`);
        const result = await res.json();
        if (result.success) setBillings(result.data);
    };

    useEffect(() => { fetchBilling(); }, [month, year]);

    const exportPDF = (data) => {
        const doc = new jsPDF();
        doc.text("NOTA TAGIHAN RETRIBUSI TPS JALINGKOS", 14, 15);
        doc.setFontSize(10);
        doc.text(`Periode: ${month}/${year}`, 14, 22);
        doc.text(`Nama: ${data.nama_pengendara} (${data.jenis_armada})`, 14, 28);
        
        doc.autoTable({
            startY: 35,
            head: [['Keterangan', 'Jumlah', 'Tarif', 'Subtotal']],
            body: [[
                `Kedatangan di TPS`, 
                `${data.total_kedatangan}x`, 
                data.jenis_armada === 'GEROBAK' ? 'Rp 40.000' : 'Rp 60.000',
                `Rp ${data.total_tagihan.toLocaleString()}`
            ]],
        });

        doc.text("Harap lunas sebelum tanggal 10 bulan berikutnya.", 14, doc.lastAutoTable.finalY + 10);
        doc.save(`Billing_${data.nama_pengendara}_${month}.pdf`);
    };

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter">ID <span className="text-green-600">Billing</span></h1>
                            <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">Perhitungan Retribusi Armada</p>
                        </div>
                        <div className="flex gap-2">
                            <select className="p-3 bg-slate-100 rounded-xl font-bold" value={month} onChange={(e)=>setMonth(e.target.value)}>
                                <option value="1">Januari</option><option value="2">Februari</option>
                            </select>
                            <select className="p-3 bg-slate-100 rounded-xl font-bold" value={year} onChange={(e)=>setYear(e.target.value)}>
                                <option value="2026">2026</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                                <tr><th className="p-8">Armada</th><th className="p-8">Total Masuk</th><th className="p-8">Tagihan</th><th className="p-8 text-center">Opsi</th></tr>
                            </thead>
                            <tbody className="text-sm font-bold">
                                {billings.map((b) => (
                                    <tr key={b.id_armada} className="border-b hover:bg-slate-50">
                                        <td className="p-8">
                                            <span className="block text-slate-900">{b.nama_pengendara}</span>
                                            <span className="text-[10px] text-green-600">{b.jenis_armada}</span>
                                        </td>
                                        <td className="p-8">{b.total_kedatangan} Kali</td>
                                        <td className="p-8 text-slate-900">Rp {b.total_tagihan ? b.total_tagihan.toLocaleString() : 0}</td>
                                        <td className="p-8 text-center">
                                            <button onClick={() => exportPDF(b)} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Export PDF</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;