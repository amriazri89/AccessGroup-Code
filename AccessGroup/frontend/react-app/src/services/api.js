import axios from "axios";

const API_BASE_URL = "http://localhost:5008/api"; // your .NET API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor: attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor: handle expired/unauthorized token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized → clear and redirect
      localStorage.removeItem("token");
      window.location.href = "/access/login"; // redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
