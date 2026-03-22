const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint: Lấy thông báo cá nhân (cho người dùng xem)
router.get('/my', authMiddleware.verifyToken, notificationController.getMyNotifications);

// Endpoint: Đánh dấu đã đọc
router.put('/:id/read', authMiddleware.verifyToken, notificationController.markAsRead);

// Endpoint: Quản lý (Cho Admin / Người quản lý)
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, notificationController.getAllNotifications); // Lấy toàn bộ thông báo hệ thống
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, notificationController.createNotification); // Tạo mới & gửi đến user tùy chỉnh
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, notificationController.deleteNotification); // Xóa thông báo

module.exports = router;
