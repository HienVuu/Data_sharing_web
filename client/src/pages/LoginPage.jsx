import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const endpoint = isLogin ? 'http://localhost:3000/api/login' : 'http://localhost:3000/api/register';
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    alert('Đăng nhập thành công!');
                    if (data.user.role === 'admin') navigate('/admin');
                    else navigate('/');
                    window.location.reload(); 
                } else {
                    alert('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
                    setIsLogin(true);
                    setFormData({ username: '', password: '' });
                }
            } else {
                setMessage(data.message || 'Có lỗi xảy ra.');
            }
        } catch (error) {
            setMessage('Lỗi kết nối Server.');
        }
    };

    return (
        <div className="page-centered">
            <div className="form-container">
                <h2 style={{ textAlign: 'center', color: '#2563EB', marginBottom: '25px' }}>
                    {isLogin ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản'}
                </h2>
                {message && <div style={{ color: '#dc3545', background: '#ffe6e6', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Tên đăng nhập:</label>
                        <input type="text" name="username" className="form-input" value={formData.username} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mật khẩu:</label>
                        <input type="password" name="password" className="form-input" value={formData.password} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn-primary">{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</button>
                </form>
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                    <span style={{ color: '#666' }}>{isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}</span>
                    <button onClick={() => { setIsLogin(!isLogin); setMessage(''); }} style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 'bold' }}>
                        {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;