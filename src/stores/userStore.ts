import { defineStore } from 'pinia';
import { api } from '../boot/axios';

export interface UserParameters {
  name?: string;
  weight?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
  calories?: number;
}

interface UserState {
  data: UserParameters;
  token: string | null;
}

export const useUserStore = defineStore('userStore', {
  state: (): { user: UserState } => ({
    user: {
      data: {
        name: '',
      },
      token: localStorage.getItem('TOKEN'),
    },
  }),

  getters: {
    isAuthenticated: (state) => !!state.user.token,
  },

  actions: {
    async register(user: Record<string, unknown>) {
      const { data } = await api.post('/register', user);
      this.setUser(data.user);
      this.setToken(data.token);
      return data;
    },
    async login(user: Record<string, unknown>) {
      const { data } = await api.post('/login', user);
      this.setUser(data.user);
      this.setToken(data.token);
      return data;
    },
    async logout() {
      const response = await api.post('/logout');
      this.logoutUser();
      return response;
    },
    async updateUser(user: UserParameters) {
      const { data } = await api.post('/user/update', user);
      this.setUser(data);
      return data;
    },
    async getUser() {
      const { data } = await api.get('/user');
      this.setUser(data);
    },
    async getCategories() {
      const { data } = await api.get('/categories');
      return data;
    },
    setUser(user: UserParameters) {
      this.user.data = user;
    },
    setToken(token: string) {
      this.user.token = token;
      localStorage.setItem('TOKEN', token);
    },
    userAuth() {
      return this.user.token ? true : false;
    },
    logoutUser() {
      this.user.token = null;
      this.user.data = {
        name: '',
      };
      localStorage.removeItem('TOKEN');
    },
  },
});
