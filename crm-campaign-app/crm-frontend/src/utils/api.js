import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const customerAPI = {
  getAll: () => api.get('/customers'),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`)
};

export const segmentAPI = {
  getAll: () => api.get('/segments'),
  create: (data) => api.post('/segments', data),
  getCustomers: (id) => api.get(`/segments/${id}/customers`),
  delete: (id) => api.delete(`/segments/${id}`)
};

export const campaignAPI = {
  getAll: () => api.get('/campaigns'),
  create: (data) => api.post('/campaigns', data),
  execute: (id) => api.post(`/campaigns/${id}/execute`)
};

export default api;