import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/api/auth/login', data).then((r) => r.data),
  googleLogin: (credential) => api.post('/api/auth/google', { credential }).then((r) => r.data),
  getMe: () => api.get('/api/auth/me').then((r) => r.data),
};

export const reviewAPI = {
  analyze: (prUrl, githubToken) =>
    api.post('/api/review/analyze', { prUrl, githubToken }).then((r) => r.data),
  getHistory: () => api.get('/api/review/history').then((r) => r.data),
  getById: (id) => api.get(`/api/review/${id}`).then((r) => r.data),
  deleteReview: (id) => api.delete(`/api/review/${id}`).then((r) => r.data),
  shareGet: (id) => api.get(`/api/review/share/${id}`).then((r) => r.data),
};

export const userAPI = {
  saveGithubToken: (githubToken) =>
    api.put('/api/user/github-token', { githubToken }).then((r) => r.data),
  getStats: () => api.get('/api/user/stats').then((r) => r.data),
};

export default api;
