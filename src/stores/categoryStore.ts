import { defineStore } from 'pinia';
import { api } from '../boot/axios';

interface CategoryState {
  categories: Category[];
  loading: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export const useCategoryStore = defineStore('categoryStore', {
  state: (): CategoryState => ({
    categories: [],
    loading: false,
  }),

  getters: {
    allCategories: (state) => state.categories,
  },

  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const { data } = await api.get('/categories');
        this.categories = data;
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
