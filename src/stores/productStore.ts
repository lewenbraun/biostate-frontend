import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { handleApiError } from '../utils/errorHandler';

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
  weight_for_features: number;
  image: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  count: number;
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
  is_public: boolean;
}

export interface UpdateProduct {
  id: number;
  name?: string;
  description: string;
  price?: number;
  weight?: number;
  weight_for_features?: number;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  is_public: boolean;
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
    async fetchProducts(): Promise<void> {
      this.loading = true;
      try {
        const { data } = await api.get('/products');
        this.products = data;
      } catch (error) {
        handleApiError(error);
      } finally {
        this.loading = false;
      }
    },
    async getProduct(id: string) {
      try {
        const { data } = await api.get(`/products/show/${id}`);
        return data;
      } catch (error) {
        handleApiError(error);
      }
    },
    async createProduct(productData: CreateProduct) {
      this.loading = true;
      try {
        const { data } = await api.post('/products/create', productData);
        this.products.push(data);
        return data;
      } catch (error) {
        handleApiError(error);
      } finally {
        this.loading = false;
      }
    },
    async updateProduct(productData: UpdateProduct) {
      try {
        const { data } = await api.post('/products/update', productData);

        return data;
      } catch (error) {
        handleApiError(error);
      }
    },
    async deleteProduct(product_id: number) {
      try {
        const { data } = await api.post('/products/delete', {
          id: product_id,
        });

        return data;
      } catch (error) {
        handleApiError(error);
      }
    },
    async searchProducts(query: string) {
      try {
        const { data } = await api.get(`/products/search/${query}`);
        return data;
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
  },
});
