'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function NuevoPlatoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'PRINCIPAL',
    price: '',
    description: '',
    city: '',
    localId: '',
    image: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const token = localStorage.getItem('token');
      
      const respuesta = await fetch('https://api-react-taller-production.up.railway.app/api/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price)
        })
      });

      const datos = await respuesta.json();
      console.log('✅ Plato creado:', datos);
      
      if (datos.id) {
        router.push(`/plato/${datos.id}`);
      } else {
        router.push('/');
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al crear el plato');
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
      <h1>Crear Nuevo Plato</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="name"
          placeholder="Nombre del plato *"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{ padding: '10px' }}
        >
          <option value="ENTRADA">Entrada</option>
          <option value="PRINCIPAL">Principal</option>
          <option value="POSTRE">Postre</option>
          <option value="BEBIDA">Bebida</option>
          <option value="OTROS">Otros</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Precio *"
          value={formData.price}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          style={{ padding: '10px', minHeight: '100px' }}
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
          type="number"
          name="localId"
          placeholder="ID del local *"
          value={formData.localId}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />

        <input
          type="url"
          name="image"
          placeholder="URL de la imagen (opcional)"
          value={formData.image}
          onChange={handleChange}
          style={{ padding: '10px' }}
        />

        <button 
          type="submit"
          disabled={cargando}
          style={{
            padding: '15px',
            background: 'green',
            color: 'white',
            border: 'none',
            cursor: cargando ? 'not-allowed' : 'pointer'
          }}
        >
          {cargando ? 'Creando...' : 'Crear Plato'}
        </button>
      </form>
    </div>
  );
}