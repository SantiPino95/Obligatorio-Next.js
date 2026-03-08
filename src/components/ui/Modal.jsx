// components/ui/Modal.jsx
'use client';
import { useEffect } from 'react';
import Button from './Button';

export default function Modal({ isOpen, onClose, children }) {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose} // Clic en el fondo cierra
    >
      <div 
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Evita que clic dentro cierre
      >
        <div className="p-6">
          {/* Botón cerrar */}
          <div className="flex justify-end">
            <Button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </Button>
          </div>
          
          {/* Contenido del modal */}
          {children}
        </div>
      </div>
    </div>
  );
}