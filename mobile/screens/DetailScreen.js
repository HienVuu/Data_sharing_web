import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TextInput, TouchableOpacity, FlatList } from 'react-native';
import api from '../api';

export default function DetailScreen({ route }) {
    const { id } = route.params; // Nhận ID từ trang Home truyền sang
    const [doc, setDoc] = useState(null);
    const [comments, setComments] = useState([]);
    const [myComment, setMyComment] = useState('');

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
        if (!myComment) return;
        try {
            await api.post('/comments', {
                documentId: id,
                authorName: "Người dùng Mobile", 
                content: myComment
            });
            setMyComment('');
            fetchDetail(); // Load lại bình luận
        } catch (error) { console.error(error); }
    };

    if (!doc) return <Text>Đang tải...</Text>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{doc.title}</Text>
                <Text style={styles.meta}>{doc.category} • {doc.views} lượt xem</Text>
                <TouchableOpacity style={styles.btnRead} onPress={() => Linking.openURL(doc.fileUrl)}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>ĐỌC TÀI LIỆU</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mô tả</Text>
                <Text style={styles.desc}>{doc.description || 'Không có mô tả.'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bình luận ({comments.length})</Text>
                {comments.map((item, index) => (
                    <View key={index} style={styles.cmtBox}>
                        <Text style={{fontWeight: 'bold'}}>{item.authorName}</Text>
                        <Text>{item.content}</Text>
                    </View>
                ))}
                
                <TextInput 
                    style={styles.input} 
                    placeholder="Viết bình luận..." 
                    value={myComment} 
                    onChangeText={setMyComment}
                />
                <TouchableOpacity style={styles.btnSend} onPress={postComment}>
                    <Text style={{color: 'white'}}>Gửi bình luận</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    title: { fontSize: 22, fontWeight: 'bold', color: '#2563EB' },
    meta: { color: '#666', marginVertical: 10 },
    btnRead: { backgroundColor: '#2563EB', padding: 15, borderRadius: 8, alignItems: 'center' },
    section: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    desc: { lineHeight: 20, color: '#444' },
    cmtBox: { padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5, marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginTop: 10 },
    btnSend: { backgroundColor: '#10b981', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' }
});