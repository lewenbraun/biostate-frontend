export interface ProductState {
  products: Product[];
  loading: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  weight_for_features: number;
  image: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  count: number;
  is_public: boolean;
}

export interface CreateProduct {
  name?: string;
  description: string;
  price?: number;
  weight?: number;
  weight_for_features?: number;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  is_public: boolean;
}

export interface UpdateProduct {
  id: number;
  name?: string;
  description: string;
  price?: number;
  weight?: number;
  weight_for_features?: number;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  is_public: boolean;
}
