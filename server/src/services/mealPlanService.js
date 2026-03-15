const MealPlan = require('../models/mealPlanModel');

const mealPlanService = {
  async getUserPlans(userId, startDate, endDate) {
    // Nếu không truyền ngày, lấy ngày hôm nay
    const start = startDate || new Date().toISOString().split('T')[0];
    const end = endDate || start;
    const plans = await MealPlan.getPlansByDateRange(userId, start, end);
    return plans.map(p => ({
      ...p,
      image: p.image_data ? `data:image/jpeg;base64,${p.image_data.toString('base64')}` : ''
    }));
  },

  async addToPlan(userId, data) {
    if (!data.mealId || !data.planDate || !data.mealTypeId) {
      throw { status: 400, message: 'Thiếu thông tin kế hoạch (mealId, planDate, mealTypeId)' };
    }
    return await MealPlan.addPlan(userId, data);
  },

  async removeFromPlan(userId, planId) {
    return await MealPlan.removePlan(userId, planId);
  },

  async toggleStatus(userId, planId, isCompleted) {
    return await MealPlan.toggleComplete(userId, planId, isCompleted);
  }
};

module.exports = mealPlanService;
