import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';

const Login = () => {
    const [activeTab, setActiveTab] = useState('admin');
    const [email, setEmail] = useState('admin@tegal.go.id');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const endpoint = activeTab === 'admin' ? '/api/auth/login' : '/api/auth/login-petugas';
            const res = await axios.post(`http://localhost:5000${endpoint}`, {
                email,
                password
            });

            if (res.data.success) {
                localStorage.setItem('admin_profile', JSON.stringify(res.data.data));
                
                // Tampilkan notifikasi sukses
                setNotification({
                    type: 'success',
                    title: '✓ LOGIN BERHASIL',
                    message: `Selamat datang, ${res.data.data.nama}!`,
                    playSound: true
                });

                // Redirect setelah notifikasi ditampilkan
                setTimeout(() => {
                    navigate(activeTab === 'admin' ? '/admin/dashboard' : '/mandor/dashboard');
                }, 1500);
            }
        } catch (err) {
            setNotification({
                type: 'error',
                title: '✗ LOGIN GAGAL',
                message: err.response?.data?.message || "Gagal terhubung ke server backend!",
                playSound: false
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl w-[480px] border border-slate-100 flex flex-col items-center">
                
                {/* 1. LOGO PEMKAB / DLH */}
                <img 
                    src="/logo-pemkab.png" 
                    alt="Logo DLH" 
                    className="w-20 h-auto mb-4"
                />

                {/* 2. JUDUL SISTEM */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black italic text-slate-900 tracking-tighter uppercase">
                        ECOSCAN <span className="text-green-600">DLH</span>
                    </h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">
                        Kabupaten Tegal
                    </p>
                </div>

                {/* 3. SELECTOR ROLE (ADMIN & PETUGAS SCAN) */}
                <div className="flex bg-slate-100 p-2 rounded-[1.5rem] mb-10 w-full shadow-inner">
                    <button 
                        onClick={() => setActiveTab('admin')}
                        className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'admin' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}
                    >
                        Admin
                    </button>
                    <button 
                        onClick={() => setActiveTab('petugas')}
                        className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'petugas' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}
                    >
                        Petugas Scan
                    </button>
                </div>

                {/* FORM LOGIN */}
                <form onSubmit={handleLogin} className="w-full space-y-5">
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-2 block tracking-widest">Email Akun</label>
                        <input 
                            type="email" 
                            className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-green-500 focus:bg-white transition-all shadow-sm"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@tegal.go.id"
                            required
                        />
                    </div>
                    
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-2 block tracking-widest">Kata Sandi</label>
                        <input 
                            type="password" 
                            className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-green-500 focus:bg-white transition-all shadow-sm"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs mt-6 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                    >
                        Masuk Sistem
                    </button>
                </form>

                <p className="mt-12 text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">
                    Dinas Lingkungan Hidup — Jalingkos Slawi
                </p>
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
        </div>
    );
};

export default Login;