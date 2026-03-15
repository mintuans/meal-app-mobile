const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const mealRoutes = require('./routes/mealRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/ingredients', ingredientRoutes);
app.use('/api/v1/meals', mealRoutes);
app.use('/api/v1/meal-plans', mealPlanRoutes);

// Xử lý Route 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'URL Not Found' });
});

// Xử lý lỗi tập trung (Error Handling)
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`📡 Backend Server is running on port ${PORT}`);
});

module.exports = app;
