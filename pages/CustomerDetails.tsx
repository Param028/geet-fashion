import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { storage } from '../services/storage';
import { Customer, Measurement, Category, PreferredDesign } from '../types';
import { CATEGORIES } from '../constants';
import Toast, { ToastType } from '../components/Toast';

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Base Customer State
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [toast, setToast] = useState<{msg: string, type: ToastType} | null>(null);
  
  const [activeTab, setActiveTab] = useState<'measurements' | 'preferred'>('measurements');
  const [isEditing, setIsEditing] = useState(false);
  
  // Measurement State
  const [measurements, setMeasurements] = useState<Measurement>({
    blouseLength: '', dressLength: '',
    chest: '', waistRound: '', waistHeight: '', seatRound: '', tuksPoint: '',
    sleeveLength: '', armRound: '', armhole: '', shoulder: '',
    frontNeck: '', backNeck: '',
    notes: '', dateSaved: '', dueDate: '',
    isSubmitted: false,
    isPaymentDone: false
  });

  // Preferred Design State
  const [prefImage, setPrefImage] = useState<string | null>(null);
  const [prefCat, setPrefCat] = useState<Category>(Category.BLOUSE);
  const [prefNotes, setPrefNotes] = useState('');

  const loadData = async () => {
    try {
      const allCustomers = await storage.getCustomers();
      const cust = allCustomers.find(c => c.id === id);
      if (cust) {
        setCustomer(cust);
        setCustName(cust.name);
        setCustPhone(cust.phone);
        if (cust.measurements) {
          setMeasurements({
            blouseLength: cust.measurements.blouseLength || '',
            dressLength: cust.measurements.dressLength || '',
            chest: cust.measurements.chest || '',
            waistRound: cust.measurements.waistRound || '',
            waistHeight: cust.measurements.waistHeight || '',
            seatRound: cust.measurements.seatRound || '',
            tuksPoint: cust.measurements.tuksPoint || '',
            sleeveLength: cust.measurements.sleeveLength || '',
            armRound: cust.measurements.armRound || '',
            armhole: cust.measurements.armhole || '',
            shoulder: cust.measurements.shoulder || '',
            frontNeck: cust.measurements.frontNeck || '',
            backNeck: cust.measurements.backNeck || '',
            notes: cust.measurements.notes || '',
            dateSaved: cust.measurements.dateSaved || '',
            dueDate: cust.measurements.dueDate || '',
            isSubmitted: cust.measurements.isSubmitted || false,
            isPaymentDone: cust.measurements.isPaymentDone || false
          });
        }
      } else {
        navigate('/admin/customers');
      }
    } catch(e) {
      setToast({msg: "Failed to load customer profile.", type: 'error'});
    }
  };

  useEffect(() => {
    loadData();
  }, [id, navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    try {
      const finalMeasurements = {
        ...measurements,
        dateSaved: new Date().toISOString()
      };

      const updatedCustomer: Customer = {
        ...customer,
        name: custName,
        phone: custPhone,
        measurements: finalMeasurements
      };

      await storage.saveCustomer(updatedCustomer);
      setCustomer(updatedCustomer);
      setIsEditing(false);
      setToast({msg: "Profile synced with vault.", type: 'success'});
    } catch (e) {
      setToast({msg: "Save failed. Check network.", type: 'error'});
    }
  };

  const toggleSubmissionStatus = async () => {
    if (!customer || !customer.measurements) return;
    try {
      const updatedStatus = !measurements.isSubmitted;
      const finalMeasurements = {
        ...measurements,
        isSubmitted: updatedStatus,
        dateSaved: new Date().toISOString()
      };
      const updatedCustomer: Customer = {
        ...customer,
        measurements: finalMeasurements
      };
      await storage.saveCustomer(updatedCustomer);
      setMeasurements(finalMeasurements);
      setCustomer(updatedCustomer);
      setToast({msg: "Order status updated.", type: 'success'});
    } catch (e) {
      setToast({msg: "Update failed.", type: 'error'});
    }
  };

  const togglePaymentStatus = async () => {
    if (!customer || !customer.measurements) return;
    try {
      const updatedStatus = !measurements.isPaymentDone;
      const finalMeasurements = {
        ...measurements,
        isPaymentDone: updatedStatus,
        dateSaved: new Date().toISOString()
      };
      const updatedCustomer: Customer = {
        ...customer,
        measurements: finalMeasurements
      };
      await storage.saveCustomer(updatedCustomer);
      setMeasurements(finalMeasurements);
      setCustomer(updatedCustomer);
      setToast({msg: "Payment status updated.", type: 'success'});
    } catch (e) {
      setToast({msg: "Update failed.", type: 'error'});
    }
  };

  const handleUploadPreferred = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !prefImage) return;

    try {
      const newPref: PreferredDesign = {
        id: Date.now().toString(),
        image: prefImage,
        category: prefCat,
        notes: prefNotes
      };

      const updatedCustomer: Customer = {
        ...customer,
        preferredDesigns: [newPref, ...customer.preferredDesigns]
      };
      await storage.saveCustomer(updatedCustomer);
      setCustomer(updatedCustomer);
      setPrefImage(null);
      setPrefNotes('');
      setToast({msg: "Reference image stored.", type: 'success'});
    } catch (e) {
      setToast({msg: "Upload failed.", type: 'error'});
    }
  };

  const deletePreferred = async (prefId: string) => {
    if (!customer) return;
    try {
      const updated = customer.preferredDesigns.filter(p => p.id !== prefId);
      const updatedCustomer = { ...customer, preferredDesigns: updated };
      await storage.saveCustomer(updatedCustomer);
      setCustomer(updatedCustomer);
      setToast({msg: "Reference removed.", type: 'success'});
    } catch (e) {
      setToast({msg: "Delete failed.", type: 'error'});
    }
  };

  const fields = [
    { id: 'blouseLength', label: 'Blouse Height' },
    { id: 'dressLength', label: 'Dress Height' },
    { id: 'chest', label: 'Chest' },
    { id: 'waistRound', label: 'Waist Round' },
    { id: 'waistHeight', label: 'Waist Height' },
    { id: 'seatRound', label: 'Seat Round' },
    { id: 'sleeveLength', label: 'Sleeves Height' },
    { id: 'armRound', label: 'Arm Round' },
    { id: 'armhole', label: 'Armhole' },
    { id: 'shoulder', label: 'Shoulder' },
    { id: 'frontNeck', label: 'Front Neck' },
    { id: 'backNeck', label: 'Back Neck' },
    { id: 'tuksPoint', label: 'Tuks Point' },
  ];

  if (!customer) return null;

  return (
    <AdminLayout>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[50px] border border-[#f6c1cc] shadow-sm">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate('/admin/customers')} 
            className="w-14 h-14 rounded-full bg-white shadow-xl border border-[#f6c1cc] flex items-center justify-center hover:bg-[#c9a14a] hover:text-white hover:border-[#c9a14a] transition-all text-[#4a2c2a] font-bold text-xl"
          >
            ←
          </button>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="text-4xl font-bold playfair text-[#4a2c2a] bg-white border-b-4 border-[#c9a14a] focus:outline-none px-4 py-1"
                  />
                  <input 
                    type="tel" 
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="text-gray-400 font-bold bg-white border-b-2 border-[#f6c1cc] focus:outline-none px-4 py-1 text-base tracking-widest"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold playfair text-[#4a2c2a]">{customer.name}</h1>
                  <div className="flex gap-3">
                    {measurements.isSubmitted && (
                      <span className="bg-green-100 text-green-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-green-200 shadow-sm">
                        ✓ Delivered
                      </span>
                    )}
                    {measurements.isPaymentDone ? (
                      <span className="bg-[#c9a14a]/10 text-[#c9a14a] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-[#c9a14a]/30 shadow-sm">
                        💰 Paid
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-red-100 shadow-sm">
                        ⏳ Unpaid
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            {!isEditing && <p className="text-gray-400 font-medium tracking-widest text-sm italic uppercase">Registry Contact: {customer.phone}</p>}
          </div>
        </div>
        <div className="flex items-center gap-5">
           <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-10 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl border-2 ${
                isEditing 
                  ? 'bg-red-50 text-red-500 border-red-200 shadow-inner' 
                  : 'bg-[#4a2c2a] text-white border-[#4a2c2a] hover:bg-[#c9a14a]'
              }`}
           >
             {isEditing ? 'Discard' : 'Modify Record'}
           </button>
        </div>
      </header>

      <div className="flex gap-6 mb-12 overflow-x-auto pb-4">
        <button 
          onClick={() => setActiveTab('measurements')}
          className={`px-10 py-5 rounded-[30px] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-sm whitespace-nowrap ${activeTab === 'measurements' ? 'bg-[#c9a14a] text-white shadow-2xl scale-105' : 'bg-white text-gray-400 border-2 border-[#f6c1cc] hover:border-[#c9a14a] hover:text-[#c9a14a]'}`}
        >
          Body Dimensions
        </button>
        <button 
          onClick={() => setActiveTab('preferred')}
          className={`px-10 py-5 rounded-[30px] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-sm whitespace-nowrap ${activeTab === 'preferred' ? 'bg-[#c9a14a] text-white shadow-2xl scale-105' : 'bg-white text-gray-400 border-2 border-[#f6c1cc] hover:border-[#c9a14a] hover:text-[#c9a14a]'}`}
        >
          Design Notes
        </button>
      </div>

      {activeTab === 'measurements' ? (
        <div className="bg-white p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-sm border border-[#f6c1cc] relative overflow-hidden">
          {isEditing && (
            <div className="absolute top-0 left-0 w-full h-2 bg-[#c9a14a] animate-pulse"></div>
          )}
          
          {!customer.measurements && !isEditing ? (
            <div className="text-center py-32">
              <div className="text-8xl mb-10 opacity-10">📏</div>
              <h3 className="text-2xl font-bold text-[#4a2c2a] mb-6 playfair">Empty Tailoring Profile</h3>
              <p className="text-gray-400 mb-12 max-w-sm mx-auto italic font-medium">This customer has no historical tailoring data recorded in the system.</p>
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-[#c9a14a] text-white px-12 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-[#4a2c2a] transition-all"
              >
                Initialize Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b-2 border-[#fff7f9] flex-wrap gap-6">
                <h3 className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-[0.5em]">Dimension Archive Vault</h3>
                <div className="flex gap-4 flex-wrap">
                  <button 
                    type="button"
                    onClick={togglePaymentStatus}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border-2 ${
                      measurements.isPaymentDone 
                        ? 'bg-[#c9a14a]/10 text-[#c9a14a] border-[#c9a14a]/40 shadow-inner' 
                        : 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    {measurements.isPaymentDone ? '💰 Payment Settled' : '⚠️ Pending Payment'}
                  </button>
                  <button 
                    type="button"
                    onClick={toggleSubmissionStatus}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border-2 ${
                      measurements.isSubmitted 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : 'bg-[#4a2c2a] text-white border-[#4a2c2a] hover:bg-[#c9a14a]'
                    }`}
                  >
                    {measurements.isSubmitted ? '✓ Delivered to Client' : 'Confirm Dispatch'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10 mb-16">
                <div className="col-span-2 xl:col-span-2">
                  <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">Target Deadline</label>
                  <input 
                    type="date" 
                    disabled={!isEditing}
                    value={measurements.dueDate || ''}
                    onChange={(e) => setMeasurements({...measurements, dueDate: e.target.value})}
                    className={`w-full bg-[#fff7f9] border-2 rounded-2xl px-6 py-5 focus:outline-none transition-all ${
                      isEditing 
                        ? 'border-[#c9a14a] bg-white ring-8 ring-[#c9a14a]/5' 
                        : 'border-transparent opacity-80 cursor-not-allowed font-bold text-lg'
                    }`}
                  />
                </div>
                {fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">{field.label}</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={(measurements as any)[field.id] || ''}
                      onChange={(e) => setMeasurements({...measurements, [field.id]: e.target.value})}
                      className={`w-full bg-[#fff7f9] border-2 rounded-2xl px-6 py-5 focus:outline-none transition-all text-center ${
                        isEditing 
                          ? 'border-[#c9a14a] bg-white ring-8 ring-[#c9a14a]/5' 
                          : 'border-transparent opacity-80 cursor-not-allowed font-black text-xl text-[#4a2c2a]'
                      }`}
                      placeholder="--"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-16">
                <label className="block text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4">Bespoke Specifications</label>
                <textarea 
                  disabled={!isEditing}
                  value={measurements.notes || ''}
                  onChange={(e) => setMeasurements({...measurements, notes: e.target.value})}
                  className={`w-full bg-[#fff7f9] border-2 rounded-[40px] px-10 py-8 focus:outline-none min-h-[220px] transition-all leading-loose text-lg ${
                    isEditing 
                      ? 'border-[#c9a14a] bg-white ring-8 ring-[#c9a14a]/5' 
                      : 'border-transparent opacity-80 cursor-not-allowed font-medium italic'
                  }`}
                  placeholder="Specific design requests, fabric choices, and stitching patterns for this client..."
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between border-t-2 border-[#fff7f9] pt-12 gap-8">
                <div className="flex items-center gap-6">
                  <div className={`w-4 h-4 rounded-full ${measurements.dateSaved ? 'bg-green-400' : 'bg-gray-200'} shadow-inner`}></div>
                  <p className="text-[11px] text-gray-400 mono font-black uppercase tracking-[0.4em]">
                    {measurements.dateSaved 
                      ? `STAMPED_RECORD: ${new Date(measurements.dateSaved).toLocaleString()}` 
                      : 'AWAITING_CLOUD_SYNC'}
                  </p>
                </div>
                {isEditing && (
                  <button 
                    type="submit" 
                    className="w-full md:w-auto bg-[#4a2c2a] text-white px-24 py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:bg-[#c9a14a] transition-all transform hover:-translate-y-1 active:scale-95"
                  >
                    Commit Updates to Vault
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-16 animate-in fade-in duration-700">
          <div className="bg-white p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-sm border border-[#f6c1cc]">
            <h2 className="text-3xl font-bold text-[#4a2c2a] mb-12 playfair border-b border-[#fff7f9] pb-6">Design References</h2>
            <form onSubmit={handleUploadPreferred} className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div 
                className={`border-4 border-dashed rounded-[50px] aspect-video flex flex-col items-center justify-center p-12 transition-all relative group overflow-hidden ${
                  prefImage ? 'border-[#c9a14a] bg-white' : 'border-[#f6c1cc] bg-[#fff7f9] hover:bg-[#f6c1cc]/10'
                }`}
              >
                {prefImage ? (
                  <div className="relative w-full h-full">
                    <img src={prefImage} className="w-full h-full object-contain rounded-3xl" alt="" />
                    <button 
                      type="button" 
                      onClick={() => setPrefImage(null)} 
                      className="absolute -top-4 -right-4 bg-red-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform font-bold text-xl"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
                    <div className="text-7xl mb-10 opacity-10">📸</div>
                    <span className="text-[#c9a14a] text-[11px] font-black uppercase tracking-[0.5em] border-b-2 border-[#c9a14a]/20 pb-2">Attach Lookbook Inspiration</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if(file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setPrefImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
              <div className="flex flex-col gap-10 justify-center">
                <div>
                  <label className="block text-[11px] font-black text-[#c9a14a] uppercase mb-4 tracking-[0.4em]">Boutique Category</label>
                  <select 
                    value={prefCat} 
                    onChange={(e) => setPrefCat(e.target.value as Category)}
                    className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/30 rounded-3xl px-8 py-5 font-bold text-lg text-[#4a2c2a] focus:ring-8 focus:ring-[#c9a14a]/10 outline-none cursor-pointer appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#c9a14a] uppercase mb-4 tracking-[0.4em]">Design Annotation</label>
                  <textarea 
                    value={prefNotes} 
                    onChange={(e) => setPrefNotes(e.target.value)}
                    placeholder="Specify custom details for this reference..."
                    className="w-full bg-[#fff7f9] border-2 border-[#f6c1cc]/30 rounded-3xl px-8 py-6 min-h-[140px] outline-none font-medium leading-relaxed"
                  />
                </div>
                <button className="bg-[#4a2c2a] text-white py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.4em] shadow-xl hover:bg-[#c9a14a] transition-all transform hover:-translate-y-1 active:scale-95">
                  Store Reference to Vault
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
            {customer.preferredDesigns.map(design => (
              <div key={design.id} className="bg-white p-8 rounded-[50px] shadow-sm border border-white group hover:shadow-2xl transition-all relative">
                <button 
                  onClick={() => deletePreferred(design.id)}
                  className="absolute top-10 right-10 z-10 w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl font-bold text-xl"
                >
                  ✕
                </button>
                <div className="overflow-hidden rounded-[40px] mb-8 shadow-inner bg-gray-50 aspect-[4/5]">
                  <img src={design.image} className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110" alt="" />
                </div>
                <div className="px-4">
                  <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a14a] bg-[#fff7f9] px-5 py-2 rounded-full border border-[#f6c1cc] mb-6 shadow-sm">
                    {design.category}
                  </span>
                  <p className="text-[#4a2c2a] text-lg leading-relaxed italic border-l-4 border-[#f6c1cc] pl-6 py-2 font-light">{design.notes || 'Reference archived without specific annotations.'}</p>
                </div>
              </div>
            ))}
            {customer.preferredDesigns.length === 0 && (
              <div className="col-span-full py-40 text-center bg-white/50 rounded-[80px] border-4 border-dashed border-[#f6c1cc]/40">
                <div className="text-8xl mb-8 opacity-10">📂</div>
                <p className="text-gray-400 font-black uppercase tracking-[0.6em] text-sm">Design Reference Feed is Empty</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CustomerDetails;