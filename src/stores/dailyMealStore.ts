import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { Product } from './productStore';

export interface Meal {
  id: number | null;
  products: Product[];
  meal_order: number;
}

export interface DailylMealState {
  meal: Meal[];
  loading: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export const useDailyMealStore = defineStore('dailyMealStore', {
  state: (): DailylMealState => ({
    meal: [],
    loading: false,
  }),

  getters: {},

  actions: {
    async fetchDailyMeal(date: Date) {
      this.loading = true;
      try {
        // Передаем параметр date в GET запрос
        const { data } = await api.get('/daily-meal', {
          params: { date: date },
        });
        this.meal = data.data;
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        this.loading = false;
      }
    },
    async createMeal(date: Date, countMeal: number) {
      try {
        const { data } = await api.post('/daily-meal/meal/create', {
          date,
          countMeal,
        });
        console.log('Data:', data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    },
    async addProductToMeal(product_id: number, date: Date, meal_order: number) {
      try {
        const { data } = await api.post('/daily-meal/product/add', {
          product_id,
          date,
          meal_order,
        });
        console.log('Data:', data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    },
    async deleteProductFromMeal(product_id: number, meal_id: number | null) {
      try {
        const { data } = await api.post('/daily-meal/product/delete', {
          product_id,
          meal_id,
        });
        console.log('Data:', data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    },
  },
});
