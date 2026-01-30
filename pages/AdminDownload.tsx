import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { storage } from '../services/storage';
import { IconSheet, IconDownload } from '../components/BoutiqueIcons';

const AdminDownload: React.FC = () => {
  const handleDownloadJSON = async () => {
    const [designs, customers] = await Promise.all([
      storage.getDesigns(),
      storage.getCustomers()
    ]);
    const data = { designs, customers };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Geet_Fashion_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleDownloadCSV = async () => {
    const customers = await storage.getCustomers();
    let csv = 'Name,Phone,Chest,Bust,Waist,Lower Belly,Sleeve Length,Neck Depth,Shoulder,Wrist,Ankle,Blouse Length,Full Length,Notes\n';
    customers.forEach(c => {
      const m = c.measurements;
      csv += `"${c.name}","${c.phone}","${m?.chest || ''}","${m?.bust || ''}","${m?.waist || ''}","${m?.lowerBelly || ''}","${m?.sleeveLength || ''}","${m?.neckDepth || ''}","${m?.shoulder || ''}","${m?.wrist || ''}","${m?.ankle || ''}","${m?.blouseLength || ''}","${m?.fullLength || ''}","${m?.notes?.replace(/"/g, '""') || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Geet_Customers_Data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="flex bg-[#fff7f9] min-h-screen">
      <AdminSidebar />
      {/* ADDED pt-28 for mobile */}
      <div className="flex-1 md:pl-80 p-6 pt-28 md:p-12 md:pt-12 lg:p-16">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between bg-white p-12 rounded-[60px] border border-[#f6c1cc] shadow-sm">
            <div className="md:text-left">
              <h1 className="text-4xl font-bold playfair text-[#4a2c2a]">System Vault</h1>
              <p className="text-gray-400 font-medium mt-3 italic">Archive and secure your boutique records for offline access and safety.</p>
            </div>
            <div className="mt-8 md:mt-0">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c9a14a] bg-[#fff7f9] px-6 py-2.5 rounded-full border border-[#f6c1cc] shadow-inner">Sec_Prot_Active</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-16 rounded-[60px] shadow-sm border border-[#f6c1cc] text-center hover:shadow-2xl transition-all group hover:-translate-y-1">
              <div className="text-[#c9a14a] mb-10 flex justify-center group-hover:scale-110 transition-transform duration-700">
                <IconSheet size={84} />
              </div>
              <h3 className="text-3xl font-bold text-[#4a2c2a] mb-6 playfair">Client Spreadsheet</h3>
              <p className="text-gray-400 text-base mb-12 leading-relaxed font-medium italic">
                Export a detailed CSV including all client contact details and their latest body dimensions.
              </p>
              <button 
                onClick={handleDownloadCSV}
                className="w-full bg-[#c9a14a] text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:bg-[#4a2c2a] transition-all"
              >
                Export CSV Archive
              </button>
            </div>

            <div className="bg-white p-16 rounded-[60px] shadow-sm border border-[#f6c1cc] text-center hover:shadow-2xl transition-all group hover:-translate-y-1">
              <div className="text-[#4a2c2a] mb-10 flex justify-center group-hover:scale-110 transition-transform duration-700">
                <IconDownload size={84} />
              </div>
              <h3 className="text-3xl font-bold text-[#4a2c2a] mb-6 playfair">Boutique Backup</h3>
              <p className="text-gray-400 text-base mb-12 leading-relaxed font-medium italic">
                A comprehensive JSON dump of the entire system: gallery, designs, and historical records.
              </p>
              <button 
                onClick={handleDownloadJSON}
                className="w-full bg-[#4a2c2a] text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:bg-[#c9a14a] transition-all"
              >
                Complete JSON Backup
              </button>
            </div>
          </div>

          <div className="mt-20 bg-white p-10 rounded-[45px] border-2 border-dashed border-[#f6c1cc] text-sm text-[#4a2c2a] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <IconDownload size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                 <div className="w-3 h-3 rounded-full bg-[#c9a14a] animate-pulse"></div>
                 <span className="font-black uppercase tracking-[0.5em] text-[11px] text-[#c9a14a]">Registry Security Protocol</span>
              </div>
              <p className="font-medium text-[#4a2c2a]/70 italic leading-loose text-lg max-w-4xl">
                We strongly advise performing a full system backup every 7 days. This ensures that even in case of local cache clearance or browser data reset, your design portfolio and tailored measurements remain permanently accessible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDownload;