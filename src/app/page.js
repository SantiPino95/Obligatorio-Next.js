// app/page.js
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import ModalLocal from '@/components/local/ModalLocal'; 
import ModalPlato from '@/components/plato/Modalplato';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function HomePage() {
  // ============================================
  // 1. HOOKS BÁSICOS 
  // ============================================
  const { user, logout } = useAuth();  // Datos del usuario
  const router = useRouter();           // Para navegar

  // ============================================
  // 2. DATOS QUE VAMOS A MOSTRAR
  // ============================================
  const [locales, setLocales] = useState([]);  // Lista de locales
  const [platos, setPlatos] = useState([]);    // Lista de platos
  const [vista, setVista] = useState('locales'); // ¿Mostramos locales o platos?

  // ============================================
  // 3. FILTROS PARA LOCALES
  // ============================================
  const [filtrosLocales, setFiltrosLocales] = useState({
    q: '',          // Buscar por nombre
    type: '',       // Tipo (restaurante, cafetería...)
    priceRange: '', // Rango de precio
    rating: '',     // Puntuación mínima
    city: '',       // Ciudad
    zone: ''        // Zona
  });

  // ============================================
  // 4. FILTROS PARA PLATOS
  // ============================================
  const [filtrosPlatos, setFiltrosPlatos] = useState({
    q: '',          // Buscar por nombre
    category: '',   // Categoría
    dateFrom: '',   // Fecha desde
    dateTo: '',     // Fecha hasta
    city: '',       // Ciudad
    localId: ''     // ID del local
  });

  // ============================================
  // 5. CONTROL DE MODALES (ventanas emergentes)
  // ============================================
  const [localModalOpen, setLocalModalOpen] = useState(false);
  const [selectedLocalId, setSelectedLocalId] = useState(null);
  const [platoModalOpen, setPlatoModalOpen] = useState(false);
  const [selectedPlatoId, setSelectedPlatoId] = useState(null);
  // Nota: falta el estado para userModal (lo agregaremos después)

  // ============================================
  // 6. FUNCIÓN PARA ARMAR LA URL CON FILTROS
  // ============================================
  const construirURL = (base, filtros) => {
    const params = new URLSearchParams();
    // Solo agregamos los filtros que tienen algún valor
    Object.keys(filtros).forEach(key => {
      if (filtros[key] && filtros[key] !== '') {
        params.append(key, filtros[key]);
      }
    });
    // Si hay filtros, los agregamos con ? ej: ?city=Montevideo&type=RESTAURANTE
    return `${base}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  // ============================================
  // 7. CARGAR DATOS CUANDO CAMBIA ALGO
  // ============================================
  useEffect(() => {
    // Si no hay usuario, lo mandamos al login
    if (!user) {
      router.push('/login');
      return;
    }

    // Función para traer datos de la API
    const fetchData = async () => {
      try {
        if (vista === 'locales') {
          // Pedimos locales con los filtros actuales
          const url = construirURL('https://api-react-taller-production.up.railway.app/api/locals', filtrosLocales);
          const res = await fetch(url);
          const data = await res.json();
          // La API devuelve un objeto con una propiedad que contiene el array
          setLocales(data[Object.keys(data)[0]] || []);
        } else {
          // Pedimos platos con los filtros actuales
          const url = construirURL('https://api-react-taller-production.up.railway.app/api/dishes', filtrosPlatos);
          const res = await fetch(url);
          const data = await res.json();
          setPlatos(data[Object.keys(data)[0]] || []);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
    // Esto se ejecuta cada vez que cambia: el usuario, la vista o los filtros
  }, [user, vista, filtrosLocales, filtrosPlatos]);

  // ============================================
  // 8. QUÉ PASA CUANDO EL USUARIO HACE CLIC
  // ============================================
  const handleLocalClick = (localId) => {
    setSelectedLocalId(localId);
    setLocalModalOpen(true); // Abrimos el modal del local
  };

  const handlePlatoClick = (platoId) => {
    setSelectedPlatoId(platoId);
    setPlatoModalOpen(true); // Abrimos el modal del plato
  };

  const handleCreatorClick = (creatorId) => {
    
    console.log('Click en creador:', creatorId);
  };

  // Cuando el usuario cambia un filtro
  const handleFiltroChange = (e, tipo) => {
    const { name, value } = e.target;
    if (tipo === 'locales') {
      // Actualizamos SOLO el filtro que cambió
      setFiltrosLocales(prev => ({ ...prev, [name]: value }));
    } else {
      setFiltrosPlatos(prev => ({ ...prev, [name]: value }));
    }
  };

  // ============================================
  // 9. LO QUE SE VE EN PANTALLA
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ======================================== */}
      {/* HEADER (barra de arriba) */}
      {/* ======================================== */}
      <header className="bg-white shadow-sm p-4">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-500">🍽️ Rutas del sabor App</h1>
          <div className="flex items-center gap-4">
            <span>Hola, {user?.name}</span>
            <button 
              onClick={() => router.push(`/usuario/${user?.id}`)} 
              className="bg-blue-600 text-white hover:underline px-3 py-2 rounded"
            >
              Mi perfil
            </button>
            <button onClick={logout} className="bg-red-500 text-white px-2 py-1 rounded">
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* ======================================== */}
      {/* CONTENIDO PRINCIPAL */}
      {/* ======================================== */}
      <main className="container-custom py-8">
        
        {/* TABS (botones para cambiar entre Locales y Platos) */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setVista('locales')}
            className={`px-4 py-2 rounded ${
              vista === 'locales' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'bg-gray-200'
            }`}
          >
            Locales ({locales.length})
          </button>
          <button
            onClick={() => setVista('platos')}
            className={`px-4 py-2 rounded ${
              vista === 'platos' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'bg-gray-200'
            }`}
          >
            Platos ({platos.length})
          </button>
        </div>

        {/* ======================================== */}
        {/* FILTROS (solo se muestra el de la pestaña activa) */}
        {/* ======================================== */}

        {/* FILTROS PARA LOCALES */}
        {vista === 'locales' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">🔍 Filtrar locales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              
              {/* Buscar por nombre */}
              <Input
                type="text"
                name="q"
                placeholder="Buscar por nombre"
                value={filtrosLocales.q}
                onChange={(e) => handleFiltroChange(e, 'locales')}
              />
              
              {/* Tipo de local */}
              <Select
                name="type"
                value={filtrosLocales.type}
                onChange={(e) => handleFiltroChange(e, 'locales')}
              >
                <option value="">Tipo</option>
                <option value="RESTAURANTE">Restaurante</option>
                <option value="CAFETERIA">Cafetería</option>
                <option value="BAR">Bar</option>
                <option value="FOOD_TRUCK">Food Truck</option>
                <option value="OTROS">Otros</option>
              </Select>
              
              {/* Rango de precio */}
              <Select
                name="priceRange"
                value={filtrosLocales.priceRange}
                onChange={(e) => handleFiltroChange(e, 'locales')}
              >
                <option value="">Precio</option>
                <option value="ECONOMICO">Económico</option>
                <option value="MEDIO">Medio</option>
                <option value="ALTO">Alto</option>
              </Select>
              
              {/* Puntuación mínima */}
              <Select
                name="rating"
                value={filtrosLocales.rating}
                onChange={(e) => handleFiltroChange(e, 'locales')}
              >
                <option value="">Puntuación</option>
                <option value="1">1+ ⭐</option>
                <option value="2">2+ ⭐</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="5">5 ⭐</option>
              </Select>
              
              {/* Ciudad */}
              <Input
                type="text"
                name="city"
                placeholder="Ciudad"
                value={filtrosLocales.city}
                onChange={(e) => handleFiltroChange(e, 'locales')}
              />
              
              {/* Zona */}
              <Input
                type="text"
                name="zone"
                placeholder="Zona"
                value={filtrosLocales.zone}
                onChange={(e) => handleFiltroChange(e, 'locales')}
              />
            </div>
          </div>
        )}

        {/* FILTROS PARA PLATOS */}
        {vista === 'platos' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">🔍 Filtrar platos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              
              {/* Buscar por nombre */}
              <Input
                type="text"
                name="q"
                placeholder="Buscar por nombre"
                value={filtrosPlatos.q}
                onChange={(e) => handleFiltroChange(e, 'platos')}
              />
              
              {/* Categoría */}
              <Select
                name="category"
                value={filtrosPlatos.category}
                onChange={(e) => handleFiltroChange(e, 'platos')}
              >
                <option value="">Categoría</option>
                <option value="ENTRADA">Entrada</option>
                <option value="PRINCIPAL">Principal</option>
                <option value="POSTRE">Postre</option>
                <option value="BEBIDA">Bebida</option>
                <option value="OTROS">Otros</option>
              </Select>
              
              {/* Fecha desde */}
              <Input
                type="date"
                name="dateFrom"
                value={filtrosPlatos.dateFrom}
                onChange={(e) => handleFiltroChange(e, 'platos')}
              />
              
              {/* Fecha hasta */}
              <Input
                type="date"
                name="dateTo"
                value={filtrosPlatos.dateTo}
                onChange={(e) => handleFiltroChange(e, 'platos')}
              />
              
              {/* Ciudad */}
              <Input
                type="text"
                name="city"
                placeholder="Ciudad"
                value={filtrosPlatos.city}
                onChange={(e) => handleFiltroChange(e, 'platos')}
              />
              
              {/* ID del local */}
              <Input
                type="number"
                name="localId"
                placeholder="ID del local"
                value={filtrosPlatos.localId}
                onChange={(e) => handleFiltroChange(e, 'platos')}
              />
            </div>
          </div>
        )}

        {/* ======================================== */}
        {/* GRID DE CARDS (locales o platos) */}
        {/* ======================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vista === 'locales' 
            ? // Si estamos en "Locales", mostramos los locales
              locales.map(local => (
                <Card
                  key={local.id}
                  item={local}
                  tipo="local"
                  onClick={() => handleLocalClick(local.id)}
                  onCreatorClick={handleCreatorClick}
                />
              ))
            : // Si estamos en "Platos", mostramos los platos
              platos.map(plato => (
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

      {/* ======================================== */}
      {/* MODALES (ventanas emergentes) */}
      {/* ======================================== */}
      <ModalLocal
        localId={selectedLocalId}
        isOpen={localModalOpen}
        onClose={() => setLocalModalOpen(false)}
      />

      <ModalPlato
        platoId={selectedPlatoId}
        isOpen={platoModalOpen}
        onClose={() => setPlatoModalOpen(false)}
      />
    </div>
  );
}