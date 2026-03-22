-- Kích hoạt extension để tự động tạo UUID 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- 1. Bảng NGƯỜI DÙNG & HỒ SƠ 
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),        -- Lưu mật khẩu đã mã hóa
    role VARCHAR(50) DEFAULT 'user', -- Quyền: 'user' hoặc 'admin'
    is_active BOOLEAN DEFAULT TRUE, -- Trạng thái kích hoạt tài khoản
    height DECIMAL(5,2),          -- Chiều cao (cm)
    weight DECIMAL(5,2),          -- Cân nặng (kg)
    grocery_limit DECIMAL(10,2),  -- Hạn mức chi tiêu mua sắm hàng tuần/tháng
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],       -- Dị ứng (Mảng chuỗi)
    disliked_foods TEXT[] DEFAULT ARRAY[]::TEXT[],  -- Thức ăn không thích (Mảng chuỗi)
    avatar_data BYTEA,            -- Lưu dữ liệu nhị phân (ảnh)
    avatar_filename VARCHAR(255), -- Lưu tên file ảnh
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ================= THAY ĐỔI: BẢNG DANH MỤC ================= --

-- 2. Bảng PHÂN LOẠI NGUYÊN LIỆU (Category)
-- Chứa: 'Vegetables', 'Meat', 'Spices', 'Dry Goods', 'Dairy & Eggs'...
CREATE TABLE ingredient_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng LOẠI BỮA ĂN (Meal Type) 
-- Chứa: 'Breakfast', 'Lunch', 'Dinner', 'Snack'...
CREATE TABLE meal_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================== --

-- 4. Bảng NGUYÊN LIỆU (Từ xa / Hệ thống chung)
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL nếu là nguyên liệu mẫu của hệ thống
    name VARCHAR(255) NOT NULL,
    category_id UUID NOT NULL REFERENCES ingredient_categories(id) ON DELETE RESTRICT,
    base_price DECIMAL(10,2),
    image_data BYTEA,
    image_filename VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 5. Bảng KHO NGUYÊN LIỆU CỦA NGƯỜI DÙNG (Quản lý trạng thái inStock)
CREATE TABLE user_pantry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    in_stock BOOLEAN DEFAULT TRUE,
    quantity_amount VARCHAR(100), -- Ví dụ '1 bunch', '500g' đang có ở nhà
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, ingredient_id)
);


-- 6. Bảng MÓN ĂN (Thư viện công thức)
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Null nếu là món ăn mẫu của hệ thống
    name VARCHAR(255) NOT NULL,
    default_type_id UUID REFERENCES meal_types(id) ON DELETE SET NULL, -- Ràng buộc khóa ngoại xuống bảng Meal Types
    kcal INTEGER,                  -- Tổng lượng calo
    estimated_price DECIMAL(10,2), -- Ước tính chi phí
    image_data BYTEA,
    image_filename VARCHAR(255),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],         -- Nhanh gọn, chay, protein cao...
    steps TEXT[] DEFAULT ARRAY[]::TEXT[],        -- Các bước chế biến (Lưu dưới dạng mảng)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bảng CHI TIẾT CÔNG THỨC (Quan hệ n-n giữa Món ăn và Nguyên liệu)
CREATE TABLE meal_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    amount VARCHAR(100),           -- Ví dụ '2 cups', '1/2 cup'
    calculated_price DECIMAL(10,2),-- Giá cụ thể cho định lượng này
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Bảng THỰC ĐƠN HÀNG NGÀY/TUẦN (Meal Plan)
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,       -- Kế hoạch cho ngày nào
    meal_type_id UUID NOT NULL REFERENCES meal_types(id) ON DELETE RESTRICT, -- Thay VARCHAR thành mối quan hệ chặt với bảng meal_types
    is_completed BOOLEAN DEFAULT FALSE, -- Đánh dấu đã ăn/nấu chưa
    actual_price DECIMAL(10,2),    -- Chi phí thực tế (đề phòng giá nguyên liệu thay đổi)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Tạo Index phục vụ các truy vấn phổ biến
CREATE INDEX idx_meal_plans_user_date ON meal_plans(user_id, plan_date);
CREATE INDEX idx_ingredients_category ON ingredients(category_id);
