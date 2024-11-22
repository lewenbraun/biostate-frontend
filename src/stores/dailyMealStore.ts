import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { Product } from './productStore';

export interface Meal {
  id: number | null;
  products: Product[];
  meal_order: number;
  date: string;
}

export interface DailyMealState {
  meals: Meal[];
  loadedDates: Set<string>; // Даты с загруженными данными
  emptyDates: Set<string>;  // Даты, где данных нет
}

export const useDailyMealStore = defineStore('dailyMealStore', {
  state: (): DailyMealState => ({
    meals: [],
    loadedDates: new Set(),
    emptyDates: new Set(),
  }),

  getters: {
    // Получение списка приемов пищи за дату
    getMealsByDate: (state) => (date: string) => {
      return state.meals.filter((meal) => meal.date === date);
    },

    // Проверка наличия данных для даты
    hasDataForDate: (state) => (date: string) => {
      return state.loadedDates.has(date) || state.emptyDates.has(date);
    },

    // Проверка, является ли дата пустой
    isEmptyDate: (state) => (date: string) => {
      return state.emptyDates.has(date);
    },
  },

  actions: {
    // Загрузка данных за определенную дату
    async fetchMealsByDate(date: string) {
      if (this.loadedDates.has(date) || this.emptyDates.has(date)) {
        return; // Не делаем повторный запрос
      }

      try {
        const { data } = await api.get('/daily-meal', { params: { date } });

        // Если данных нет, помечаем дату как пустую
        if (!data.data || data.data.length === 0) {
          this.emptyDates.add(date);
          return [];
        }

        // Добавляем новые приемы пищи в store
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newMeals = data.data.map((meal: any) => ({
          ...meal,
          date, // Гарантируем, что дата установлена корректно
        }));

        this.meals = [...this.meals, ...newMeals];
        this.loadedDates.add(date);

        return newMeals;
      } catch (error) {
        console.error(`Ошибка при загрузке данных для ${date}:`, error);
        throw error;
      }
    },

    // Добавление нового приема пищи
    addMeal(meal: Meal) {
      this.meals.push(meal);
      if (!this.loadedDates.has(meal.date)) {
        this.loadedDates.add(meal.date);
      }
    },

    // Очистка данных
    clearStore() {
      this.meals = [];
      this.loadedDates.clear();
      this.emptyDates.clear();
    },

    // Создание приема пищи
    async createMeal(date: Date, meal_order: number): Promise<number> {
      const formattedDate = date.toISOString().split('T')[0];
      try {
        const { data } = await api.post('/daily-meal/meal/create', {
          date: formattedDate,
          meal_order,
        });

        return data.id;
      } catch (error) {
        console.error('Ошибка при создании приема пищи:', error);
        throw error;
      }
    },


    removeMeal(meal: Meal) {
      this.meals = this.meals.filter((m) => m !== meal); // Удаляем из `store`
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
