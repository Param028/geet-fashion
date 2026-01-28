
import React from 'react';

interface LightRaysProps {
  color?: string;
  intensity?: number;
  speed?: number;
}

const LightRays: React.FC<LightRaysProps> = ({
  color = "#f6c1cc",
  intensity = 0.15,
  speed = 40
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Primary Ray Layer */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%]"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, 
            transparent 0deg, 
            ${color} 15deg, 
            transparent 30deg, 
            ${color} 45deg, 
            transparent 60deg,
            ${color} 75deg, 
            transparent 90deg,
            ${color} 105deg, 
            transparent 120deg,
            ${color} 135deg, 
            transparent 150deg,
            ${color} 165deg, 
            transparent 180deg,
            ${color} 195deg, 
            transparent 210deg,
            ${color} 225deg, 
            transparent 240deg,
            ${color} 255deg, 
            transparent 270deg,
            ${color} 285deg, 
            transparent 300deg,
            ${color} 315deg, 
            transparent 330deg,
            ${color} 345deg, 
            transparent 360deg
          )`,
          opacity: intensity,
          animation: `rays-rotate-slow ${speed}s linear infinite`,
          filter: 'blur(40px)',
          mixBlendMode: 'soft-light'
        }}
      />

      {/* Secondary Counter-Rotating Layer */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%]"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, 
            transparent 0deg, 
            #ffffff 20deg, 
            transparent 40deg, 
            #ffffff 60deg, 
            transparent 80deg
          )`,
          opacity: intensity * 0.5,
          animation: `rays-rotate-reverse ${speed * 1.5}s linear infinite`,
          filter: 'blur(60px)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Soft Glow Center */}
      <div className="absolute inset-0 bg-radial-vignette"></div>

      <style>{`
        @keyframes rays-rotate-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes rays-rotate-reverse {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
        .bg-radial-vignette {
          background: radial-gradient(circle at center, transparent 0%, #fff7f9 85%);
        }
      `}</style>
    </div>
  );
};

export default LightRays;
