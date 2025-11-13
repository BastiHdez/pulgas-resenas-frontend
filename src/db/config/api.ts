import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_RATINGS_BASE || 'http://localhost:3001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});
