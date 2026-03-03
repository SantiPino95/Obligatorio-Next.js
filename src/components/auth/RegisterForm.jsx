// components/auth/RegisterForm.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error del campo que se está editando
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = 'El usuario es obligatorio';
    else if (formData.username.length < 3) newErrors.username = 'El usuario debe tener al menos 3 caracteres';

    if (!formData.name) newErrors.name = 'El nombre es obligatorio';

    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      
      await register(formData.username, formData.name, formData.password);
      router.push('/'); // Redirigir al home
      
    } catch (err) {
      setErrors({ 
        general: err.message || 'Error al registrarse. El usuario puede existir ya.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-2">🍽️</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Rutas del sabor App
        </h1>
        <p className="text-gray-500 mt-2">Crea tu cuenta gratis</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <Input
          label="Usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="ej: juan123"
          required
          disabled={loading}
          error={errors.username}
        />

        <Input
          label="Nombre completo"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="ej: Juan Pérez"
          required
          disabled={loading}
          error={errors.name}
        />

        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          required
          disabled={loading}
          error={errors.password}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
          required
          disabled={loading}
          error={errors.confirmPassword}
        />

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </Button>
      </form>

      {/* Link a login */}
      <p className="text-center mt-6 text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-purple-600 hover:underline font-semibold">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}