// src/api/http.js

// Base URL for API calls
export const API = (path) => {

  const base = 'http://localhost:3001';
  return `${base}${path}`;
};

// Helper to get Authorization header
export const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
