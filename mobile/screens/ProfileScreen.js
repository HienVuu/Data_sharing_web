import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    };

    const handleLogout = async () => {
        // Xóa dữ liệu đăng nhập
        await AsyncStorage.clear();
        // Quay về màn hình đăng nhập
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {(user && user.username) ? user.username.charAt(0).toUpperCase() : '?'}
                    </Text>
                </View>
                <Text style={styles.username}>{user ? user.username : 'Khách'}</Text>
                <Text style={styles.role}>{user ? 'Thành viên chính thức' : 'Chưa đăng nhập'}</Text>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>📂 Tài liệu của tôi (Đang phát triển)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>⭐ Đánh giá của tôi (Đang phát triển)</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.menuItem, styles.logoutBtn]} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { backgroundColor: 'white', alignItems: 'center', padding: 30, marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    avatarText: { color: 'white', fontSize: 32, fontWeight: 'bold' },
    username: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
    role: { color: '#6B7280', marginTop: 5 },
    menu: { paddingHorizontal: 20 },
    menuItem: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 1 },
    menuText: { fontSize: 16, color: '#374151' },
    logoutBtn: { marginTop: 20, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
    logoutText: { color: '#DC2626', fontWeight: 'bold', textAlign: 'center' }
});