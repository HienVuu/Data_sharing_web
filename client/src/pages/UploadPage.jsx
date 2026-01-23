import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
    const navigate = useNavigate();
    
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            alert('Bạn cần đăng nhập để thực hiện chức năng Tải tài liệu!');
            navigate('/login');
        }
    }, [navigate]);

    const [formData, setFormData] = useState({ title: '', description: '', category: 'Cong nghe thong tin', file: null });
    const [fileName, setFileName] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [isCustomCat, setIsCustomCat] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            if (value === 'other') {
                setIsCustomCat(true);
                setFormData({ ...formData, category: '' });
            } else {
                setIsCustomCat(false);
                setFormData({ ...formData, category: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCustomCategoryChange = (e) => {
        setCustomCategory(e.target.value);
        setFormData({ ...formData, category: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return alert('File quá lớn! Vui lòng chọn file dưới 5MB');
            setFormData({ ...formData, file: file });
            setFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('file', formData.file);

        try {
            const response = await fetch('http://localhost:3000/api/documents', { method: 'POST', body: data });
            if (response.ok) {
                alert('Tải tài liệu lên thành công!');
                navigate('/');
            } else {
                alert('Có lỗi xảy ra.');
            }
        } catch (error) {
            alert('Lỗi kết nối server.');
        }
    };

    return (
        <div className="page-centered">
            <div className="form-container wide">
                <h2 style={{ textAlign: 'center', color: '#2563EB', marginBottom: '30px' }}>Tải Tài Liệu Mới</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Tiêu đề tài liệu:</label>
                        <input type="text" name="title" className="form-input" value={formData.title} onChange={handleInputChange} required placeholder="Ví dụ: Giáo trình Giải tích 1" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mô tả:</label>
                        <textarea name="description" className="form-textarea" value={formData.description} onChange={handleInputChange} placeholder="Mô tả ngắn gọn..."></textarea>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Danh mục:</label>
                        <select name="category" className="form-select" value={isCustomCat ? 'other' : formData.category} onChange={handleInputChange}>
                            <option value="Cong nghe thong tin">Công nghệ thông tin</option>
                            <option value="Dien tu vien thong">Điện tử viễn thông</option>
                            <option value="Tu dong hoa">Tự động hóa</option>
                            <option value="Kinh te">Kinh tế</option>
                            <option value="Tieng Anh">Tiếng Anh</option>
                            <option value="other">-- Khác (Nhập mới) --</option>
                        </select>

                        {isCustomCat && (
                            <input
                                type="text"
                                className="form-input"
                                style={{ marginTop: '10px', borderColor: '#2563EB' }}
                                placeholder="Nhập tên danh mục mới vào đây..."
                                value={customCategory}
                                onChange={handleCustomCategoryChange}
                                required
                            />
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Chọn file (PDF, Docx... tối đa 5MB):</label>
                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <label style={{cursor: 'pointer', padding: '10px 20px', background: '#E5E7EB', borderRadius: '6px', fontWeight: '500'}}>
                                Chọn tệp
                                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileChange} required style={{display: 'none'}} />
                            </label>
                            <span style={{color: '#666', fontSize: '14px'}}>{fileName || 'Chưa có tệp nào được chọn'}</span>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{marginTop: '20px'}}>Xác nhận tải lên</button>
                </form>
            </div>
        </div>
    );
}

export default UploadPage;