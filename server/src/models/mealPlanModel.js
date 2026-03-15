const db = require('../config/db');

const MealPlan = {
  // Lấy kế hoạch ăn uống của người dùng theo khoảng ngày
  async getPlansByDateRange(userId, startDate, endDate) {
    const text = `
      SELECT mp.*, m.name as meal_name, m.kcal, m.estimated_price, m.tags, m.image_data, mt.name as type_name
      FROM meal_plans mp
      JOIN meals m ON mp.meal_id = m.id
      JOIN meal_types mt ON mp.meal_type_id = mt.id
      WHERE mp.user_id = $1 AND mp.plan_date BETWEEN $2 AND $3
      ORDER BY mp.plan_date ASC, mt.id ASC;
    `;
    const { rows } = await db.query(text, [userId, startDate, endDate]);
    return rows;
  },

  // Thêm một món vào kế hoạch
  async addPlan(userId, { mealId, planDate, mealTypeId }) {
    const text = `
      INSERT INTO meal_plans (user_id, meal_id, plan_date, meal_type_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await db.query(text, [userId, mealId, planDate, mealTypeId]);
    return rows[0];
  },

  // Xóa một mục khỏi kế hoạch
  async removePlan(userId, planId) {
    const text = 'DELETE FROM meal_plans WHERE id = $1 AND user_id = $2';
    const res = await db.query(text, [planId, userId]);
    return res.rowCount > 0;
  },

  // Cập nhật trạng thái hoàn thành
  async toggleComplete(userId, planId, isCompleted) {
    const text = 'UPDATE meal_plans SET is_completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
    const { rows } = await db.query(text, [isCompleted, planId, userId]);
    return rows[0];
  }
};

module.exports = MealPlan;
