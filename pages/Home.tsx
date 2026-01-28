import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CircularText from '../components/CircularText';
import { LOGO_SRC } from '../constants';
import { storage } from '../services/storage';
import { Design } from '../types';

const Home: React.FC = () => {
  const [imgError, setImgError] = useState(false);
  const [latestDesign, setLatestDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatest = async () => {
      try {
        const designs = await storage.getDesigns();
        if (designs && designs.length > 0) {
          setLatestDesign(designs[0]);
        }
      } catch (e) {
        console.error("Failed to load spotlight design", e);
      } finally {
        setLoading(false);
      }
    };
    loadLatest();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fff7f9] selection:bg-[#f6c1cc] selection:text-[#4a2c2a]">
      {/* Static Decorative Elements - Adjusted for right-heavy layout */}
      <div className="absolute top-[10%] right-[5%] text-[160px] font-black text-[#f6c1cc]/10 select-none pointer-events-none leading-none">01</div>
      <div className="absolute bottom-[15%] left-[5%] text-[160px] font-black text-[#f6c1cc]/10 select-none pointer-events-none leading-none">LUXE</div>

      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row-reverse items-center justify-between gap-16 md:gap-24 relative z-10">
        <div className="flex-1 space-y-12 text-center md:text-right flex flex-col md:items-end">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white border border-[#f6c1cc] text-[#4a2c2a] text-[10px] font-black tracking-[0.5em] uppercase rounded-full shadow-sm">
            Premium Boutique
            <span className="w-2 h-2 bg-[#c9a14a] rounded-full animate-pulse"></span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-7xl md:text-9xl font-black text-[#4a2c2a] leading-[0.85] tracking-tighter">
              GEET <br />
              <span className="text-[#c9a14a] italic relative">
                FASHION
                <span className="absolute -bottom-2 right-0 w-full h-3 bg-[#f6c1cc]"></span>
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-[#4a2c2a]/50 font-medium italic tracking-widest">
              Bespoke Couture Excellence
            </p>
          </div>
          
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed font-light ml-auto">
            Elevate your wardrobe with GEET FASHION. We specialize in handcrafted ethnic couture, bridal masterpieces, and tailored designs that celebrate individual elegance.
          </p>

          <div className="flex flex-wrap justify-center md:justify-end gap-6 pt-4">
            <Link 
              to="/gallery" 
              className="px-14 py-6 bg-white border-2 border-[#f6c1cc] text-[#4a2c2a] font-bold text-xs tracking-[0.3em] uppercase rounded-full hover:border-[#c9a14a] hover:text-[#c9a14a] transition-all duration-300"
            >
              New Arrivals
            </Link>
            <Link 
              to="/gallery" 
              className="px-14 py-6 bg-[#4a2c2a] text-white font-bold text-xs tracking-[0.3em] uppercase rounded-full shadow-2xl hover:bg-[#c9a14a] hover:-translate-y-1 transition-all duration-300"
            >
              The Portfolio
            </Link>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-[550px] md:max-w-none">
          {/* Image Frame shifted to the Left side now */}
          <div className="window-panel p-4 bg-white relative z-10">
            <div className="bg-[#fff7f9] h-12 flex items-center px-5 gap-3 border-b border-[#f6c1cc] mb-4 rounded-t-xl">
              <div className="w-3.5 h-3.5 rounded-full bg-[#f6c1cc]"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-[#c9a14a]"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-gray-100"></div>
              <span className="ml-auto text-[10px] font-black text-[#c9a14a] tracking-widest uppercase">
                {latestDesign ? `LATEST: ${latestDesign.name.substring(0, 15)}...` : 'COLLECTION_2025'}
              </span>
            </div>
            
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-50 group flex items-center justify-center">
              {loading ? (
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-[#c9a14a] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#c9a14a]">Loading Gallery...</span>
                </div>
              ) : latestDesign ? (
                <img 
                  src={latestDesign.image} 
                  alt={latestDesign.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[2000ms]"
                  style={{ 
                    imageRendering: 'auto',
                    display: 'block'
                  }}
                />
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center opacity-60">
                   <div className="w-32 h-32 mb-6">
                      <img 
                        src={LOGO_SRC} 
                        alt="Brand" 
                        className="w-full h-full object-contain"
                      />
                   </div>
                   <p className="font-black text-[#c9a14a] tracking-[0.3em] uppercase text-xs">New Collection Arriving Soon</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Badge Overlay - Adjusted Position */}
          <div className="absolute -top-16 -left-16 hidden lg:flex items-center justify-center w-56 h-56 pointer-events-none">
            <CircularText 
              text="GEET FASHION • BESPOKE LUXURY • CUSTOM CRAFTED • " 
              radius={90} 
              fontSize={12} 
              speed={40}
            />
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-[#f6c1cc] shadow-2xl relative z-10 p-1">
              {!imgError ? (
                <img 
                  src={LOGO_SRC} 
                  alt="Geet Fashion Logo" 
                  className="w-full h-full object-contain rounded-full"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-4xl">👗</span>
              )}
            </div>
          </div>

          {/* Floating Aesthetic Card - Positioned relative to image on left */}
          <div className="absolute -bottom-12 -right-12 bg-white border-2 border-[#f6c1cc] p-8 shadow-2xl max-w-[280px] rotate-2 hidden md:block hover:rotate-0 transition-transform duration-500">
            <div className="w-12 h-1.5 bg-[#c9a14a] mb-5"></div>
            <p className="text-[11px] font-black text-[#c9a14a] tracking-[0.3em] uppercase mb-3">
              {latestDesign ? `Ref: #${String(latestDesign.id).slice(-4)}` : 'Bespoke_Design'}
            </p>
            <p className="text-xl font-bold text-[#4a2c2a] leading-snug mb-5 playfair">
              {latestDesign ? latestDesign.description.substring(0, 50) + "..." : 'Timeless silhouettes tailored for the modern muse.'}
            </p>
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              <span>{latestDesign ? 'NEW_ARRIVAL' : 'HAND_CRAFTED'}</span>
              <span>{latestDesign ? latestDesign.category.toUpperCase() : 'LUXURY'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker Row */}
      <div className="bg-[#4a2c2a] py-8 overflow-hidden flex whitespace-nowrap border-y border-[#c9a14a]/30">
        <div className="animate-marquee flex gap-16 text-[#f6c1cc] font-black text-[12px] tracking-[0.8em] uppercase">
          {[...Array(10)].map((_, i) => (
            <span key={i}>GEET FASHION • BRIDAL • CUSTOM BLOUSE • ETHNIC COUTURE • HAND STITCHED • LUXURY BOUTIQUE • </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;