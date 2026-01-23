import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UploadScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    // State cho danh mục
    const [category, setCategory] = useState('Cong nghe thong tin');
    const [customCategory, setCustomCategory] = useState(''); // Lưu tên danh mục tự nhập
    const [isCustom, setIsCustom] = useState(false); // Biến kiểm tra có đang chọn "Khác" không

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Danh sách danh mục có sẵn
    const categories = ['Cong nghe thong tin', 'Dien tu vien thong', 'Tu dong hoa', 'Kinh te', 'Khac'];

    const handleSelectCategory = (cat) => {
        if (cat === 'Khac') {
            setIsCustom(true); // Bật chế độ nhập tay
            setCategory('');   // Xóa category chọn sẵn
        } else {
            setIsCustom(false); // Tắt chế độ nhập tay
            setCategory(cat);
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets.length > 0) {
                setFile(result.assets[0]);
            }
        } catch (err) {
            console.log('Hủy chọn file');
        }
    };

    const handleUpload = async () => {
        // 1. Xác định tên danh mục cuối cùng
        // Nếu đang chọn "Khác" thì lấy text người dùng nhập, nếu không thì lấy danh mục có sẵn
        const finalCategory = isCustom ? customCategory : category;

        // 2. Validate
        if (!title || !file) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập tiêu đề và chọn file!');
            return;
        }

        if (isCustom && !finalCategory.trim()) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên danh mục mới!');
            return;
        }

        setLoading(true);

        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) {
                Alert.alert('Lỗi', 'Bạn cần đăng nhập để tải tài liệu');
                return;
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', finalCategory); // Gửi danh mục chuẩn lên server
            
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/octet-stream',
            });

            const response = await api.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data) {
                Alert.alert('Thành công', 'Tài liệu đã được tải lên!');
                navigation.goBack();
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Thất bại', 'Lỗi khi tải lên server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Tiêu đề tài liệu (*)</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Ví dụ: Giáo trình C++" 
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Mô tả</Text>
            <TextInput 
                style={[styles.input, {height: 80, textAlignVertical: 'top'}]} 
                placeholder="Mô tả nội dung tài liệu..." 
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <Text style={styles.label}>Danh mục</Text>
            <View style={styles.catContainer}>
                {categories.map((cat) => {
                    // Logic kiểm tra nút nào đang active
                    const isActive = (cat === 'Khac' && isCustom) || (cat === category && !isCustom);
                    
                    return (
                        <TouchableOpacity 
                            key={cat}
                            style={[styles.catChip, isActive && styles.catActive]}
                            onPress={() => handleSelectCategory(cat)}
                        >
                            <Text style={[styles.catText, isActive && styles.textActive]}>
                                {cat === 'Khac' ? '✏️ Khác (Nhập mới)' : cat}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Ô NHẬP DANH MỤC MỚI (Chỉ hiện khi chọn 'Khác') */}
            {isCustom && (
                <View style={{marginBottom: 15}}>
                    <Text style={[styles.label, {color: '#2563EB'}]}>Nhập tên danh mục mới:</Text>
                    <TextInput 
                        style={[styles.input, {borderColor: '#2563EB', backgroundColor: '#EFF6FF'}]}
                        placeholder="Ví dụ: Marketing, Tiếng Nhật..."
                        value={customCategory}
                        onChangeText={setCustomCategory}
                        autoFocus={true} // Tự động bật bàn phím
                    />
                </View>
            )}

            <Text style={styles.label}>File đính kèm (*)</Text>
            <TouchableOpacity style={styles.fileBtn} onPress={pickDocument}>
                <Text style={styles.fileBtnText}>
                    {file ? `📎 ${file.name}` : '📂 Bấm để chọn file (PDF, DOCX...)'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.uploadBtn, loading && {opacity: 0.7}]} 
                onPress={handleUpload}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.uploadText}>TẢI LÊN NGAY</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', padding: 20 },
    label: { fontWeight: 'bold', marginBottom: 5, color: '#374151' },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 16 },
    catContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
    catChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#F3F4F6' },
    catActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
    catText: { fontSize: 12, color: '#374151' },
    textActive: { color: 'white', fontWeight: 'bold' },
    fileBtn: { borderWidth: 1, borderColor: '#2563EB', borderStyle: 'dashed', padding: 20, borderRadius: 10, alignItems: 'center', marginBottom: 30, backgroundColor: '#EFF6FF' },
    fileBtnText: { color: '#2563EB', fontWeight: '600' },
    uploadBtn: { backgroundColor: '#2563EB', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 50 },
    uploadText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});