const db = require('../config/db');

const User = {
  // Lấy User theo ID
  async findById(id) {
    const text = 'SELECT id, name, email, height, weight, grocery_limit FROM users WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(text, values);
    return rows[0];
  },

  // Tìm User bằng Email
  async findByEmail(email) {
    const text = 'SELECT id, name, email FROM users WHERE email = $1';
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
      INSERT INTO users (name, email, password, height, weight, grocery_limit)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, height, weight, grocery_limit;
    `;
    const values = [
      data.name,
      data.email,
      data.password || null,
      data.height || null,
      data.weight || null,
      data.grocery_limit || 1500000
    ];
    
    const { rows } = await db.query(text, values);
    return rows[0];
  },

  // Cập nhật thông tin User
  async update(id, data) {
    const text = `
      UPDATE users 
      SET name = $1, height = $2, weight = $3, grocery_limit = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, name, email, height, weight, grocery_limit;
    `;
    const values = [
      data.name,
      data.height === '' ? null : data.height,
      data.weight === '' ? null : data.weight,
      data.grocery_limit === '' ? null : data.grocery_limit,
      id
    ];

    const { rows } = await db.query(text, values);
    return rows[0];
  }
};

module.exports = User;
