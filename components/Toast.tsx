import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-[#4a2c2a] text-white border-l-4 border-[#c9a14a]',
    error: 'bg-red-50 text-red-600 border-l-4 border-red-500',
    info: 'bg-white text-[#4a2c2a] border-l-4 border-[#c9a14a]'
  };

  const icons = {
    success: '✓',
    error: '!',
    info: 'i'
  };

  return (
    <div className={`fixed top-24 right-6 z-[100] flex items-center gap-4 px-6 py-5 rounded-r-xl shadow-2xl min-w-[320px] max-w-md animate-in slide-in-from-right duration-500 ease-out ${styles[type]}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${type === 'success' ? 'bg-[#c9a14a] text-[#4a2c2a]' : type === 'error' ? 'bg-red-200 text-red-600' : 'bg-[#fff7f9] text-[#c9a14a]'}`}>
        {icons[type]}
      </div>
      <div className="flex-1">
        <p className="font-black text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">{type}</p>
        <p className="font-bold text-sm leading-tight">{message}</p>
      </div>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 font-bold p-2 text-lg">×</button>
    </div>
  );
};

export default Toast;