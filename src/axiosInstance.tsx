import axios from 'axios'

const API_URL = 'https://z-image-cdn.com';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log(token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(config);
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
const api = axios.create({
  baseURL: API_URL
});

export default api;