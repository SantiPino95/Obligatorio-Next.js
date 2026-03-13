// components/auth/LoginForm.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.username || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      
     
      setLoading(true);
      setError('');

      await login(formData.username, formData.password);
      router.push('/'); // Redirigir al home

    } catch (err) {
      setError('Usuario o contraseña incorrectos');
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
        <p className="text-gray-500 mt-2">Inicia sesión para continuar</p>
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
          error={error && !formData.username ? error : ''}
        />

        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          disabled={loading}
          error={error && !formData.password ? error : ''}
        />

        {error && formData.username && formData.password && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      {/* Link a registro */}
      <p className="text-center mt-6 text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="text-purple-600 hover:underline font-semibold">
          Regístrate
        </Link>
      </p>
    </div>
  );
}