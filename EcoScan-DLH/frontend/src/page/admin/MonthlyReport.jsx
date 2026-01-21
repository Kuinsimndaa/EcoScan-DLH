import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Calendar, Download, Clock, Filter, Trash2 } from 'lucide-react';
import Notification from '../../components/Notification';
import ConfirmationModal from '../../components/ConfirmationModal';

const MonthlyReport = () => {
    const [laporan, setLaporan] = useState([]);
    const [filterTanggal, setFilterTanggal] = useState(""); // Untuk Filter Harian
    const [filterBulan, setFilterBulan] = useState(new Date().toISOString().slice(0, 7)); // Default Bulan Sekarang
    const [modeFilter, setModeFilter] = useState("bulan"); // "hari" atau "bulan"
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null, onCancel: null });
    const [deleteId, setDeleteId] = useState(null);

    // Fungsi format tanggal ke format Indonesia
    const formatTanggalIndonesia = (tanggalStr) => {
        const bulanIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const [tahun, bulan, hari] = tanggalStr.split('-');
        const bulanIndex = parseInt(bulan) - 1;
        return `${hari} ${bulanIndo[bulanIndex]} ${tahun}`;
    };

    const fetchLaporan = async () => {
        setLoading(true);
        try {
            // Menentukan query berdasarkan mode yang dipilih
            const query = modeFilter === "hari" 
                ? `tanggal=${filterTanggal}` 
                : `bulan=${filterBulan}`;
            
            const res = await axios.get(`http://localhost:5000/api/scan/laporan?${query}`);
            setLaporan(res.data);
        } catch (err) {
            console.error("Error load data laporan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (modeFilter === "hari" && !filterTanggal) return;
        fetchLaporan();
    }, [filterBulan, filterTanggal, modeFilter]);

    const handleExportExcel = () => {
        if (laporan.length === 0) {
            setNotification({
                type: 'error',
                title: '✗ DATA KOSONG',
                message: 'Tidak ada data laporan untuk diekspor. Silahkan filter data terlebih dahulu.',
                playSound: false
            });
            return;
        }

        const dataExcel = laporan.map((item, index) => ({
            "No": index + 1,
            "Tanggal": formatTanggalIndonesia(item.tanggalLengkap),
            "Jam": item.waktu,
            "Nama Petugas": item.namaPengendara,
            "Jenis Armada": item.jenisKendaraan,
            "Wilayah": item.wilayah,
            "Mandor": item.mandor,
            "Total Masuk": item.kedatanganKe,
            "Tarif (Rp)": Number(item.tarif)
        }));

        const ws = XLSX.utils.json_to_sheet(dataExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Laporan EcoScan");
        const fileName = modeFilter === "hari" ? `Laporan_Harian_${filterTanggal}` : `Laporan_Bulanan_${filterBulan}`;
        XLSX.writeFile(wb, `${fileName}.xlsx`);

        setNotification({
            type: 'success',
            title: '✓ BERHASIL DIEKSPOR',
            message: `File "${fileName}.xlsx" berhasil diunduh.`,
            playSound: true
        });
    };

    const handleDelete = async (id) => {
        setDeleteId(id);
        setConfirmationModal({
            isOpen: true,
            type: 'error',
            title: '✗ HAPUS LAPORAN',
            message: 'Apakah Anda yakin ingin menghapus data laporan ini? Data tidak dapat dikembalikan.',
            onConfirm: async () => {
                try {
                    await axios.delete(`http://localhost:5000/api/scan/laporan/${id}`);
                    fetchLaporan();
                    
                    setNotification({
                        type: 'success',
                        title: '✓ BERHASIL DIHAPUS',
                        message: 'Data laporan berhasil dihapus dari sistem.',
                        playSound: true
                    });
                } catch (err) {
                    console.error("Error hapus:", err);
                    setNotification({
                        type: 'error',
                        title: '✗ GAGAL DIHAPUS',
                        message: err.response?.data?.message || 'Terjadi kesalahan saat menghapus data.',
                        playSound: false
                    });
                } finally {
                    // PENTING: Reset modal state dan deleteId untuk siap delete berikutnya
                    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                    setDeleteId(null);
                }
            },
            onCancel: () => {
                setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                setDeleteId(null);
            }
        });
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-5 bg-green-600 rounded-[2rem] text-white shadow-2xl shadow-green-200">
                        <FileSpreadsheet size={35} />
                    </div>
                    <div>
                        <h2 className="font-black italic uppercase text-4xl text-slate-900 tracking-tighter leading-none">
                            REKAPAN <span className="text-green-600">LAPORAN</span>
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Filter Harian & Bulanan</p>
                    </div>
                </div>

                {/* Multi-Filter System */}
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
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-auto border border-slate-100">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0">
                        <tr className="bg-slate-900 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <th className="px-6 py-6"><div className="flex items-center gap-2"><Clock size={14}/> TANGGAL / WAKTU</div></th>
                            <th className="px-6 py-6">NAMA PETUGAS</th>
                            <th className="px-6 py-6">MANDOR</th>
                            <th className="px-6 py-6 text-center">TOTAL MASUK</th>
                            <th className="px-6 py-6 text-right">TARIF</th>
                            <th className="px-6 py-6 text-center">AKSI</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-32 text-center animate-pulse font-black text-slate-300">MEMUAT DATA...</td>
                            </tr>
                        ) : laporan.length > 0 ? laporan.map((item) => (
                            <tr key={item.id} className="hover:bg-green-50/30 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-black text-slate-900 text-sm italic">{formatTanggalIndonesia(item.tanggalLengkap)}</div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase">{item.waktu} WIB</div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="font-black text-slate-900 uppercase text-sm">
                                        {item.namaPengendara}
                                    </div>
                                    <div className="text-[9px] font-bold text-green-600 uppercase mt-1">{item.jenisKendaraan} — <span className="text-slate-400 italic font-medium">{item.wilayah}</span></div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="font-black text-slate-500 uppercase text-xs">
                                        {item.mandor}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-block px-3 py-1 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all rounded-lg font-black text-xs italic">
                                        KE-{item.kedatanganKe}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right font-black text-slate-900 text-sm">
                                    <span className="text-green-600 text-xs mr-1 font-bold italic">Rp</span>
                                    {Number(item.tarif).toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Hapus Data">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-40 text-center">
                                    <div className="font-black text-slate-200 uppercase text-3xl tracking-[0.5em]">Data Tidak Ditemukan</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Notification */}
            {notification && (
                <Notification
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    playSound={notification.playSound}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                type={confirmationModal.type}
                title={confirmationModal.title}
                message={confirmationModal.message}
                confirmText="HAPUS"
                cancelText="BATAL"
                onConfirm={confirmationModal.onConfirm}
                onCancel={confirmationModal.onCancel}
            />
        </div>
    );
};

export default MonthlyReport;