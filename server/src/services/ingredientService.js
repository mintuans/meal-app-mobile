const Ingredient = require('../models/ingredientModel');

const ingredientService = {
  // Lấy danh sách nguyên liệu của user
  async getPantry(userId) {
    if (!userId) {
      throw { status: 400, message: 'Thiếu ID người dùng' };
    }
    const list = await Ingredient.getUserPantry(userId);

    // Chuẩn hóa dữ liệu trả về giống cấu trúc Interface bên Frontend
    const normalizedData = list.map(item => ({
      id: item.ingredient_id,
      name: item.name,
      category: item.category_name,
      price: item.base_price,
      // Tính logic inStock (nếu user chưa từng check vào pantry, coi như chưa mua -> inStock = false)
      inStock: item.in_stock === null ? false : item.in_stock,
      amount: item.quantity_amount || '1 unit',
      image: item.image_data ? `data:image/jpeg;base64,${item.image_data.toString('base64')}` : '',
    }));

    return normalizedData;
  },

  // Thay đổi trạng thái 'Còn hàng / Hết hàng'
  async toggleStockStatus(userId, ingredientId, inStockStatus) {
    if (!userId || !ingredientId) {
      throw { status: 400, message: 'Thiếu dữ liệu đầu vào' };
    }
    const updated = await Ingredient.toggleStock(userId, ingredientId, inStockStatus);
    return updated;
  },

  // Thêm mới
  async addIngredient(userId, data) {
    if(!data.name || !data.categoryId) throw { status: 400, message: "Tên và Danh mục là bắt buộc" };
    
    // Nếu có ảnh Base64 gửi lên từ frontend
    if (data.image && data.image.startsWith('data:image')) {
      const base64Data = data.image.split(',')[1];
      data.imageData = Buffer.from(base64Data, 'base64');
      data.imageFilename = `ingredient_${Date.now()}.jpg`;
    }

    return await Ingredient.create(userId, data);
  },

  async getCategories() {
    return await Ingredient.getCategories();
  },

  async getAllIngredients() {
    const list = await Ingredient.getAllIngredients();
    return list.map(item => ({
      ...item,
      price: item.price ? parseFloat(item.price) : 0
    }));
  }
};

module.exports = ingredientService;
