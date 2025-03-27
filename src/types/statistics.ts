
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
  