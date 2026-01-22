import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(5); // Mặc định 5 sao

    useEffect(() => {
        fetch(`http://localhost:3000/api/documents/${id}`)
            .then(res => res.json())
            .then(data => setDocument(data))
            .catch(err => console.error(err));

        fetchComments();
    }, [id]);

    const fetchComments = () => {
        fetch(`http://localhost:3000/api/comments/${id}`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(err => console.error(err));
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Vui lòng đăng nhập để bình luận!');
            navigate('/login');
            return;
        }
        const user = JSON.parse(userStr);

        const response = await fetch('http://localhost:3000/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                documentId: id,
                authorName: user.username,
                email: user.email || 'user@example.com',
                content: newComment,
                rating: rating 
            })
        });

        if (response.ok) {
            setNewComment('');
            setRating(5);
            fetchComments();
        } else {
            alert('Gửi bình luận thất bại');
        }
    };

    // Hàm hiển thị sao (dùng cho danh sách bình luận)
    const renderStars = (score) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < score ? '#F59E0B' : '#D1D5DB', fontSize: '18px' }}>★</span>
        ));
    };

    if (!document) return <div className="page-centered">Đang tải...</div>;

    return (
        <div className="main-layout" style={{ display: 'block', paddingTop: '30px' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                <h1 style={{ color: '#2563EB', marginTop: 0 }}>{document.title}</h1>
                <div style={{ color: '#6B7280', marginBottom: '20px', fontSize: '14px' }}>
                    Danh mục: <strong>{document.category}</strong> • 
                    Lượt xem: <strong>{document.views}</strong> • 
                    Ngày đăng: {new Date(document.createdAt).toLocaleDateString('vi-VN')}
                </div>
                
                <div style={{ padding: '20px', background: '#F9FAFB', borderRadius: '8px', marginBottom: '30px', lineHeight: '1.6' }}>
                    <strong>Mô tả tài liệu:</strong> <br/>
                    {document.description || 'Chưa có mô tả chi tiết cho tài liệu này.'}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <a href={document.fileUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '12px 30px', fontSize: '16px' }}>
                        ĐỌC & TẢI XUỐNG TÀI LIỆU
                    </a>
                </div>

                <h3 style={{ borderBottom: '2px solid #E5E7EB', paddingBottom: '10px' }}>Bình luận & Đánh giá</h3>

                {/* Form nhập bình luận */}
                <form onSubmit={handleCommentSubmit} style={{ marginBottom: '40px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Đánh giá của bạn:</label>
                        <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                    key={star} 
                                    onClick={() => setRating(star)}
                                    style={{ 
                                        color: star <= rating ? '#F59E0B' : '#D1D5DB', 
                                        fontSize: '30px', 
                                        transition: 'color 0.2s' 
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <textarea 
                            className="form-textarea" 
                            placeholder="Chia sẻ cảm nghĩ về tài liệu này..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Gửi đánh giá</button>
                </form>

                {/* Danh sách bình luận */}
                <div className="comment-list">
                    {comments.map((cmt, index) => (
                        <div key={index} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <strong style={{ color: '#2563EB' }}>{cmt.authorName}</strong>
                                <span>{renderStars(cmt.rating || 5)}</span>
                            </div>
                            <p style={{ margin: '5px 0', color: '#374151' }}>{cmt.content}</p>
                            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                {new Date(cmt.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    ))}
                    {comments.length === 0 && <p style={{ color: '#666', fontStyle: 'italic' }}>Chưa có đánh giá nào.</p>}
                </div>
            </div>
        </div>
    );
}

export default DetailPage;