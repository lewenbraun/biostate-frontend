import { defineStore } from 'pinia';
import { api } from '../boot/axios';

interface ProductState {
  products: Product[];
  loading: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  image: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  category: Category;
}

interface Category {
  id: string;
  name: string;
}

export const useProductStore = defineStore('productStore', {
  state: (): ProductState => ({
    products: [],
    loading: false,
  }),

  getters: {
    allProducts: (state) => state.products,
  },

  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const { data } = await api.get('/products');
        this.products = data; // Обновляем состояние products
      } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
