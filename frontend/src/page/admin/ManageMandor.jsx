import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar'; // Pastikan path benar

const ManageMandor = () => {
    const [mandors, setMandors] = useState([]);
    const [formData, setFormData] = useState({ nama: '', email: '', password: 'mandor123' });

    const fetchMandors = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/mandor');
            const result = await res.json();
            if (result.success) setMandors(result.data);
        } catch (error) { console.error(error); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/admin/mandor/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            alert(result.message);
            if (result.success) {
                setFormData({ nama: '', email: '', password: 'mandor123' });
                fetchMandors();
            }
        } catch (error) { alert("Gagal menambah mandor"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus akun mandor ini?")) {
            await fetch(`http://localhost:5000/api/admin/mandor/${id}`, { method: 'DELETE' });
            fetchMandors();
        }
    };

    useEffect(() => { fetchMandors(); }, []);

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                        <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">
                            Tambah <span className="text-green-600 italic">Petugas Mandor</span>
                        </h2>
                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <input type="text" placeholder="NAMA MANDOR" className="p-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-green-500 transition-all uppercase" 
                                value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
                            <input type="email" placeholder="EMAIL LOGIN" className="p-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-green-500 transition-all" 
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                            <button type="submit" className="bg-slate-900 text-white rounded-2xl hover:bg-green-600 transition-all font-black uppercase tracking-widest text-xs">Simpan Akun</button>
                        </form>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                <tr><th className="p-8">Nama Petugas</th><th className="p-8">Email Sistem</th><th className="p-8 text-center">Aksi</th></tr>
                            </thead>
                            <tbody className="text-sm font-bold text-slate-600">
                                {mandors.map((m) => (
                                    <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                                        <td className="p-8 text-slate-900 uppercase italic font-black">{m.nama}</td>
                                        <td className="p-8 text-slate-400 font-mono">{m.email}</td>
                                        <td className="p-8 text-center">
                                            <button onClick={() => handleDelete(m.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase">Hapus</button>
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

export default ManageMandor;