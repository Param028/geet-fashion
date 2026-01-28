import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { storage } from '../services/storage';
import { CATEGORIES } from '../constants';
import { Category, Design } from '../types';
import { IconCamera } from '../components/BoutiqueIcons';

const AdminUpload: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.BLOUSE);
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setStatus('Please select an image');
      return;
    }

    setIsUploading(true);
    setStatus('Processing...');

    try {
      let finalImageUrl = imagePreview;

      // If connected to Cloud, upload the raw file to Bucket
      if (storage.isCloud() && imageFile) {
        setStatus('Uploading high-res image to cloud...');
        finalImageUrl = await storage.uploadImage(imageFile);
      } else {
        // Fallback for local storage (Base64)
        if (storage.isCloud()) {
           console.warn("Cloud connected but no file object found, using Base64 fallback");
        }
      }

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
      setImageFile(null);
      setStatus('Design uploaded successfully!');
      setTimeout(() => setStatus(''), 3000);

    } catch (error: any) {
      console.error(error);
      setStatus(`Error: ${error.message || 'Upload failed'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex bg-[#fff7f9] min-h-screen">
      <AdminSidebar />
      <div className="flex-1 md:pl-80 p-8 md:p-12 lg:p-16">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-bold playfair text-[#4a2c2a]">Upload Boutique Piece</h1>
            <p className="text-gray-400 font-medium mt-2">Publish your latest design masterpieces to the digital portfolio vault.</p>
          </header>

          <div className="bg-white p-12 md:p-16 rounded-[60px] shadow-sm border border-[#f6c1cc]">
            <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-2 gap-20">
              <div className="space-y-8">
                <div>
                  <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-6">Visual Presentation</label>
                  <div 
                    className={`border-4 border-dashed rounded-[50px] aspect-square flex flex-col items-center justify-center p-8 transition-all relative group overflow-hidden ${
                      imagePreview ? 'border-[#c9a14a] bg-white' : 'border-[#f6c1cc] bg-[#fff7f9] hover:bg-[#f6c1cc]/10'
                    }`}
                  >
                    {imagePreview ? (
                      <div className="w-full h-full relative">
                        <img src={imagePreview} className="w-full h-full object-contain rounded-[40px]" alt="Preview" />
                        <button 
                          type="button" 
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          className="absolute top-6 right-6 bg-red-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-10 font-bold text-xl"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                        <div className="text-[#c9a14a] mb-8 scale-150 opacity-40">
                          <IconCamera size={64} />
                        </div>
                        <span className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] text-center leading-relaxed">
                          Drag & Drop or <br/>
                          <span className="text-[#c9a14a] mt-2 block border-b-2 border-[#c9a14a]/20">Select Frame</span>
                        </span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-12 flex flex-col justify-center">
                <div>
                  <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">Stitch Identity / Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/50 rounded-[28px] px-10 py-6 focus:outline-none focus:border-[#c9a14a] focus:ring-8 focus:ring-[#c9a14a]/5 transition-all font-bold text-[#4a2c2a] text-lg"
                    placeholder="e.g. Maharani Bridal Zardosi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">Boutique Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/50 rounded-[28px] px-10 py-6 focus:outline-none focus:border-[#c9a14a] focus:ring-8 focus:ring-[#c9a14a]/5 transition-all font-bold text-[#4a2c2a] appearance-none text-lg cursor-pointer"
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
                    className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/50 rounded-[28px] px-10 py-8 focus:outline-none focus:border-[#c9a14a] focus:ring-8 focus:ring-[#c9a14a]/5 transition-all font-medium text-[#4a2c2a] leading-relaxed"
                    placeholder="Detail the fabric, embroidery, and design inspiration..."
                    required
                  />
                </div>

                {status && (
                  <div className={`p-6 rounded-[24px] text-center font-black text-xs uppercase tracking-[0.4em] border ${status.includes('successfully') ? 'bg-green-50 text-green-700 border-green-100' : status.includes('Uploading') || status.includes('Processing') ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {status}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isUploading}
                  className={`w-full text-white py-8 rounded-[28px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all transform ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4a2c2a] hover:bg-[#c9a14a] hover:-translate-y-1 active:scale-95'}`}
                >
                  {isUploading ? 'Uploading to Vault...' : 'Publish To Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;