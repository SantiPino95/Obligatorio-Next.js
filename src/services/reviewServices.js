// src/services/reviewsService.js
import { fetchAPI } from './api';

export const reviewsService = {
  // POST /api/locals/1/reviews
  createLocalReview: async (localId, reviewData) => {
    try {
      // Verificar que hay token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Debes iniciar sesión para dejar una review');
      }

      const response = await fetchAPI(`/api/locals/${localId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating: parseInt(reviewData.rating),
          comment: reviewData.comment || ''
        }),
      });
      
      console.log('📍 Review creada:', response);
      return response;
      
    } catch (error) {
      console.error('📍 Error en createLocalReview:', error);
      throw error;
    }
  },

  // POST /api/dishes/1/reviews
  createPlatoReview: async (platoId, reviewData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Debes iniciar sesión para dejar una review');
      }

      const response = await fetchAPI(`/api/dishes/${platoId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating: parseInt(reviewData.rating),
          comment: reviewData.comment || ''
        }),
      });
      
      console.log('📍 Review creada:', response);
      return response;
      
    } catch (error) {
      console.error('📍 Error en createPlatoReview:', error);
      throw error;
    }
  }
};