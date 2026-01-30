import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { storage } from '../services/storage';
import { Design } from '../types';
import { IconHanger } from '../components/BoutiqueIcons';
import Toast, { ToastType } from '../components/Toast';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminManageGallery: React.FC = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(false);
  
  // UI State
  const [toast, setToast] = useState<{msg: string, type: ToastType} | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const showToast = (msg: string, type: ToastType) => {
    setToast({ msg, type });
  };

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await storage.getDesigns();
      setDesigns(data);
    } catch (e) {
      showToast("Unable to fetch gallery data from cloud.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await storage.deleteDesign(deleteId);
      // Optimistic update
      setDesigns(prev => prev.filter(d => String(d.id) !== String(deleteId)));
      showToast('Masterpiece removed from public portfolio.', 'success');
    } catch (err) {
      showToast('Delete operation failed. Check connection.', 'error');
      await loadGallery(); // Revert on failure
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      <ConfirmationModal 
        isOpen={!!deleteId}
        title="Delete Masterpiece?"
        message="This design will be permanently removed from the public gallery and all associated image data will be destroyed."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Remove Design"
        isDangerous={true}
      />

      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[50px] border border-[#f6c1cc] shadow-sm">
        <div>
          <h1 className="text-4xl font-bold playfair text-[#4a2c2a]">Gallery Curation</h1>
          <p className="text-gray-400 font-medium italic mt-2">Manage and refine your public design portfolio and presence.</p>
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
              
              <div className="p-8 flex-grow flex flex-col bg-white">
                <h3 className="font-bold text-[#4a2c2a] text-xl leading-tight mb-8 playfair h-14 overflow-hidden group-hover:text-[#c9a14a] transition-colors">{design.name}</h3>
                
                <div className="mt-auto pt-6 border-t border-[#fff7f9] flex items-center justify-between gap-4">
                  <div className="mono text-[9px] text-gray-300 font-bold uppercase tracking-widest truncate">
                    ID_{String(design.id).slice(-4)}
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if(design.id) handleDeleteClick(design.id);
                    }}
                    className="px-6 py-2 bg-red-50 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminManageGallery;