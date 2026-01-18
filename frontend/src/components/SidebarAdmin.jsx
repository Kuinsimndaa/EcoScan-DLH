import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, FileText, Receipt, LogOut } from 'lucide-react'; 

const SidebarAdmin = () => {
    const location = useLocation();
    const menuItems = [
        { name: 'DASHBOARD', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'TAMBAH ARMADA', path: '/admin/tambah-armada', icon: <Truck size={20} /> },
        { name: 'REKAPAN LAPORAN', path: '/admin/rekapan-laporan', icon: <FileText size={20} /> },
        { name: 'ID BILLING', path: '/admin/id-billing', icon: <Receipt size={20} /> },
    ];

    return (
        <aside className="fixed top-0 left-0 h-screen w-[20%] bg-slate-900 text-white flex flex-col z-50">
            <div className="p-8 border-b border-slate-800">
                <h1 className="font-black text-xl italic uppercase">ECOSCAN<span className="text-green-500">ADMIN</span></h1>
            </div>
            <nav className="flex-1 p-6 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`flex items-center gap-4 px-6 py-4 rounded-2xl ${location.pathname === item.path ? 'bg-green-600' : 'text-slate-400 hover:bg-slate-800'}`}>
                        {item.icon} <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-6 border-t border-slate-800">
                <Link to="/" className="text-red-400 font-black text-[10px] flex items-center gap-4 px-6 py-4 italic uppercase"><LogOut size={20} /> KELUAR</Link>
            </div>
        </aside>
    );
};
export default SidebarAdmin;