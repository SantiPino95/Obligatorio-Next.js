'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { platosService } from '@/services/platosServices';
import { DISH_CATEGORIES_ARRAY } from '@/utils/constants';

export default function NuevoPlatoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'PRINCIPAL',
    price: '',
    description: '',
    image: '',
    localId: '' // ID del local al que pertenece
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!formData.name || !formData.price || !formData.localId) {
      setError('Completa los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      // Convertir precio a número
      const platoData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      const response = await platosService.createPlato(platoData);
      console.log('📍 Plato creado:', response);
      
      setSuccess('¡Plato creado exitosamente!');
      
      // Limpiar formulario
      setFormData({
        name: '',
        category: 'PRINCIPAL',
        price: '',
        description: '',
        image: '',
        localId: ''
      });

      // Opcional: redirigir después de 2 segundos
      setTimeout(() => {
        router.push(`/plato/${response.id}`);
      }, 2000);

    } catch (err) {
      console.error('📍 Error:', err);
      setError(err.message || 'Error al crear el plato');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', color: '#6b21a8', marginBottom: '2rem' }}>
        🍲 Crear Nuevo Plato
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Nombre del Plato *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Categoría *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
            required
          >
            {DISH_CATEGORIES_ARRAY.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Precio (en pesos) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
            min="0"
            step="1"
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            ID del Local *
          </label>
          <input
            type="number"
            name="localId"
            value={formData.localId}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
            placeholder="Ej: 1, 2, 3..."
            required
          />
          <small style={{ color: '#6b7280' }}>
            Ingresa el ID del local al que pertenece este plato
          </small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            URL de la imagen
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <small style={{ color: '#6b7280' }}>
            Opcional: URL de una imagen para el plato
          </small>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '0.375rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#dcfce7',
            color: '#166534',
            padding: '1rem',
            borderRadius: '0.375rem'
          }}>
            {success}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(to right, #9333ea, #db2777)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Creando...' : 'Crear Plato'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            style={{
              background: '#e5e7eb',
              color: '#374151',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}