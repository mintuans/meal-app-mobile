const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Đăng nhập / Đăng ký
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
