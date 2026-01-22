const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // Thư viện xử lý upload
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Cấu hình Middleware
app.use(express.json());
app.use(cors());

// Public thư mục uploads để trình duyệt truy cập được file
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- CẤU HÌNH MULTER (UPLOAD FILE) ---
// 1. Nơi lưu trữ và tên file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Tạo tên file duy nhất để tránh trùng lặp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Chuyển tên file gốc sang không dấu hoặc giữ nguyên tùy ý (ở đây giữ nguyên nhưng thêm suffix)
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// 2. Bộ lọc và giới hạn
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB 
    fileFilter: function (req, file, cb) {
        // Có thể thêm check đuôi file .pdf, .doc tại đây nếu muốn
        cb(null, true);
    }
});

// --- KẾT NỐI DATABASE ---
const MONGO_URI = 'mongodb://127.0.0.1:27017/docshare_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Ket noi MongoDB thanh cong.'))
  .catch((err) => console.error('Loi ket noi MongoDB:', err));

// --- ĐỊNH NGHĨA MODEL ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});
const User = mongoose.model('User', UserSchema);

const DocSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    fileUrl: { type: String, required: true }, 
    originalName: String, 
    mimeType: String,     
    size: Number,         
    category: String,
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const Document = mongoose.model('Document', DocSchema);

const CommentSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    authorName: String,
    email: String,
    content: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', CommentSchema);

// --- CÁC API CHỨC NĂNG ---

// 1. API Đăng nhập
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({
                success: true,
                message: 'Dang nhap thanh cong',
                user: { id: user._id, username: user.username, role: user.role }
            });
        } else {
            res.status(401).json({ success: false, message: 'Sai thong tin dang nhap' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. API Đăng ký
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
        }

        // Mặc định role là 'user'
        const newUser = await User.create({ 
            username, 
            password, 
            role: 'user' 
        });

        res.json({ success: true, message: 'Đăng ký thành công', data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. API Upload Tài liệu mới 
// QUAN TRỌNG: field name phải là 'file' để khớp với Frontend
app.post('/api/documents', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Vui long chon file (toi da 5MB)' });
        }

        const { title, description, category } = req.body;
        
        // Tạo đường dẫn file
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const newDoc = await Document.create({
            title,
            description,
            category,
            fileUrl: fileUrl,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size
        });

        res.json({ success: true, message: 'Upload tai lieu thanh cong', data: newDoc });

    } catch (error) {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. API Lấy danh sách tài liệu
app.get('/api/documents', async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. API Chi tiết tài liệu
app.get('/api/documents/:id', async (req, res) => {
    try {
        const document = await Document.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!document) return res.status(404).json({ message: 'Khong tim thay' });
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. API Bình luận
app.post('/api/comments', async (req, res) => {
    try {
        const { documentId, authorName, email, content, rating } = req.body;
        const newComment = await Comment.create({ documentId, authorName, email, content, rating });
        res.json({ success: true, data: newComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/comments/:documentId', async (req, res) => {
    try {
        const comments = await Comment.find({ documentId: req.params.documentId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- KHU VỰC API ADMIN (MỚI BỔ SUNG) ---

// 7. Thống kê Dashboard
app.get('/api/admin/stats', async (req, res) => {
    try {
        const documents = await Document.find();
        const totalViews = documents.reduce((sum, doc) => sum + (doc.views || 0), 0);
        const totalDocs = documents.length;
        const totalComments = await Comment.countDocuments();
        
        res.json({ totalViews, totalDocs, totalComments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 8. Lấy toàn bộ bình luận (cho Admin quản lý)
app.get('/api/admin/comments', async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 9. Xóa bình luận
app.delete('/api/admin/comments/:id', async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Đã xóa bình luận' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 10. Xóa tài liệu (Xóa cả bình luận liên quan)
app.delete('/api/admin/documents/:id', async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        // Xóa luôn các bình luận của tài liệu này để sạch data
        await Comment.deleteMany({ documentId: req.params.id });
        res.json({ success: true, message: 'Đã xóa tài liệu' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 11. Cập nhật tài liệu
app.put('/api/admin/documents/:id', async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const updatedDoc = await Document.findByIdAndUpdate(
            req.params.id,
            { title, description, category },
            { new: true } // Trả về dữ liệu mới sau khi update
        );
        res.json({ success: true, data: updatedDoc });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- KHỞI ĐỘNG SERVER ---
app.get('/', (req, res) => {
    res.send('Backend chia sẻ tài liệu đang hoạt động.');
});

app.listen(PORT, () => {
    console.log(`Server dang hoat dong tai: http://localhost:${PORT}`);
});