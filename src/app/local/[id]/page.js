'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { localesService } from '@/services/localesServices';
import { reviewsService } from '@/services/reviewServices';
import { useAuth } from '@/hooks/useAuth';

export default function LocalDetallePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarLocal = async () => {
      try {
        setLoading(true);
        console.log('Cargando local ID:', id);
        const data = await localesService.getLocalById(id);
        setLocal(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el local');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarLocal();
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
      await reviewsService.createLocalReview(id, review);
      alert('¡Review enviada!');
      setReview({ rating: 5, comment: '' });
      // Recargar local
      const updated = await localesService.getLocalById(id);
      setLocal(updated);
    } catch (err) {
      alert('Error al enviar review');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div className="text-center p-8">Cargando...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!local) return <div className="text-center p-8">Local no encontrado</div>;

  return (
    <div className="container-custom py-8">
      <button onClick={() => router.back()} className="mb-4 text-purple-600 hover:underline">
        ← Volver
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Imágenes */}
        {local.photos && local.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-1">
            {local.photos.slice(0, 2).map((photo, idx) => (
              <img key={idx} src={photo} alt={local.name} className="w-full h-64 object-cover" />
            ))}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{local.name}</h1>
            <span className="bg-yellow-100 px-3 py-1 rounded-full font-semibold">
              ⭐ {local.rating || 'Nuevo'}
            </span>
          </div>

          <p className="text-gray-600 mb-4">{local.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 text-sm">Tipo</span>
              <p className="font-semibold">{local.type}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 text-sm">Precio</span>
              <p className="font-semibold">{local.priceRange}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 text-sm">Ubicación</span>
              <p className="font-semibold">{local.zone}, {local.city}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 text-sm">Dirección</span>
              <p className="font-semibold">{local.address}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 text-sm">Horario</span>
              <p className="font-semibold">{local.hours}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 text-sm">Creado por</span>
              <button 
                onClick={() => router.push(`/usuario/${local.userId}`)}
                className="font-semibold text-purple-600 hover:underline block"
              >
                {local.userName || 'Ver usuario'}
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
                    placeholder="¿Qué te pareció el lugar?"
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
              {local.reviews?.map((rev, idx) => (
                <div key={idx} className="border-b pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{rev.userName}</span>
                    <span className="text-yellow-500">{'⭐'.repeat(rev.rating)}</span>
                  </div>
                  {rev.comment && <p className="text-gray-600">{rev.comment}</p>}
                </div>
              ))}
              {(!local.reviews || local.reviews.length === 0) && (
                <p className="text-gray-500 text-center py-4">No hay reviews todavía</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}