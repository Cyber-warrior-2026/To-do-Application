import axios from 'axios';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {


  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;