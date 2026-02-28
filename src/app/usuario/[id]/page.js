'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UsuarioPerfilPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    fetch(`https://api-react-taller-production.up.railway.app/api/users/${id}`)
      .then(res => res.json())
      .then(data => setUsuario(data.item || data));
  }, [id]);

  if (!usuario) return <div>Cargando...</div>;

  const esMiPerfil = user?.id == id;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => router.back()}>← Volver</button>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '20px 0' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'purple', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '30px'
        }}>
          {usuario.name?.charAt(0) || usuario.username?.charAt(0)}
        </div>
        <div>
          <h1>{usuario.name}</h1>
          <p>@{usuario.username}</p>
        </div>
      </div>

     {esMiPerfil && (
  <div style={{ margin: '20px 0' }}>
    <button 
      onClick={() => router.push('/local/nuevo')}
      style={{ 
        marginRight: '10px',
        padding: '10px 20px',
        background: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      + Nuevo Local
    </button>
    <button 
      onClick={() => router.push('/plato/nuevo')}
      style={{ 
        padding: '10px 20px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      + Nuevo Plato
    </button>
  </div>
)}

      <h2>Locales creados ({usuario.locals?.length || 0})</h2>
      {usuario.locals?.map(local => (
        <div key={local.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{local.name}</h3>
          <p>{local.city}</p>
        </div>
      ))}
    </div>
  );
}