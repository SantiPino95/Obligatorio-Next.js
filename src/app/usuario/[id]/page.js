'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function UsuarioPerfilPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  // ✅ ESTADOS NECESARIOS
  const [usuario, setUsuario] = useState(null);
  const [locales, setLocales] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del usuario
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api-react-taller-production.up.railway.app/api/users/${id}`);
        const data = await res.json();
        
        // La API puede devolver diferentes estructuras
        const userData = data.user || data.item || data;
        
        setUsuario(userData);
        setLocales(userData.locals || []);
        setPlatos(userData.dishes || []);
      } catch (error) {
        console.error('Error cargando usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarUsuario();
    }
  }, [id]);

  const esMiPerfil = user?.id == id;

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (!usuario) {
    return <div className="text-center py-8">Usuario no encontrado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Botón volver */}
      <button 
        onClick={() => router.back()}
        className="text-purple-600 hover:underline mb-4 block"
      >
        ← Volver
      </button>

      {/* Header del perfil */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {(usuario.name || usuario.username || '?').charAt(0).toUpperCase()}
          </div>
          
          {/* Información del usuario */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{usuario.name}</h1>
            <p className="text-gray-600">@{usuario.username}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>{locales.length} locales</span>
              <span>•</span>
              <span>{platos.length} platos</span>
            </div>
          </div>
        </div>

        {/* Botones de acción (solo si es su perfil) */}
        {esMiPerfil && (
          <div className="flex gap-4 mt-6 pt-6 border-t">
            <Button 
              onClick={() => router.push('/local/nuevo')}
              variant="primary"
            >
              + Nuevo Local
            </Button>
            <Button 
              onClick={() => router.push('/plato/nuevo')}
              variant="primary"
            >
              + Nuevo Plato
            </Button>
          </div>
        )}
      </div>

      {/* Sección de locales */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Locales creados ({locales.length})
        </h2>
        
        {locales.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-6xl mb-4">🏠</p>
            <p className="text-gray-500">No ha creado locales todavía</p>
            
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aquí van los locales cuando existan */}
            {locales.map(local => (
              <div key={local.id} className="border p-4 rounded-lg">
                <h3 className="font-bold">{local.name}</h3>
                <p className="text-gray-600">{local.city}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de platos (similar) */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Platos creados ({platos.length})
        </h2>
        
        {platos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-6xl mb-4">🍲</p>
            <p className="text-gray-500">No ha creado platos todavía</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platos.map(plato => (
              <div key={plato.id} className="border p-4 rounded-lg">
                <h3 className="font-bold">{plato.name}</h3>
                <p className="text-green-600">${plato.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}