import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const instance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

const setToken = (token: string) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearToken = () => {
  delete instance.defaults.headers.common.Authorization;
};

export default {
  instance,
  post: (url: string, data?: any) => instance.post(url, data),
  get: (url: string, params?: any) => instance.get(url, { params }),
  put: (url: string, data?: any) => instance.put(url, data),
  delete: (url: string) => instance.delete(url),
  setToken,
  clearToken,
};
