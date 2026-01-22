import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- STATE BỘ LỌC ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All'); 

    useEffect(() => {
        fetch('http://localhost:3000/api/documents')
            .then(res => res.json())
            .then(data => {
                setDocuments(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
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
        // 1. Lọc theo từ khóa tìm kiếm
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
        
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

    // Danh sách môn học
    const categories = [
        { id: 'All', name: 'Tất cả môn học' },
        { id: 'Cong nghe thong tin', name: 'Công nghệ thông tin' },
        { id: 'Dien tu vien thong', name: 'Điện tử viễn thông' },
        { id: 'Tu dong hoa', name: 'Tự động hóa' },
        { id: 'Kinh te', name: 'Kinh tế' },
    ];

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
                        {categories.map(cat => (
                            <li 
                                key={cat.id} 
                                className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.name}
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
                            {selectedCategory === 'All' ? 'Tài liệu' : categories.find(c=>c.id===selectedCategory)?.name}
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