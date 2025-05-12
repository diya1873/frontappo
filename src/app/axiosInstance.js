// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://appointments-6zq4.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("Interceptor triggered!", error.response?.data?.message);
  
      const message = error.response?.data?.message;
  
      if (message === 'Token expired' || message === 'Invalid token') {
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
  
      return Promise.reject(error);
    }
  );
export default axiosInstance;
