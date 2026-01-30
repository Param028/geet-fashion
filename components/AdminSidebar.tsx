import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { LOGO_SRC } from '../constants';
import * as Icons from './BoutiqueIcons';

interface AdminSidebarProps {
  collapsed?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.clearAuth();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <Icons.IconDashboard /> },
    { path: '/admin/upload', label: 'Upload Designs', icon: <Icons.IconHanger /> },
    { path: '/admin/manage-gallery', label: 'Manage Gallery', icon: <Icons.IconGallery /> },
    { path: '/admin/customers', label: 'Customers', icon: <Icons.IconMannequin /> },
    { path: '/admin/download', label: 'Download Data', icon: <Icons.IconDownload /> },
    { path: '/admin/settings', label: 'Settings', icon: <Icons.IconSettings /> },
  ];

  const SidebarContent = () => (
    <div className={`h-full flex flex-col transition-all duration-300 ${collapsed ? 'p-4' : 'p-8'}`}>
      <div className={`mb-12 flex items-center gap-4 ${collapsed ? 'justify-center' : 'pl-2'}`}>
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center border border-[#f6c1cc] overflow-hidden shadow-lg p-0.5 shrink-0">
           {!imgError ? (
             <img 
               src={LOGO_SRC} 
               alt="Geet Fashion" 
               className="w-full h-full object-contain rounded-full" 
               onError={() => setImgError(true)}
             />
           ) : (
             <span className="text-xl">👗</span>
           )}
        </div>
        {!collapsed && (
          <div className="min-w-0 transition-opacity duration-300">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a14a] font-black mono leading-none mb-1.5 truncate">Admin_System</p>
            <p className="text-xl font-bold text-[#4a2c2a] playfair tracking-wider truncate">Geet Boutique</p>
          </div>
        )}
      </div>
      
      <nav className="space-y-3 flex-grow">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-4 rounded-2xl transition-all duration-300 group ${
                collapsed ? 'justify-center p-3' : 'p-4'
              } ${
                isActive 
                  ? 'bg-[#4a2c2a] text-white shadow-xl' 
                  : 'text-gray-400 hover:bg-[#fff7f9] hover:text-[#c9a14a]'
              } ${!collapsed && isActive ? 'translate-x-2' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <span className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              {!collapsed && <span className="font-bold text-[11px] uppercase tracking-[0.2em]">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10 border-t border-[#fff7f9]">
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center space-x-4 rounded-2xl text-red-300 hover:bg-red-50 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-[0.3em] group ${
            collapsed ? 'justify-center p-3' : 'p-4'
          }`}
          title="Logout"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            <Icons.IconLogout />
          </span>
          {!collapsed && <span>Terminate</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header - Visible on lg and smaller now (bumped from md) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-b border-[#f6c1cc] flex items-center justify-between px-6 z-[60] shadow-sm">
        <div className="flex items-center gap-4">
           {!imgError ? (
             <img 
               src={LOGO_SRC} 
               alt="Logo" 
               className="w-10 h-10 rounded-full border border-[#f6c1cc] p-0.5 object-contain" 
               onError={() => setImgError(true)}
             />
           ) : (
             <span className="text-xl">👗</span>
           )}
           <span className="font-bold playfair text-[#4a2c2a] tracking-[0.2em] uppercase text-sm">GEET_ADMIN</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-12 h-12 flex items-center justify-center text-[#4a2c2a] hover:bg-[#fff7f9] rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-[60] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside 
        className={`bg-white min-h-screen border-r border-[#f6c1cc] hidden lg:block fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${collapsed ? 'w-24' : 'w-72'}`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;