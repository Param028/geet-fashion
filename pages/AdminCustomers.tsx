import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { storage } from '../services/storage';
import { Customer, Measurement } from '../types';
import { Link } from 'react-router-dom';
import { IconSearch, IconMannequin } from '../components/BoutiqueIcons';

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [status, setStatus] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [measurements, setMeasurements] = useState<Measurement>({
    chest: '', bust: '', waist: '', lowerBelly: '',
    sleeveLength: '', neckDepth: '', shoulder: '', wrist: '', ankle: '',
    blouseLength: '', fullLength: '', notes: '', dateSaved: '', dueDate: '',
    isSubmitted: false,
    isPaymentDone: false
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await storage.getCustomers();
    setCustomers(data);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const customerId = Date.now().toString();
    const finalMeasurements: Measurement = {
      ...measurements,
      dateSaved: new Date().toISOString()
    };
    const newCustomer: Customer = {
      id: customerId,
      name,
      phone,
      measurements: finalMeasurements,
      preferredDesigns: []
    };
    await storage.saveCustomer(newCustomer);
    await loadCustomers();
    setName('');
    setPhone('');
    setMeasurements({
      chest: '', bust: '', waist: '', lowerBelly: '',
      sleeveLength: '', neckDepth: '', shoulder: '', wrist: '', ankle: '',
      blouseLength: '', fullLength: '', notes: '', dateSaved: '', dueDate: '',
      isSubmitted: false,
      isPaymentDone: false
    });
    setIsAdding(false);
    setStatus('Client registry updated.');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Permanently remove this customer record?')) {
      await storage.deleteCustomer(id);
      await loadCustomers();
    }
  };

  const measurementFields = [
    { id: 'chest', label: 'Chest' },
    { id: 'bust', label: 'Bust' },
    { id: 'waist', label: 'Waist' },
    { id: 'lowerBelly', label: 'Lower Belly' },
    { id: 'sleeveLength', label: 'Sleeve Length' },
    { id: 'neckDepth', label: 'Neck Depth' },
    { id: 'shoulder', label: 'Shoulder' },
    { id: 'wrist', label: 'Wrist' },
    { id: 'ankle', label: 'Ankle' },
    { id: 'blouseLength', label: 'Blouse Length' },
    { id: 'fullLength', label: 'Full Length' }
  ];

  return (
    <div className="flex bg-[#fff7f9] min-h-screen">
      <AdminSidebar />
      {/* ADDED pt-28 for mobile */}
      <div className="flex-1 md:pl-80 p-6 pt-28 md:p-12 md:pt-12 lg:p-16">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[50px] border border-[#f6c1cc] shadow-sm">
            <div className="md:text-left">
              <h1 className="text-4xl font-bold playfair text-[#4a2c2a]">Client Registry</h1>
              <p className="text-gray-400 font-medium mt-2 italic">Bespoke profile management and historical dimension records.</p>
            </div>
            <div className="flex items-center gap-5 md:ml-auto">
              {status && <span className="text-green-600 font-bold text-xs bg-green-50 px-6 py-3 rounded-full border border-green-100 shadow-sm">{status}</span>}
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className={`px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all ${
                  isAdding ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-[#4a2c2a] text-white hover:bg-[#c9a14a]'
                }`}
              >
                {isAdding ? 'Close Entry' : '+ Create Record'}
              </button>
            </div>
          </header>

          {isAdding && (
            <div className="bg-white p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-sm mb-16 border border-[#f6c1cc] animate-in slide-in-from-top-6 duration-700">
              <h2 className="text-3xl font-bold text-[#4a2c2a] mb-12 playfair border-b border-[#fff7f9] pb-6">Client Onboarding</h2>
              <form onSubmit={handleAddCustomer}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
                  <div>
                    <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">Legal Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/40 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#c9a14a] focus:ring-8 focus:ring-[#c9a14a]/5 transition-all font-bold text-lg"
                      placeholder="e.g. Ananya Sharma"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">Primary Contact</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/40 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#c9a14a] focus:ring-8 focus:ring-[#c9a14a]/5 transition-all font-bold text-lg"
                      placeholder="+91"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">Target Delivery</label>
                    <input 
                      type="date" 
                      value={measurements.dueDate || ''}
                      onChange={(e) => setMeasurements({...measurements, dueDate: e.target.value})}
                      className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/40 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#c9a14a] focus:ring-8 focus:ring-[#c9a14a]/5 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="mb-12 p-8 md:p-12 bg-[#fff7f9] rounded-[40px] md:rounded-[50px] border border-[#f6c1cc]/30 shadow-inner">
                  <div className="flex items-center justify-between border-b border-[#f6c1cc] pb-6 mb-10">
                    <h3 className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-[0.5em]">Stitch Dimensions (Inches)</h3>
                    <span className="text-[10px] mono text-[#c9a14a] font-bold bg-white px-4 py-1.5 rounded-full shadow-sm border border-[#f6c1cc]">STNDRD_MEASURE</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
                    {measurementFields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-[10px] font-black text-[#c9a14a] uppercase mb-3 tracking-widest">{field.label}</label>
                        <input 
                          type="text" 
                          value={(measurements as any)[field.id]}
                          onChange={(e) => setMeasurements({...measurements, [field.id]: e.target.value})}
                          className="w-full bg-white border-2 border-[#f6c1cc]/50 rounded-2xl px-5 py-4 text-base font-bold focus:ring-8 focus:ring-[#c9a14a]/5 focus:border-[#c9a14a] outline-none transition-all"
                          placeholder="--"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="bg-[#4a2c2a] text-white px-20 py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:bg-[#c9a14a] transition-all transform hover:-translate-y-1 active:scale-95">
                    Commit Registry Data
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white p-8 md:p-12 rounded-[40px] md:rounded-[60px] shadow-sm border border-[#f6c1cc]">
            <div className="mb-12">
              <div className="relative group">
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[#c9a14a] transition-transform group-focus-within:scale-110">
                  <IconSearch size={28} />
                </span>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/30 rounded-[32px] pl-20 pr-10 py-6 focus:outline-none focus:border-[#c9a14a] focus:ring-8 focus:ring-[#c9a14a]/5 transition-all font-bold text-lg"
                  placeholder="Query records by name, ID or phone..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-[#fff7f9]">
                    <th className="pb-8 font-black text-[#c9a14a] text-[11px] uppercase tracking-[0.4em] px-8">Client Identity</th>
                    <th className="pb-8 font-black text-[#c9a14a] text-[11px] uppercase tracking-[0.4em] px-8">Channel Info</th>
                    <th className="pb-8 font-black text-[#c9a14a] text-[11px] uppercase tracking-[0.4em] px-8 text-right">Vault Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#fff7f9]">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="group hover:bg-[#fff7f9]/50 transition-all">
                      <td className="py-8 px-8">
                        <Link to={`/admin/customer/${customer.id}`} className="block">
                          <span className="font-bold text-[#4a2c2a] text-xl block group-hover:text-[#c9a14a] transition-colors">{customer.name}</span>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-[10px] mono text-gray-300 font-bold uppercase tracking-widest">UID_{customer.id.slice(-6)}</span>
                            {customer.measurements?.isSubmitted ? (
                              <span className="text-[9px] bg-green-50 text-green-500 px-3 py-1 rounded-full font-black tracking-widest border border-green-100 uppercase shadow-sm">✓ Archived</span>
                            ) : (
                              <span className="text-[9px] bg-amber-50 text-[#c9a14a] px-3 py-1 rounded-full font-black tracking-widest border border-amber-100 uppercase shadow-sm animate-pulse">● Active</span>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="py-8 px-8">
                        <p className="text-[#4a2c2a] font-bold text-base tracking-widest">{customer.phone}</p>
                      </td>
                      <td className="py-8 px-8 text-right space-x-10">
                        <Link 
                          to={`/admin/customer/${customer.id}`}
                          className="text-[#c9a14a] hover:text-[#4a2c2a] font-black text-[11px] uppercase tracking-[0.3em] transition-all border-b-2 border-transparent hover:border-[#4a2c2a]"
                        >
                          Access_Vault
                        </Link>
                        <button 
                          onClick={(e) => handleDelete(customer.id, e)}
                          className="text-red-200 hover:text-red-500 text-[11px] font-black uppercase tracking-[0.3em] transition-colors"
                        >
                          Purge
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-32 text-center text-gray-300 italic font-medium">
                        <div className="text-6xl mb-6 opacity-10">📂</div>
                        No records match the active query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;