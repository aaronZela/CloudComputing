import axios from 'axios';
import { auth } from './firebase';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token de autenticación a cada petición
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      console.error('Unauthorized - redirecting to login');
      // Aquí podrías redirigir al login
    }
    return Promise.reject(error);
  }
);

// === AUTH ENDPOINTS ===
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// === TASKS ENDPOINTS ===
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  delete: (id) => api.delete(`/tasks/${id}`),
  addComment: (id, text) => api.post(`/tasks/${id}/comments`, { text })
};

// === USERS ENDPOINTS ===
export const usersAPI = {
  getAll: () => api.get('/users'),
  getByRole: (role) => api.get(`/users/role/${role}`),
  getById: (uid) => api.get(`/users/${uid}`),
  getMetrics: () => api.get('/users/metrics/summary')
};

export default api;
