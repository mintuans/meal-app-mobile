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

// Các endpoint quản lý danh mục (Admin/User tùy policy - hiện tại cho phép user đã token)
router.post('/categories', authMiddleware.verifyToken, ingredientController.createCategory);
router.put('/categories/:id', authMiddleware.verifyToken, ingredientController.updateCategory);
router.delete('/categories/:id', authMiddleware.verifyToken, ingredientController.deleteCategory);

// Endpoint: Quét hóa đơn (OCR)
router.post('/scan-receipt', authMiddleware.verifyToken, ingredientController.scanReceipt);

// Endpoint: Lấy toàn bộ danh sách nguyên liệu hệ thống
router.get('/', authMiddleware.verifyToken, ingredientController.getAllIngredients);

module.exports = router;
