// src/services/api.js
const API_BASE_URL = 'https://api-react-taller-production.up.railway.app';

export const fetchAPI = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('📍 fetchAPI llamando a:', url);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📍 Status:', res.status);
    
    const text = await res.text();
    console.log('📍 Respuesta texto:', text.substring(0, 200)); // Primeros 200 caracteres
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${text}`);
    }

    // Intentar parsear JSON
    try {
      const data = JSON.parse(text);
      return data;
    } catch (e) {
      console.error('📍 No es JSON válido:', text);
      return text;
    }
  } catch (error) {
    console.error('📍 Error en fetchAPI:', error);
    throw error;
  }
};