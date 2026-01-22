import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api'; // Import file cấu hình API ta đã tạo

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            // Gọi API đăng nhập từ Server
            const response = await api.post('/login', { username, password });
            
            if (response.data.success) {
                // Lưu thông tin user vào bộ nhớ điện thoại
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
                Alert.alert('Thành công', 'Đăng nhập thành công!');
                
                // Chuyển sang trang chủ 
                navigation.replace('Home');
            } else {
                Alert.alert('Lỗi', response.data.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể kết nối đến Server.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logoText}>DOCIFY</Text>
            <Text style={styles.subText}>Kho tài liệu trực tuyến</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
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
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});