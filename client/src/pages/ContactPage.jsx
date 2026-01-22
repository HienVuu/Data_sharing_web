import React, { useState } from 'react';

function ContactPage() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Cảm ơn bạn! Ý kiến của bạn đã được gửi tới quản trị viên.');
        e.target.reset();
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
                        <input type="text" className="form-input" required placeholder="Nguyễn Văn A" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nội dung góp ý:</label>
                        <textarea className="form-textarea" required placeholder="Nhập nội dung..."></textarea>
                    </div>
                    <button type="submit" className="btn-primary">Gửi liên hệ</button>
                </form>
            </div>
        </div>
    );
}

export default ContactPage;