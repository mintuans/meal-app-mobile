const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashedPassword });

      const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

      res.status(201).json({ success: true, token, user: newUser });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findByEmailWithPassword(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
      }

      if (user.is_active === false) {
        return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
      delete user.password;
      res.status(200).json({ success: true, token, user });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
