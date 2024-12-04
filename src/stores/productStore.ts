import { defineStore } from 'pinia';
import { api } from '../boot/axios';

export interface ProductState {
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
  carbs: number;
  fats: number;
  count: number;
  category: Category;
}

export interface CreateProduct {
  name?: string;
  description: string;
  price?: number;
  weight?: number;
  weight_for_features?: number;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  category_id?: number;
  for_weight?: number;
}

export interface Category {
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
        this.products = data;
      } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
      } finally {
        this.loading = false;
      }
    },

    async createProduct(productData: CreateProduct) {
      this.loading = true;
      try {
        const { data } = await api.post('/products', productData);
        this.products.push(data);
        return data;
      } catch (error) {
        console.error('Ошибка при создании продукта:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
