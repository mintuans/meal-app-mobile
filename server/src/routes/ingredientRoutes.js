const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint: Lấy danh sách thành phần và trạng thái có sẵn trong kho nhà (Quyền User)
router.get('/pantry', authMiddleware.verifyToken, ingredientController.getPantry);

// Endpoint: Cập nhật có / hết hàng 
router.post('/pantry/toggle', authMiddleware.verifyToken, ingredientController.toggleStock);

// Endpoint: Thêm nguyên liệu tùy chỉnh
router.post('/', authMiddleware.verifyToken, ingredientController.addCustomIngredient);

// Endpoint: Lấy danh sách danh mục
router.get('/categories', authMiddleware.verifyToken, ingredientController.getCategories);

// Endpoint: Lấy toàn bộ danh sách nguyên liệu hệ thống
router.get('/', authMiddleware.verifyToken, ingredientController.getAllIngredients);

module.exports = router;
