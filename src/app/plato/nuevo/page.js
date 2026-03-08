'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';

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
          price: Number(formData.price) // Asegurar que price sea número
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

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">🍽️ Crear Nuevo Plato</h1>
        
        <button 
          onClick={() => router.back()}
          className="text-purple-600 hover:underline mb-4 block"
        >
          ← Volver
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <Input
            label="Nombre del plato *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Milanesa con puré"
            required
          />

          {/* Categoría - Usando Select con label incluido */}
          <Select
            label="Categoría *"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="ENTRADA">Entrada</option>
            <option value="PRINCIPAL">Principal</option>
            <option value="POSTRE">Postre</option>
            <option value="BEBIDA">Bebida</option>
            <option value="OTROS">Otros</option>
          </Select>

          {/* Precio */}
          <Input
            label="Precio *"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Ej: 500"
            required
          />

          {/* Descripción */}
          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe el plato..."
            rows={4}
          />

          {/* Ciudad */}
          <Input
            label="Ciudad *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ej: Montevideo"
            required
          />

          {/* ID del Local */}
          <Input
            label="ID del Local *"
            type="number"
            name="localId"
            value={formData.localId}
            onChange={handleChange}
            placeholder="Ej: 1"
            required
          />

          {/* URL de la imagen */}
          <Input
            label="URL de la imagen (opcional)"
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />

          {/* Botón */}
          <Button 
            type="submit"
            disabled={cargando}
            variant="primary"
            fullWidth
          >
            {cargando ? 'Creando...' : 'Crear Plato'}
          </Button>
        </form>
      </div>
    </div>
  );
}