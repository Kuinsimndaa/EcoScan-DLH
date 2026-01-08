import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/add-armada', label: 'Tambah Armada', icon: '🚛' },
        { path: '/admin/report', label: 'Rekapan Laporan', icon: '📋' },
        { path: '/admin/manage-mandor', label: 'Kelola Mandor', icon: '👮' },
        { path: '/admin/billing', label: 'ID Billing', icon: '💰' }, // Menu Baru
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="w-72 bg-slate-900 text-white min-h-screen p-8 flex flex-col justify-between shadow-2xl sticky top-0">
            <div>
                <div className="mb-12">
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                        EcoScan<span className="text-green-500">Admin</span>
                    </h1>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em]">DLH Kabupaten Tegal</p>
                </div>

                <nav className="space-y-3">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path}
                            to={item.path} 
                            className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${
                                location.pathname === item.path 
                                ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <button 
                onClick={handleLogout}
                className="w-full p-4 bg-slate-800 hover:bg-red-600/20 hover:text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
                Keluar Sistem
            </button>
        </div>
    );
};

export default Sidebar;