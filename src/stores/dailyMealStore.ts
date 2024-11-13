import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { Product } from './productStore';

export interface Meal {
  id: number | null;
  products: Product[];
  meal_order: number;
  date: Date;
}

export interface DailylMealState {
  meals: Meal[];
  loading: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export const useDailyMealStore = defineStore('dailyMealStore', {
  state: (): DailylMealState => ({
    meals: [],
    loading: false,
  }),

  getters: {
    getMealsByDate: (state) => (date: Date) => {
      return state.meals.filter((meal) => meal.date === date);
    },
  },

  actions: {
    async fetchDailyMeal(date: Date) {
      this.loading = true;
      const formatedDate = date.toISOString().split('T')[0];

      try {
        const { data } = await api.get('/daily-meal', {
          params: { date: formatedDate },
        });
        this.meals = data.data;
      } catch (error) {
        console.error('Error loading meals:', error);
      } finally {
        this.loading = false;
      }
    },
    async getOrFetchMealsByDate(date: Date) {
      const mealsForDate = this.getMealsByDate(date);

      // Если для указанной даты нет данных, делаем запрос
      if (mealsForDate.length === 0) {
        await this.fetchDailyMeal(date);
        return this.getMealsByDate(date); // Возвращаем обновленные данные
      }

      // Если данные уже есть, возвращаем их
      return mealsForDate;
    },
    async createMeal(date: Date, meal_order: number) {
      try {
        const formatedDate = date.toISOString().split('T')[0];

        const { data } = await api.post('/daily-meal/meal/create', {
          formatedDate,
          meal_order,
        });

        return data.id;
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
    async increaseCountProduct(product_id: number, meal_id: number | null) {
      try {
        const { data } = await api.post('/daily-meal/product/increase-count', {
          product_id,
          meal_id,
        });
        console.log('Data:', data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    },
    async decreaseCountProduct(product_id: number, meal_id: number | null) {
      try {
        const { data } = await api.post('/daily-meal/product/decrease-count', {
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
