import React, { useState } from 'react';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', content: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        try {
            const res = await fetch('http://localhost:3000/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert(`Cảm ơn ${formData.name}! Chúng tôi đã nhận được ý kiến.`);
                setFormData({ name: '', email: '', content: '' });
                setStatus('Ý kiến của bạn đã được gửi tới quản trị viên.');
            } else {
                alert('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (error) {
            alert('Lỗi kết nối Server!');
        }
    };

    return (
        <div className="page-centered">
            <div className="form-container">
                <h1 style={{color: '#111827', textAlign: 'center', marginBottom: '10px'}}>Liên hệ & Góp ý</h1>
                <p style={{textAlign: 'center', color: '#6B7280', marginBottom: '30px'}}>Chúng tôi luôn lắng nghe ý kiến của bạn.</p>
                {status && <div style={{ color: 'green', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>{status}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Họ tên của bạn:</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            required
                            placeholder="Nguyễn Văn A"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            required
                            placeholder="email@domain.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nội dung góp ý:</label>
                        <textarea
                            name="content"
                            className="form-textarea"
                            required
                            placeholder="Nhập nội dung..."
                            value={formData.content}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Gửi liên hệ</button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;