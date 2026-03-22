import { fetchApi } from './apiService';

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  recipient_name?: string; // Trả về kèm khi ở màn quản lý
}

export const notificationServices = {
  // Lấy danh sách toàn bộ thông báo (Admin)
  getAll: () => 
    fetchApi<{ data: NotificationItem[] }>('/notifications', { method: 'GET' }),

  // Lấy thông báo cá nhân
  getMy: () => 
    fetchApi<{ data: NotificationItem[] }>('/notifications/my', { method: 'GET' }),

  // Tạo & gửi thông báo
  create: (data: { user_id: string, title: string, message: string }) =>
    fetchApi<{ success: boolean }>('/notifications', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Đánh dấu đã đọc
  markRead: (id: string) =>
    fetchApi<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PUT' }),

  // Xóa thông báo
  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/notifications/${id}`, { method: 'DELETE' }),
};
