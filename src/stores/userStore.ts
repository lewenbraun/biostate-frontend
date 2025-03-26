import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { handleApiError } from '../utils/errorHandler';
import type {
  LoginData,
  RegisterData,
  UserState,
  UserParameters,
  MaxNutrients,
  ProfileData,
} from '../types/user';

export const useUserStore = defineStore('userStore', {
  state: (): { user: UserState } => ({
    user: {
      data: {
        maxNutrients: {},
        profileData: {
          name: '',
        },
      },
      token: localStorage.getItem('TOKEN'),
    },
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user.token,
    maxCountNutrients: (
      state
    ): {
      proteins: MaxNutrients['proteins'];
      fats: MaxNutrients['fats'];
      carbs: MaxNutrients['carbs'];
      calories: MaxNutrients['calories'];
    } => {
      const { proteins, fats, carbs, calories } = state.user.data.maxNutrients;
      return {
        proteins: proteins,
        fats: fats,
        carbs: carbs,
        calories: calories,
      };
    },
  },

  actions: {
    async register(user: RegisterData): Promise<void> {
      try {
        const { data } = await api.post('/register', user);
        this.setUser(data.user);
        this.setToken(data.token);
      } catch (error) {
        handleApiError(error);
      }
    },
    async login(user: LoginData): Promise<void> {
      try {
        const { data } = await api.post('/login', user);
        this.setUser(data.user);
        this.setToken(data.token);
      } catch (error) {
        handleApiError(error);
      }
    },
    async logout(): Promise<void> {
      try {
        await api.post('/logout');
        this.deleteCurrentSession();
      } catch (error) {
        handleApiError(error);
      }
    },
    async updateUser(user: UserParameters): Promise<void> {
      try {
        const { data } = await api.post('/user/update', user);
        this.setUser(data);
      } catch (error) {
        handleApiError(error);
      }
    },
    async getProfileData(): Promise<void> {
      try {
        const { data } = await api.get('/user/profile-data');
        this.setProfileData(data);
      } catch (error) {
        handleApiError(error);
      }
    },
    async getMaxNutrients(): Promise<void> {
      try {
        const { data } = await api.get('/user/max-nutrients');
        this.setMaxNutrients(data);
      } catch (error) {
        handleApiError(error);
      }
    },
    setMaxNutrients(maxNutrients: MaxNutrients): void {
      this.user.data.maxNutrients = maxNutrients;
    },
    setProfileData(profileData: ProfileData): void {
      this.user.data.profileData = profileData;
    },
    setUser(user: UserParameters): void {
      this.user.data = user;
    },
    setToken(token: string): void {
      this.user.token = token;
      localStorage.setItem('TOKEN', token);
    },
    userAuth(): boolean {
      return !!this.user.token;
    },
    deleteCurrentSession(): void {
      this.user.token = null;
      this.user.data = {
        maxNutrients: {},
        profileData: {
          name: '',
        },
      };
      localStorage.removeItem('TOKEN');
      window.location.reload();
    },
  },
});
