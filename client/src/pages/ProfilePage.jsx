import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Lấy thông tin user từ LocalStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            // Nếu chưa đăng nhập thì đá về trang Login
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Xóa thông tin đăng nhập
        localStorage.removeItem('user');
        // Chuyển về trang đăng nhập
        navigate('/');
    };

    if (!user) return null;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Avatar giả lập bằng chữ cái đầu */}
                <div style={styles.avatar}>
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                
                <h2 style={styles.username}>{user.username}</h2>
                <p style={styles.role}>
                    {user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Thành viên chính thức'}
                </p>

                <div style={styles.infoSection}>
                    <p><strong>Email:</strong> {user.email || 'Chưa cập nhật'}</p>
                    <p><strong>Ngày tham gia:</strong> {new Date().toLocaleDateString('vi-VN')}</p>
                </div>

                <div style={styles.buttonGroup}>
                    <button style={styles.backBtn} onClick={() => navigate('/home')}>
                        ⬅ Quay lại Trang chủ
                    </button>
                    
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
};

// CSS viết trực tiếp trong file JS cho gọn
const styles = {
    container: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', backgroundColor: '#F3F4F6', fontFamily: 'Arial, sans-serif'
    },
    card: {
        backgroundColor: 'white', padding: '40px', borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px',
        textAlign: 'center'
    },
    avatar: {
        width: '100px', height: '100px', backgroundColor: '#2563EB',
        borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center',
        margin: '0 auto 20px', color: 'white', fontSize: '40px', fontWeight: 'bold'
    },
    username: { margin: '0 0 5px', color: '#1F2937' },
    role: { margin: '0 0 20px', color: '#6B7280', fontSize: '14px' },
    infoSection: {
        textAlign: 'left', backgroundColor: '#F9FAFB', padding: '15px',
        borderRadius: '10px', marginBottom: '30px'
    },
    buttonGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    backBtn: {
        padding: '12px', border: '1px solid #D1D5DB', backgroundColor: 'white',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '500'
    },
    logoutBtn: {
        padding: '12px', border: 'none', backgroundColor: '#DC2626', color: 'white',
        borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
    }
};

export default ProfilePage;