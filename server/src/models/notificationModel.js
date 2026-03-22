const db = require('../config/db');

const Notification = {
  // Tạo thông báo mới cho 1 user
  async create({ user_id, title, message }) {
    const text = `
      INSERT INTO notifications (user_id, title, message)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [user_id, title, message];
    const { rows } = await db.query(text, values);
    return rows[0];
  },

  // Lấy danh sách toàn bộ thông báo (Dành cho quản lý)
  async getAll() {
    const text = `
      SELECT n.*, u.name as recipient_name
      FROM notifications n
      JOIN users u ON n.user_id = u.id
      ORDER BY n.created_at DESC;
    `;
    const { rows } = await db.query(text);
    return rows;
  },

  // Lấy thông báo của một User cụ thể
  async getByUserId(userId) {
    const text = `
      SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC;
    `;
    const { rows } = await db.query(text, [userId]);
    return rows;
  },

  // Đánh dấu đã đọc
  async markAsRead(id) {
    const text = `UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *;`;
    const { rows } = await db.query(text, [id]);
    return rows[0];
  },

  // Xóa thông báo
  async delete(id) {
    await db.query('DELETE FROM notifications WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Notification;
