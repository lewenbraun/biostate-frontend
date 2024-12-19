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
  weight_default?: number;
  weight_for_features?: number;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  category_id?: number;
}

export interface UpdateProduct {
  id: number;
  name?: string;
  description: string;
  price?: number;
  weight_default?: number;
  weight_for_features?: number;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  category_id?: number;
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
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
    async getProduct(id: string) {
      try {
        const { data } = await api.get(`/products/show/${id}`);
        return data;
      } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
    },
    async updateProduct(productData: UpdateProduct) {
      try {
        const { data } = await api.post('/products/update', productData);

        return data;
      } catch (error) {
        console.error('Error update product by ID:', error);
        throw error;
      }
    },
    async createProduct(productData: CreateProduct) {
      this.loading = true;
      try {
        const { data } = await api.post('/products/update', productData);
        this.products.push(data);
        return data;
      } catch (error) {
        console.error('Ошибка при создании продукта:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async searchProducts(query: string) {
      try {
        const { data } = await api.get(`/products/search/${query}`);
        return data;
      } catch (error) {
        console.error('Error search products:', error);
        throw error;
      }
    },
  },
});
