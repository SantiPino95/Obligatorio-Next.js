'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LocalDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [local, setLocal] = useState(null);

  useEffect(() => {
    fetch(`https://api-react-taller-production.up.railway.app/api/locals/${id}`)
      .then(res => res.json())
      .then(data => setLocal(data));
  }, [id]);

  if (!local) return <div>Cargando...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => router.back()}>← Volver</button>
      <h1>{local.name}</h1>
      <p>{local.description}</p>
      <p><strong>Dirección:</strong> {local.address}</p>
      <p><strong>Ciudad:</strong> {local.city}</p>
      <p><strong>Tipo:</strong> {local.type}</p>
      <p><strong>Precio:</strong> {local.priceRange}</p>
      <p><strong>Horario:</strong> {local.hours}</p>
    </div>
  );
}