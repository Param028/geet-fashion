import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { IconChevronLeft, IconChevronRight } from './BoutiqueIcons';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-[#fff7f9] min-h-screen">
      <AdminSidebar collapsed={collapsed} />
      
      {/* Desktop Sidebar Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className={`hidden lg:flex fixed z-[51] top-8 bg-white text-[#4a2c2a] w-8 h-8 rounded-full items-center justify-center border border-[#f6c1cc] shadow-md hover:bg-[#c9a14a] hover:text-white transition-all duration-300 ${collapsed ? 'left-20' : 'left-[17rem]'}`}
        title={collapsed ? "Expand Panel" : "Collapse Panel"}
      >
        {collapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
      </button>

      {/* Main Content Area - Adjusts padding based on sidebar state */}
      <div 
        className={`flex-1 p-6 pt-28 lg:pt-12 lg:p-16 transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:pl-40' : 'lg:pl-80'
        }`}
      >
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;