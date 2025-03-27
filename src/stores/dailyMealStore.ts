import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { formatToLocal } from '../utils/Formatters/dateFormatter.ts';
import { handleApiError } from '../utils/errorHandler.ts';
import type { Product } from '../types/product';
import type { Meal, DailyMealState } from '../types/dailyMeal';

export const useDailyMealStore = defineStore('dailyMealStore', {
  state: (): DailyMealState => ({
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
            calories: parseFloat(totals.calories.toFixed(1)),
            fats: parseFloat(totals.fats.toFixed(1)),
            carbs: parseFloat(totals.carbs.toFixed(1)),
            proteins: parseFloat(totals.proteins.toFixed(1)),
          };
        },
        { calories: 0, fats: 0, carbs: 0, proteins: 0 }
      );
    },
  },

  actions: {
    async fetchDailyMeal(date: Date): Promise<Meal[]> {
      const formatedDate = formatToLocal(date);
      this.mealsStatus[formatedDate] = 'loading';

      try {
        const { data } = await api.get('/daily-meal', {
          params: { date: formatedDate },
        });

        if (!data.data || data.data.length === 0) {
          this.mealsStatus[formatedDate] = 'empty';
          return [];
        }

        this.mealsStatus[formatedDate] = 'loaded';

        const mealsWithRecalculatedProducts = data.data.map((meal: Meal) => {
          meal.products = meal.products.map((product: Product) => {
            this.recalculateProduct(product);
            return product;
          });
          return meal;
        });

        this.meals = [...this.meals, ...mealsWithRecalculatedProducts];
        return mealsWithRecalculatedProducts;
      } catch (error) {
        handleApiError(error);
        this.mealsStatus[formatedDate] = 'error';
        return [];
      }
    },
    async getOrFetchMealsByDate(date: Date): Promise<Meal[]> {
      const formatedDate = formatToLocal(date);

      if (this.mealsStatus[formatedDate] === 'loading') {
        return [];
      }

      if (this.mealsStatus[formatedDate] === 'empty') {
        return [];
      }

      if (this.mealsStatus[formatedDate] === 'loaded') {
        return this.meals.filter((meal) => meal.date === formatedDate);
      }

      return await this.fetchDailyMeal(date);
    },
    async createMeal(date: Date, meal_order: number): Promise<Meal[]> {
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
        throw error;
      }
    },

    async addProductToMeal(
      product: Product,
      date: Date,
      meal_order: number
    ): Promise<void> {
      try {
        const formatedDate = formatToLocal(date);

        await api.post('/daily-meal/product/add', {
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
            this.recalculateProduct(product);
            existingGroup.products.push(product);
          }
        }
      } catch (error) {
        handleApiError(error);
      }
    },
    async deleteMeal(date: Date, meal_id: number): Promise<Meal[]> {
      try {
        const formatedDate = formatToLocal(date);

        await api.post('/daily-meal/meal/delete', {
          id: meal_id,
        });

        this.meals = this.meals.filter((meal) => meal.id !== meal_id);

        return this.meals.filter((meal) => meal.date === formatedDate);
      } catch (error) {
        throw error;
      }
    },
    async deleteProductFromMeal(
      product_id: number,
      weight_product: number,
      meal_id: number | null,
      date: Date
    ): Promise<Meal[]> {
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
        throw error;
      }
    },
    async increaseCountProduct(
      product_id: number,
      meal_id: number | null
    ): Promise<void> {
      try {
        await api.post('/daily-meal/product/increase-count', {
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
      } catch (error) {
        handleApiError(error);
      }
    },
    async decreaseCountProduct(
      product_id: number,
      meal_id: number | null
    ): Promise<void> {
      try {
        await api.post('/daily-meal/product/decrease-count', {
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
      } catch (error) {
        handleApiError(error);
      }
    },
    async updateProductWeight(
      product: Product,
      meal_id: number | null,
      changed_weight: number
    ): Promise<void> {
      try {
        await api.post('/daily-meal/product/update-weight', {
          product_id: product.id,
          weight_product: product.weight,
          meal_id,
          changed_weight,
        });
        this.meals.forEach((meal) => {
          if (meal.id === meal_id) {
            meal.products.forEach((mealProduct) => {
              if (
                mealProduct.id === product.id &&
                mealProduct.weight === product.weight
              ) {
                mealProduct.weight = changed_weight;
                this.recalculateProduct(mealProduct);
              }
            });
          }
        });
      } catch (error) {
        handleApiError(error);
      }
    },
    recalculateProduct(product: Product): void {
      product.proteins = parseFloat(
        (
          ((product.weight ?? this.WEIGHT_FACTOR_BASE) /
            product.weight_for_features) *
          product.proteins
        ).toFixed(1)
      );
      product.carbs = parseFloat(
        (
          ((product.weight ?? this.WEIGHT_FACTOR_BASE) /
            product.weight_for_features) *
          product.carbs
        ).toFixed(1)
      );
      product.fats = parseFloat(
        (
          ((product.weight ?? this.WEIGHT_FACTOR_BASE) /
            product.weight_for_features) *
          product.fats
        ).toFixed(1)
      );
      product.calories = parseFloat(
        (
          ((product.weight ?? this.WEIGHT_FACTOR_BASE) /
            product.weight_for_features) *
          product.calories
        ).toFixed(1)
      );

      product.weight_for_features = product.weight;
    },
  },
});
