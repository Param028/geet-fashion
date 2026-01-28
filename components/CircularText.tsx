
import React from 'react';

interface CircularTextProps {
  text: string;
  radius?: number;
  fontSize?: number;
  className?: string;
  speed?: number;
}

const CircularText: React.FC<CircularTextProps> = ({ 
  text, 
  radius = 50, 
  fontSize = 10, 
  className = "",
  speed = 15
}) => {
  const characters = text.split("");
  const degreeStep = 360 / characters.length;

  return (
    <div 
      className={`absolute top-1/2 left-1/2 flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ 
        width: 0, 
        height: 0,
        animation: `spin-circular-text ${speed}s linear infinite` 
      }}
    >
      {characters.map((char, i) => (
        <span
          key={i}
          className="absolute font-black uppercase tracking-widest text-[#c9a14a] whitespace-nowrap"
          style={{
            fontSize: `${fontSize}px`,
            // Center the character on the 0,0 point then rotate and move it out
            transform: `translate(-50%, -50%) rotate(${i * degreeStep}deg) translateY(-${radius}px)`,
            transformOrigin: "center center",
          }}
        >
          {char}
        </span>
      ))}
      <style>{`
        @keyframes spin-circular-text {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CircularText;
