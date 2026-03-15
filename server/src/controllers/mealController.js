const mealService = require('../services/mealService');

const mealController = {
  // Lấy danh sách tất cả món ăn (Thư viện dùng chung + Của user tự tạo)
  async getAllMeals(req, res, next) {
    try {
      const userId = req.user.id;
      const meals = await mealService.getAllMeals(userId);
      res.status(200).json({ success: true, data: meals });
    } catch (error) {
      next(error);
    }
  },

  // Xem chi tiết 1 món ăn cụ thể bằng Meal ID
  async getMealDetails(req, res, next) {
    try {
      const { id } = req.params;
      const meal = await mealService.getMealDetails(id);
      res.status(200).json({ success: true, data: meal });
    } catch (error) {
      next(error);
    }
  },

  // POST: /api/v1/meals
  async addMeal(req, res, next) {
    try {
      const userId = req.user.id;
      const data = req.body; 
      const result = await mealService.addMeal(userId, data);
      res.status(201).json({ success: true, data: result, message: 'Tạo món ăn mới thành công' });
    } catch (error) {
      next(error);
    }
  },

  // GET: /api/v1/meals/types
  async getMealTypes(req, res, next) {
    try {
      const types = await mealService.getMealTypes();
      res.status(200).json({ success: true, data: types });
    } catch (error) {
      next(error);
    }
  },

  // PUT: /api/v1/meals/:id
  async updateMeal(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      await mealService.updateMeal(id, data);
      res.status(200).json({ success: true, message: 'Cập nhật món ăn thành công' });
    } catch (error) {
      next(error);
    }
  },

  // DELETE: /api/v1/meals/:id
  async deleteMeal(req, res, next) {
    try {
      const { id } = req.params;
      await mealService.deleteMeal(id);
      res.status(200).json({ success: true, message: 'Xóa món ăn thành công' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = mealController;
