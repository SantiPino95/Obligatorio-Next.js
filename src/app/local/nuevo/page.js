'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { localesService } from '@/services/localesServices';
import { LOCAL_TYPES_ARRAY, PRICE_RANGES_ARRAY } from '@/utils/constants';

export default function NuevoLocalPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!formData.name || !formData.address || !formData.city) {
      setError('Completa los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      const localData = {
        ...formData,
        // Asegurar tipos correctos
        type: formData.type,
        priceRange: formData.priceRange
      };

      console.log('📍 Enviando local:', localData);
      const response = await localesService.createLocal(localData);
      console.log('📍 Local creado:', response);
      
      setSuccess('¡Local creado exitosamente!');
      
      // Limpiar formulario
      setFormData({
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

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push(`/local/${response.id}`);
      }, 2000);

    } catch (err) {
      console.error('📍 Error:', err);
      setError(err.message || 'Error al crear el local');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#6b21a8' }}>
          🍽️ Crear Nuevo Local
        </h1>
        <button
          onClick={() => router.back()}
          style={{
            background: '#e5e7eb',
            color: '#374151',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Nombre */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Nombre del Local *
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
              borderRadius: '0.375rem',
              fontSize: '1rem'
            }}
            placeholder="Ej: La Esquina"
            required
          />
        </div>

        {/* Tipo y Rango de Precio */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Tipo *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
              required
            >
              {LOCAL_TYPES_ARRAY.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Rango de Precio *
            </label>
            <select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
              required
            >
              {PRICE_RANGES_ARRAY.map(precio => (
                <option key={precio.value} value={precio.value}>
                  {precio.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              resize: 'vertical'
            }}
            placeholder="Describe el local, su ambiente, especialidades..."
          />
        </div>

        {/* Dirección */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Dirección *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem'
            }}
            placeholder="Ej: Av. 18 de Julio 1234"
            required
          />
        </div>

        {/* Ciudad y Zona */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Ciudad *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
              placeholder="Ej: Montevideo"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Zona
            </label>
            <input
              type="text"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
              placeholder="Ej: Centro"
            />
          </div>
        </div>

        {/* Horario */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Horario de Atención
          </label>
          <input
            type="text"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem'
            }}
            placeholder="Ej: 10:00 - 23:00"
          />
        </div>

        {/* URL de imagen (simplificado) */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            URL de imagen principal
          </label>
          <input
            type="url"
            name="photo"
            onChange={(e) => {
              // Si la API espera un array de fotos
              setFormData(prev => ({
                ...prev,
                photos: e.target.value ? [e.target.value] : []
              }));
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem'
            }}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
            Opcional: URL de una imagen para el local
          </small>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#dcfce7',
            color: '#166534',
            padding: '1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}>
            {success} Redirigiendo...
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(to right, #9333ea, #db2777)',
              color: 'white',
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              flex: 1
            }}
          >
            {loading ? 'Creando...' : 'Crear Local'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            style={{
              background: '#e5e7eb',
              color: '#374151',
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '1rem',
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