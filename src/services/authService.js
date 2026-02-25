import { fetchAPI } from './api';

export const authService = {
  // POST /api/auth/register
  register: async (userData) => {
    // userData = { username, name, password }
    return fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // POST /api/auth/login
  login: async (credentials) => {
    // credentials = { username, password }
    return fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
};