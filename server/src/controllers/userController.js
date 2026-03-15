const userService = require('../services/userService');

const userController = {
  // Lấy chi tiết thông tin user
  async getUserProfile(req, res, next) {
    try {
      // Bảo mật: Nếu không phải Admin, chỉ cho phép lấy profile của chính mình
      const id = (req.user.role === 'admin') ? req.params.id : req.user.id;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
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
      const isAdmin = req.user.role === 'admin';
      // Bảo mật: Nếu không phải Admin, chỉ được sửa chính mình
      const id = isAdmin ? req.params.id : req.user.id;
      
      const { name, height, weight, grocery_limit, is_active, role } = req.body;
      
      // Bảo mật: Chỉ Admin mới có quyền đổi Role hoặc trạng thái kích hoạt (is_active)
      const updateData = { name, height, weight, grocery_limit };
      if (isAdmin) {
        if (is_active !== undefined) updateData.is_active = is_active;
        if (role !== undefined) updateData.role = role;
      }

      const updatedUser = await userService.updateProfile(id, updateData);

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
