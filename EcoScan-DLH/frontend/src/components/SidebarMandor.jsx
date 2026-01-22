import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, QrCode, LogOut, Leaf } from 'lucide-react'; 

const SidebarMandor = () => {
    const location = useLocation();
    
    // Menu 'RIWAYAT SCAN' telah dihapus dari array ini
    const menuItems = [
        { 
            name: 'DASHBOARD SCAN', 
            path: '/mandor/dashboard', 
            icon: <LayoutDashboard size={20} /> 
        },
        { 
            name: 'MULAI SCAN', 
            path: '/mandor/scanner', 
            icon: <QrCode size={20} /> 
        },
    ];

    return (
        <aside className="fixed top-0 left-0 h-screen w-[20%] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col z-50 shadow-2xl border-r border-slate-800/50">
            
            {/* Logo Area - DLH Placeholder */}
            <div className="p-6 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
                <div className="mb-4 p-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Leaf size={24} className="text-green-500 animate-bounce" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">DLH</span>
                    </div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.15em]">Dinas Lingkungan Hidup</p>
                </div>
                <h1 className="font-black text-lg italic uppercase text-center tracking-tighter leading-tight">
                    PETUGAS<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">SCAN</span>
                </h1>
            </div>
            
            {/* Navigation Menu */}
            <nav className="flex-1 p-5 space-y-1 mt-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`flex items-center gap-4 px-5 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 group ${
                            location.pathname === item.path 
                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-900/50 border border-green-500/50' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                        }`}
                    >
                        <span className={`transition-all group-hover:scale-110 ${location.pathname === item.path ? 'text-white' : 'text-slate-500'}`}>
                            {item.icon}
                        </span>
                        <span className="hidden group-hover:inline xl:inline">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Stats Badge */}
            <div className="px-5 py-4 border-t border-slate-800/50 bg-slate-900/50">
                <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-black text-green-400">Aktif</span>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <div className="p-5 border-t border-slate-800/50">
                <Link 
                    to="/" 
                    className="flex items-center justify-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl border border-red-500/20 transition-all duration-300 group"
                >
                    <LogOut size={18} className="group-hover:scale-110 transition-transform" /> 
                    <span className="hidden group-hover:inline xl:inline">KELUAR</span>
                </Link>
            </div>
        </aside>
    );
};

export default SidebarMandor;