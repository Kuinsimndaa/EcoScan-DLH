import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, QrCode, LogOut } from 'lucide-react'; 

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
        <aside className="fixed top-0 left-0 h-screen w-[20%] bg-slate-900 text-white flex flex-col z-50 shadow-2xl">
            <div className="p-8 border-b border-slate-800">
                <h1 className="font-black text-xl italic uppercase text-green-500 tracking-tighter">
                    PETUGAS<span className="text-white">SCAN</span>
                </h1>
            </div>
            
            <nav className="flex-1 p-6 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                            location.pathname === item.path 
                            ? 'bg-green-600 shadow-lg shadow-green-900/50 text-white' 
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        {item.icon} 
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {item.name}
                        </span>
                    </Link>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-800">
                <Link 
                    to="/" 
                    className="text-red-400 font-black text-[10px] flex items-center gap-4 px-6 py-4 italic uppercase hover:bg-red-500/10 rounded-2xl transition-all"
                >
                    <LogOut size={20} /> KELUAR
                </Link>
            </div>
        </aside>
    );
};

export default SidebarMandor;