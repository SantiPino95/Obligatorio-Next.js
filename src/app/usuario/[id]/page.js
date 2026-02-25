'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usuariosService } from '@/services/usuariosServices';
import { useAuth } from '@/hooks/useAuth';

export default function UsuarioPerfilPage() {
  const { id } = useParams();
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [locales, setLocales] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabActivo, setTabActivo] = useState('locales');
  const {user} = useAuth();

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        setLoading(true);
        console.log('Cargando usuario ID:', id);
        const data = await usuariosService.getUserById(id);
        setUsuario(data.user || data);
        setLocales(data.locals || []);
        setPlatos(data.dishes || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarUsuario();
    }
  }, [id]);

  if (loading) return <div className="text-center p-8">Cargando...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!usuario) return <div className="text-center p-8">Usuario no encontrado</div>;

  return (
    <div className="container-custom py-8">
      <button onClick={() => router.back()} className="mb-4 text-purple-600 hover:underline">
        ← Volver
      </button>

     {/* Header del perfil */}
<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
  {/* Primera fila: Avatar y datos */}
  <div className="flex items-center gap-4">
    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
      {(usuario.name || usuario.username)}
    </div>
    <div>
      <h1 className="text-2xl font-bold text-gray-800">{usuario.name || usuario.username}</h1>
      <p className="text-gray-600">@{usuario.username}</p>
      <p className="text-sm text-gray-500 mt-1">
        {locales.length} locales • {platos.length} platos
      </p>
    </div>
  </div>

 {/* Segunda fila: Botones (solo si es el propio usuario) */}
{(() => {
  console.log('🔍 ===== DEBUG BOTONES =====');
  console.log('🔍 user (logueado):', user);
  console.log('🔍 id de la página:', id);
  console.log('🔍 user?.id:', user?.id);
  console.log('🔍 tipo user?.id:', typeof user?.id);
  console.log('🔍 tipo id:', typeof id);
  console.log('🔍 comparación con ==:', user?.id == id);
  console.log('🔍 comparación con ===:', user?.id === id);
  console.log('🔍 comparación string:', String(user?.id) === String(id));
  
  // USAR DOBLE IGUAL PARA COMPARAR (ignora tipos)
  if (user?.id == id) {
    console.log('🔍 ✅ CONDICIÓN CUMPLIDA - Mostrando botones');
    return (
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => router.push('/plato/nuevo')}
          style={{
            background: 'linear-gradient(to right, #9333ea, #db2777)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          + Nuevo Plato
        </button>
        <button
          onClick={() => router.push('/local/nuevo')}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          + Nuevo Local
        </button>
      </div>
    );
  } else {
    console.log('🔍 ❌ CONDICIÓN NO CUMPLIDA - Ocultando botones');
    return null;
  }
})()}
</div>
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTabActivo('locales')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            tabActivo === 'locales'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🍽️ Locales ({locales.length})
        </button>
        <button
          onClick={() => setTabActivo('platos')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            tabActivo === 'platos'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🍲 Platos ({platos.length})
        </button>
      </div>

      {/* Grid de contenido */}
      {tabActivo === 'locales' ? (
        locales.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Este usuario no ha creado locales</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locales.map(local => (
              <div 
                key={local.id} 
                className="card"
                onClick={() => router.push(`/local/${local.id}`)}
              >
                {local.photos && local.photos[0] && (
                  <img src={local.photos[0]} alt={local.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{local.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{local.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>📍 {local.zone || local.city}</span>
                    <span>💰 {local.priceRange}</span>
                  </div>
                  {local.rating && (
                    <div className="mt-2 text-yellow-500">⭐ {local.rating}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        platos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Este usuario no ha creado platos</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platos.map(plato => (
              <div 
                key={plato.id} 
                className="card"
                onClick={() => router.push(`/plato/${plato.id}`)}
              >
                {plato.image && (
                  <img src={plato.image} alt={plato.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plato.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plato.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-bold">${plato.price}</span>
                    <span className="text-sm text-gray-500">{plato.category}</span>
                  </div>
                  {plato.rating && (
                    <div className="mt-2 text-yellow-500">⭐ {plato.rating}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}