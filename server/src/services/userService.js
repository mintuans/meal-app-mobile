const User = require('../models/userModel');

const userService = {
  // Logic kiểm tra và lấy thông tin người dùng
  async getUserById(id) {
    if (!id) {
      throw new Error('ID người dùng không hợp lệ');
    }
    const user = await User.findById(id);
    return user;
  },

  // Logic nghiệp vụ tạo người dùng, check email trùng lặp...
  async createUser(userData) {
    const { email } = userData;

    // Ví dụ một quy định nghiệp vụ: Email không được trống
    if (!email) {
      throw { status: 400, message: 'Email là bắt buộc' };
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw { status: 400, message: 'Email này đã được sử dụng' };
    }

    const newUser = await User.create(userData);
    return newUser;
  },

  async updateProfile(id, userData) {
    if (!id) throw new Error('ID người dùng không hợp lệ');
    const updatedUser = await User.update(id, userData);
    return updatedUser;
  }
};

module.exports = userService;
