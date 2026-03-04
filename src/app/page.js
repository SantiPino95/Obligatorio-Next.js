// app/page.js
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import ModalLocal from '@/components/local/ModalLocal';
import ModalUsuario from '@/components/usuario/ModalUsuario'; 
import ModalPlato from '@/components/plato/Modalplato';

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [locales, setLocales] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [vista, setVista] = useState('locales');
  
  // Modales
  const [localModalOpen, setLocalModalOpen] = useState(false);
  const [selectedLocalId, setSelectedLocalId] = useState(null);
  
  // Modal de usuario
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Modal de Plato
  const [PlatoModalOpen , setPlatoModalOpen] = useState (false);
  const [selectedPlatoId, setSelectedPlatoId] =useState(null);

  // Cargar datos (igual que antes)
  useEffect(() => {
    if (!user) return;

    const fetchLocales = async () => {
      const res = await fetch('https://api-react-taller-production.up.railway.app/api/locals');
      const data = await res.json();
      setLocales(data[Object.keys(data)[0]] || []);
    };

    const fetchPlatos = async () => {
      const res = await fetch('https://api-react-taller-production.up.railway.app/api/dishes');
      const data = await res.json();
      setPlatos(data[Object.keys(data)[0]] || []);
    };

    fetchLocales();
    fetchPlatos();
  }, [user]);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLocalClick = (localId) => {
    setSelectedLocalId(localId);
    setLocalModalOpen(true);
  };

  const handlePlatoClick = (platoId) => {
    setSelectedPlatoId(platoId);
    setPlatoModalOpen(true);
  }

  const handleCreatorClick = (creatorId) => {
    setSelectedUserId(creatorId);
    setUserModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (igual) */}
      <header className="bg-white shadow-sm p-4">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">🍽️ GastroApp</h1>
          <div className="flex items-center gap-4">
            <span>Hola, {user.name}</span>
            <button 
              onClick={() => handleCreatorClick(user.id)} 
              className="text-purple-600 hover:underline"
            >
              Mi perfil
            </button>
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Tabs (igual) */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setVista('locales')}
            className={`px-4 py-2 rounded ${vista === 'locales' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Locales ({locales.length})
          </button>
          <button
            onClick={() => setVista('platos')}
            className={`px-4 py-2 rounded ${vista === 'platos' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Platos ({platos.length})
          </button>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vista === 'locales' 
            ? locales.map(local => (
                <Card
                  key={local.id}
                  item={local}
                  tipo="local"
                  onClick={() => handleLocalClick(local.id)}
                  onCreatorClick={handleCreatorClick}
                />
              ))
            : platos.map(plato => (
                <Card
                  key={plato.id}
                  item={plato}
                  tipo="plato"
                  onClick={() => handlePlatoClick(plato.id)}
                  onCreatorClick={handleCreatorClick}
                />
              ))
          }
        </div>
      </main>

      {/* Modales */}
      <ModalLocal
        localId={selectedLocalId}
        isOpen={localModalOpen}
        onClose={() => setLocalModalOpen(false)}
      />

      <ModalUsuario
        userId={selectedUserId}
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
      />
      <ModalPlato
      platoId={selectedPlatoId}
      isOpen={PlatoModalOpen}
      onClose={() => setPlatoModalOpen(false)}
      />

    </div>
  );
}