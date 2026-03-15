const mealPlanService = require('../services/mealPlanService');

const mealPlanController = {
  async getPlans(req, res, next) {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;
      const plans = await mealPlanService.getUserPlans(userId, startDate, endDate);
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      next(error);
    }
  },

  async addPlan(req, res, next) {
    try {
      const userId = req.user.id;
      const data = req.body;
      const result = await mealPlanService.addToPlan(userId, data);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async removePlan(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await mealPlanService.removeFromPlan(userId, id);
      res.status(200).json({ success: true, message: 'Đã xóa khỏi kế hoạch' });
    } catch (error) {
      next(error);
    }
  },

  async toggleComplete(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { isCompleted } = req.body;
      const result = await mealPlanService.toggleStatus(userId, id, isCompleted);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = mealPlanController;
