const ingredientService = require('../services/ingredientService');

const ingredientController = {
  // GET: /api/v1/ingredients/pantry (Tạm thời lấy userID từ req.user do Middleware truyền sang)
  async getPantry(req, res, next) {
    try {
      const userId = req.user.id; // Lấy userID từ Token Middleware
      const data = await ingredientService.getPantry(userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // POST (hoặc PATCH): /api/v1/ingredients/pantry/toggle
  // Đóng gói logic chuyển đổi trạng thái nguyên liệu vào Controller này
  async toggleStock(req, res, next) {
    try {
      const userId = req.user.id;
      const { ingredientId, inStockStatus } = req.body;

      const updated = await ingredientService.toggleStockStatus(userId, ingredientId, inStockStatus);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Cập nhật trạng thái thành công'
      });
    } catch (error) {
      next(error);
    }
  },

  // POST: /api/v1/ingredients
  async addCustomIngredient(req, res, next) {
    try {
      const userId = req.user.id;
      const data = req.body; // { name, categoryId, price, amount }
      
      const result = await ingredientService.addIngredient(userId, data);
      res.status(201).json({
        success: true,
        data: result,
        message: 'Thêm nguyên liệu mới thành công'
      });
    } catch (error) {
      next(error);
    }
  },

  // GET: /api/v1/ingredients/categories
  async getCategories(req, res, next) {
    try {
      const data = await ingredientService.getCategories();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // GET: /api/v1/ingredients
  async getAllIngredients(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await ingredientService.getAllIngredients(userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ingredientController;
