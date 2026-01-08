import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { QRCodeCanvas } from 'qrcode.react';

const AddArmada = () => {
    const [formData, setFormData] = useState({ nama: '', jenis: 'TOSSA', wilayah: 'SLAWI' });
    const [qrValue, setQrValue] = useState('');
    const [armadaList, setArmadaList] = useState([]);

    // Fungsi mengambil daftar armada yang sudah ada
    const fetchArmada = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/armada');
            const result = await res.json();
            if (result.success) setArmadaList(result.data);
        } catch (error) {
            console.error("Gagal mengambil data armada");
        }
    };

    useEffect(() => { fetchArmada(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/admin/armada/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nama_pengendara: formData.nama,
                    jenis_armada: formData.jenis,
                    wilayah: formData.wilayah
                })
            });
            const result = await res.json();
            if (result.success) {
                setQrValue(result.qr_token);
                alert("Armada Berhasil Didaftarkan!");
                fetchArmada(); // Refresh tabel setelah tambah baru
            }
        } catch (error) { alert("Gagal koneksi ke server"); }
    };

    const downloadQR = (nama) => {
        const canvas = document.getElementById("qr-gen");
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_${nama}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Form Card */}
                        <div className="flex-1 bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">Registrasi <span className="text-green-600 italic">Armada Baru</span></h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nama Pengendara</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-green-500 transition-all uppercase"
                                        value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Jenis Armada</label>
                                        <select className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold appearance-none"
                                            value={formData.jenis} onChange={(e) => setFormData({...formData, jenis: e.target.value})}>
                                            <option value="TOSSA">TOSSA</option>
                                            <option value="GEROBAK">GEROBAK</option>
                                            <option value="TRUK">TRUK</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Wilayah</label>
                                        <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold uppercase"
                                            value={formData.wilayah} onChange={(e) => setFormData({...formData, wilayah: e.target.value})} />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-green-600 transition-all shadow-xl shadow-slate-200">
                                    Buat Token & QR Code
                                </button>
                            </form>
                        </div>

                        {/* QR Preview Card */}
                        <div className="w-full md:w-80 bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                            {qrValue ? (
                                <>
                                    <QRCodeCanvas id="qr-gen" value={qrValue} size={200} level={"H"} includeMargin={true} />
                                    <p className="mt-6 text-[10px] font-black text-slate-900 uppercase tracking-widest">QR CODE AKTIF</p>
                                    <button onClick={() => downloadQR(formData.nama)} className="mt-4 bg-green-50 text-green-600 px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-green-600 hover:text-white transition-all">Download PNG</button>
                                </>
                            ) : (
                                <div className="w-48 h-48 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-100 flex items-center justify-center italic text-slate-300 text-[10px] uppercase font-black p-4">
                                    Klik "Lihat QR" di tabel untuk menampilkan kembali
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabel Daftar Armada */}
                    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                        <div className="p-8 border-b border-slate-50">
                            <h2 className="font-black uppercase tracking-widest text-sm text-slate-900">Daftar QR Code Terdaftar</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="p-6">Nama Pengendara</th>
                                    <th className="p-6">Jenis</th>
                                    <th className="p-6">Wilayah</th>
                                    <th className="p-6 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold text-slate-600">
                                {armadaList.map((item, i) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="p-6 text-slate-900 uppercase font-black">{item.nama_pengendara}</td>
                                        <td className="p-6"><span className="text-green-600 italic text-xs">{item.jenis_armada}</span></td>
                                        <td className="p-6 uppercase text-[12px]">{item.wilayah}</td>
                                        <td className="p-6 text-center">
                                            <button 
                                                onClick={() => {
                                                    setQrValue(item.qr_token);
                                                    setFormData({nama: item.nama_pengendara, jenis: item.jenis_armada, wilayah: item.wilayah});
                                                }}
                                                className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-green-600 transition-all"
                                            >
                                                Lihat QR
                                            </button>
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

export default AddArmada;