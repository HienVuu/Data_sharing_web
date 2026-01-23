import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, TextInput, Alert, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

export default function DetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
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
        if (!comment.trim()) return;
        try {
            await api.post('/comments', {
                documentId: id,
                userId: user ? user.id : null, 
                username: user ? user.username : 'Khách Mobile',
                content: comment,
                rating: 5
            });
            setComment('');
            fetchDetail(); // Load lại comment
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể gửi bình luận');
        }
    };

    const handleOpenLink = () => {
        if (document && document.fileUrl) {
            // Mở trình duyệt để xem file
            Linking.openURL(document.fileUrl); 
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563EB" /></View>;
    if (!document) return <View style={styles.center}><Text>Không tìm thấy tài liệu</Text></View>;

    // Lấy đuôi file (PDF, DOC...)
    const fileType = document.fileUrl ? document.fileUrl.split('.').pop().toUpperCase() : 'DOC';

    return (
        <ScrollView style={styles.container}>
            {/* HEADER - ICON TÀI LIỆU */}
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

            {/* NỘI DUNG MÔ TẢ */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mô tả tài liệu</Text>
                <Text style={styles.description}>
                    {document.description || 'Chưa có mô tả cho tài liệu này.'}
                </Text>
                
                {/* NÚT ĐỌC TÀI LIỆU */}
                <TouchableOpacity style={styles.readButton} onPress={handleOpenLink}>
                    <Text style={styles.readButtonText}>📖 ĐỌC TÀI LIỆU NGAY</Text>
                </TouchableOpacity>
            </View>

            {/* BÌNH LUẬN */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bình luận ({commentsList.length})</Text>
                
                {/* Ô nhập bình luận */}
                <View style={styles.inputRow}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Viết bình luận..." 
                        value={comment}
                        onChangeText={setComment}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleComment}>
                        <Text style={styles.sendText}>Gửi</Text>
                    </TouchableOpacity>
                </View>

                {/* Danh sách bình luận */}
                {commentsList.map((c, index) => (
                    <View key={index} style={styles.commentItem}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {(c.username || 'K').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.commentContent}>
                            <Text style={styles.commentUser}>{c.username}</Text>
                            <Text style={styles.commentText}>{c.content}</Text>
                            <Text style={styles.commentDate}>{new Date(c.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>
                ))}
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
    
    readButton: { backgroundColor: '#2563EB', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, elevation: 3 },
    readButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    inputRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    input: { flex: 1, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 15, height: 45 },
    sendBtn: { backgroundColor: '#2563EB', width: 60, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    sendText: { color: 'white', fontWeight: 'bold' },

    commentItem: { flexDirection: 'row', marginBottom: 15 },
    avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    avatarText: { color: '#4F46E5', fontWeight: 'bold' },
    commentContent: { flex: 1, backgroundColor: '#F9FAFB', padding: 10, borderRadius: 10 },
    commentUser: { fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
    commentText: { color: '#374151', fontSize: 14 },
    commentDate: { fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'right' }
});