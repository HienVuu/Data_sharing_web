import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const navigate = useNavigate();
    // Stats & Data
    const [stats, setStats] = useState({ totalViews: 0, totalDocs: 0, totalComments: 0 });
    const [comments, setComments] = useState([]);
    const [documents, setDocuments] = useState([]);
    
    // UI State
    const [activeTab, setActiveTab] = useState('docs'); // 'docs' hoặc 'comments'
    const [editingDoc, setEditingDoc] = useState(null); // Tài liệu đang được sửa

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user || JSON.parse(user).role !== 'admin') {
            alert('Quyền truy cập bị từ chối!');
            navigate('/');
        } else {
            fetchData();
        }
    }, [navigate]);

    const fetchData = async () => {
        try {
            const [statsRes, cmtRes, docRes] = await Promise.all([
                fetch('http://localhost:3000/api/admin/stats'),
                fetch('http://localhost:3000/api/admin/comments'),
                fetch('http://localhost:3000/api/documents') // Tận dụng API lấy list docs có sẵn
            ]);
            
            setStats(await statsRes.json());
            setComments(await cmtRes.json());
            setDocuments(await docRes.json());
        } catch (error) {
            console.error(error);
        }
    };

    // --- XỬ LÝ BÌNH LUẬN ---
    const handleDeleteComment = async (id) => {
        if (!window.confirm('Xóa bình luận này?')) return;
        await fetch(`http://localhost:3000/api/admin/comments/${id}`, { method: 'DELETE' });
        fetchData();
    };

    // --- XỬ LÝ TÀI LIỆU ---
    const handleDeleteDoc = async (id) => {
        if (!window.confirm('CẢNH BÁO: Xóa tài liệu sẽ xóa cả bình luận bên trong.\nBạn chắc chắn chứ?')) return;
        await fetch(`http://localhost:3000/api/admin/documents/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleUpdateDoc = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3000/api/admin/documents/${editingDoc._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editingDoc.title,
                    description: editingDoc.description,
                    category: editingDoc.category
                })
            });
            if (res.ok) {
                alert('Cập nhật thành công!');
                setEditingDoc(null); // Đóng form sửa
                fetchData();
            } else {
                alert('Lỗi cập nhật');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '20px' }}>
            <h1 style={{color: '#2563EB', borderBottom: '2px solid #ddd', paddingBottom: '15px'}}>
                Dashboard Quản Trị
            </h1>

            {/* 1. THỐNG KÊ */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', marginTop: '20px' }}>
                <div style={statCard}><h3 style={{margin:0}}>Tổng View</h3><p style={statNum}>{stats.totalViews}</p></div>
                <div style={statCard}><h3 style={{margin:0}}>Tổng Tài liệu</h3><p style={statNum}>{stats.totalDocs}</p></div>
                <div style={statCard}><h3 style={{margin:0}}>Tổng Bình luận</h3><p style={statNum}>{stats.totalComments}</p></div>
            </div>

            {/* 2. TAB SWITCHER */}
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <button 
                    style={activeTab === 'docs' ? activeTabStyle : tabStyle} 
                    onClick={() => setActiveTab('docs')}
                >
                    Quản lý Tài liệu
                </button>
                <button 
                    style={activeTab === 'comments' ? activeTabStyle : tabStyle} 
                    onClick={() => setActiveTab('comments')}
                >
                    Quản lý Bình luận
                </button>
            </div>

            {/* 3. NỘI DUNG TAB */}
            {activeTab === 'docs' ? (
                <div>
                    {/* FORM SỬA (Chỉ hiện khi đang bấm nút Sửa) */}
                    {editingDoc && (
                        <div style={{background: '#EFF6FF', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #2563EB'}}>
                            <h3 style={{marginTop: 0}}>Đang sửa: {editingDoc.title}</h3>
                            <form onSubmit={handleUpdateDoc}>
                                <div style={{marginBottom: '10px'}}>
                                    <label style={{display:'block', fontWeight:'bold'}}>Tiêu đề:</label>
                                    <input type="text" style={inputStyle} value={editingDoc.title} onChange={e => setEditingDoc({...editingDoc, title: e.target.value})} />
                                </div>
                                <div style={{marginBottom: '10px'}}>
                                    <label style={{display:'block', fontWeight:'bold'}}>Danh mục:</label>
                                    <select style={inputStyle} value={editingDoc.category} onChange={e => setEditingDoc({...editingDoc, category: e.target.value})}>
                                        <option value="Cong nghe thong tin">Công nghệ thông tin</option>
                                        <option value="Dien tu vien thong">Điện tử viễn thông</option>
                                        <option value="Tu dong hoa">Tự động hóa</option>
                                        <option value="Kinh te">Kinh tế</option>
                                        <option value="Tieng Anh">Tiếng Anh</option>
                                    </select>
                                </div>
                                <div style={{marginBottom: '10px'}}>
                                    <label style={{display:'block', fontWeight:'bold'}}>Mô tả:</label>
                                    <textarea style={{...inputStyle, height: '80px'}} value={editingDoc.description} onChange={e => setEditingDoc({...editingDoc, description: e.target.value})} />
                                </div>
                                <button type="submit" style={btnPrimary}>Lưu thay đổi</button>
                                <button type="button" onClick={() => setEditingDoc(null)} style={{...btnSecondary, marginLeft: '10px'}}>Hủy</button>
                            </form>
                        </div>
                    )}

                    {/* DANH SÁCH TÀI LIỆU */}
                    <table style={tableStyle}>
                        <thead>
                            <tr style={{background: '#f8f9fa'}}>
                                <th style={thStyle}>Tiêu đề</th>
                                <th style={thStyle}>Danh mục</th>
                                <th style={thStyle}>Views</th>
                                <th style={thStyle}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map(doc => (
                                <tr key={doc._id} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={tdStyle}><strong>{doc.title}</strong></td>
                                    <td style={tdStyle}>{doc.category}</td>
                                    <td style={tdStyle}>{doc.views}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => setEditingDoc(doc)} style={{...btnSmall, background: '#F59E0B', marginRight: '5px'}}>Sửa</button>
                                        <button onClick={() => handleDeleteDoc(doc._id)} style={{...btnSmall, background: '#EF4444'}}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* DANH SÁCH BÌNH LUẬN */
                <table style={tableStyle}>
                    <thead>
                        <tr style={{background: '#f8f9fa'}}>
                            <th style={thStyle}>Người gửi</th>
                            <th style={thStyle}>Nội dung</th>
                            <th style={thStyle}>Ngày gửi</th>
                            <th style={thStyle}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map(cmt => (
                            <tr key={cmt._id} style={{borderBottom: '1px solid #eee'}}>
                                <td style={tdStyle}>
                                    <strong>{cmt.authorName}</strong><br/>
                                    <span style={{fontSize:'12px', color:'#666'}}>{cmt.email}</span>
                                </td>
                                <td style={tdStyle}>{cmt.content}</td>
                                <td style={tdStyle}>{new Date(cmt.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td style={tdStyle}>
                                    <button onClick={() => handleDeleteComment(cmt._id)} style={{...btnSmall, background: '#EF4444'}}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// CSS Inline Styles
const statCard = { flex: 1, padding: '20px', background: '#2563EB', color: 'white', borderRadius: '8px', textAlign: 'center' };
const statNum = { fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' };
const tabStyle = { padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#666' };
const activeTabStyle = { ...tabStyle, borderBottom: '3px solid #2563EB', color: '#2563EB', fontWeight: 'bold' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px' };
const btnSmall = { color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const btnPrimary = { background: '#2563EB', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' };
const btnSecondary = { background: '#9CA3AF', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' };

export default AdminPage;