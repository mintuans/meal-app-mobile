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

module.exports = router;
