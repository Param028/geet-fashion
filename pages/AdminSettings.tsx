import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { storage } from '../services/storage';
import { IconSettings } from '../components/BoutiqueIcons';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminSettings: React.FC = () => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isCloud, setIsCloud] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setIsCloud(storage.isCloud());
    const config = storage.getCloudConfig();
    if (config) {
      setUrl(config.url);
      setKey(config.key);
    }
  }, []);

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && key) {
      setShowConfirm(true);
    }
  };

  const confirmSave = () => {
    storage.saveCloudConfig(url, key);
    setShowConfirm(false);
  };

  return (
    <AdminLayout>
      <ConfirmationModal
        isOpen={showConfirm}
        title="Reconfigure System?"
        message="Saving these settings will reload the application to establish a secure connection with the new cloud endpoints."
        onConfirm={confirmSave}
        onCancel={() => setShowConfirm(false)}
        confirmText="Connect & Reload"
      />

      <header className="mb-12">
        <h1 className="text-4xl font-bold playfair text-[#4a2c2a]">System Configuration</h1>
        <p className="text-gray-400 font-medium mt-2">Manage cloud connectivity and storage drivers.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-12 rounded-[50px] shadow-sm border border-[#f6c1cc]">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCloud ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
               <IconSettings />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#4a2c2a]">Cloud Storage Connection</h3>
              <p className={`text-xs font-black uppercase tracking-widest ${isCloud ? 'text-green-500' : 'text-red-400'}`}>
                {isCloud ? '● Active' : '○ Disconnected (Local Mode)'}
              </p>
            </div>
          </div>

          <p className="text-gray-500 mb-8 leading-relaxed text-sm">
            To enable cross-device image visibility (so customers can see photos on their phones), you must connect a Supabase project.
            <br/><br/>
            <strong>Instructions:</strong>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Create a free project at <a href="https://supabase.com" target="_blank" className="text-[#c9a14a] underline">supabase.com</a></li>
              <li>Go to Project Settings -&gt; API</li>
              <li>Copy the <strong>Project URL</strong> and <strong>anon public key</strong> below.</li>
              <li>Create a storage bucket named <code>designs</code> and set it to Public.</li>
            </ol>
          </p>

          <form onSubmit={handleSaveClick} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-[#c9a14a] uppercase tracking-[0.3em] mb-2">Supabase Project URL</label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#fff7f9] border border-[#f6c1cc] rounded-xl px-4 py-3 font-mono text-sm focus:border-[#c9a14a] outline-none"
                placeholder="https://xyz.supabase.co"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#c9a14a] uppercase tracking-[0.3em] mb-2">Supabase Anon Key</label>
              <input 
                type="password" 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-[#fff7f9] border border-[#f6c1cc] rounded-xl px-4 py-3 font-mono text-sm focus:border-[#c9a14a] outline-none"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#4a2c2a] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#c9a14a] transition-all"
            >
              Connect & Reload System
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;