import api from '@/lib/axios';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../../../types/auth.types'; // We will make this file

export const AuthService = {

  async register(data: RegisterCredentials) {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async login(data: LoginCredentials) {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  }
};