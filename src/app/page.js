'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [locales, setLocales] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [vista, setVista] = useState('locales');
  const [cargando, setCargando] = useState(true);

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Cargar datos
  useEffect(() => {
    async function cargarDatos() {
      if (!user) return;
      
      try {
        setCargando(true);
        
        // Cargar locales - LA CLAVE ESTÁ AQUÍ
        const resLocales = await fetch('https://api-react-taller-production.up.railway.app/api/locals');
        const datosLocales = await resLocales.json();
        
        // ✅ IMPORTANTE: El array está en la primera propiedad del objeto
        const arrayLocales = datosLocales[Object.keys(datosLocales)[0]] || [];
        setLocales(arrayLocales);
        
        // Cargar platos - IGUAL
        const resPlatos = await fetch('https://api-react-taller-production.up.railway.app/api/dishes');
        const datosPlatos = await resPlatos.json();
        const arrayPlatos = datosPlatos[Object.keys(datosPlatos)[0]] || [];
        setPlatos(arrayPlatos);
        
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, [user]);

  if (!user || cargando) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '30px',
        padding: '10px',
        background: '#f0f0f0',
        borderRadius: '5px'
      }}>
        <h1 style={{ margin: 0 }}>🍽️ GastroApp</h1>
        <div>
          <span>Hola, {user.name}</span>
          <button 
            onClick={() => router.push(`/usuario/${user.id}`)}
            style={{ margin: '0 10px', padding: '5px 10px' }}
          >
            Mi Perfil
          </button>
          <button onClick={logout} style={{ padding: '5px 10px' }}>Salir</button>
        </div>
      </div>

      {/* Botones de vista */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setVista('locales')}
          style={{ 
            marginRight: '10px',
            padding: '10px 20px',
            background: vista === 'locales' ? 'blue' : '#ddd',
            color: vista === 'locales' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🍽️ Locales ({locales.length})
        </button>
        <button 
          onClick={() => setVista('platos')}
          style={{ 
            padding: '10px 20px',
            background: vista === 'platos' ? 'blue' : '#ddd',
            color: vista === 'platos' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🍲 Platos ({platos.length})
        </button>
      </div>

      {/* Listado */}
      {vista === 'locales' ? (
        <div>
          <h2>Locales</h2>
          {locales.map(local => (
            <div 
              key={local.id}
              onClick={() => router.push(`/local/${local.id}`)}
              style={{ 
                border: '1px solid #ccc',
                padding: '15px',
                marginBottom: '10px',
                cursor: 'pointer',
                borderRadius: '5px'
              }}
            >
              <h3 style={{ margin: '0 0 5px 0' }}>{local.name}</h3>
              <p style={{ margin: '0', color: '#666' }}>📍 {local.city}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2>Platos</h2>
          {platos.map(plato => (
            <div 
              key={plato.id}
              onClick={() => router.push(`/plato/${plato.id}`)}
              style={{ 
                border: '1px solid #ccc',
                padding: '15px',
                marginBottom: '10px',
                cursor: 'pointer',
                borderRadius: '5px'
              }}
            >
              <h3 style={{ margin: '0 0 5px 0' }}>{plato.name}</h3>
              <p style={{ margin: '0', color: '#666' }}>💰 ${plato.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}