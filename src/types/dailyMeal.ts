import type { Product } from './product';

export interface Meal {
  id: number;
  products: Product[];
  meal_order: number;
  date: string;
}

export interface DailyMealState {
  meals: Meal[];
  loading: boolean;
  mealsStatus: Record<string, 'loading' | 'loaded' | 'empty' | 'error'>;
}
