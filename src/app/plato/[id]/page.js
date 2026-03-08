'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PlatoDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [plato, setPlato] = useState(null);

  useEffect(() => {
    fetch(`https://api-react-taller-production.up.railway.app/api/dishes/${id}`)
      .then(res => res.json())
      .then(data => setPlato(data));
  }, [id]);

  if (!plato) return <div style={{ padding: '20px' }}>Cargando...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => router.back()}>← Volver</button>
      <h1>{plato.name}</h1>
      {plato.image && <img src={plato.image} alt={plato.name} style={{ width: '100%' }} />}
      <p>{plato.description}</p>
      <p><strong>Categoría:</strong> {plato.category}</p>
      <p><strong>Precio:</strong> ${plato.price}</p>
      <p><strong>Ciudad:</strong> {plato.city}</p>
      <p><strong>Local:</strong> {plato.localName}</p>
      {plato.localId && (
        <button onClick={() => router.push(`/local/${plato.localId}`)}>
          Ver local
        </button>
      )}
    </div>
  );
}