const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const authMiddleware = require('../middlewares/authMiddleware');

// Lấy kế hoạch
router.get('/', authMiddleware.verifyToken, mealPlanController.getPlans);

// Thêm vào kế hoạch
router.post('/', authMiddleware.verifyToken, mealPlanController.addPlan);

// Xóa khỏi kế hoạch
router.delete('/:id', authMiddleware.verifyToken, mealPlanController.removePlan);

// Đánh dấu hoàn thành
router.patch('/:id/complete', authMiddleware.verifyToken, mealPlanController.toggleComplete);

module.exports = router;
