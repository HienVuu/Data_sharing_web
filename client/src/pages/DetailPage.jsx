import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function DetailPage() {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho form bình luận
    const [commentForm, setCommentForm] = useState({
        authorName: '',
        email: '',
        content: '',
        rating: 5
    });

    // Hàm lấy chi tiết tài liệu và danh sách bình luận
    const fetchData = async () => {
        try {
            // Gọi song song 2 API để tối ưu tốc độ
            const [docRes, commentRes] = await Promise.all([
                fetch(`http://localhost:3000/api/documents/${id}`),
                fetch(`http://localhost:3000/api/comments/${id}`)
            ]);

            if (!docRes.ok) throw new Error('Không thể tải thông tin tài liệu');
            
            const docData = await docRes.json();
            const commentData = await commentRes.json();

            setDocument(docData);
            setComments(commentData);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // Xử lý thay đổi input form bình luận
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCommentForm({ ...commentForm, [name]: value });
    };

    // Xử lý gửi bình luận
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documentId: id,
                    ...commentForm
                })
            });

            if (response.ok) {
                alert('Gửi bình luận thành công!');
                // Reset form
                setCommentForm({ authorName: '', email: '', content: '', rating: 5 });
                // Tải lại dữ liệu để thấy bình luận mới
                fetchData();
            } else {
                alert('Lỗi khi gửi bình luận');
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi kết nối server');
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Đang tải dữ liệu...</div>;
    if (error) return <div style={{textAlign: 'center', color: 'red', marginTop: '50px'}}>{error}</div>;
    if (!document) return <div style={{textAlign: 'center', marginTop: '50px'}}>Tài liệu không tồn tại</div>;

    return (
        <div className="detail-container">
            {/* Phần thông tin tài liệu */}
            <div className="doc-detail-card">
                <h1 className="detail-title">{document.title}</h1>
                <div className="detail-meta">
                    <span>Danh mục: <strong>{document.category}</strong></span>
                    <span> • </span>
                    <span>Lượt xem: <strong>{document.views}</strong></span>
                    <span> • </span>
                    <span>Ngày đăng: {new Date(document.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                
                <div className="detail-desc">
                    <h3>Mô tả tài liệu:</h3>
                    <p>{document.description}</p>
                </div>

                <div className="detail-actions">
                    <a href={document.fileUrl} target="_blank" rel="noreferrer" className="btn-download">
                        Tải xuống / Xem tài liệu
                    </a>
                </div>
            </div>

            <hr className="divider" />

            {/* Phần Bình luận & Đánh giá */}
            <div className="comments-section">
                <h3>Bình luận & Đánh giá ({comments.length})</h3>

                {/* Form gửi bình luận */}
                <div className="comment-form-box">
                    <h4>Gửi đánh giá của bạn</h4>
                    <form onSubmit={handleCommentSubmit}>
                        <div className="form-row">
                            <input 
                                type="text" 
                                name="authorName" 
                                placeholder="Họ tên của bạn" 
                                value={commentForm.authorName} 
                                onChange={handleInputChange} 
                                required 
                                className="form-input"
                            />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email" 
                                value={commentForm.email} 
                                onChange={handleInputChange} 
                                required 
                                className="form-input"
                            />
                        </div>
                        <div className="form-row">
                            <label>Đánh giá: </label>
                            <select 
                                name="rating" 
                                value={commentForm.rating} 
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="5">5 Sao (Tuyệt vời)</option>
                                <option value="4">4 Sao (Tốt)</option>
                                <option value="3">3 Sao (Bình thường)</option>
                                <option value="2">2 Sao (Tệ)</option>
                                <option value="1">1 Sao (Rất tệ)</option>
                            </select>
                        </div>
                        <textarea 
                            name="content" 
                            placeholder="Nội dung bình luận..." 
                            value={commentForm.content} 
                            onChange={handleInputChange} 
                            required 
                            className="form-textarea"
                        ></textarea>
                        <button type="submit" className="btn-submit">Gửi bình luận</button>
                    </form>
                </div>

                {/* Danh sách bình luận */}
                <div className="comments-list">
                    {comments.map((cmt) => (
                        <div key={cmt._id} className="comment-item">
                            <div className="comment-header">
                                <strong>{cmt.authorName}</strong>
                                <span className="comment-rating"> - {cmt.rating} ⭐</span>
                                <span className="comment-date">
                                    {new Date(cmt.createdAt).toLocaleString('vi-VN')}
                                </span>
                            </div>
                            <div className="comment-content">
                                {cmt.content}
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>}
                </div>
            </div>
        </div>
    );
}

export default DetailPage;