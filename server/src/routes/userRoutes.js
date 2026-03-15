const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint: Lấy thông tin User theo ID (Yêu cầu phải có token hợp lệ)
router.get('/:id', authMiddleware.verifyToken, userController.getUserProfile);

// Endpoint: Đăng ký / Tạo người dùng mới
router.post('/', userController.createUser);

// Endpoint: Cập nhật thông tin User
router.put('/:id', authMiddleware.verifyToken, userController.updateProfile);

// Endpoints dành cho Admin: Lấy danh sách và xóa user
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.getAllUsers);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;
