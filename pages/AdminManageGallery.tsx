import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { storage } from '../services/storage';
import { Design } from '../types';
import { IconHanger } from '../components/BoutiqueIcons';

const AdminManageGallery: React.FC = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await storage.getDesigns();
      setDesigns(data);
    } catch (e) {
      console.error("Failed to load gallery:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    if (window.confirm("Are you sure you want to delete this design piece permanently from the gallery?")) {
      try {
        setDesigns(prev => prev.filter(d => String(d.id) !== String(id)));
        await storage.deleteDesign(id);
        setStatus('Successfully deleted piece');
        setTimeout(() => setStatus(''), 3000);
      } catch (err) {
        console.error("Delete failed:", err);
        await loadGallery();
        setStatus('Error: Could not delete item');
        setTimeout(() => setStatus(''), 3000);
      }
    }
  };

  return (
    <div className="flex bg-[#fff7f9] min-h-screen">
      <AdminSidebar />
      <div className="flex-1 md:pl-80 p-8 md:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[50px] border border-[#f6c1cc] shadow-sm">
            <div>
              <h1 className="text-4xl font-bold playfair text-[#4a2c2a]">Gallery Curation</h1>
              <p className="text-gray-400 font-medium italic mt-2">Manage and refine your public design portfolio and presence.</p>
            </div>
            {status && (
              <div className={`px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-xl animate-in slide-in-from-top-4 duration-500 ${status.includes('Error') ? 'bg-red-500 text-white' : 'bg-[#4a2c2a] text-white'}`}>
                {status.includes('Error') ? '✕' : '✓'} {status}
              </div>
            )}
          </header>

          {loading ? (
            <div className="text-center py-40">
              <div className="animate-spin text-5xl mb-8 text-[#c9a14a]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
              </div>
              <p className="text-gray-400 font-black tracking-[0.5em] uppercase text-sm">Accessing Design Vault...</p>
            </div>
          ) : designs.length === 0 ? (
            <div className="bg-white p-40 rounded-[80px] text-center border-4 border-dashed border-[#f6c1cc]/30 shadow-inner">
              <div className="mb-12 opacity-10 text-[#4a2c2a] flex justify-center">
                <IconHanger size={160} strokeWidth={0.3} />
              </div>
              <p className="text-gray-400 font-black uppercase tracking-[0.6em] text-sm">Portfolio Archive Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {designs.map((design) => (
                <div 
                  key={design.id} 
                  className="bg-white rounded-[50px] overflow-hidden shadow-sm border border-white flex flex-col transition-all duration-700 hover:shadow-2xl relative group"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-gray-50 relative">
                    <img 
                      src={design.image} 
                      alt={design.name} 
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
                    />
                    <div className="absolute top-6 left-6">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#c9a14a] bg-white/95 backdrop-blur px-5 py-2 rounded-full border border-[#f6c1cc] shadow-sm">
                        {design.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-10 flex-grow flex flex-col bg-white">
                    <h3 className="font-bold text-[#4a2c2a] text-xl leading-tight mb-8 playfair h-14 overflow-hidden group-hover:text-[#c9a14a] transition-colors">{design.name}</h3>
                    
                    <div className="mt-auto pt-8 border-t border-[#fff7f9] flex items-center justify-between">
                      <div className="mono text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                        VAULT_{String(design.id).slice(-4)}
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if(design.id) handleDelete(design.id);
                        }}
                        className="px-8 py-3 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageGallery;