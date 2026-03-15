const jwt = require('jsonwebtoken');

// Placeholder cho việc kiểm tra JWT token
const authMiddleware = {
  verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
      return res.status(403).json({ message: 'Token là bắt buộc' });
    }

    const token = bearerHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded; // { id: '...', role: '...' }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  },

  isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Quyền truy cập bị từ chối: Yêu cầu quyền Admin' });
    }
  }
};

module.exports = authMiddleware;
