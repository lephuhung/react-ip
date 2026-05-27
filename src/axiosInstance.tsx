import axios from 'axios';

const instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    const isTargetApi = config.url && (config.url.includes('z-image-cdn.com') || config.url.startsWith('/'));
    
    if (token && isTargetApi) {
      if (config.headers && typeof config.headers.set === 'function') {
        if (!config.headers.has('Authorization') && !config.headers.has('authorization')) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }
      } else {
        config.headers = config.headers || {};
        if (!config.headers['Authorization'] && !config.headers['authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;