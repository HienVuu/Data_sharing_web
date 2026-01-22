import React, { useState, useEffect } from 'react';

function AdPopup() {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 3000); 
        return () => clearTimeout(timer);
    }, []);

    if (!showPopup) return null;

    return (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
            <div style={{backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '350px', textAlign: 'center', position: 'relative', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'}}>
                <button onClick={() => setShowPopup(false)} style={{position: 'absolute', top: '10px', right: '10px', background: '#ccc', border: 'none', width: '25px', height: '25px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold'}}>X</button>
                <h3 style={{color: '#d63031', marginTop: 0}}>Sản phẩm nổi bật!</h3>
                <img src="https://via.placeholder.com/300x200?text=Quang+Cao" alt="Quảng cáo" style={{width: '100%', borderRadius: '4px', marginBottom: '10px'}} />
                <p>Giảm giá 50% tài liệu ôn thi cuối kỳ ngay hôm nay!</p>
                <button style={{backgroundColor: '#0984e3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', marginTop: '10px', cursor: 'pointer', width: '100%'}} onClick={() => setShowPopup(false)}>Xem ngay</button>
            </div>
        </div>
    );
}

export default AdPopup;