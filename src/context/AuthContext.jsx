// src/context/AuthContext.jsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el contexto
const AuthContext = createContext();

// 2. Provider que envuelve la app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recuperar usuario del localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
  try {
    
    
    const res = await fetch('https://api-react-taller-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
   
    
    const data = await res.json();
   
    
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      console.log('✅ Login exitoso:', data.user);
    } else {
      console.error('❌ Respuesta sin token:', data);
      throw new Error('Usuario o contraseña incorrectos');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  }
};
  const register = async (username, name, password) => {
    try {
      const res = await fetch('https://api-react-taller-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error en registro');
      }
      
      // Si la API devuelve token (login automático después de registro)
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login,register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook personalizado 
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}