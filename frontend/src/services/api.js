import axios from 'axios';

const API_URL = 'http://localhost:8080/api/';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = 'Bearer ' + user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); //it will reject the promise bbecause of error, 
    // but instead of promise why we don't show a message? because the error will be caught by 
    // the caller function and it will show the message.
  }
);

export default api;
