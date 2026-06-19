import axios from 'axios';

const getBaseURL = () => {
  const saved = localStorage.getItem('backend_url');
  if (saved) return saved;
  // If running on localhost client, default to local backend, otherwise default to relative /api
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return import.meta.env.VITE_API_URL || '/api';
};

const api = axios.create({
  baseURL: getBaseURL()
});

export const setBackendURL = (url) => {
  api.defaults.baseURL = url;
  localStorage.setItem('backend_url', url);
};

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
