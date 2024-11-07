import { boot } from 'quasar/wrappers';
import { useUserStore } from '../stores/userStore';
import axios, { AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  transformRequest: [
    (data) => {
      return JSON.stringify(data);
    },
  ],
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const userStore = useUserStore();

  config.headers.Authorization = `Bearer ${userStore.user.token}`;
  return config;
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
