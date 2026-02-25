'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { localesService } from '@/services/localesServices';
import { platosService } from '@/services/platosServices';
import { LOCAL_TYPES_ARRAY, PRICE_RANGES_ARRAY, DISH_CATEGORIES_ARRAY } from '@/utils/constants';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Estados para datos
  const [tabActivo, setTabActivo] = useState('locales');
  const [locales, setLocales] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filtros
  const [filtrosLocales, setFiltrosLocales] = useState({
    q: '',
    type: '',
    priceRange: '',
    rating: '',
    city: '',
    zone: ''
  });
  
  const [filtrosPlatos, setFiltrosPlatos] = useState({
    q: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    city: '',
    localId: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar datos según el tab activo
  useEffect(() => {
  const cargarDatos = async () => {
    if (!user || !mounted) return;
    
    try {
      setDataLoading(true);
      setError('');
      
      if (tabActivo === 'locales') {
        console.log('📍 Cargando locales con filtros:', filtrosLocales);
        
        // Limpiar filtros vacíos antes de enviar
        const filtrosLimpios = {};
        Object.keys(filtrosLocales).forEach(key => {
          if (filtrosLocales[key] && filtrosLocales[key].trim() !== '') {
            filtrosLimpios[key] = filtrosLocales[key];
          }
        });
        
        console.log('📍 Filtros limpios:', filtrosLimpios);
        
        const data = await localesService.getLocales(filtrosLimpios);
        console.log('📍 Datos recibidos:', data);
        setLocales(Array.isArray(data) ? data : []);
      } else {
        console.log('📍 Cargando platos con filtros:', filtrosPlatos);
        
        const filtrosLimpios = {};
        Object.keys(filtrosPlatos).forEach(key => {
          if (filtrosPlatos[key] && filtrosPlatos[key].trim() !== '') {
            filtrosLimpios[key] = filtrosPlatos[key];
          }
        });
        
        const data = await platosService.getPlatos(filtrosLimpios);
        setPlatos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('📍 Error cargando datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setDataLoading(false);
    }
  };

  cargarDatos();
}, [user, mounted, tabActivo, JSON.stringify(filtrosLocales), JSON.stringify(filtrosPlatos)]);
// 👆 importante: convertir a string para que useEffect detecte cambios en objetos
  // Redirigir si no hay usuario
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router, mounted]);

  const handleFiltroChange = (e, tipo) => {
    const { name, value } = e.target;
    if (tipo === 'locales') {
      setFiltrosLocales(prev => ({ ...prev, [name]: value }));
    } else {
      setFiltrosPlatos(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!mounted || authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#4b5563' }}>Cargando...</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Verificando sesión</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
     
      {/* Header */}
<header style={{
  background: 'white',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 10
}}>
  <div style={{
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <h1 
      onClick={() => router.push('/')}
      style={{ 
        fontSize: '1.5rem', 
        color: '#6b21a8', 
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      🍽️ GastroApp
    </h1>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span>Hola, {user.name || user.username}</span>
      
      {/* Avatar CLICKEABLE que lleva al perfil */}
<div
  onClick={() => router.push(`/usuario/${user.id}`)}
  style={{
    width: '40px',
    height: '40px',
    background: 'linear-gradient(to right, #9333ea, #db2777)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  }}
>
  {(user.name || user.username).charAt(0).toUpperCase()}
</div>
      
      <button
        onClick={handleLogout}
        style={{
          padding: '0.5rem 1rem',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer'
        }}
      >
        Salir
      </button>
    </div>
  </div>
</header>
      {/* Contenido principal */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setTabActivo('locales')}
            style={{
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              background: tabActivo === 'locales' ? 'linear-gradient(to right, #9333ea, #db2777)' : 'white',
              color: tabActivo === 'locales' ? 'white' : '#374151',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            🍽️ Locales
          </button>
          <button
            onClick={() => setTabActivo('platos')}
            style={{
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              background: tabActivo === 'platos' ? 'linear-gradient(to right, #9333ea, #db2777)' : 'white',
              color: tabActivo === 'platos' ? 'white' : '#374151',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            🍲 Platos
          </button>
        </div>

        {/* Filtros */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            🔍 Filtros
          </h3>
          
          {tabActivo === 'locales' ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <input
                type="text"
                name="q"
                placeholder="Buscar por nombre"
                value={filtrosLocales.q}
                onChange={(e) => handleFiltroChange(e, 'locales')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
              <select
                name="type"
                value={filtrosLocales.type}
                onChange={(e) => handleFiltroChange(e, 'locales')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              >
                <option value="">Tipo</option>
                {LOCAL_TYPES_ARRAY.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <select
                name="priceRange"
                value={filtrosLocales.priceRange}
                onChange={(e) => handleFiltroChange(e, 'locales')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              >
                <option value="">Precio</option>
                {PRICE_RANGES_ARRAY.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <select
                name="rating"
                value={filtrosLocales.rating}
                onChange={(e) => handleFiltroChange(e, 'locales')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              >
                <option value="">Puntuación</option>
                <option value="5">5 estrellas</option>
                <option value="4">4+ estrellas</option>
                <option value="3">3+ estrellas</option>
              </select>
              <input
                type="text"
                name="city"
                placeholder="Ciudad"
                value={filtrosLocales.city}
                onChange={(e) => handleFiltroChange(e, 'locales')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
              <input
                type="text"
                name="zone"
                placeholder="Zona"
                value={filtrosLocales.zone}
                onChange={(e) => handleFiltroChange(e, 'locales')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <input
                type="text"
                name="q"
                placeholder="Buscar por nombre"
                value={filtrosPlatos.q}
                onChange={(e) => handleFiltroChange(e, 'platos')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
              <select
                name="category"
                value={filtrosPlatos.category}
                onChange={(e) => handleFiltroChange(e, 'platos')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              >
                <option value="">Categoría</option>
                {DISH_CATEGORIES_ARRAY.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <input
                type="date"
                name="dateFrom"
                value={filtrosPlatos.dateFrom}
                onChange={(e) => handleFiltroChange(e, 'platos')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
              <input
                type="date"
                name="dateTo"
                value={filtrosPlatos.dateTo}
                onChange={(e) => handleFiltroChange(e, 'platos')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
              <input
                type="text"
                name="city"
                placeholder="Ciudad"
                value={filtrosPlatos.city}
                onChange={(e) => handleFiltroChange(e, 'platos')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
            </div>
          )}
        </div>

        {/* Resultados */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {dataLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Cargando {tabActivo}...</p>
          </div>
        ) : (
          <>
            {tabActivo === 'locales' ? (
              locales.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.75rem' }}>
                  <p>No se encontraron locales</p>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {locales.map(local => (
                    <div
                      key={local.id}
                      onClick={() => router.push(`/local/${local.id}`)}
                      style={{
                        background: 'white',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                      }}
                    >
                      {local.photos && local.photos[0] && (
                        <img
                          src={local.photos[0]}
                          alt={local.name}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{local.name}</h3>
                          {local.rating && (
                            <span style={{ color: '#fbbf24' }}>⭐ {local.rating}</span>
                          )}
                        </div>
                        <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>{local.description}</p>
                        <div style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                          <span>📍 {local.zone || local.city}</span>
                          <span>💰 {local.priceRange}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              platos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.75rem' }}>
                  <p>No se encontraron platos</p>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {platos.map(plato => (
                    <div
                      key={plato.id}
                      onClick={() => router.push(`/plato/${plato.id}`)}
                      style={{
                        background: 'white',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                      }}
                    >
                      {plato.image && (
                        <img
                          src={plato.image}
                          alt={plato.name}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{plato.name}</h3>
                          {plato.rating && (
                            <span style={{ color: '#fbbf24' }}>⭐ {plato.rating}</span>
                          )}
                        </div>
                        <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>{plato.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#10b981', fontWeight: 'bold' }}>${plato.price}</span>
                          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{plato.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </main>
    </div>
  );
}