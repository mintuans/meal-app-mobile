const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint: Chi tiêu theo danh mục
router.get('/spending-by-category', authMiddleware.verifyToken, analyticsController.getSpendingByCategory);

// Endpoint: Tổng quan chi tiêu (Dùng cho biểu đồ chính)
router.get('/summary', authMiddleware.verifyToken, analyticsController.getSummary);

module.exports = router;
