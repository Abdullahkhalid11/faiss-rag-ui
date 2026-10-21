import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY || 'my_production_secret_key_12345_change_this';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  },
});

export const uploadPDFs = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  return apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const queryRAG = async (question) => {
  return apiClient.post('/chat', { question });
};

export const checkHealth = async () => {
  return apiClient.get('/health');
};