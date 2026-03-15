const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint: Lấy danh sách toàn bộ thẻ các món ăn (Bảo vệ bởi Token)
router.get('/', authMiddleware.verifyToken, mealController.getAllMeals);

// Endpoint: Lấy danh sách loại bữa ăn
router.get('/types', authMiddleware.verifyToken, mealController.getMealTypes);

// Endpoint: Truy vấn chi tiết một món ăn bằng ID (Kèm nguyên liệu con)
router.get('/:id', authMiddleware.verifyToken, mealController.getMealDetails);

// Endpoint: Tạo món ăn mới
router.post('/', authMiddleware.verifyToken, mealController.addMeal);

// Endpoint: Cập nhật món ăn
router.put('/:id', authMiddleware.verifyToken, mealController.updateMeal);

// Endpoint: Xóa món ăn
router.delete('/:id', authMiddleware.verifyToken, mealController.deleteMeal);

module.exports = router;
