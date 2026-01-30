import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUpload from './pages/AdminUpload';
import AdminManageGallery from './pages/AdminManageGallery';
import AdminCustomers from './pages/AdminCustomers';
import CustomerDetails from './pages/CustomerDetails';
import AdminDownload from './pages/AdminDownload';
import AdminSettings from './pages/AdminSettings';
import { storage } from './services/storage';
import { LOGO_SRC } from './constants';
import CircularText from './components/CircularText';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const location = useLocation();
  const auth = storage.getAuth();
  
  const isAdminPath = location.pathname.startsWith('/admin');
  const hideMainNavbar = isAdminPath && auth?.isLoggedIn;

  if (hideMainNavbar) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#f6c1cc] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group shrink-0">
          <div className="relative flex items-center justify-center w-16 h-16">
            <CircularText 
              text="GEET FASHION • BOUTIQUE • EST 2024 • " 
              radius={34} 
              fontSize={7} 
              speed={20}
            />
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border border-[#f6c1cc] relative z-10 group-hover:scale-110 transition-transform duration-500 shadow-sm p-0.5">
              {!imgError ? (
                <img 
                  src={LOGO_SRC} 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-full"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-xl">👗</span>
              )}
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold playfair tracking-[0.25em] text-[#4a2c2a] leading-none">GEET</h1>
            <p className="text-[9px] mono tracking-[0.4em] text-[#c9a14a] font-black uppercase mt-1.5">STITCH_SYS_01</p>
          </div>
        </Link>
        
        <div className="hidden md:flex space-x-12 items-center">
          <Link to="/" className={`text-[11px] font-black mono transition-colors tracking-[0.2em] uppercase ${location.pathname === '/' ? 'text-[#c9a14a]' : 'text-[#4a2c2a] hover:text-[#c9a14a]'}`}>Home_Dir</Link>
          <Link to="/gallery" className={`text-[11px] font-black mono transition-colors tracking-[0.2em] uppercase ${location.pathname === '/gallery' ? 'text-[#c9a14a]' : 'text-[#4a2c2a] hover:text-[#c9a14a]'}`}>Gallery_View</Link>
          <Link to="/admin" className="px-7 py-2.5 border border-[#4a2c2a] text-[10px] font-black mono hover:bg-[#4a2c2a] hover:text-white transition-all tracking-[0.2em] uppercase active:scale-95">Admin_Access</Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#4a2c2a] p-2 hover:bg-[#fff7f9] rounded-lg transition-colors">
          <div className="space-y-1.5 w-6">
            <div className={`h-0.5 bg-[#4a2c2a] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`h-0.5 bg-[#4a2c2a] transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`h-0.5 bg-[#4a2c2a] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </div>
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-b border-[#f6c1cc] overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-80' : 'max-h-0'}`}>
        <div className="p-8 space-y-6 flex flex-col items-center">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-[12px] font-black mono tracking-[0.3em] uppercase">Home_Directory</Link>
          <Link to="/gallery" onClick={() => setIsOpen(false)} className="text-[12px] font-black mono tracking-[0.3em] uppercase">Gallery_Snapshot</Link>
          <Link to="/admin" onClick={() => setIsOpen(false)} className="w-full text-center py-4 bg-[#4a2c2a] text-white text-[12px] font-black mono tracking-[0.3em] uppercase rounded-xl">Portal_Access</Link>
        </div>
      </div>
    </nav>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = storage.getAuth();
  if (!auth?.isLoggedIn) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#fff7f9] flex flex-col selection:bg-[#f6c1cc] selection:text-[#4a2c2a]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/upload" element={<ProtectedRoute><AdminUpload /></ProtectedRoute>} />
            <Route path="/admin/manage-gallery" element={<ProtectedRoute><AdminManageGallery /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomers /></ProtectedRoute>} />
            <Route path="/admin/customer/:id" element={<ProtectedRoute><CustomerDetails /></ProtectedRoute>} />
            <Route path="/admin/download" element={<ProtectedRoute><AdminDownload /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-white py-24 border-t border-[#f6c1cc]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold playfair text-[#4a2c2a] uppercase tracking-[0.25em]">Geet Fashion</h2>
              <p className="text-gray-400 mono text-[11px] leading-loose tracking-widest">
                ESTABLISHED_2024<br />
                DESIGN_SYSTEM_CORE_V.1.2.0<br />
                BOUTIQUE_SERVICES_OPERATIONAL<br />
                STITCHED_WITH_PRIDE
              </p>
            </div>
            <div className="space-y-8">
              <h4 className="mono text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em]">Connect</h4>
              <div className="flex flex-col gap-4">
                <a href="https://www.instagram.com/geetfashiondesigns?igsh=bHR6YW0zYm1qcjNy" target="_blank" rel="noreferrer" className="text-xs font-black tracking-widest hover:text-[#c9a14a] transition-colors uppercase border-b border-transparent hover:border-[#c9a14a] w-fit">Instagram</a>
                <a href="https://wa.me/919823376600" target="_blank" rel="noreferrer" className="text-xs font-black tracking-widest hover:text-[#c9a14a] transition-colors uppercase border-b border-transparent hover:border-[#c9a14a] w-fit">WhatsApp (+91 98233 76600)</a>
                <a href="#" className="text-xs font-black tracking-widest hover:text-[#c9a14a] transition-colors uppercase border-b border-transparent hover:border-[#c9a14a] w-fit">Facebook_Meta</a>
              </div>
            </div>
            <div className="md:text-right flex flex-col justify-end gap-2 opacity-40">
              <p className="mono text-[10px] text-[#4a2c2a] uppercase tracking-widest">© 2025 GEET FASHION BOUTIQUE</p>
              <p className="mono text-[10px] text-[#4a2c2a] uppercase tracking-widest">ALL_RIGHTS_RESERVED_CRYPT_01</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;