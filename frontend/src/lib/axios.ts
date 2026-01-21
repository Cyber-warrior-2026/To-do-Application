import axios from 'axios';

// Create the instance
const api = axios.create({
  baseURL: 'http://localhost:500/api', // Your Backend URL
  withCredentials: true, // IMPORTANT: Allows cookies to be sent/received
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach Token if it exists (for non-cookie endpoints)
api.interceptors.request.use((config) => {
  // We will check localStorage just in case we need it later, 
  // but mostly we rely on the httpOnly cookie.
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;