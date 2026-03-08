'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';

export default function NuevoLocalPage() {
  // ============================================
  // 1. HOOKS Y ESTADOS BÁSICOS
  // ============================================
  const { user } = useAuth();           // ¿Quién es el usuario?
  const router = useRouter();            // Para navegar entre páginas
  const [cargando, setCargando] = useState(false); // ¿Estamos enviando?
  const [photoUrl, setPhotoUrl] = useState('');    // URL de la foto que vamos a agregar

  // ============================================
  // 2. DATOS DEL FORMULARIO
  // ============================================
  const [formData, setFormData] = useState({
    name: '',        // Nombre del local
    type: 'RESTAURANTE',     // Tipo (por defecto RESTAURANTE)
    priceRange: 'MEDIO',     // Rango de precio (por defecto MEDIO)
    description: '', // Descripción
    address: '',     // Dirección
    city: '',        // Ciudad
    zone: '',        // Zona
    hours: '',       // Horario
    photos: []       // Array con URLs de fotos
  });

  // ============================================
  // 3. FUNCIONES PARA MANEJAR FOTOS
  // ============================================
  const handleAddPhoto = () => {
    // Si la URL no está vacía
    if (photoUrl.trim()) {
      // Agregamos la nueva URL al array de fotos
      setFormData({
        ...formData,                       // Copiamos todo lo que ya tenía
        photos: [...formData.photos, photoUrl]  // Agregamos la nueva foto
      });
      setPhotoUrl(''); // Limpiamos el input de URL
    }
  };

  const handleRemovePhoto = (index) => {
    // Filtramos: quitamos la foto que tiene ese índice
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    });
  };

  // ============================================
  // 4. ENVIAR EL FORMULARIO A LA API
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();  // Evitamos que la página se recargue
    setCargando(true);   // Mostramos "Cargando..."

    try {
      const token = localStorage.getItem('token'); // Token del usuario

      // Llamamos a la API
      const respuesta = await fetch('https://api-react-taller-production.up.railway.app/api/locals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Token para identificarnos
        },
        body: JSON.stringify(formData) // Enviamos todos los datos
      });

      const datos = await respuesta.json();
      console.log('✅ Local creado:', datos);

      // Si la API devuelve un ID, vamos a la página del local creado
      if (datos.id) {
        router.push(`/local/${datos.id}`);
      } else {
        router.push('/'); // Si no, volvemos al inicio
      }

    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al crear el local');
    } finally {
      setCargando(false); // Terminó de cargar
    }
  };

  // ============================================
  // 5. CUANDO EL USUARIO ESCRIBE EN UN INPUT
  // ============================================
  const handleChange = (e) => {
    // Actualizamos SOLO el campo que cambió
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ============================================
  // 6. REDIRIGIR SI NO HAY USUARIO
  // ============================================
  useEffect(() => {
    if (!user) {
      router.push('/login'); // Si no hay usuario, lo mandamos al login
    }
  }, [user, router]);

  // Mientras redirige, no mostramos nada
  if (!user) {
    return null;
  }

  // ============================================
  // 7. LO QUE SE VE EN PANTALLA (JSX)
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">🏠 Crear Nuevo Local</h1>
        
        {/* Botón para volver */}
        <button
          onClick={() => router.back()}
          className="text-purple-600 hover:underline mb-4 block"
        >
          ← Volver
        </button>

        {/* ======================================== */}
        {/* FORMULARIO */}
        {/* ======================================== */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre del local */}
          <Input
            label="Nombre del local*"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: La Esquina"
            required
          />

          {/* Tipo de local (Select) */}
          <Select
            label="Categoría *"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="RESTAURANTE">Restaurante</option>
            <option value="CAFETERIA">Cafetería</option>
            <option value="BAR">Bar</option>
            <option value="FOOD_TRUCK">Food Truck</option>
            <option value="OTROS">Otros</option>
          </Select>

          {/* Rango de precio (Select) */}
          <Select
            label="Gama *"
            name="priceRange"
            value={formData.priceRange}
            onChange={handleChange}
          >
            <option value="ECONOMICO">Económico</option>
            <option value="MEDIO">Medio</option>
            <option value="ALTO">Alto</option>
          </Select>

          {/* Descripción (Textarea) */}
          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe el local..."
            rows={3}
          />

          {/* Dirección */}
          <Input
            label="Dirección *"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Ej: Av. 18 de Julio 1234"
            required
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

          {/* Zona */}
          <Input
            label="Zona"
            name="zone"
            value={formData.zone}
            onChange={handleChange}
            placeholder="Ej: Centro"
          />

          {/* Horario */}
          <Input
            label="Horario"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            placeholder="Ej: 10:00 - 20:00"
          />

          {/* ======================================== */}
          {/* SECCIÓN DE FOTOS */}
          {/* ======================================== */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-3">Fotos del local</h3>

            {/* Input para URL + Botón Agregar */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  label="URL de la foto"
                  name="photoUrl"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://ejemplo.com/foto.jpg"
                />
              </div>

              <Button
                type="button"
                onClick={handleAddPhoto}
                variant="secondary"
                size="sm"
                className="mb-1"
              >
                Agregar
              </Button>
            </div>

            {/* Lista de fotos agregadas */}
            <div className="mt-4 space-y-2">
              {formData.photos.map((url, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600 truncate flex-1">
                    📸 {url}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {formData.photos.length === 0 && (
                <p className="text-sm text-gray-400">No hay fotos agregadas</p>
              )}
            </div>
          </div>

          {/* Botón para enviar el formulario */}
          <Button
            type="submit"
            disabled={cargando}
            variant="primary"
            fullWidth
          >
            {cargando ? 'Creando...' : 'Crear Local'}
          </Button>
        </form>
      </div>
    </div>
  );
}