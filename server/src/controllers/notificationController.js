const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

const notificationController = {
  // POST /api/v1/notifications
  async createNotification(req, res, next) {
    try {
      const { user_id, title, message } = req.body;
      if (!user_id || !title || !message) {
        throw { status: 400, message: "Vui lòng nhập đầy đủ: user_id, title, message" };
      }
      const data = await Notification.create({ user_id, title, message });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/notifications (Giao diện Quản lý)
  async getAllNotifications(req, res, next) {
    try {
      const data = await Notification.getAll();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/notifications/my
  async getMyNotifications(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await Notification.getByUserId(userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/notifications/:id/read
  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const data = await Notification.markAsRead(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/notifications/:id
  async deleteNotification(req, res, next) {
    try {
      const { id } = req.params;
      await Notification.delete(id);
      res.status(200).json({ success: true, message: "Đã xóa thông báo" });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController;
