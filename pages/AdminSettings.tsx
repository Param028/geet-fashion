import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { storage } from '../services/storage';
import { IconSettings } from '../components/BoutiqueIcons';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminSettings: React.FC = () => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isCloud, setIsCloud] = useState(false);
  const [isHardcoded, setIsHardcoded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setIsCloud(storage.isCloud());
    setIsHardcoded(storage.isConfiguredViaCode());
    const config = storage.getCloudConfig();
    if (config) {
      setUrl(config.url || '');
      setKey(config.key || '');
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
        message="Saving these settings here only updates THIS device's browser. For permanent cross-device access (Phones/Tablets), please update constants.tsx instead."
        onConfirm={confirmSave}
        onCancel={() => setShowConfirm(false)}
        confirmText="Save to Browser Only"
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
                {isCloud ? '● Active' : '○ Disconnected'}
              </p>
            </div>
          </div>

          <div className="bg-[#fff7f9] border border-[#f6c1cc] rounded-3xl p-8 mb-10">
            <h4 className="text-[#4a2c2a] font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c9a14a]"></span>
                Connection Instructions
            </h4>
            <ol className="list-decimal list-inside text-sm text-gray-500 space-y-4 leading-relaxed font-medium marker:text-[#c9a14a] marker:font-bold">
              <li>Log in to your <strong>Supabase Dashboard</strong>.</li>
              <li>Navigate to <strong>Project Settings (Gear Icon)</strong> &rarr; <strong>API</strong>.</li>
              <li>Copy the <strong>Project URL</strong> and the <strong>anon public key</strong>.</li>
              <li>
                 <strong>Recommended:</strong> Open <code>constants.tsx</code> in your code editor and paste these values into the <code>SUPABASE_CONFIG</code> object.
                 <p className="text-xs text-[#c9a14a] mt-1 ml-5 font-bold uppercase tracking-wider">✓ Enables Mobile Access</p>
              </li>
              <li>
                 <strong>Alternative:</strong> Paste them below (Only works on this browser).
              </li>
            </ol>
            <a 
              href="https://supabase.com/dashboard/project/_/settings/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-[10px] font-black uppercase tracking-[0.2em] bg-[#4a2c2a] text-white px-6 py-3 rounded-xl hover:bg-[#c9a14a] transition-all shadow-md group"
            >
              <span>Open Supabase Settings</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          {isHardcoded ? (
             <div className="bg-green-50 border border-green-200 rounded-3xl p-6 mb-8">
                <p className="text-green-800 font-bold text-sm mb-2">✓ Configured via Code</p>
                <p className="text-green-700 text-xs">Your credentials are loaded from <code>constants.tsx</code>. Your app is now ready for cross-device usage. You do not need to edit settings here.</p>
             </div>
          ) : (
            <form onSubmit={handleSaveClick} className="space-y-6 opacity-100">
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
                Connect (This Device Only)
              </button>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;