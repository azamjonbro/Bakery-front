import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.alphae.uz',
  // baseURL:"http://192.168.1.5:3500",
  // baseURL:"http://localhost:3500",
  withCredentials: true,
  timeout: 40000,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).accessToken : null;

    if (token) {
      config.headers.authorization = `${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export default api;