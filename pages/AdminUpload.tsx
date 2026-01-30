import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { storage } from '../services/storage';
import { CATEGORIES } from '../constants';
import { Category, Design } from '../types';
import { IconCamera, IconSettings } from '../components/BoutiqueIcons';
import Toast, { ToastType } from '../components/Toast';

const AdminUpload: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.BLOUSE);
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: ToastType} | null>(null);
  
  const isCloudConnected = storage.isCloud();

  // Helper: Convert Data URL to Blob
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    if (!match) return null;
    const mime = match[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  };

  // Helper: Compress Image
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200; // Good quality for web
          const scaleSize = MAX_WIDTH / img.width;
          
          if (scaleSize < 1) {
             canvas.width = MAX_WIDTH;
             canvas.height = img.height * scaleSize;
          } else {
             canvas.width = img.width;
             canvas.height = img.height;
          }

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Compress to JPEG with 0.8 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file);
        setImagePreview(compressedDataUrl);
        
        // Prepare blob for upload
        const blob = dataURLtoBlob(compressedDataUrl);
        setCompressedBlob(blob);
        
      } catch (err) {
        console.error("Compression error", err);
        setToast({msg: "Image processing failed. Try another photo.", type: 'error'});
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCloudConnected) {
        setToast({msg: 'Error: System Offline. Please Connect Cloud.', type: 'error'});
        return;
    }

    if (!compressedBlob) {
      setToast({msg: 'Please select an image for the portfolio.', type: 'error'});
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. Upload the COMPRESSED image to Supabase
      const finalImageUrl = await storage.uploadImage(compressedBlob);

      // 2. Save Design Record
      const newDesign: Design = {
        id: Date.now().toString(),
        name,
        category,
        description,
        image: finalImageUrl,
        createdAt: new Date().toISOString()
      };

      await storage.saveDesign(newDesign);
      
      // Reset Form
      setName('');
      setDescription('');
      setImagePreview(null);
      setCompressedBlob(null);
      setToast({msg: 'Design successfully published to Cloud Vault!', type: 'success'});

    } catch (error: any) {
      console.error(error);
      setToast({msg: error.message || 'Upload failed due to network error.', type: 'error'});
    } finally {
      setIsUploading(false);
    }
  };

  if (!isCloudConnected) {
      return (
          <AdminLayout>
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                  <div className="bg-red-50 text-red-500 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                      <IconSettings size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-[#4a2c2a] mb-4 playfair">Connection Required</h2>
                  <p className="text-gray-500 max-w-md mb-8">
                      This system is now in <strong>Online Only</strong> mode. You must connect to the Supabase Cloud to manage your boutique portfolio.
                  </p>
                  <Link 
                    to="/admin/settings"
                    className="bg-[#4a2c2a] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#c9a14a] transition-all"
                  >
                    Configure Settings
                  </Link>
              </div>
          </AdminLayout>
      );
  }

  return (
    <AdminLayout>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-green-50 border border-green-200 rounded-3xl p-4 mb-10 flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-2"></div>
          <p className="text-green-700 text-[10px] font-black uppercase tracking-widest">
            System Online • Ready for Upload
          </p>
      </div>

      <header className="mb-12">
        <h1 className="text-4xl font-bold playfair text-[#4a2c2a]">Upload Boutique Piece</h1>
        <p className="text-gray-400 font-medium mt-2">Publish your latest design masterpieces to the digital portfolio vault.</p>
      </header>

      <div className="bg-white p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-sm border border-[#f6c1cc]">
        <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20">
          <div className="space-y-8">
            <div>
              <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-6">Visual Presentation</label>
              <div 
                className={`border-4 border-dashed rounded-[40px] w-full aspect-square max-h-[500px] flex flex-col items-center justify-center p-4 transition-all relative group overflow-hidden ${
                  imagePreview ? 'border-[#c9a14a] bg-white' : 'border-[#f6c1cc] bg-[#fff7f9] hover:bg-[#f6c1cc]/10'
                }`}
              >
                {imagePreview ? (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <img src={imagePreview} className="w-full h-full object-contain rounded-[20px]" alt="Preview" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setImagePreview(null);
                        setCompressedBlob(null);
                      }}
                      className="absolute top-4 right-4 bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-10 font-bold text-xl"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                    <div className="text-[#c9a14a] mb-6 scale-125 opacity-40">
                      <IconCamera size={64} />
                    </div>
                    <span className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] text-center leading-relaxed px-4">
                      Tap to Select <br/>
                      <span className="text-[#c9a14a] mt-2 block border-b-2 border-[#c9a14a]/20">Photo from Gallery</span>
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-10 flex flex-col justify-center">
            <div>
              <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">Stitch Identity / Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/50 rounded-[28px] px-8 py-5 focus:outline-none focus:border-[#c9a14a] focus:ring-8 focus:ring-[#c9a14a]/5 transition-all font-bold text-[#4a2c2a] text-lg"
                placeholder="e.g. Maharani Bridal Zardosi"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">Boutique Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/50 rounded-[28px] px-8 py-5 focus:outline-none focus:border-[#c9a14a] focus:ring-8 focus:ring-[#c9a14a]/5 transition-all font-bold text-[#4a2c2a] appearance-none text-lg cursor-pointer"
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">Design Narrative</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/50 rounded-[28px] px-8 py-5 focus:outline-none focus:border-[#c9a14a] focus:ring-8 focus:ring-[#c9a14a]/5 transition-all font-medium text-[#4a2c2a] leading-relaxed"
                placeholder="Detail the fabric, embroidery, and design inspiration..."
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isUploading}
              className={`w-full text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all transform ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4a2c2a] hover:bg-[#c9a14a] hover:-translate-y-1 active:scale-95'}`}
            >
              {isUploading ? 'Publishing to Cloud...' : 'Publish To Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminUpload;