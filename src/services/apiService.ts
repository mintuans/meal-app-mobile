/**
 * Lấy Base URL từ biến môi trường (Vite sử dụng import.meta.env).
 * Khi chạy local trên máy, nó sẽ ưu tiên biến môi trường, nếu không có sẽ lấy http://localhost:5001/api/v1 làm mặc định.
 * Khi deploy, bạn chỉ cần cấu hình VITE_API_BASE_URL trên biến môi trường của Vercel/Netlify.
 */
const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Cấu hình luồng Fetch Request chuẩn để tái sử dụng
export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // Phép nối chuỗi tạo thành URL hoàn chỉnh
  const url = `${API_BASE_URL}${endpoint}`;

  // Tự động đính kèm Token (nếu có xác thực người dùng)
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Xử lý những Respone không có body
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      // Bắn lỗi xuống catch nếu API trả về status báo lỗi (400, 401, 500...)
      throw new Error(data?.message || 'Có lỗi xảy ra khi gọi API!');
    }

    return data;
  } catch (error: any) {
    console.error(`Lỗi API ở [${endpoint}]:`, error.message);
    throw error;
  }
};

// --- Dưới đây là các hàm mẫu gọi API tương ứng với từng màn hình ---

export const userServices = {
  // GET: Lấy thông tin tài khoản theo ID
  getUserProfile: (userId: string) =>
    fetchApi<any>(`/users/${userId}`, { method: 'GET' }),

  // POST: Tạo tài khoản mới (Gửi dữ liệu qua thuộc tính body)
  createUser: (userData: any) =>
    fetchApi<any>(`/users`, {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  // PUT: Cập nhật thông tin tài khoản
  updateProfile: (userId: string, userData: any) =>
    fetchApi<any>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),
};

// Sau này làm thêm Entity Meals thì viết tiếp:
// export const mealServices = {
//   getMealsInWeek: (startDate: string) => fetchApi<any>(`/meals?date=${startDate}`, { method: 'GET' }),
// }
