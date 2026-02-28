'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PlatoDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [plato, setPlato] = useState(null);

  // Cargar el plato cuando la página carga
  useEffect(() => {
    fetch(`https://api-react-taller-production.up.railway.app/api/dishes/${id}`)
      .then(res => res.json())
      .then(data => setPlato(data));
  }, [id]);

  // Mientras carga
  if (!plato) return <div style={{ padding: '20px' }}>Cargando...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Botón volver */}
      <button 
        onClick={() => router.back()}
        style={{ marginBottom: '20px', padding: '5px 10px' }}
      >
        ← Volver
      </button>

      {/* Título */}
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{plato.name}</h1>

      {/* Imagen (si existe) */}
      {plato.image && (
        <img 
          src={plato.image} 
          alt={plato.name}
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
        />
      )}

      {/* Descripción */}
      <p style={{ fontSize: '18px', margin: '20px 0', color: '#555' }}>
        {plato.description || 'Sin descripción'}
      </p>

      {/* Detalles en dos columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <strong>Categoría:</strong> {plato.category}
        </div>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <strong>Precio:</strong> ${plato.price}
        </div>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <strong>Ciudad:</strong> {plato.city}
        </div>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <strong>Local:</strong> {plato.localName || 'No especificado'}
        </div>
      </div>

      {/* Link al local (si existe) */}
      {plato.localId && (
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => router.push(`/local/${plato.localId}`)}
            style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Ver local
          </button>
        </div>
      )}
    </div>
  );
}