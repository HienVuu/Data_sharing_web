import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

export default function DetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State cho bình luận & đánh giá
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5); // Mặc định 5 sao
    const [commentsList, setCommentsList] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchDetail();
        getUser();
    }, []);

    const getUser = async () => {
        const u = await AsyncStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
    };

    const fetchDetail = async () => {
        try {
            const res = await api.get(`/documents/${id}`);
            setDocument(res.data);
            
            const resComments = await api.get(`/comments/${id}`);
            setCommentsList(resComments.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleComment = async () => {
        if (!comment.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập nội dung bình luận');
            return;
        }
        
        try {
            await api.post('/comments', {
                documentId: id,
                userId: user ? user.id : null, 
                username: user ? user.username : 'Khách Mobile',
                content: comment,
                rating: rating // <-- Gửi số sao người dùng chọn
            });
            
            Alert.alert('Thành công', 'Đã gửi đánh giá của bạn!');
            setComment('');
            setRating(5); // Reset về 5 sao
            fetchDetail(); // Load lại danh sách comment
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể gửi bình luận');
        }
    };

    const handleOpenLink = () => {
        if (document && document.fileUrl) {
            Linking.openURL(document.fileUrl); 
        }
    };

    // Hàm vẽ ngôi sao (Chọn sao)
    const renderStarsInput = () => {
        return (
            <View style={{flexDirection: 'row', marginBottom: 10}}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Text style={{fontSize: 30, color: star <= rating ? '#F59E0B' : '#D1D5DB', marginRight: 5}}>
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    // Hàm hiển thị sao (Trong list comment)
    const renderStarsDisplay = (count) => {
        // Tạo chuỗi sao, ví dụ 3 sao -> "★★★"
        return '★'.repeat(count || 5); 
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563EB" /></View>;
    if (!document) return <View style={styles.center}><Text>Không tìm thấy tài liệu</Text></View>;

    const fileType = document.fileUrl ? document.fileUrl.split('.').pop().toUpperCase() : 'DOC';

    return (
        <ScrollView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.iconBox}>
                    <Text style={styles.iconText}>{fileType}</Text>
                </View>
                <Text style={styles.title}>{document.title}</Text>
                <View style={styles.metaRow}>
                    <Text style={styles.metaBadge}>{document.category || 'Tài liệu'}</Text>
                    <Text style={styles.metaText}>👁 {document.views} lượt xem</Text>
                </View>
            </View>

            {/* MÔ TẢ */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mô tả tài liệu</Text>
                <Text style={styles.description}>
                    {document.description || 'Chưa có mô tả cho tài liệu này.'}
                </Text>
                <TouchableOpacity style={styles.readButton} onPress={handleOpenLink}>
                    <Text style={styles.readButtonText}>📖 ĐỌC TÀI LIỆU NGAY</Text>
                </TouchableOpacity>
            </View>

            {/* BÌNH LUẬN & ĐÁNH GIÁ */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đánh giá & Bình luận</Text>
                
                {/* Khu vực nhập liệu */}
                <View style={styles.inputContainer}>
                    <Text style={{marginBottom: 5, fontWeight: 'bold', color: '#374151'}}>Chọn đánh giá của bạn:</Text>
                    {renderStarsInput()} 

                    <TextInput 
                        style={styles.input} 
                        placeholder="Viết cảm nghĩ của bạn..." 
                        value={comment}
                        onChangeText={setComment}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleComment}>
                        <Text style={styles.sendText}>Gửi đánh giá</Text>
                    </TouchableOpacity>
                </View>

                {/* Danh sách bình luận cũ */}
                <View style={{marginTop: 20}}>
                    {commentsList.map((c, index) => (
                        <View key={index} style={styles.commentItem}>
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{(c.username || 'K').charAt(0).toUpperCase()}</Text>
                            </View>
                            <View style={styles.commentContent}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={styles.commentUser}>{c.username}</Text>
                                    <Text style={{color: '#F59E0B', fontSize: 12}}>
                                        {renderStarsDisplay(c.rating)}
                                    </Text>
                                </View>
                                <Text style={styles.commentText}>{c.content}</Text>
                                <Text style={styles.commentDate}>{new Date(c.createdAt).toLocaleDateString()}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { backgroundColor: 'white', padding: 20, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 4, marginBottom: 15 },
    iconBox: { width: 80, height: 80, backgroundColor: '#EFF6FF', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#BFDBFE' },
    iconText: { color: '#2563EB', fontWeight: '900', fontSize: 24 },
    title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#111827', marginBottom: 10 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    metaBadge: { backgroundColor: '#DBEAFE', color: '#2563EB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, fontSize: 12, fontWeight: 'bold' },
    metaText: { color: '#6B7280', fontSize: 13 },
    section: { backgroundColor: 'white', padding: 20, marginBottom: 15, borderRadius: 12, marginHorizontal: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 10, borderBottomWidth: 2, borderBottomColor: '#F3F4F6', paddingBottom: 5 },
    description: { color: '#4B5563', lineHeight: 22, fontSize: 15 },
    readButton: { backgroundColor: '#2563EB', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    readButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    
    // Style mới cho phần đánh giá
    inputContainer: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 10 },
    input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, height: 80, textAlignVertical: 'top', marginBottom: 10 },
    sendBtn: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center' },
    sendText: { color: 'white', fontWeight: 'bold' },

    commentItem: { flexDirection: 'row', marginBottom: 15 },
    avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    avatarText: { color: '#4F46E5', fontWeight: 'bold' },
    commentContent: { flex: 1, backgroundColor: '#F9FAFB', padding: 10, borderRadius: 10 },
    commentUser: { fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
    commentText: { color: '#374151', fontSize: 14 },
    commentDate: { fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'right' }
});