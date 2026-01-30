import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { Category, Design } from '../types';
import { CATEGORIES } from '../constants';
import { IconSearch } from '../components/BoutiqueIcons';

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await storage.getDesigns();
      setDesigns(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredDesigns = designs.filter(d => {
    const matchesCategory = activeFilter === 'All' || d.category === activeFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = d.name.toLowerCase().includes(searchLower) || 
                          d.description.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  const closeModal = () => setSelectedDesign(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col md:items-end md:text-right mb-16 md:mb-20 gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-7xl font-bold playfair text-[#4a2c2a] leading-none">Design Portfolio</h1>
          <div className="h-1.5 w-24 md:w-32 bg-[#c9a14a] md:ml-auto"></div>
        </div>
        <p className="text-gray-400 font-medium max-w-2xl leading-relaxed italic text-base md:text-lg">
          Explore our curated collection of bespoke ethnic wear. Each piece is a testament to the artisan's skill and the beauty of traditional craftsmanship.
        </p>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96 group mt-4">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#c9a14a] opacity-60 group-focus-within:opacity-100 transition-opacity">
            <IconSearch className="w-5 h-5" />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or style..."
            className="w-full bg-white border-2 border-[#f6c1cc] rounded-full pl-14 pr-8 py-3 md:py-4 font-bold text-[#4a2c2a] focus:outline-none focus:border-[#c9a14a] transition-all placeholder:text-gray-300 text-[10px] md:text-[11px] tracking-[0.2em] uppercase shadow-sm focus:shadow-lg focus:ring-4 focus:ring-[#c9a14a]/5"
          />
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-3">
          <button 
            onClick={() => setActiveFilter('All')}
            className={`px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all border-2 ${
              activeFilter === 'All' 
                ? 'bg-[#4a2c2a] text-white border-[#4a2c2a] shadow-xl scale-105' 
                : 'bg-white border-[#f6c1cc] text-[#4a2c2a] hover:border-[#c9a14a] hover:text-[#c9a14a]'
            }`}
          >
            All Collections
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all border-2 ${
                activeFilter === cat 
                  ? 'bg-[#4a2c2a] text-white border-[#4a2c2a] shadow-xl scale-105' 
                  : 'bg-white border-[#f6c1cc] text-[#4a2c2a] hover:border-[#c9a14a] hover:text-[#c9a14a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-32">
          <div className="animate-spin text-4xl mb-6 text-[#c9a14a]">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
               <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
             </svg>
          </div>
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">Accessing Portfolio Vault...</p>
        </div>
      ) : filteredDesigns.length === 0 ? (
        <div className="text-center py-40 bg-white rounded-[40px] md:rounded-[80px] border-4 border-dashed border-[#f6c1cc]/30">
          <div className="text-7xl mb-8 opacity-10">🧵</div>
          <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-sm italic">Archive Search Returned No Pieces</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {filteredDesigns.map((design) => (
            <div 
              key={design.id} 
              onClick={() => setSelectedDesign(design)}
              className="bg-white rounded-[40px] md:rounded-[60px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-white group cursor-pointer flex flex-col h-full"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <img 
                  src={design.image} 
                  alt={design.name} 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1500ms]"
                  style={{ display: 'block' }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                <div className="absolute top-6 left-6 md:top-8 md:left-8">
                  <span className="bg-white/95 backdrop-blur px-4 md:px-5 py-2 rounded-full text-[9px] md:text-[10px] font-black text-[#c9a14a] border border-[#f6c1cc] uppercase tracking-widest shadow-sm">
                    {design.category}
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-12 flex-grow flex flex-col">
                <h3 className="text-2xl md:text-3xl font-bold playfair text-[#4a2c2a] mb-4 group-hover:text-[#c9a14a] transition-colors line-clamp-2">{design.name}</h3>
                <p className="text-gray-400 line-clamp-2 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 font-medium italic">"{design.description}"</p>
                <div className="flex items-center justify-between pt-6 md:pt-8 border-t border-[#fff7f9] mt-auto">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#c9a14a]">Ref_{String(design.id).slice(-4)}</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#f6c1cc] flex items-center justify-center group-hover:bg-[#4a2c2a] group-hover:text-white transition-all text-[#4a2c2a]">
                    →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDesign && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-[#4a2c2a]/95 backdrop-blur-xl"
            onClick={closeModal}
          ></div>
          <div className="relative w-full max-w-6xl bg-[#fff7f9] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-500 border border-white/20">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-[#4a2c2a] hover:bg-[#c9a14a] hover:text-white transition-all font-bold text-lg md:text-xl"
            >
              ✕
            </button>
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden h-1/2 md:h-auto">
              <img src={selectedDesign.image} alt={selectedDesign.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 p-8 md:p-24 overflow-y-auto h-1/2 md:h-auto">
              <div className="mb-8 md:mb-12">
                <span className="inline-block px-5 py-2 bg-[#f6c1cc] text-[#4a2c2a] text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase rounded-full mb-6 md:mb-8 shadow-sm">
                  {selectedDesign.category} Collection
                </span>
                <h2 className="text-3xl md:text-6xl font-bold playfair text-[#4a2c2a] leading-tight mb-6 md:mb-8">{selectedDesign.name}</h2>
                <div className="w-16 md:w-24 h-1.5 bg-[#c9a14a] mb-8 md:mb-12"></div>
                <p className="text-base md:text-xl text-gray-500 leading-relaxed font-light mb-8 md:mb-12 italic">"{selectedDesign.description}"</p>
              </div>
              <div className="space-y-8 md:space-y-12">
                <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] border border-[#f6c1cc] shadow-sm">
                  <h4 className="text-[10px] md:text-[11px] font-black text-[#c9a14a] uppercase tracking-[0.4em] mb-4 md:mb-6">Craftsmanship Profile</h4>
                  <ul className="space-y-3 md:space-y-4">
                    <li className="flex items-center gap-4 text-sm md:text-base text-[#4a2c2a] font-bold"><span className="w-2 h-2 bg-[#c9a14a] rounded-full"></span>Custom Tailored Dimensions</li>
                    <li className="flex items-center gap-4 text-sm md:text-base text-[#4a2c2a] font-bold"><span className="w-2 h-2 bg-[#c9a14a] rounded-full"></span>Authentic Hand-Stitched Details</li>
                    <li className="flex items-center gap-4 text-sm md:text-base text-[#4a2c2a] font-bold"><span className="w-2 h-2 bg-[#c9a14a] rounded-full"></span>Premium Silk & Thread Selection</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-4 md:gap-6">
                  <a href={`https://wa.me/919823376600?text=Hi Geet Fashion, I am interested in the ${selectedDesign.name} (${selectedDesign.category})`} target="_blank" rel="noreferrer" className="w-full bg-[#4a2c2a] text-white py-5 md:py-6 rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] text-center shadow-2xl hover:bg-[#c9a14a] transition-all transform hover:-translate-y-1">Initiate Enquiry</a>
                  <p className="text-[9px] md:text-[10px] text-center text-gray-300 font-bold uppercase tracking-[0.5em] mono">VAULT_REF: {selectedDesign.id} • STITCH_CORE_1.2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;