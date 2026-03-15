const db = require('../config/db');

const Ingredient = {
  // Lấy chi tiết kho nguyên liệu của 1 User
  // Nó sẽ kết hợp bảng user_pantry (đồ có ở nhà) và bảng ingredients (dữ liệu chung)
  async getUserPantry(userId) {
    const text = `
      SELECT 
        i.id as ingredient_id, 
        i.name, 
        i.base_price, 
        ic.name as category_name,
        up.in_stock,
        up.quantity_amount,
        i.image_data,
        i.image_filename
      FROM ingredients i
      JOIN ingredient_categories ic ON i.category_id = ic.id
      LEFT JOIN user_pantry up ON i.id = up.ingredient_id AND up.user_id = $1
    `;
    const values = [userId];
    const { rows } = await db.query(text, values);
    return rows;
  },

  // Update trạng thái Nguyên liệu (còn trong kho hay hết hàng)
  async toggleStock(userId, ingredientId, inStockStatus) {
    // Upsert (Insert nếu chưa có, Update nếu đã có)
    const text = `
      INSERT INTO user_pantry (user_id, ingredient_id, in_stock, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, ingredient_id) 
      DO UPDATE SET 
        in_stock = EXCLUDED.in_stock,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [userId, ingredientId, inStockStatus];
    const { rows } = await db.query(text, values);
    return rows[0];
  },

  // Tạo mới nguyên liệu và thêm vào kho của User
  async create(userId, { name, categoryId, price, amount, imageData, imageFilename }) {
    // Sử dụng transaction để đảm bảo dữ liệu toàn vẹn
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Thêm vào bảng ingredients
      const ingText = `
        INSERT INTO ingredients (name, category_id, base_price, image_data, image_filename)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
      const ingRes = await client.query(ingText, [name, categoryId, price, imageData, imageFilename]);
      const ingredientId = ingRes.rows[0].id;

      // 2. Thêm vào bảng user_pantry
      const pantryText = `
        INSERT INTO user_pantry (user_id, ingredient_id, in_stock, quantity_amount)
        VALUES ($1, $2, true, $3)
        RETURNING *;
      `;
      const pantryRes = await client.query(pantryText, [userId, ingredientId, amount]);
      
      await client.query('COMMIT');
      return {
        id: ingredientId,
        name,
        categoryId,
        price,
        amount,
        inStock: true
      };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  // Lấy danh sách danh mục để đổ vào Dropdown
  async getCategories() {
    const { rows } = await db.query('SELECT id, name FROM ingredient_categories ORDER BY name ASC');
    return rows;
  },

  // Lấy toàn bộ danh sách nguyên liệu hệ thống
  async getAllIngredients() {
    const { rows } = await db.query('SELECT id, name, base_price as price FROM ingredients ORDER BY name ASC');
    return rows;
  }
};

module.exports = Ingredient;
