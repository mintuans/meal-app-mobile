const db = require('../config/db');

const analyticsController = {
  // GET /api/v1/analytics/spending-by-category
  async getSpendingByCategory(req, res, next) {
    try {
      const userId = req.user.id;
      
      const text = `
        SELECT 
          c.name as category,
          c.color,
          SUM(COALESCE(i.base_price, 0)) as amount
        FROM ingredients i
        JOIN ingredient_categories c ON i.category_id = c.id
        LEFT JOIN user_pantry up ON i.id = up.ingredient_id AND up.user_id = $1
        WHERE i.user_id = $1 OR i.user_id IS NULL
        GROUP BY c.id, c.name, c.color
        HAVING SUM(COALESCE(i.base_price, 0)) > 0
        ORDER BY amount DESC;
      `;
      const { rows } = await db.query(text, [userId]);
      
      // Tính toán phần trăm
      const total = rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);
      const data = rows.map(row => ({
        ...row,
        amount: Math.round(parseFloat(row.amount) * 1000),
        percentage: total > 0 ? (parseFloat(row.amount) / total * 100).toFixed(1) : 0
      }));

      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/analytics/summary?timeframe=weekly|monthly|yearly
  async getSummary(req, res, next) {
    try {
      const userId = req.user.id;
      const { timeframe = 'weekly' } = req.query;
      
      let summary = {};

      if (timeframe === 'monthly') {
        summary = {
            totalSpending: 1850000, 
            spendingTrend: -5.2,
            homeSpending: 1200000,
            outSpending: 650000,
            weeklyData: [
                { name: 'Tuần 1', value: 450000 },
                { name: 'Tuần 2', value: 380000 },
                { name: 'Tuần 3', value: 520000 },
                { name: 'Tuần 4', value: 500000 },
            ]
        };
      } else if (timeframe === 'yearly') {
        summary = {
            totalSpending: 22400000, 
            spendingTrend: 8.7,
            homeSpending: 15800000,
            outSpending: 6600000,
            weeklyData: [
                { name: 'T1', value: 1800000 },
                { name: 'T2', value: 2100000 },
                { name: 'T3', value: 1950000 },
                { name: 'T4', value: 2200000 },
                { name: 'T5', value: 1750000 },
                { name: 'T6', value: 2050000 },
                { name: 'T7', value: 2300000 },
                { name: 'T8', value: 1900000 },
                { name: 'T9', value: 2150000 },
                { name: 'T10', value: 2000000 },
                { name: 'T11', value: 2100000 },
                { name: 'T12', value: 2250000 },
            ]
        };
      } else {
        // Mặc định: Weekly
        summary = {
            totalSpending: 428500,
            spendingTrend: 12.4,
            homeSpending: 154200,
            outSpending: 274300,
            weeklyData: [
                { name: 'T2', value: 30000 },
                { name: 'T3', value: 45000 },
                { name: 'T4', value: 35000 },
                { name: 'T5', value: 60000 },
                { name: 'T6', value: 25000 },
                { name: 'T7', value: 55000 },
                { name: 'CN', value: 40000 },
            ]
        };
      }
      
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = analyticsController;
