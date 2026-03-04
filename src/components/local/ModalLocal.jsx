// components/local/LocalDetailModal.jsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Modal from '@/components/ui/Modal';

export default function ModalLocal({ localId, isOpen, onClose }) {
  const { user } = useAuth();
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [sendingReview, setSendingReview] = useState(false);

  // Cargar datos del local cuando se abre el modal
  useEffect(() => {
    if (!isOpen || !localId) return;

    const cargarLocal = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api-react-taller-production.up.railway.app/api/locals/${localId}`);
        const data = await res.json();
        // La API puede devolver { item: ... } o directamente el objeto
        setLocal(data.item || data);
      } catch (error) {
        console.error('Error cargando local:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarLocal();
  }, [localId, isOpen]);


  
  const enviarReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para dejar una review');
      return;
    }

    setSendingReview(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://api-react-taller-production.up.railway.app/api/locals/${localId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: review.rating,
          comment: review.comment
        })
      });

      if (res.ok) {
        alert('¡Review enviada!');
        setReview({ rating: 5, comment: '' });
        // Recargar el local para ver la nueva review
        const updatedRes = await fetch(`https://api-react-taller-production.up.railway.app/api/locals/${localId}`);
        const updatedData = await updatedRes.json();
        setLocal(updatedData.item || updatedData);
      }
    } catch (error) {
      console.error('Error enviando review:', error);
      alert('Error al enviar la review');
    } finally {
      setSendingReview(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {loading ? (
        <div className="text-center py-8">Cargando...</div>
      ) : !local ? (
        <div className="text-center py-8">Local no encontrado</div>
      ) : (
        <div>
          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{local.name}</h2>

          {/* Imagen */}
          {local.photos?.[0] && (
            <img 
              src={local.photos[0]} 
              alt={local.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}

          {/* Información */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="font-semibold">{local.type}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Precio</p>
              <p className="font-semibold">{local.priceRange}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Ciudad</p>
              <p className="font-semibold">{local.city}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Dirección</p>
              <p className="font-semibold">{local.address}</p>
            </div>
            {local.hours && (
              <div className="bg-gray-50 p-3 rounded col-span-2">
                <p className="text-sm text-gray-500">Horario</p>
                <p className="font-semibold">{local.hours}</p>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold mb-3">Reviews</h3>
            
            {/* Formulario de review (solo para usuarios logueados) */}
            {user && (
              <form onSubmit={enviarReview} className="bg-gray-50 p-4 rounded mb-4">
                <h4 className="font-semibold mb-2">Deja tu review</h4>
                <select
                  value={review.rating}
                  onChange={(e) => setReview({...review, rating: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value="5">5 ⭐</option>
                  <option value="4">4 ⭐</option>
                  <option value="3">3 ⭐</option>
                  <option value="2">2 ⭐</option>
                  <option value="1">1 ⭐</option>
                </select>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({...review, comment: e.target.value})}
                  placeholder="Tu comentario (opcional)"
                  className="w-full p-2 border rounded mb-2"
                  rows="3"
                />
                <button
                  type="submit"
                  disabled={sendingReview}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {sendingReview ? 'Enviando...' : 'Enviar review'}
                </button>
              </form>
            )}

            {/* Lista de reviews */}
            {local.reviews?.length > 0 ? (
              local.reviews.map((rev, idx) => (
                <div key={idx} className="border-b pb-3 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{rev.userName}</span>
                    <span className="text-yellow-500">{'⭐'.repeat(rev.rating)}</span>
                  </div>
                  {rev.comment && <p className="text-gray-600">{rev.comment}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay reviews todavía</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}