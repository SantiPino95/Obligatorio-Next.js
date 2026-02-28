'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function NuevoLocalPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'RESTAURANTE',
    priceRange: 'MEDIO',
    description: '',
    address: '',
    city: '',
    zone: '',
    hours: '',
    photos: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const token = localStorage.getItem('token');
      
      const respuesta = await fetch('https://api-react-taller-production.up.railway.app/api/locals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const datos = await respuesta.json();
      console.log('✅ Local creado:', datos);
      
      // Redirigir al local creado (si tiene id)
      if (datos.id) {
        router.push(`/local/${datos.id}`);
      } else {
        router.push('/');
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al crear el local');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Crear Nuevo Local</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="name"
          placeholder="Nombre del local *"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={{ padding: '10px' }}
        >
          <option value="RESTAURANTE">Restaurante</option>
          <option value="CAFETERIA">Cafetería</option>
          <option value="BAR">Bar</option>
          <option value="FOOD_TRUCK">Food Truck</option>
          <option value="OTROS">Otros</option>
        </select>

        <select
          name="priceRange"
          value={formData.priceRange}
          onChange={handleChange}
          style={{ padding: '10px' }}
        >
          <option value="ECONOMICO">Económico</option>
          <option value="MEDIO">Medio</option>
          <option value="ALTO">Alto</option>
        </select>

        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          style={{ padding: '10px', minHeight: '100px' }}
        />

        <input
          type="text"
          name="address"
          placeholder="Dirección *"
          value={formData.address}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />

        <input
          type="text"
          name="city"
          placeholder="Ciudad *"
          value={formData.city}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />

        <input
          type="text"
          name="zone"
          placeholder="Zona"
          value={formData.zone}
          onChange={handleChange}
          style={{ padding: '10px' }}
        />

        <input
          type="text"
          name="hours"
          placeholder="Horario (ej: 10:00 - 20:00)"
          value={formData.hours}
          onChange={handleChange}
          style={{ padding: '10px' }}
        />

        <button 
          type="submit"
          disabled={cargando}
          style={{
            padding: '15px',
            background: 'blue',
            color: 'white',
            border: 'none',
            cursor: cargando ? 'not-allowed' : 'pointer'
          }}
        >
          {cargando ? 'Creando...' : 'Crear Local'}
        </button>
      </form>
    </div>
  );
}