import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API, // API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
