# Docify - Hệ thống chia sẻ tài liệu

Docify là một nền tảng chia sẻ tài liệu toàn diện, bao gồm ứng dụng web và ứng dụng di động, cho phép người dùng tải lên, xem và bình luận về các tài liệu như PDF và DOC.

## Tính năng chính

### Ứng dụng Web (Client)
- **Trang chủ**: Hiển thị danh sách tài liệu với tìm kiếm và lọc.
- **Đăng nhập/Đăng ký**: Xác thực người dùng.
- **Tải tài liệu**: Upload file lên đến 5MB (PDF, DOC).
- **Chi tiết tài liệu**: Xem tài liệu, bình luận và đánh giá.
- **Quản trị**: Dashboard cho admin để quản lý tài liệu và bình luận.
- **Liên hệ**: Trang liên hệ.

### Ứng dụng Di động (Mobile)
- **Đăng nhập**: Xác thực người dùng.
- **Trang chủ**: Danh sách tài liệu.
- **Chi tiết**: Xem và bình luận tài liệu.

### Máy chủ (Server)
- API RESTful cho tất cả chức năng.
- Quản lý người dùng, tài liệu, bình luận.
- Upload file với Multer.
- Cơ sở dữ liệu MongoDB.

## Công nghệ sử dụng

- **Backend**: Node.js, Express.js, MongoDB, Multer
- **Frontend Web**: React, Vite, React Router
- **Mobile**: React Native, Expo
- **Authentication**: Local storage (web), AsyncStorage (mobile)
- **Database**: MongoDB

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (phiên bản 16+)
- MongoDB (chạy cục bộ trên port 27017)
- npm hoặc yarn

### 1. Clone repository
```bash
git clone https://github.com/HienVuu/Data_sharing_web.git
cd data_sharing
```

### 2. Cài đặt dependencies cho từng phần

#### Server
```bash
cd server
npm install
```

#### Client (Web)
```bash
cd ../client
npm install
```

#### Mobile
```bash
cd ../mobile
npm install
```

### 3. Chạy MongoDB
Đảm bảo MongoDB đang chạy trên `mongodb://127.0.0.1:27017/docshare_db`

### 4. Chạy các ứng dụng

#### Server
```bash
cd server
npm run dev  # hoặc npm start
```
Server sẽ chạy trên http://localhost:3000

#### Client (Web)
```bash
cd client
npm run dev
```
Web app sẽ chạy trên http://localhost:5173

#### Mobile
```bash
cd mobile
npm start
```
Sau đó chọn platform (iOS, Android, Web) để chạy.

### 5. Truy cập
- Web: http://localhost:5173
- API: http://localhost:3000
- Mobile: Theo hướng dẫn của Expo

## Cấu trúc dự án

```
data_sharing/
├── client/          # Ứng dụng web React
├── mobile/          # Ứng dụng di động React Native
├── server/          # Máy chủ backend Node.js
├── .gitignore       # File ignore Git
└── README.md        # Tài liệu này
```

## API Endpoints

### Authentication
- `POST /api/login` - Đăng nhập
- `POST /api/register` - Đăng ký

### Documents
- `POST /api/documents` - Upload tài liệu
- `GET /api/documents` - Lấy danh sách
- `GET /api/documents/:id` - Chi tiết tài liệu

### Comments
- `POST /api/comments` - Thêm bình luận
- `GET /api/comments/:documentId` - Lấy bình luận

### Admin
- `GET /api/admin/stats` - Thống kê
- `GET /api/admin/comments` - Tất cả bình luận
- `DELETE /api/admin/comments/:id` - Xóa bình luận
- `DELETE /api/admin/documents/:id` - Xóa tài liệu
- `PUT /api/admin/documents/:id` - Cập nhật tài liệu

## Đóng góp

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Giấy phép

Dự án này sử dụng giấy phép ISC.

## Liên hệ

Nếu có câu hỏi, vui lòng tạo issue trên GitHub hoặc liên hệ qua trang liên hệ trong ứng dụng.
