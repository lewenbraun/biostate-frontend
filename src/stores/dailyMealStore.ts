import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { Product } from './productStore';

export interface Meal {
  id: number;
  products: Product[];
  meal_order: number;
  date: string;
}

export interface DailylMealState {
  meals: Meal[];
  loading: boolean;
  mealsStatus: Record<string, 'loading' | 'loaded' | 'empty' | 'error'>;
}

export interface Category {
  id: string;
  name: string;
}

export const useDailyMealStore = defineStore('dailyMealStore', {
  state: (): DailylMealState => ({
    meals: [],
    loading: false,
    mealsStatus: {},
  }),

  getters: {
    getMealsByDate: (state) => (date: string) => {
      return state.meals.filter((meal) => meal.date == date);
    },
  },

  actions: {
    async fetchDailyMeal(date: Date) {
      const formatedDate = date.toISOString().split('T')[0];
      this.mealsStatus[formatedDate] = 'loading';

      try {
        const { data } = await api.get('/daily-meal', {
          params: { date: formatedDate },
        });

        if (!data.data || data.data.length === 0) {
          console.warn(`Нет данных для даты ${formatedDate}`);
          this.mealsStatus[formatedDate] = 'empty';
          return [];
        }

        this.mealsStatus[formatedDate] = 'loaded';
        this.meals = [...this.meals, ...data.data];
        return data.data;
      } catch (error) {
        console.error('Error loading meals:', error);
        this.mealsStatus[formatedDate] = 'error';
        return [];
      }
    },
    async getOrFetchMealsByDate(date: Date) {
      const formatedDate = date.toISOString().split('T')[0];

      if (this.mealsStatus[formatedDate] === 'loading') {
        console.log(`Data for ${formatedDate} still loading.`);
        return [];
      }

      if (this.mealsStatus[formatedDate] === 'empty') {
        console.warn(`For date ${formatedDate} data is empty.`);
        return [];
      }

      if (this.mealsStatus[formatedDate] === 'loaded') {
        return this.meals.filter((meal) => meal.date === formatedDate);
      }

      return await this.fetchDailyMeal(date);
    },
    async createMeal(date: Date, meal_order: number) {
      try {
        const formatedDate = date.toISOString().split('T')[0];

        const { data } = await api.post('/daily-meal/meal/create', {
          date: formatedDate,
          meal_order,
        });

        this.meals.push({
          id: data.id,
          products: [],
          meal_order,
          date: formatedDate,
        });

        if (this.mealsStatus[formatedDate] === 'empty') {
          this.mealsStatus[formatedDate] = 'loaded';
        }

        return this.meals.filter((meal) => meal.date === formatedDate);
      } catch (error) {
        console.error('Error create new meal:', error);
        throw error;
      }
    },
    async deleteMeal(date: Date, meal_id: number) {
      try {
        const formatedDate = date.toISOString().split('T')[0];

        await api.post('/daily-meal/meal/delete', {
          date,
          meal_id,
        });

        this.meals = this.meals.filter((meal) => meal.id !== meal_id);

        return this.meals.filter((meal) => meal.date === formatedDate);
      } catch (error) {
        console.error('Error delete meal:', error);
        throw error;
      }
    },
    async addProductToMeal(
      product_id: number,
      date: Date,
      meal_order: number,
      weight: number
    ) {
      try {
        const { data } = await api.post('/daily-meal/product/add', {
          product_id,
          date,
          meal_order,
          weight,
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
        this.meals.forEach((meal) => {
          if (meal.id === meal_id) {
            meal.products.forEach((product) => {
              if (product.id === product_id) {
                product.count++;
              }
            });
          }
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
        this.meals.forEach((meal) => {
          if (meal.id === meal_id) {
            meal.products.forEach((product) => {
              if (product.id === product_id) {
                product.count--;
              }
            });
          }
        });
        console.log('Data:', data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    },
  },
});
