import { defineStore } from 'pinia';
import { api } from '../boot/axios';

export interface StatisticsState {
  sumNutrientsPerWeek: SumNutrientsPerWeek;
  loading: boolean;
}

export interface SumNutrientsPerWeek {
  calories: DataDays[];
  proteins: DataDays[];
  fats: DataDays[];
  carbs: DataDays[];
}

export interface DataDays {
  total: number;
  date: string;
}

export const useStatisticsStore = defineStore('statisticsStore', {
  state: (): StatisticsState => ({
    sumNutrientsPerWeek: {
      calories: [],
      proteins: [],
      fats: [],
      carbs: [],
    },
    loading: false,
  }),

  getters: {},

  actions: {
    async fetchSumNutrientsPerWeek(nutrient: string) {
      this.loading = true;
      try {
        const end_date = new Date().toISOString().split('T')[0];
        const start_date = new Date(
          new Date().setDate(new Date().getDate() - 7)
        )
          .toISOString()
          .split('T')[0];

        const { data } = await api.get(
          '/statistics/sum-nutrients-for-period-date',
          {
            params: {
              start_date: start_date,
              end_date: end_date,
              nutrient: nutrient,
            },
          }
        );
        this.sumNutrientsPerWeek.calories = data;
        console.log(
          '🚀 ~ fetchSumNutrientsPerWeek ~ this.sumNutrientsPerWeek.calories :',
          this.sumNutrientsPerWeek.calories
        );
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
