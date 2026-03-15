import { fetchApi } from './apiService';

// Interfaces định nghĩa cấu trúc dữ liệu trả về từ Backend
export interface MealIngredient {
  id: string;
  name: string;
  category: string;
  amount: string;
  price: number;
  image: string;
}

export interface MealDetail {
  id: string;
  name: string;
  type: string;
  kcal: number;
  price: number;
  image: string;
  tags: string[];
  steps: string[];
  ingredients?: MealIngredient[]; // Array nguyên liệu khi lấy details
}

/**
 * Service giao tiếp API chuyên biệt cho Màn hình Thực Đơn (Meals / Thư Viện Món Ăn)
 */
export const mealServices = {
  // Lấy danh sách toàn bộ các món ăn (Bao gồm món mẫu và món của user tự tạo)
  getAllMeals: () => 
    fetchApi<{ data: MealDetail[] }>('/meals', { method: 'GET' }),

  // Lấy chi tiết một món ăn (Bao gồm công thức, nguyên liệu của món đó theo ID)
  getMealDetails: (mealId: string) => 
    fetchApi<{ data: MealDetail }>(`/meals/${mealId}`, { method: 'GET' }),

  // Lấy danh sách loại bữa ăn
  getMealTypes: () => 
    fetchApi<{ data: {id: string, name: string}[] }>('/meals/types', { method: 'GET' }),

  // Tạo mới món ăn
  createMeal: (data: any) => 
    fetchApi<{ success: boolean, message: string }>('/meals', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Cập nhật món ăn
  updateMeal: (mealId: string, data: any) => 
    fetchApi<{ success: boolean, message: string }>(`/meals/${mealId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Xóa món ăn
  deleteMeal: (mealId: string) => 
    fetchApi<{ success: boolean, message: string }>(`/meals/${mealId}`, {
      method: 'DELETE'
    }),
};
