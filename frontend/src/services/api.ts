import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:12000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Posts API
export const postsApi = {
  getAll: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: any) => api.post('/posts', data),
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
};

// Pages API
export const pagesApi = {
  getAll: (page = 1, limit = 10) => api.get(`/pages?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get(`/pages/${id}`),
  create: (data: any) => api.post('/pages', data),
  update: (id: string, data: any) => api.put(`/pages/${id}`, data),
  delete: (id: string) => api.delete(`/pages/${id}`),
};

// Users API
export const usersApi = {
  getAll: (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export default api;