import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { Product } from './productStore';
import { formatToLocal } from '../utils/Formatters/dateFormatter.ts';

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
    WEIGHT_FACTOR_BASE: () => 100,
    getMaxNutritonalQuantity: () => {
      return {
        calories: 2000,
        fats: 65,
        carbs: 300,
        proteins: 150,
      };
    },
    getNutritionalSummary: (state) => (date: string) => {
      const mealsByDate = state.meals.filter((meal) => meal.date == date);

      return mealsByDate.reduce(
        (totals, meal) => {
          meal.products.forEach((product) => {
            totals.calories += product.calories * product.count;
            totals.fats += product.fats * product.count;
            totals.carbs += product.carbs * product.count;
            totals.proteins += product.proteins * product.count;
          });

          return {
            calories: parseFloat(totals.calories.toFixed(0)),
            fats: parseFloat(totals.fats.toFixed(0)),
            carbs: parseFloat(totals.carbs.toFixed(0)),
            proteins: parseFloat(totals.proteins.toFixed(0)),
          };
        },
        { calories: 0, fats: 0, carbs: 0, proteins: 0 }
      );
    },
  },

  actions: {
    async fetchDailyMeal(date: Date) {
      const formatedDate = formatToLocal(date);
      this.mealsStatus[formatedDate] = 'loading';

      try {
        const { data } = await api.get('/daily-meal', {
          params: { date: formatedDate },
        });

        if (!data.data || data.data.length === 0) {
          console.warn(`No data for ${formatedDate}`);
          this.mealsStatus[formatedDate] = 'empty';
          return [];
        }

        this.mealsStatus[formatedDate] = 'loaded';

        const mealsWithRecalculatedProducts = data.data.map((meal: Meal) => {
          meal.products = meal.products.map((product: Product) => {
            this.recalculateProduct(product, this.WEIGHT_FACTOR_BASE);
            return product;
          });
          return meal;
        });

        this.meals = [...this.meals, ...mealsWithRecalculatedProducts];
        return mealsWithRecalculatedProducts;
      } catch (error) {
        console.error('Error loading meals:', error);
        this.mealsStatus[formatedDate] = 'error';
        return [];
      }
    },
    async getOrFetchMealsByDate(date: Date) {
      const formatedDate = formatToLocal(date);

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
        const formatedDate = formatToLocal(date);

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

    async addProductToMeal(product: Product, date: Date, meal_order: number) {
      try {
        const formatedDate = formatToLocal(date);

        const { data } = await api.post('/daily-meal/product/add', {
          product_id: product.id,
          weight: product.weight,
          date: formatedDate,
          meal_order,
        });

        const existingGroup = this.meals.find(
          (group) =>
            group.meal_order === meal_order && group.date === formatedDate
        );
        product.count = 1;
        if (existingGroup) {
          const existingProduct = existingGroup.products.find(
            (productInGroup) =>
              productInGroup.id === product.id &&
              productInGroup.weight === product.weight
          );
          if (existingProduct) {
            this.meals.forEach((meal) => {
              if (meal.id === existingGroup.id) {
                meal.products.forEach((productInGroup) => {
                  if (productInGroup.id === product.id) {
                    productInGroup.count++;
                  }
                });
              }
            });
          } else {
            this.recalculateProduct(product, this.WEIGHT_FACTOR_BASE);
            existingGroup.products.push(product);
          }
        }
        console.log('Data:', data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    },
    async deleteMeal(date: Date, meal_id: number) {
      try {
        const formatedDate = formatToLocal(date);

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
    async deleteProductFromMeal(
      product_id: number,
      weight_product: number,
      meal_id: number | null,
      date: Date
    ) {
      try {
        await api.post('/daily-meal/product/delete', {
          product_id,
          weight_product,
          meal_id,
        });

        const formatedDate = formatToLocal(date);

        this.meals.forEach((meal) => {
          if (meal.id === meal_id) {
            meal.products = meal.products.filter(
              (product) =>
                product.id !== product_id ||
                Number(product.weight) !== Number(weight_product)
            );
          }
        });

        return this.meals.filter((meal) => meal.date === formatedDate);
      } catch (error) {
        console.error('Error loading categories:', error);
        throw error;
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
    async updateProductWeight(
      product_id: number,
      meal_id: number | null,
      changed_weight: number
    ) {
      try {
        const { data } = await api.post('/daily-meal/product/update-weight', {
          product_id,
          meal_id,
          changed_weight,
        });
        this.meals.forEach((meal) => {
          if (meal.id === meal_id) {
            meal.products.forEach((product) => {
              if (product.id === product_id) {
                const weight_for_calculating = product.weight;
                product.weight = changed_weight;
                this.recalculateProduct(product, weight_for_calculating);
              }
            });
          }
        });
        console.log('Data:', data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    },
    recalculateProduct(product: Product, weight: number) {
      product.proteins = parseFloat(
        ((product.proteins / weight) * product.weight).toFixed(1)
      );
      product.carbs = parseFloat(
        ((product.carbs / weight) * product.weight).toFixed(1)
      );
      product.fats = parseFloat(
        ((product.fats / weight) * product.weight).toFixed(1)
      );
      product.calories = parseFloat(
        ((product.calories / weight) * product.weight).toFixed(1)
      );
    },
  },
});
