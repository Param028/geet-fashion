import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CREDENTIALS } from '../constants';
import { storage } from '../services/storage';
import { IconLock } from '../components/BoutiqueIcons';

const AdminLogin: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
      storage.setAuth({ isLoggedIn: true, adminId: id });
      navigate('/admin');
    } else {
      setError('Invalid ID or Password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-10 rounded-[40px] shadow-xl border border-[#f6c1cc]">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#f6c1cc]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#c9a14a]">
            <IconLock size={36} />
          </div>
          <h1 className="text-3xl font-bold playfair text-[#4a2c2a]">Admin Access</h1>
          <p className="text-gray-400 text-sm mt-2 italic">Secure Login for Geet Fashion Management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#4a2c2a] mb-2">Admin ID</label>
            <input 
              type="text" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full bg-[#fff7f9] border border-[#f6c1cc] rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#c9a14a]/50"
              placeholder="Enter your ID"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4a2c2a] mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#fff7f9] border border-[#f6c1cc] rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#c9a14a]/50"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-[#4a2c2a] text-white py-4 rounded-2xl font-bold hover:bg-[#c9a14a] transition-all shadow-lg active:scale-95"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;