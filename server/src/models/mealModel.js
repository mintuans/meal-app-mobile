const db = require('../config/db');

const Meal = {
  // Lấy danh sách các món ăn (Bao gồm món ăn mẫu của hệ thống và của riêng user)
  async getAllMeals(userId) {
    const text = `
      SELECT 
        m.id, 
        m.name, 
        mt.name as type, 
        m.kcal, 
        m.estimated_price as price, 
        m.image_data,
        m.image_filename,
        m.tags,
        m.steps
      FROM meals m
      LEFT JOIN meal_types mt ON m.default_type_id = mt.id
      WHERE m.user_id = $1 OR m.user_id IS NULL
      ORDER BY m.created_at DESC;
    `;
    const values = [userId];
    const { rows } = await db.query(text, values);
    return rows;
  },

  // Lấy chi tiết một món ăn kèm danh sách nguyên liệu
  async getMealById(mealId) {
    // 1. Lấy thông tin cơ bản của món ăn
    const mealQuery = `
      SELECT 
        m.id, m.name, mt.name as type, m.kcal, m.estimated_price as price, 
        m.image_data, m.image_filename, m.tags, m.steps
      FROM meals m
      LEFT JOIN meal_types mt ON m.default_type_id = mt.id
      WHERE m.id = $1
    `;
    const { rows: meals } = await db.query(mealQuery, [mealId]);
    const meal = meals[0];

    if (!meal) return null;

    // 2. Lấy danh sách nguyên liệu của món ăn đó
    const ingrQuery = `
      SELECT 
        mi.id as meal_ingredient_id,
        i.id as ingredient_id,
        i.name,
        ic.name as category,
        mi.amount,
        mi.calculated_price as price,
        i.base_price as "basePrice",
        i.base_unit as "baseUnit",
        i.image_data
      FROM meal_ingredients mi
      JOIN ingredients i ON mi.ingredient_id = i.id
      LEFT JOIN ingredient_categories ic ON i.category_id = ic.id
      WHERE mi.meal_id = $1
    `;
    const { rows: ingredients } = await db.query(ingrQuery, [mealId]);

    // Gắn mảng nguyên liệu vào object meal
    meal.ingredients = ingredients;
    return meal;
  },

  // Tạo mới món ăn
  async create(userId, { name, typeId, kcal, price, tags, steps, ingredients, imageData, imageFilename }) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Thêm vào bảng meals
      const mealText = `
        INSERT INTO meals (name, default_type_id, user_id, kcal, estimated_price, tags, steps, image_data, image_filename)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
      `;
      const mealRes = await client.query(mealText, [
        name, typeId, userId, kcal || 0, price || 0, tags || [], steps || [], imageData, imageFilename
      ]);
      const mealId = mealRes.rows[0].id;

      // 2. Thêm danh sách nguyên liệu của món ăn (nếu có)
      if (ingredients && ingredients.length > 0) {
        for (const ing of ingredients) {
          const ingText = `
            INSERT INTO meal_ingredients (meal_id, ingredient_id, amount, calculated_price)
            VALUES ($1, $2, $3, $4);
          `;
          await client.query(ingText, [mealId, ing.id, ing.amount, ing.price || 0]);
        }
      }
      
      await client.query('COMMIT');
      return { id: mealId, name };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  // Lấy danh sách loại bữa ăn
  async getMealTypes() {
    const { rows } = await db.query('SELECT id, name FROM meal_types ORDER BY id ASC');
    return rows;
  },

  // Xóa món ăn
  async delete(mealId) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      // Xóa nguyên liệu trước
      await client.query('DELETE FROM meal_ingredients WHERE meal_id = $1', [mealId]);
      // Xóa món ăn
      const res = await client.query('DELETE FROM meals WHERE id = $1', [mealId]);
      await client.query('COMMIT');
      return res.rowCount > 0;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  // Cập nhật món ăn
  async update(mealId, { name, typeId, kcal, price, tags, steps, ingredients, imageData, imageFilename }) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Cập nhật bảng meals
      const mealText = `
        UPDATE meals 
        SET name = $1, default_type_id = $2, kcal = $3, estimated_price = $4, tags = $5, steps = $6, image_data = $7, image_filename = $8
        WHERE id = $9;
      `;
      await client.query(mealText, [name, typeId, kcal || 0, price || 0, tags || [], steps || [], imageData, imageFilename, mealId]);

      // 2. Cập nhật nguyên liệu: Xóa cũ thêm mới (đơn giản nhất)
      await client.query('DELETE FROM meal_ingredients WHERE meal_id = $1', [mealId]);
      if (ingredients && ingredients.length > 0) {
        for (const ing of ingredients) {
          const ingText = `
            INSERT INTO meal_ingredients (meal_id, ingredient_id, amount, calculated_price)
            VALUES ($1, $2, $3, $4);
          `;
          await client.query(ingText, [mealId, ing.id, ing.amount, ing.price || 0]);
        }
      }

      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};

module.exports = Meal;
