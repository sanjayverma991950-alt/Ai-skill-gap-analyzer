import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to attach Authorization Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API Helper Methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  guestLogin: () => api.post('/auth/guest'),
  getMe: () => api.get('/auth/me'),
};

export const analyzerAPI = {
  scanResume: (formData, onUploadProgress) => {
    // Check if formData is FormData object or JSON
    const isFormData = formData instanceof FormData;
    return api.post('/analyzer/scan', formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      onUploadProgress
    });
  },
  getHistory: () => api.get('/analyzer/history'),
  getAnalysisById: (id) => api.get(`/analyzer/${id}`),
};

export const roleAPI = {
  getRoles: () => api.get('/roles'),
  getRoleBySlug: (slug) => api.get(`/roles/${slug}`),
};

export const roadmapAPI = {
  getRoadmapById: (id) => api.get(`/roadmaps/${id}`),
  getUserRoadmaps: () => api.get('/roadmaps/user/me'),
  toggleMilestone: (roadmapId, phaseIndex, milestoneIndex) => 
    api.patch(`/roadmaps/${roadmapId}/milestones/${phaseIndex}/${milestoneIndex}`),
};

export const healthAPI = {
  checkStatus: () => api.get('/health'),
};

export default api;
