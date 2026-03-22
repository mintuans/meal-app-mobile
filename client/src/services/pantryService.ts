import { fetchApi } from './apiService';

export interface PantryIngredient {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  baseUnit: string;
  inStock: boolean;
  amount: string;
  image: string;
}

/**
 * Service giao tiếp với BE cho Màn hình Nguyên Liệu (Pantry & Grocery)
 */
export const pantryServices = {
  // 1. Lấy danh sách toàn bộ nguyên liệu kèm trạng thái có trong kho (Pantry) hay không
  getPantryList: () => 
    fetchApi<{data: PantryIngredient[]}>('/ingredients/pantry', { method: 'GET' }),

  // 2. Chuyển đổi trạng thái nguyên liệu (Còn Hàng -> Hết Hàng, hoặc ngược lại)
  toggleStockStatus: (ingredientId: string, inStockStatus: boolean) => 
    fetchApi<any>('/ingredients/pantry/toggle', { 
      method: 'POST', 
      body: JSON.stringify({ ingredientId, inStockStatus }) 
    }),

  // 3. Thêm nguyên liệu tùy chỉnh
  addCustomIngredient: (data: { name: string; categoryId: string; price: number; amount: string; image?: string }) =>
    fetchApi<any>('/ingredients', { 
      method: 'POST', 
      body: JSON.stringify(data)
    }),

  // 4. Lấy danh sách danh mục
  getCategories: () =>
    fetchApi<{ data: { id: string; name: string }[] }>('/ingredients/categories', { method: 'GET' }),

  createCategory: (name: string) =>
    fetchApi<any>('/ingredients/categories', { method: 'POST', body: JSON.stringify({ name }) }),

  updateCategory: (id: string, name: string) =>
    fetchApi<any>(`/ingredients/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),

  deleteCategory: (id: string) =>
    fetchApi<any>(`/ingredients/categories/${id}`, { method: 'DELETE' }),

  // 5. Lấy toàn bộ nguyên liệu hệ thống
  getAllIngredients: () => 
    fetchApi<{ data: { id: string; name: string; price: number; unit: string }[] }>('/ingredients', { method: 'GET' }),

  // 6. Quét hóa đơn (OCR)
  scanReceipt: (imageBase64: string) =>
    fetchApi<{ data: { description: string; quantity: number; unit_price: number; total_amount: number }[] }>(
      '/ingredients/scan-receipt', 
      { method: 'POST', body: JSON.stringify({ image: imageBase64 }) }
    ),
};
