// components/usuario/UserModal.jsx
'use client';
import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';

export default function ModalUsuario({ userId, isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const cargarUsuario = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api-react-taller-production.up.railway.app/api/users/${userId}`);
        const data = await res.json();
        setUser(data.user || data.item || data);
      } catch (error) {
        console.error('Error cargando usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [userId, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {loading ? (
        <div className="text-center py-8">Cargando usuario...</div>
      ) : !user ? (
        <div className="text-center py-8">Usuario no encontrado</div>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(user.name || user.username || '?').charAt(0).toUpperCase()}
            </div>
            
            {/* Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name || 'Sin nombre'}</h2>
              <p className="text-gray-600">@{user.username}</p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded text-center">
              <p className="text-2xl font-bold text-purple-600">{user.locals?.length || 0}</p>
              <p className="text-sm text-gray-500">Locales</p>
            </div>
            <div className="bg-gray-50 p-3 rounded text-center">
              <p className="text-2xl font-bold text-pink-600">{user.dishes?.length || 0}</p>
              <p className="text-sm text-gray-500">Platos</p>
            </div>
          </div>

          {/* Lista de locales (si tiene) */}
          {user.locals?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Sus locales:</h3>
              <div className="space-y-2">
                {user.locals.slice(0, 3).map(local => (
                  <div key={local.id} className="text-sm text-gray-600">
                    • {local.name}
                  </div>
                ))}
                {user.locals.length > 3 && (
                  <p className="text-xs text-gray-400">y {user.locals.length - 3} más...</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}