import { fetchApi } from './apiService';

export interface MealPlanItem {
  id: string;
  user_id: string;
  meal_id: string;
  plan_date: string;
  meal_type_id: string;
  is_completed: boolean;
  actual_price: number;
  meal_name: string;
  kcal: number;
  estimated_price: number;
  tags: string[];
  type_name: string;
  image: string;
}

export const mealPlanServices = {
  // Lấy kế hoạch theo ngày
  getPlans: (startDate?: string, endDate?: string) => {
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    return fetchApi<{ data: MealPlanItem[] }>(`/meal-plans?${query.toString()}`, { method: 'GET' });
  },

  // Thêm món vào kế hoạch
  addToPlan: (data: { mealId: string, planDate: string, mealTypeId: string }) => 
    fetchApi<{ success: boolean, data: MealPlanItem }>('/meal-plans', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Xóa khỏi kế hoạch
  removeFromPlan: (planId: string) => 
    fetchApi<any>(`/meal-plans/${planId}`, { method: 'DELETE' }),

  // Đánh dấu hoàn thành
  toggleComplete: (planId: string, isCompleted: boolean) => 
    fetchApi<any>(`/meal-plans/${planId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted })
    })
};
