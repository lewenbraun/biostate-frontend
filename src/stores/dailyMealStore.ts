import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { Product } from './productStore';

export interface Meal {
  id: number | null;
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
          this.mealsStatus[formatedDate] = 'empty'; // Данных нет
          return [];
        }

        this.mealsStatus[formatedDate] = 'loaded'; // Данные успешно загружены
        this.meals = [...this.meals, ...data.data]; // Добавляем данные
        return data.data;
      } catch (error) {
        console.error('Ошибка при загрузке meals:', error);
        this.mealsStatus[formatedDate] = 'error'; // Ошибка загрузки
        return [];
      }
    },
    async getOrFetchMealsByDate(date: Date) {
      const formatedDate = date.toISOString().split('T')[0];

      if (this.mealsStatus[formatedDate] === 'loading') {
        console.log(`Данные для ${formatedDate} уже загружаются.`);
        return [];
      }

      if (this.mealsStatus[formatedDate] === 'empty') {
        console.warn(`Для даты ${formatedDate} данных нет.`);
        return [];
      }

      if (this.mealsStatus[formatedDate] === 'loaded') {
        return this.meals.filter((meal) => meal.date === formatedDate);
      }

      // Если статус неизвестен, загружаем данные
      return await this.fetchDailyMeal(date);
    },
    async createMeal(date: Date, meal_order: number) {
      try {
        const formatedDate = date.toISOString().split('T')[0];

        // Отправка запроса на сервер
        const { data } = await api.post('/daily-meal/meal/create', {
          date: formatedDate,
          meal_order,
        });

        // Обновление данных в store
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
        console.error('Ошибка при создании приема пищи в store:', error);
        throw error; // Пробрасываем ошибку
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
