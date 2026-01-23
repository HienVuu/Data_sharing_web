import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- STATE BỘ LỌC ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All'); 

    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/documents');
                const data = await res.json();

                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setDocuments(sortedData);

                const allCats = sortedData.map(doc => doc.category);
                const uniqueCats = [...new Set(allCats)];
                const finalCats = ['All', ...uniqueCats.filter(c => c)];
                setCategories(finalCats);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const handleDocClick = (docId) => {
        const user = localStorage.getItem('user');
        if (!user) {
            alert("Vui lòng đăng nhập để xem chi tiết và tải tài liệu!");
            navigate('/login');
        } else {
            navigate(`/document/${docId}`);
        }
    };

    // --- LOGIC LỌC DỮ LIỆU  ---
    const filteredDocs = documents.filter(doc => {
        // 1. Lọc theo từ khóa tìm kiếm (theo tiêu đề hoặc danh mục)
        const term = searchTerm.toLowerCase();
        const matchesSearch = doc.title.toLowerCase().includes(term) || (doc.category && doc.category.toLowerCase().includes(term));
        
        // 2. Lọc theo môn học
        const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;

        // 3. Lọc theo loại file 
        let matchesType = true;
        if (selectedType !== 'All') {
           
            const extension = doc.fileUrl ? doc.fileUrl.split('.').pop().toLowerCase() : '';
            
            if (selectedType === 'PDF') {
                matchesType = extension === 'pdf';
            } else if (selectedType === 'DOC') {
                matchesType = ['doc', 'docx'].includes(extension);
            } else if (selectedType === 'SLIDE') {
                matchesType = ['ppt', 'pptx'].includes(extension);
            }
        }

        return matchesSearch && matchesCategory && matchesType;
    });

    // Danh sách loại file
    const fileTypes = [
        { id: 'All', name: 'Tất cả loại file' },
        { id: 'PDF', name: 'Sách / PDF' },
        { id: 'DOC', name: 'Tài liệu Word' },
        { id: 'SLIDE', name: 'Slide bài giảng' },
    ];

    const getFileIcon = (fileUrl) => {
        if (!fileUrl) return 'DOC';
        const ext = fileUrl.split('.').pop().toLowerCase();
        if (ext === 'pdf') return 'PDF';
        if (['ppt', 'pptx'].includes(ext)) return 'PPT';
        if (['doc', 'docx'].includes(ext)) return 'WORD';
        return 'FILE';
    };

    if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Đang tải dữ liệu...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', padding: '12px 24px' }}>
                <div 
                    onClick={() => navigate('/profile')} 
                    style={{
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: 'white', padding: '5px 10px', borderRadius: '20px'
                    }}
                >
                    <div style={{
                        width: '32px', height: '32px', backgroundColor: '#2563EB', color: 'white',
                        borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                        fontWeight: 'bold'
                    }}>
                        {user && user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span style={{ fontWeight: '500', color: '#374151' }}>
                        {user ? user.username : 'Tài khoản'}
                    </span>
                </div>
            </div>
            {/* SEARCH BAR */}
            <div className="search-section">
                <div className="search-container">
                    <input 
                        type="text" className="search-input" 
                        placeholder="🔍 Tìm kiếm tài liệu, môn học, đề thi..." 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-primary" style={{width: 'auto'}}>Tìm kiếm</button>
                </div>
            </div>

            <div className="main-layout">
                {/* SIDEBAR BỘ LỌC */}
                <aside className="sidebar">
                    {/* Lọc theo Môn học */}
                    <div className="sidebar-title">Danh mục môn học</div>
                    <ul className="category-list">
                        {categories.map((cat, index) => (
                            <li 
                                key={index} 
                                className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat === 'All' ? 'Tất cả tài liệu' : cat}
                            </li>
                        ))}
                    </ul>

                    {/* Lọc theo Loại file */}
                    <div className="sidebar-title">Loại tài liệu</div>
                    <ul className="category-list">
                        {fileTypes.map(type => (
                            <li 
                                key={type.id} 
                                className={`category-item ${selectedType === type.id ? 'active' : ''}`}
                                onClick={() => setSelectedType(type.id)}
                            >
                                {type.name}
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* CONTENT GRID */}
                <main className="content-area">
                    <div className="section-header">
                        <h2 style={{margin: 0, fontSize: '20px'}}>
                            {selectedCategory === 'All' ? 'Tài liệu' : selectedCategory}
                            {selectedType !== 'All' && ` (${fileTypes.find(t=>t.id===selectedType)?.name})`}
                        </h2>
                        <span className="result-count">Tìm thấy {filteredDocs.length} tài liệu</span>
                    </div>

                    {filteredDocs.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                            Không tìm thấy tài liệu nào phù hợp.
                        </div>
                    ) : (
                        <div className="document-grid">
                            {filteredDocs.map((doc) => (
                                <div key={doc._id} className="doc-card" onClick={() => handleDocClick(doc._id)}>
                                    <div className="card-thumb">
                                        
                                        <div className="file-type-icon">{getFileIcon(doc.fileUrl)}</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="card-category">{doc.category}</div>
                                        <h3 className="card-title">{doc.title}</h3>
                                        <div className="card-meta">
                                            <span>{doc.views} lượt xem</span>
                                            <span>{new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default HomePage;