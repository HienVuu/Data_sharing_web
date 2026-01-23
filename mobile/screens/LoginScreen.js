import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api'; 

export default function LoginScreen({ navigation }) {
    // Thêm state để chuyển đổi giữa Đăng nhập / Đăng ký
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!username || !password) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            // Tự động chọn API dựa trên chế độ đang chọn
            const endpoint = isLogin ? '/login' : '/register';
            const response = await api.post(endpoint, { username, password });

            if (response.data.success) {
                if (isLogin) {
                    // --- LOGIC ĐĂNG NHẬP THÀNH CÔNG ---
                    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
                    Alert.alert('Thành công', 'Chào mừng bạn quay lại!');
                    navigation.replace('Home');
                } else {
                    // --- LOGIC ĐĂNG KÝ THÀNH CÔNG ---
                    Alert.alert('Thành công', 'Đăng ký tài khoản mới thành công! Hãy đăng nhập ngay.');
                    setIsLogin(true); // Chuyển về màn hình đăng nhập
                    setUsername('');
                    setPassword('');
                }
            } else {
                Alert.alert('Thất bại', response.data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi mạng', 'Không thể kết nối đến Server. Hãy kiểm tra lại IP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logoText}>DOCIFY</Text>
            <Text style={styles.subText}>
                {isLogin ? 'Kho tài liệu trực tuyến' : 'Tạo tài khoản mới'}
            </Text>

            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput 
                    style={styles.input}
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity 
                style={[styles.button, loading && {opacity: 0.7}]} 
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>
                        {isLogin ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}
                    </Text>
                )}
            </TouchableOpacity>

            {/* Nút chuyển đổi chế độ */}
            <View style={styles.switchContainer}>
                <Text style={{color: '#666'}}>
                    {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                </Text>
                <TouchableOpacity onPress={() => {
                    setIsLogin(!isLogin);
                    setUsername('');
                    setPassword('');
                }}>
                    <Text style={styles.switchText}>
                        {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 20 },
    logoText: { fontSize: 32, fontWeight: 'bold', color: '#2563EB', marginBottom: 5 },
    subText: { fontSize: 16, color: '#6B7280', marginBottom: 40 },
    inputContainer: { width: '100%', marginBottom: 20 },
    input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB' },
    button: { backgroundColor: '#2563EB', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    switchContainer: { flexDirection: 'row', marginTop: 20 },
    switchText: { color: '#2563EB', fontWeight: 'bold' }
});