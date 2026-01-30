import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-[#4a2c2a]/40 backdrop-blur-sm transition-opacity" onClick={onCancel}></div>
      <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 shadow-2xl border border-[#f6c1cc] animate-in zoom-in-95 duration-300 flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6 ${isDangerous ? 'bg-red-50 text-red-500' : 'bg-[#fff7f9] text-[#c9a14a]'}`}>
          {isDangerous ? '!' : '?'}
        </div>
        <h3 className="text-2xl font-bold text-[#4a2c2a] playfair mb-4">{title}</h3>
        <p className="text-gray-500 mb-10 leading-relaxed font-medium text-sm">{message}</p>
        <div className="flex gap-4 w-full">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl font-bold text-[#4a2c2a] bg-[#fff7f9] hover:bg-[#f6c1cc]/50 transition-colors uppercase text-[10px] tracking-widest"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-4 rounded-2xl font-bold text-white uppercase text-[10px] tracking-widest shadow-lg transition-transform active:scale-95 ${
              isDangerous ? 'bg-red-500 hover:bg-red-600' : 'bg-[#4a2c2a] hover:bg-[#c9a14a]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;