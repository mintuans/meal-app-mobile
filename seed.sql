-- 1. Thêm dữ liệu mẫu cho Phân loại nguyên liệu (Tiếng Việt)
INSERT INTO ingredient_categories (id, name) VALUES 
('c1a01940-0000-0000-0000-000000000001', 'Rau củ'),
('c1a01940-0000-0000-0000-000000000002', 'Thịt & Hải sản'),
('c1a01940-0000-0000-0000-000000000003', 'Gia vị'),
('c1a01940-0000-0000-0000-000000000004', 'Đồ khô'),
('c1a01940-0000-0000-0000-000000000005', 'Sữa & Trứng');

-- 2. Thêm dữ liệu mẫu cho Loại bữa ăn (Tiếng Việt)
INSERT INTO meal_types (id, name) VALUES 
('2b02a500-0000-0000-0000-000000000001', 'Bữa sáng'),
('2b02a500-0000-0000-0000-000000000002', 'Bữa trưa'),
('2b02a500-0000-0000-0000-000000000003', 'Bữa tối'),
('2b02a500-0000-0000-0000-000000000004', 'Ăn nhẹ');

-- 3. Thêm một User mẫu (Dùng ID 0000... để khớp với authMiddleware giả lập)
INSERT INTO users (id, name, email, height, weight, grocery_limit) VALUES 
('00000000-0000-0000-0000-000000000000', 'Quản trị viên', 'admin@example.com', 170.5, 65.0, 1500000);

-- 4. Thêm danh sách Nguyên liệu mẫu (Tiếng Việt)
INSERT INTO ingredients (id, name, category_id, base_price, image_filename) VALUES 
('3c03b100-0000-0000-0000-000000000001', 'Cải bó xôi hữu cơ', 'c1a01940-0000-0000-0000-000000000001', 25000, 'spinach.jpg'),
('3c03b100-0000-0000-0000-000000000002', 'Ớt chuông', 'c1a01940-0000-0000-0000-000000000001', 15000, 'peppers.jpg'),
('3c03b100-0000-0000-0000-000000000003', 'Cà chua bi', 'c1a01940-0000-0000-0000-000000000001', 40000, 'tomatoes.jpg'),
('3c03b100-0000-0000-0000-000000000004', 'Quả bơ', 'c1a01940-0000-0000-0000-000000000001', 20000, 'avocados.jpg'),
('3c03b100-0000-0000-0000-000000000005', 'Lá húng tây tươi', 'c1a01940-0000-0000-0000-000000000001', 35000, 'basil.jpg'),
('3c03b100-0000-0000-0000-000000000006', 'Dầu ô liu nguyên chất', 'c1a01940-0000-0000-0000-000000000003', 150000, 'oil.jpg');

-- 5. Thêm dữ liệu Kho nguyên liệu cho User (Sẵn hàng)
INSERT INTO user_pantry (user_id, ingredient_id, in_stock, quantity_amount) VALUES 
('00000000-0000-0000-0000-000000000000', '3c03b100-0000-0000-0000-000000000001', true, '1 bó'),
('00000000-0000-0000-0000-000000000000', '3c03b100-0000-0000-0000-000000000003', true, '500g');

-- 6. Thêm Món ăn mẫu (Tiếng Việt)
INSERT INTO meals (id, name, default_type_id, kcal, estimated_price, tags, steps) VALUES 
('f4d04e20-0000-0000-0000-000000000001', 'Bánh mì nướng bơ', '2b02a500-0000-0000-0000-000000000001', 340, 45000, ARRAY['Mặn', 'Nhanh <15p', 'Sức khỏe'], 
 ARRAY['Luộc mỳ Ý: Đun sôi nồi nước muối lớn.', 'Làm sốt Pesto: Xay nhuyễn húng tây, tỏi, hạt thông và phô mai.', 'Trộn và Thưởng thức: Trộn mỳ ấm với sốt pesto tươi.']),
('f4d04e20-0000-0000-0000-000000000002', 'Salad hạt Quinoa', '2b02a500-0000-0000-0000-000000000002', 520, 75000, ARRAY['Thuần chay', 'Sức khỏe'], ARRAY['Nấu hạt Quinoa', 'Trộn các loại rau củ phối hợp']),
('f4d04e20-0000-0000-0000-000000000003', 'Cá hồi nướng hương thảo', '2b02a500-0000-0000-0000-000000000003', 410, 150000, ARRAY['Giàu Protein', 'Kiểu Ý'], ARRAY['Nướng cá hồi', 'Thêm thảo mộc tươi']);

-- 7. Thêm chi tiết nguyên liệu cho món ăn (Bánh mì nướng bơ)
INSERT INTO meal_ingredients (meal_id, ingredient_id, amount, calculated_price) VALUES 
('f4d04e20-0000-0000-0000-000000000001', '3c03b100-0000-0000-0000-000000000005', '2 tách', 35000),
('f4d04e20-0000-0000-0000-000000000001', '3c03b100-0000-0000-0000-000000000006', '1/2 tách', 22000);
