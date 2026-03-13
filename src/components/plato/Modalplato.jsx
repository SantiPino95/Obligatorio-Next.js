'use client';
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Modal from "../ui/Modal";


export default function ModalPlato({ platoId, isOpen, onClose }) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const [plato, setPlato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [sendingReview, setSendingReview] = useState(false);

  useEffect(() => {
    if (!isOpen || !platoId) return;

    const cargarPlato = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api-react-taller-production.up.railway.app/api/dishes/${platoId}`);
        const data = await res.json();
        setPlato(data.item || data);
      } catch (error) {
        console.error('Error cargando Plato:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarPlato();
  }, [platoId, isOpen]);

  const enviarReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para dejar una review');
      return;
    }

    setSendingReview(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://api-react-taller-production.up.railway.app/api/dishes/${platoId}/reviews`, {
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
        // Recargar el Plato para ver la nueva review
        const updatedRes = await fetch(`https://api-react-taller-production.up.railway.app/api/dishes/${platoId}`);
        const updatedData = await updatedRes.json();
        setPlato(updatedData.item || updatedData);
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
      ) : !plato ? (
        <div className="text-center py-8">Plato no encontrado</div>
      ) : (
        <div>


          {/* emoji de respaldo */}
          <div className="w-full h-64 mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">
            {plato.image && !imageError ? (
              <img
                src={plato.image}
                alt={plato.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                {plato.category?.toLowerCase().includes('entrada') ? '🥗' :
                  plato.category?.toLowerCase().includes('principal') ? '🍖' :
                    plato.category?.toLowerCase().includes('postre') ? '🍰' :
                      plato.category?.toLowerCase().includes('bebida') ? '🥤' : '🍲'}
              </div>
            )}
          </div>
          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{plato.name}</h2>


          {/* Información */}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Categoría</p>
              <p className="font-semibold">{plato.category || 'No especificada'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Precio</p>
              <p className="font-semibold">${plato.price}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Ciudad</p>
              <p className="font-semibold">{plato.city || 'No especificada'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Local</p>
              <p className="font-semibold">{plato.localName || plato.localId || 'No especificado'}</p>
            </div>
            {plato.description && (
              <div className="bg-gray-50 p-3 rounded col-span-2">
                <p className="text-sm text-gray-500">Descripción</p>
                <p className="font-semibold">{plato.description}</p>
              </div>
            )}
            {/* 👇 USUARIO CON NAVEGACIÓN DIRECTA */}
            <div className="bg-gray-50 p-3 rounded col-span-2">
              <p className="text-sm text-gray-500">Publicado por</p>
              <button
                onClick={() => {
                  const userId = plato.creatorId || plato.userId;
                  if (userId) {
                    router.push(`/usuario/${userId}`);
                    onClose(); // Cierra el modal al navegar
                  }
                }}
                className="font-semibold text-purple-600 hover:text-purple-800 hover:underline text-left"
              >
                {plato.creator?.name || plato.userName || plato.creatorName || 'Usuario'}
              </button>
            </div>
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
                  onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
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
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
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
            {plato.reviews?.length > 0 ? (
              plato.reviews.map((rev, idx) => {
                // Encontrar el nombre del usuario que hizo la review
                const reviewerName =
                  rev.user?.name ||
                  rev.user?.username ||
                  rev.name ||
                  'Usuario anónimo';

                return (
                  <div key={idx} className="border-b pb-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Nombre del reviewer */}
                      <span className="font-semibold text-purple-600">
                        {reviewerName}
                      </span>

                      {/* Rating en estrellas */}
                      <span className="text-yellow-500 ml-2">
                        {'⭐'.repeat(rev.rating)}
                      </span>

                      {/* Fecha (si existe) */}
                      {rev.createdAt && (
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Comentario */}
                    {rev.comment && (
                      <p className="text-gray-600 mt-1">
                        {rev.comment}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-4xl mb-2">💬</p>
                <p className="text-gray-500">No hay reviews todavía</p>
                <p className="text-sm text-gray-400 mt-2">¡Sé el primero en opinar!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}