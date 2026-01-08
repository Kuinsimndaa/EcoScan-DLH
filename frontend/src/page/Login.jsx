import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../utils/animations';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Mencoba login:", { email, role }); // Debugging di console

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await response.json();

      if (data.success) {
        // Simpan data user ke local storage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Ambil role dari data user dan paksa jadi huruf kecil
        const userRole = data.user.role.toLowerCase();

        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'mandor') {
          // Navigasi disesuaikan dengan path di App.jsx kamu
          navigate('/mandor/scanner'); 
        } else {
          alert("Role tidak dikenali oleh sistem: " + userRole);
        }
      } else {
        // Pesan error dari backend (misal: "User not found" atau "Invalid password")
        alert("Gagal Masuk: " + data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Gagal terhubung ke server backend. Pastikan server sudah jalan!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 p-10 border border-slate-100"
      >
        {/* SEKSI LOGO */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <img 
            src="/logo-pemkab.png" 
            alt="Logo Pemkab Tegal" 
            className="w-24 h-24 mx-auto mb-4 object-contain" 
          />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            EcoScan <span className="text-green-600">DLH</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            Kabupaten Tegal
          </p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* PILIHAN ROLE (ADMIN/MANDOR) */}
          <motion.div variants={itemVariants} className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                role === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('mandor')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                role === 'mandor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Mandor
            </button>
          </motion.div>

          {/* INPUT DATA */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Akun</label>
              <input 
                type="email" 
                required
                className="w-full mt-1.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-700 transition-all"
                placeholder="mandor@tegal.go.id"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Kata Sandi</label>
              <input 
                type="password" 
                required
                className="w-full mt-1.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-700 transition-all"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </motion.div>

          {/* TOMBOL LOGIN */}
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-500/10"
          >
            Masuk Sistem
          </motion.button>
        </form>

        <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                Dinas Lingkungan Hidup Kabupaten Tegal
            </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;