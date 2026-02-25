'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { platosService } from '@/services/platosServices';
import { reviewsService } from '@/services/reviewServices';
import { useAuth } from '@/hooks/useAuth';

export default function PlatoDetallePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [plato, setPlato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarPlato = async () => {
      try {
        setLoading(true);
        console.log('Cargando plato ID:', id);
        const data = await platosService.getPlatoById(id);
        setPlato(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el plato');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarPlato();
    }
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setEnviando(true);
      await reviewsService.createPlatoReview(id, review);
      alert('¡Review enviada!');
      setReview({ rating: 5, comment: '' });
      // Recargar plato
      const updated = await platosService.getPlatoById(id);
      setPlato(updated);
    } catch (err) {
      alert('Error al enviar review');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div className="text-center p-8">Cargando...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!plato) return <div className="text-center p-8">Plato no encontrado</div>;

  return (
    <div className="container-custom py-8">
      <button onClick={() => router.back()} className="mb-4 text-purple-600 hover:underline">
        ← Volver
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {plato.image && (
          <img src={plato.image} alt={plato.name} className="w-full h-96 object-cover" />
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{plato.name}</h1>
            <span className="bg-yellow-100 px-3 py-1 rounded-full font-semibold">
              ⭐ {plato.rating || 'Nuevo'}
            </span>
          </div>

          <p className="text-gray-600 mb-4">{plato.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 text-sm">Categoría</span>
              <p className="font-semibold">{plato.category}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 text-sm">Precio</span>
              <p className="font-semibold text-green-600">${plato.price}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 text-sm">Local</span>
              <button 
                onClick={() => router.push(`/local/${plato.localId}`)}
                className="font-semibold text-purple-600 hover:underline block"
              >
                {plato.localName || 'Ver local'}
              </button>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 text-sm">Creado por</span>
              <button 
                onClick={() => router.push(`/usuario/${plato.userId}`)}
                className="font-semibold text-purple-600 hover:underline block"
              >
                {plato.userName || 'Ver usuario'}
              </button>
            </div>
          </div>

          {/* Sección de Reviews */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            
            {user ? (
              <form onSubmit={handleReview} className="mb-6 bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-3">Deja tu review</h3>
                <div className="mb-3">
                  <label className="block mb-1">Puntuación</label>
                  <select 
                    value={review.rating}
                    onChange={(e) => setReview({...review, rating: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded"
                  >
                    {[5,4,3,2,1].map(num => (
                      <option key={num} value={num}>{num} estrellas</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Comentario (opcional)</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({...review, comment: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="¿Qué te pareció el plato?"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={enviando}
                  className="btn-primary"
                >
                  {enviando ? 'Enviando...' : 'Enviar Review'}
                </button>
              </form>
            ) : (
              <p className="mb-4 text-gray-600">
                <button onClick={() => router.push('/login')} className="text-purple-600 hover:underline">
                  Inicia sesión
                </button> para dejar una review
              </p>
            )}

            {/* Lista de reviews */}
            <div className="space-y-4">
              {plato.reviews?.map((rev, idx) => (
                <div key={idx} className="border-b pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{rev.userName}</span>
                    <span className="text-yellow-500">{'⭐'.repeat(rev.rating)}</span>
                  </div>
                  {rev.comment && <p className="text-gray-600">{rev.comment}</p>}
                </div>
              ))}
              {(!plato.reviews || plato.reviews.length === 0) && (
                <p className="text-gray-500 text-center py-4">No hay reviews todavía</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}