<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Project Structure (Cấu trúc dự án)

```text
meal_app_mobile/
├── server/                 # Backend (Node.js/Express)
│   ├── src/                # Backend Source Code
│   │   ├── config/         # Cấu hình CSDL và app
│   │   ├── controllers/    # Xử lý các yêu cầu từ routes
│   │   ├── middlewares/    # Các middleware của ứng dụng
│   │   ├── models/         # Định nghĩa cấu trúc dữ liệu
│   │   ├── routes/         # Định nghĩa các endpoint API
│   │   ├── services/       # Các dịch vụ xử lý logic chính
│   │   └── utils/          # Các hàm tiện ích dùng chung
│   ├── app.js              # Điểm khởi đầu của server
│   └── package.json        # Danh sách dependency và script của server
├── client/                 # Frontend (React/Vite)
│   ├── src/                # Frontend Source Code
│   │   ├── components/     # Các thành phần giao diện tái sử dụng
│   │   ├── context/        # Quản lý trạng thái toàn cục (React Context)
│   │   ├── navigation/     # Quản lý định tuyến và điều hướng
│   │   ├── screens/        # Các trang giao diện chính của ứng dụng
│   │   ├── services/       # Các dịch vụ gọi API từ frontend
│   │   ├── store/          # Quản lý trạng thái bằng Redux/Zustand
│   │   ├── utils/          # Các hàm hỗ trợ cho frontend
│   │   ├── App.tsx         # Thành phần chính của ứng dụng
│   │   ├── main.tsx        # Điểm khởi đầu của ứng dụng React
│   │   └── types.ts        # Định nghĩa các kiểu dữ liệu (TypeScript)
│   ├── index.html          # HTML entry point
│   ├── vite.config.ts      # Cấu hình Vite
│   ├── tsconfig.json       # Cấu hình TypeScript
│   └── package.json        # Danh sách dependency và script của frontend
├── database.sql            # File script tạo cơ sở dữ liệu gốc
├── seed.sql                # File script thêm dữ liệu mẫu
├── README.md               # File hướng dẫn này
└── .gitignore              # Git ignore file phục vụ quản lý dự án
```

View your app in AI Studio: https://ai.studio/apps/a50e8a79-6075-403a-8f98-c6f03e735ec5

## Run Locally

**Prerequisites:**  Node.js


1. Set up Frontend (Client):
   ```bash
   cd client
   npm install
   npm run dev
   ```
2. Set up Backend (Server):
   ```bash
   cd server
   npm install
   npm run dev
   ```
3. Set the `GEMINI_API_KEY` in `client/.env` and `server/.env` to your API key.
