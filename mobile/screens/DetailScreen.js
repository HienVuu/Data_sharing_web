import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

export default function DetailScreen({ route }) {
    const { id } = route.params;
    const [doc, setDoc] = useState(null);
    const [comments, setComments] = useState([]);
    const [myComment, setMyComment] = useState('');
    const [rating, setRating] = useState(5); // Mặc định 5 sao

    useEffect(() => {
        fetchDetail();
    }, []);

    const fetchDetail = async () => {
        try {
            const [docRes, cmtRes] = await Promise.all([
                api.get(`/documents/${id}`),
                api.get(`/comments/${id}`)
            ]);
            setDoc(docRes.data);
            setComments(cmtRes.data);
        } catch (error) { console.error(error); }
    };

    const postComment = async () => {
        if (!myComment) {
            Alert.alert("Thông báo", "Vui lòng nhập nội dung bình luận");
            return;
        }

        try {
            // Lấy thông tin user đang đăng nhập
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : { username: 'Khách Mobile' };

            await api.post('/comments', {
                documentId: id,
                authorName: user.username,
                content: myComment,
                rating: rating 
            });
            setMyComment('');
            setRating(5);
            fetchDetail(); 
            Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
        } catch (error) { 
            console.error(error);
            Alert.alert("Lỗi", "Không thể gửi bình luận.");
        }
    };

    // Hàm render sao tĩnh
    const renderStaticStars = (score) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <Text key={star} style={{ color: star <= score ? '#F59E0B' : '#D1D5DB', fontSize: 16 }}>★</Text>
                ))}
            </View>
        );
    };

    if (!doc) return <View style={styles.centered}><Text>Đang tải dữ liệu...</Text></View>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{doc.title}</Text>
                <View style={styles.metaRow}>
                    <Text style={styles.category}>{doc.category}</Text>
                    <Text style={styles.views}>• {doc.views} lượt xem</Text>
                </View>
                <TouchableOpacity style={styles.btnRead} onPress={() => Linking.openURL(doc.fileUrl)}>
                    <Text style={styles.btnReadText}>ĐỌC TÀI LIỆU</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mô tả</Text>
                <Text style={styles.desc}>{doc.description || 'Không có mô tả.'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đánh giá ({comments.length})</Text>
                
                {/* Khu vực nhập đánh giá */}
                <View style={styles.inputArea}>
                    <Text style={{fontWeight: 'bold', marginBottom: 5}}>Chọn mức độ đánh giá:</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Text style={{ 
                                    color: star <= rating ? '#F59E0B' : '#D1D5DB', 
                                    fontSize: 32, 
                                    marginRight: 5 
                                }}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput 
                        style={styles.input} 
                        placeholder="Viết cảm nhận của bạn..." 
                        value={myComment} 
                        onChangeText={setMyComment}
                        multiline
                    />
                    <TouchableOpacity style={styles.btnSend} onPress={postComment}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Gửi đánh giá</Text>
                    </TouchableOpacity>
                </View>

                {/* Danh sách bình luận cũ */}
                {comments.map((item, index) => (
                    <View key={index} style={styles.cmtBox}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontWeight: 'bold', color: '#2563EB'}}>{item.authorName}</Text>
                            {renderStaticStars(item.rating || 5)}
                        </View>
                        <Text style={{marginTop: 4, color: '#374151'}}>{item.content}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#F9FAFB' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
    metaRow: { flexDirection: 'row', marginBottom: 15 },
    category: { color: '#2563EB', fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase' },
    views: { color: '#6B7280', fontSize: 13, marginLeft: 5 },
    btnRead: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center' },
    btnReadText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
    section: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1F2937' },
    desc: { lineHeight: 22, color: '#4B5563' },
    inputArea: { marginBottom: 20, backgroundColor: '#F3F4F6', padding: 15, borderRadius: 8 },
    input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#D1D5DB', padding: 10, borderRadius: 6, minHeight: 60, textAlignVertical: 'top' },
    btnSend: { backgroundColor: '#10B981', padding: 12, borderRadius: 6, marginTop: 10, alignItems: 'center' },
    cmtBox: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 10 }
});