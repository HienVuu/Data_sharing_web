import React, { useState, useEffect } from 'react';

function AdPopup() {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Kiểm tra trạng thái đóng popup trong localStorage
        const isClosed = localStorage.getItem('docify_popup_closed');

        if (!isClosed) {
            // Yêu cầu: Hiện popup sau 1 phút (60000ms)
            // Lưu ý: Có thể chỉnh xuống 3000ms khi demo
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 60000); 

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        // Lưu trạng thái đã đóng để không hiển thị lại trong phiên sau
        localStorage.setItem('docify_popup_closed', 'true');
        setShowPopup(false);
    };

    if (!showPopup) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <button onClick={handleClose} style={styles.closeBtn}>X</button>
                
                <h3 style={styles.title}>QUẢNG CÁO</h3>
                
                <p style={styles.text}>
                    
                    Vui lòng nạp vip để tải xuống không giới hạn.
                </p>

                <button onClick={handleClose} style={styles.ctaBtn}>
                    Đóng thông báo
                </button>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        zIndex: 9999,
        animation: 'fadeIn 0.3s'
    },
    popup: {
        backgroundColor: 'white', padding: '25px', borderRadius: '8px', // Giảm bo tròn để trông cứng cáp hơn
        width: '400px', maxWidth: '90%', textAlign: 'center', position: 'relative',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #d1d5db'
    },
    closeBtn: {
        position: 'absolute', top: '10px', right: '10px',
        background: '#e5e7eb', border: 'none', width: '30px', height: '30px',
        borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#374151',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    title: { 
        color: '#1f2937', marginTop: 0, fontSize: '18px', 
        fontWeight: '700', textTransform: 'uppercase' 
    },
    image: { 
        width: '100%', borderRadius: '4px', margin: '15px 0', 
        objectFit: 'cover', border: '1px solid #eee' 
    },
    text: { 
        color: '#4b5563', fontSize: '14px', lineHeight: '1.6', 
        marginBottom: '20px' 
    },
    ctaBtn: {
        backgroundColor: '#2563EB', color: 'white', border: 'none',
        padding: '10px 20px', borderRadius: '6px', width: '100%',
        cursor: 'pointer', fontWeight: '600', fontSize: '14px'
    }
};

export default AdPopup;