export interface Meal {
  id: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  kcal: number;
  price: number;
  image: string;
  completed?: boolean;
  ingredients?: Ingredient[];
  steps?: string[];
  tags?: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  price: number;
  inStock?: boolean;
  category: 'Vegetables' | 'Meat' | 'Spices' | 'Dry Goods' | 'Dairy & Eggs';
  image: string;
}

export interface Budget {
  spent: number;
  limit: number;
  remaining: number;
  percentUsed: number;
}

export interface UserProfile {
  name: string;
  height: number;
  weight: number;
  groceryLimit: number;
  allergies: string[];
  dislikedFoods: string[];
  avatar: string;
  memberSince: string;
}
