// src/services/platosService.js
import { fetchAPI } from './api';

export const platosService = {
  getPlatos: async (filtros = {}) => {
    try {
      // Construir query string solo con filtros que tienen valor
      const params = new URLSearchParams();
      
      Object.keys(filtros).forEach(key => {
        if (filtros[key] && filtros[key].toString().trim() !== '') {
          params.append(key, filtros[key].toString().trim());
        }
      });
      
      const queryString = params.toString();
      const url = `/api/dishes${queryString ? `?${queryString}` : ''}`;
      
      console.log('📍 Llamando a platos:', url);
      const data = await fetchAPI(url);
      
      console.log('📍 Tipo de data platos:', Array.isArray(data) ? 'array' : typeof data);
      
      // Si es un array, devolverlo
      if (Array.isArray(data)) {
        return data;
      }
      
      // Si es un objeto con propiedad 'items' o similar
      if (data && data.items && Array.isArray(data.items)) {
        return data.items;
      }
      
      // Si es un objeto suelto, convertirlo en array
      if (data && typeof data === 'object' && data.id) {
        return [data];
      }
      
      // Si es null o undefined, devolver array vacío
      return [];
      
    } catch (error) {
      console.error('📍 Error en getPlatos:', error);
      return [];
    }
  },

  getPlatoById: async (id) => {
    return fetchAPI(`/api/dishes/${id}`);
  },

  createPlato: async (platoData) => {
    return fetchAPI('/api/dishes', {
      method: 'POST',
      body: JSON.stringify(platoData),
    });
  }
};