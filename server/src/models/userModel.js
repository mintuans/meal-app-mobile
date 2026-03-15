const db = require('../config/db');

const User = {
  // Lấy User theo ID
  async findById(id) {
    const text = 'SELECT id, name, email, role, is_active, height, weight, grocery_limit FROM users WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(text, values);
    return rows[0];
  },

  // Tìm User bằng Email
  async findByEmail(email) {
    const text = 'SELECT id, name, email, role, is_active FROM users WHERE email = $1';
    const values = [email];
    const { rows } = await db.query(text, values);
    return rows[0];
  },

  async findByEmailWithPassword(email) {
    const text = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const { rows } = await db.query(text, values);
    return rows[0];
  },

  // Tạo User mới
  async create(data) {
    const text = `
      INSERT INTO users (name, email, password, height, weight, grocery_limit, is_active, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, email, role, is_active, height, weight, grocery_limit;
    `;
    const values = [
      data.name,
      data.email,
      data.password || null,
      data.height || null,
      data.weight || null,
      data.grocery_limit || 1500000,
      data.is_active !== undefined ? data.is_active : true,
      data.role || 'user'
    ];
    
    const { rows } = await db.query(text, values);
    return rows[0];
  },

  // Cập nhật thông tin User
  async update(id, data) {
    const text = `
      UPDATE users 
      SET 
        name = COALESCE($1, name), 
        height = COALESCE($2, height), 
        weight = COALESCE($3, weight), 
        grocery_limit = COALESCE($4, grocery_limit), 
        is_active = COALESCE($5, is_active), 
        role = COALESCE($6, role), 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, name, email, role, is_active, height, weight, grocery_limit;
    `;
    const values = [
      data.name || null,
      (data.height === undefined || data.height === '') ? null : data.height,
      (data.weight === undefined || data.weight === '') ? null : data.weight,
      (data.grocery_limit === undefined || data.grocery_limit === '') ? null : data.grocery_limit,
      data.is_active === undefined ? null : data.is_active,
      data.role || null,
      id
    ];

    const { rows } = await db.query(text, values);
    return rows[0];
  },

  async getAllUsers() {
    const text = 'SELECT id, name, email, role, is_active, height, weight, grocery_limit, created_at FROM users ORDER BY created_at DESC';
    const { rows } = await db.query(text);
    return rows;
  },

  async delete(id) {
    const text = 'DELETE FROM users WHERE id = $1';
    await db.query(text, [id]);
    return true;
  }
};

module.exports = User;
