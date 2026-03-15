const userService = require('../services/userService');

const userController = {
  // Lấy chi tiết thông tin user
  async getUserProfile(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error); // Chuyển lỗi xuống cho middleware bắt lỗi xử lý
    }
  },

  // Tạo người dùng mới
  async createUser(req, res, next) {
    try {
      const { name, email, height, weight, grocery_limit } = req.body;
      const newUser = await userService.createUser({ name, email, height, weight, grocery_limit });

      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  },

  // Cập nhật Profile
  async updateProfile(req, res, next) {
    try {
      const { id } = req.params;
      const { name, height, weight, grocery_limit, is_active, role } = req.body;
      const updatedUser = await userService.updateProfile(id, { name, height, weight, grocery_limit, is_active, role });

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.status(200).json({ success: true, message: 'Đã xóa người dùng thành công' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
