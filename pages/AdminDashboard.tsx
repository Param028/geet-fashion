import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { storage } from '../services/storage';
import { Link } from 'react-router-dom';
import { Design, Customer } from '../types';
import LightRays from '../components/LightRays';
import * as Icons from '../components/BoutiqueIcons';
import Toast, { ToastType } from '../components/Toast';

const AdminDashboard: React.FC = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: ToastType} | null>(null);

  const loadData = async () => {
    try {
      const [d, c] = await Promise.all([
        storage.getDesigns(),
        storage.getCustomers()
      ]);
      setDesigns(d);
      setCustomers(c);
    } catch (e) {
      setToast({msg: "Failed to load dashboard data. Check connection.", type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    { label: 'Total Designs', value: designs.length, icon: <Icons.IconHanger size={32} />, color: 'bg-blue-50 text-blue-500 border-blue-100' },
    { label: 'Total Customers', value: customers.length, icon: <Icons.IconMannequin size={32} />, color: 'bg-pink-50 text-[#f6c1cc] border-pink-100' },
    { label: 'Total Measurements', value: customers.filter(c => c.measurements).length, icon: <Icons.IconTape size={32} />, color: 'bg-amber-50 text-[#c9a14a] border-amber-100' },
  ];

  const urgentDeliveries = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limitDate = new Date();
    limitDate.setDate(today.getDate() + 5);
    limitDate.setHours(23, 59, 59, 999);

    return customers.filter(c => {
      if (!c.measurements?.dueDate || c.measurements?.isSubmitted) return false;
      const dueDate = new Date(c.measurements.dueDate);
      return dueDate >= today && dueDate <= limitDate;
    }).sort((a, b) => {
      const dateA = new Date(a.measurements!.dueDate!).getTime();
      const dateB = new Date(b.measurements!.dueDate!).getTime();
      return dateA - dateB;
    });
  }, [customers]);

  const handleMarkSubmitted = async (e: React.MouseEvent, customer: Customer) => {
    e.preventDefault();
    e.stopPropagation();
    if (customer.measurements) {
      try {
        const updatedCustomer: Customer = {
          ...customer,
          measurements: {
            ...customer.measurements,
            isSubmitted: true
          }
        };
        await storage.saveCustomer(updatedCustomer);
        setToast({msg: "Order marked as Delivered.", type: 'success'});
        await loadData();
      } catch(err) {
        setToast({msg: "Update failed.", type: 'error'});
      }
    }
  };

  const handleMarkPaymentDone = async (e: React.MouseEvent, customer: Customer) => {
    e.preventDefault();
    e.stopPropagation();
    if (customer.measurements) {
      try {
        const updatedCustomer: Customer = {
          ...customer,
          measurements: {
            ...customer.measurements,
            isPaymentDone: true
          }
        };
        await storage.saveCustomer(updatedCustomer);
        setToast({msg: "Payment confirmed.", type: 'success'});
        await loadData();
      } catch(err) {
        setToast({msg: "Update failed.", type: 'error'});
      }
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin text-4xl text-[#c9a14a]">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
           </svg>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <LightRays color="#f6c1cc" intensity={0.15} speed={80} />
      
      <div className="relative z-10">
        <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-10 rounded-[50px] border border-[#f6c1cc] shadow-sm gap-6">
          <div>
            <h1 className="text-4xl font-bold playfair text-[#4a2c2a]">System Dashboard</h1>
            <p className="text-gray-400 font-medium italic mt-2">Boutique performance and real-time operational metrics.</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {storage.isCloud() ? (
              <div className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm bg-green-100 text-green-600 border border-green-200">
                ● Online
              </div>
            ) : (
              <Link to="/admin/settings" className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm bg-red-100 text-red-600 border border-red-200 animate-pulse hover:bg-red-200 transition-colors">
                ⚠️ Connect Cloud
              </Link>
            )}
            <p className="text-[10px] mono text-[#c9a14a] font-bold">STITCH_V.2.0.0</p>
          </div>
        </header>

        {urgentDeliveries.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xs font-black text-[#c9a14a] uppercase tracking-[0.5em] mb-10 flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              Priority Deliveries Required
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {urgentDeliveries.map(customer => {
                const dueDate = new Date(customer.measurements!.dueDate!);
                const diffDays = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <Link 
                    key={customer.id} 
                    to={`/admin/customer/${customer.id}`}
                    className="bg-white p-10 rounded-[45px] border-l-[12px] border-[#c9a14a] shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden border border-[#f6c1cc]"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="font-bold text-[#4a2c2a] text-2xl leading-tight mb-2 group-hover:text-[#c9a14a] transition-colors">{customer.name}</p>
                        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">{customer.phone}</p>
                      </div>
                      <span className="bg-red-50 text-red-500 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-red-100">
                        {diffDays === 0 ? 'Today' : `${diffDays} Days`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-auto gap-4 pt-6 border-t border-[#fff7f9]">
                      <div className="text-[10px] font-bold text-[#c9a14a] mono uppercase tracking-widest">Target: {customer.measurements!.dueDate}</div>
                      <div className="flex gap-3">
                        {!customer.measurements?.isPaymentDone && (
                          <button onClick={(e) => handleMarkPaymentDone(e, customer)} className="bg-amber-500 text-white w-10 h-10 rounded-xl shadow-sm hover:bg-amber-600 transition-colors flex items-center justify-center text-lg">💰</button>
                        )}
                        <button onClick={(e) => handleMarkSubmitted(e, customer)} className="bg-[#4a2c2a] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c9a14a] transition-all">Deliver</button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-10 rounded-[50px] shadow-sm border border-[#f6c1cc] flex items-center gap-10 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className={`${stat.color} w-24 h-24 rounded-[32px] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform border`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-bold tracking-[0.3em] uppercase mb-2">{stat.label}</p>
                <p className="text-6xl font-black text-[#4a2c2a]">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <div className="bg-white p-12 rounded-[60px] shadow-sm border border-[#f6c1cc]">
            <h2 className="text-2xl font-bold text-[#4a2c2a] mb-10 flex justify-between items-center playfair">
              Recent Design Uploads
              <span className="text-[9px] text-[#c9a14a] font-black uppercase tracking-[0.3em] bg-[#fff7f9] px-4 py-2 rounded-full border border-[#f6c1cc]">Portfolio Archive</span>
            </h2>
            <div className="space-y-6">
              {designs.slice(0, 5).map(design => (
                <div key={design.id} className="flex items-center gap-6 p-5 hover:bg-[#fff7f9] rounded-[32px] transition-all border border-transparent hover:border-[#f6c1cc]/20 group">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-gray-100 shrink-0">
                    <img src={design.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#4a2c2a] text-lg truncate group-hover:text-[#c9a14a] transition-colors">{design.name}</p>
                    <p className="text-xs text-[#c9a14a] font-black uppercase tracking-widest">{design.category}</p>
                  </div>
                  <span className="text-[10px] text-gray-300 font-bold mono shrink-0">{new Date(design.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {designs.length === 0 && <p className="text-gray-300 italic text-sm text-center py-20">No boutique pieces found in cloud.</p>}
            </div>
          </div>

          <div className="bg-white p-12 rounded-[60px] shadow-sm border border-[#f6c1cc]">
            <h2 className="text-2xl font-bold text-[#4a2c2a] mb-10 flex justify-between items-center playfair">
              Client Onboarding Feed
              <span className="text-[9px] text-[#c9a14a] font-black uppercase tracking-[0.3em] bg-[#fff7f9] px-4 py-2 rounded-full border border-[#f6c1cc]">Client Vault</span>
            </h2>
            <div className="space-y-5">
              {customers.slice(-5).reverse().map(customer => (
                <Link key={customer.id} to={`/admin/customer/${customer.id}`} className="flex items-center justify-between p-6 bg-[#fff7f9]/50 rounded-[32px] hover:shadow-xl hover:bg-white transition-all border border-[#f6c1cc]/10 hover:border-[#f6c1cc]/40 group">
                  <div className="min-w-0">
                    <p className="font-bold text-[#4a2c2a] text-xl group-hover:text-[#c9a14a] transition-colors truncate">{customer.name}</p>
                    <p className="text-xs text-gray-400 tracking-widest font-bold uppercase mt-1">{customer.phone}</p>
                  </div>
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-[#f6c1cc] shadow-sm text-[#c9a14a] group-hover:bg-[#4a2c2a] group-hover:text-white transition-all shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </Link>
              ))}
              {customers.length === 0 && <p className="text-gray-300 italic text-sm text-center py-20">No client records found in cloud.</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;