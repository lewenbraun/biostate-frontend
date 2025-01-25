import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import dayjs from 'dayjs';
import { Notify } from 'quasar';

export interface StatisticsState {
  sumNutrientsPerWeek: SumNutrientsPerWeek;
  loading: boolean;
}

export interface SumNutrientsPerWeek {
  calories: DataDay[];
  proteins: DataDay[];
  fats: DataDay[];
  carbs: DataDay[];
}

export interface DataDay {
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

  actions: {
    async fetchSumNutrientsPerWeek(nutrients: string[]): Promise<void> {
      this.loading = true;
      try {
        const end_date = dayjs().format('YYYY-MM-DD');
        const start_date = dayjs().subtract(7, 'days').format('YYYY-MM-DD');

        const { data } = await api.get<SumNutrientsPerWeek>(
          '/statistics/sum-nutrients-for-period-date',
          {
            params: {
              start_date,
              end_date,
              nutrients,
            },
          }
        );

        this.sumNutrientsPerWeek = data;
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: 'Error fetching nutrients per week',
        });
      } finally {
        this.loading = false;
      }
    },
  },
});
