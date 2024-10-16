import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: async (url, data) => {
    try {
      const response = await axios.post(`${BASE_URL}${url}`, data);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
