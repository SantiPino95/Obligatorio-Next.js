// src/services/usuariosService.js
import { fetchAPI } from './api';

export const usuariosService = {
  // GET /api/users/1
  getUserById: async (userId) => {
    try {
      console.log('📍 Obteniendo usuario:', userId);
      const data = await fetchAPI(`/api/users/${userId}`);
      console.log('📍 Datos de usuario (raw):', data);
      
      // La API devuelve algo como:
      // { "id": "1", "username": "an02100@20:47.9312", "location": {...} }
      
      return {
        user: {
          id: data.id,
          username: data.username,
          name: data.name || data.username
        },
        locals: [], // Por ahora vacío hasta que la API los devuelva
        dishes: []
      };
      
    } catch (error) {
      console.error('📍 Error obteniendo usuario:', error);
      return {
        user: null,
        locals: [],
        dishes: []
      };
    }
  }
};