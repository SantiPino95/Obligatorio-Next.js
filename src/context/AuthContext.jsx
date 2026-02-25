'use client';
import { createContext, useState, useEffect } from 'react';

// ✅ Exportamos el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 AuthContext: useEffect ejecutándose');
    
    const checkUser = () => {
      try {
        console.log('🔍 Verificando localStorage...');
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('🔍 Token:', token ? '✅ existe' : '❌ no existe');
        console.log('🔍 UserData:', userData ? '✅ existe' : '❌ no existe');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
          console.log('✅ Usuario cargado:', JSON.parse(userData));
        } else {
          console.log('ℹ️ No hay sesión activa');
        }
      } catch (e) {
        console.error('❌ Error:', e);
      } finally {
        console.log('✅ FINALLY: setLoading(false)');
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (username, password) => {
    // Simular login
    const userData = { id: 1, username, name: username };
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};