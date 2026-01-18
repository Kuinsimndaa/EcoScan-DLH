import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { toJpeg } from 'html-to-image';
import { Truck, BadgeCheck, Download, Trash2, Plus, QrCode, Eye } from 'lucide-react';

const AddArmada = () => {
    const qrRef = useRef(null);
    const [formData, setFormData] = useState({
        namaPetugas: '', 
        mandor: '', 
        jenisArmada: 'TOSSA', 
        wilayah: '', 
        tarif: '40000'
    });
    const [daftarArmada, setDaftarArmada] = useState([]);
    const [qrValue, setQrValue] = useState('');
    const [selectedPetugas, setSelectedPetugas] = useState(null);
    const [loading, setLoading] = useState(false);

    // Ambil data dari database
    const fetchArmada = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/armada');
            setDaftarArmada(res.data);
        } catch (err) {
            console.error("Gagal load data:", err);
        }
    };

    useEffect(() => {
        fetchArmada();
    }, []);

    // Fungsi Submit (Kunci Utama Agar QR Muncul)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/armada', formData);
            
            // Pastikan mengecek respon data qrcode dari backend
            if (res.data.success && res.data.data.qrcode) {
                // 1. Set nilai QR agar QRCodeCanvas merender gambar
                setQrValue(res.data.data.qrcode); 
                
                // 2. Set info petugas untuk tampilan kartu
                setSelectedPetugas({
                    nama: formData.namaPetugas,
                    jenis: formData.jenisArmada,
                    wilayah: formData.wilayah
                });

                alert("Berhasil Tersimpan! QR Code Otomatis Dibuat.");
                fetchArmada(); // Refresh tabel di bawah
                
                // 3. Reset input form
                setFormData({ 
                    namaPetugas: '', 
                    mandor: '', 
                    jenisArmada: 'TOSSA', 
                    wilayah: '', 
                    tarif: '40000' 
                });
            }
        } catch (err) {
            console.error("Error simpan:", err);
            alert("Gagal simpan! Pastikan Backend mengirimkan string 'qrcode'.");
        } finally {
            setLoading(false);
        }
    };

    // Menampilkan kembali QR dari data yang sudah ada di tabel
    const handleViewQR = (item) => {
        if (item.qrcode) {
            setQrValue(item.qrcode);
            setSelectedPetugas({
                nama: item.namaPetugas,
                jenis: item.jenisArmada,
                wilayah: item.wilayah
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert("Data ini tidak punya string QR di database!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus data ini?")) {
            try {
                await axios.delete(`http://localhost:5000/api/armada/${id}`);
                fetchArmada();
                setQrValue('');
                setSelectedPetugas(null);
            } catch (err) {
                alert("Gagal hapus.");
            }
        }
    };

    const downloadJPG = () => {
        if (!qrRef.current) return;
        toJpeg(qrRef.current, { quality: 1.0, backgroundColor: '#ffffff' })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `QR-${selectedPetugas?.nama || 'ARMADA'}.jpg`;
                link.href = dataUrl;
                link.click();
            });
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-green-500 rounded-2xl text-white shadow-lg">
                    <BadgeCheck size={32} />
                </div>
                <h1 className="text-4xl font-black italic text-slate-900 uppercase">
                    REGISTRASI <span className="text-green-600">ARMADA</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FORM */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                        <input placeholder="Nama Petugas" value={formData.namaPetugas} onChange={(e) => setFormData({...formData, namaPetugas: e.target.value})} className="p-5 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-green-500" required />
                        <input placeholder="Mandor Lapangan" value={formData.mandor} onChange={(e) => setFormData({...formData, mandor: e.target.value})} className="p-5 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-green-500" required />
                        <select value={formData.jenisArmada} onChange={(e) => setFormData({...formData, jenisArmada: e.target.value})} className="p-5 bg-slate-50 rounded-2xl font-bold outline-none">
                            <option value="TOSSA">TOSSA</option>
                            <option value="GEROBAK">GEROBAK</option>
                        </select>
                        <input placeholder="Wilayah Kerja" value={formData.wilayah} onChange={(e) => setFormData({...formData, wilayah: e.target.value})} className="p-5 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-green-500" required />
                        <input type="number" value={formData.tarif} onChange={(e) => setFormData({...formData, tarif: e.target.value})} className="col-span-2 p-5 bg-slate-50 rounded-2xl font-black text-xl outline-none" required />
                        <button type="submit" disabled={loading} className="col-span-2 bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase hover:bg-black transition-all flex items-center justify-center gap-2">
                            {loading ? "MENYIMPAN..." : <><Plus size={20}/> DAFTARKAN & GENERATE QR</>}
                        </button>
                    </form>
                </div>

                {/* PREVIEW QR */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center">
                    <div ref={qrRef} className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 flex flex-col items-center">
                        {qrValue ? (
                            <QRCodeCanvas value={qrValue} size={180} level={"H"} includeMargin={true} />
                        ) : (
                            <div className="w-44 h-44 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                                <QrCode size={50} className="text-slate-100" />
                            </div>
                        )}
                        <div className="mt-4 text-center">
                            <p className="font-black text-slate-900 uppercase text-sm">{selectedPetugas?.nama || "NAMA PETUGAS"}</p>
                            <p className="text-[10px] font-bold text-green-600 uppercase mt-1">{selectedPetugas?.jenis || "JENIS"} — {selectedPetugas?.wilayah || "WILAYAH"}</p>
                        </div>
                    </div>
                    <button onClick={downloadJPG} disabled={!qrValue} className="mt-8 w-full py-5 bg-green-600 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 disabled:bg-slate-100">
                        <Download size={18} /> DOWNLOAD JPG
                    </button>
                </div>
            </div>

            {/* TABEL */}
            <div className="mt-12 bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 border-b border-slate-50 flex items-center gap-3">
                    <Truck className="text-green-600" size={24} />
                    <h2 className="font-black uppercase italic text-slate-800 text-xl">Data Armada Terdaftar</h2>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-10 py-6">Petugas / Armada</th>
                            <th className="px-10 py-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {daftarArmada.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-10 py-6">
                                    <div className="font-black text-slate-900 uppercase">{item.namaPetugas}</div>
                                    <div className="text-[10px] font-bold text-green-600 uppercase">{item.jenisArmada} — {item.wilayah}</div>
                                </td>
                                <td className="px-10 py-6 text-center">
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => handleViewQR(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                            <Eye size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AddArmada;