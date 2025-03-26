export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id?: number;
  email?: string;
  is_temporary: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserParameters {
  maxNutrients: MaxNutrients;
  profileData: ProfileData;
}

export interface MaxNutrients {
  proteins?: number;
  fats?: number;
  carbs?: number;
  calories?: number;
}

export interface ProfileData {
  name: string;
  weight?: number;
}

export interface UserState {
  data: UserParameters;
  token: string | null;
}
