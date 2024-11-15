// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers,
      });
      errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
      errorMessage = 'No response received from server';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

// API endpoints
export const fetchCustomers = async () => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw error;
  }
};

export const fetchSegments = async () => {
  try {
    const response = await api.get('/segments');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch segments:', error);
    throw error;
  }
};

export const fetchCampaigns = async () => {
  try {
    const response = await api.get('/campaigns');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    throw error;
  }
};

// Add more API functions as needed
export const createCampaign = async (campaignData) => {
  try {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
  } catch (error) {
    console.error('Failed to create campaign:', error);
    throw error;
  }
};

export default api;