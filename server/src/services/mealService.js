const Meal = require('../models/mealModel');

const mealService = {
  // 1. Lấy danh sách toàn bộ các món ăn 
  async getAllMeals(userId) {
    const list = await Meal.getAllMeals(userId);
    
    // Format lại dữ liệu cho Frontend (ví dụ parse image)
    const normalizedData = list.map(m => ({
      id: m.id,
      name: m.name,
      type: m.type || 'Chưa phân loại',
      kcal: m.kcal,
      price: m.price ? parseFloat(m.price) : 0,
      tags: m.tags || [],
      steps: m.steps || [],
      image: m.image_data ? `data:image/jpeg;base64,${m.image_data.toString('base64')}` : '' 
    }));

    return normalizedData;
  },

  // 2. Lấy chi tiết món ăn (Kèm list nguyên liệu bên trong)
  async getMealDetails(mealId) {
    if (!mealId) {
      throw { status: 400, message: 'ID món ăn không hợp lệ' };
    }
    
    const meal = await Meal.getMealById(mealId);
    if (!meal) {
      throw { status: 404, message: 'Không tìm thấy thông tin món ăn' };
    }

    // Map lại mảng ingredients của bữa ăn
    const normalizedIngredients = meal.ingredients.map(ing => ({
      id: ing.ingredient_id,
      name: ing.name,
      category: ing.category,
      amount: ing.amount,
      price: ing.price ? parseFloat(ing.price) : 0,
      image: ing.image_data ? 'data:image/jpeg;base64,' + ing.image_data.toString('base64') : ''
    }));

    return {
      id: meal.id,
      name: meal.name,
      type: meal.type,
      kcal: meal.kcal,
      price: parseFloat(meal.price) || 0,
      tags: meal.tags || [],
      steps: meal.steps || [],
      image: meal.image_data ? 'data:image/jpeg;base64,' + meal.image_data.toString('base64') : '',
      ingredients: normalizedIngredients
    };
  },

  // 3. Thêm món ăn mới
  async addMeal(userId, data) {
    if (!data.name || !data.typeId) {
      throw { status: 400, message: 'Tên món ăn và Loại bữa ăn là bắt buộc' };
    }

    // Xử lý ảnh base64
    if (data.image && data.image.startsWith('data:image')) {
      const base64Data = data.image.split(',')[1];
      data.imageData = Buffer.from(base64Data, 'base64');
      data.imageFilename = `meal_${Date.now()}.jpg`;
    }

    return await Meal.create(userId, data);
  },

  // 4. Lấy danh sách loại bữa ăn
  async getMealTypes() {
    return await Meal.getMealTypes();
  },

  // 5. Xóa món ăn
  async deleteMeal(mealId) {
    return await Meal.delete(mealId);
  },

  // 6. Cập nhật món ăn
  async updateMeal(mealId, data) {
    if (!data.name || !data.typeId) {
      throw { status: 400, message: 'Tên món ăn và Loại bữa ăn là bắt buộc' };
    }

    // Xử lý ảnh base64
    if (data.image && data.image.startsWith('data:image')) {
      const base64Data = data.image.split(',')[1];
      data.imageData = Buffer.from(base64Data, 'base64');
      data.imageFilename = `meal_${Date.now()}.jpg`;
    }

    return await Meal.update(mealId, data);
  }
};

module.exports = mealService;
