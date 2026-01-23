import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';

export default function ContactScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!name || !email || !message) {
            Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin.");
            return;
        }

        // Mô phỏng gửi liên hệ 
        setTimeout(() => {
            Alert.alert("Thành công", "Cảm ơn bạn đã đóng góp ý kiến!");
            setName('');
            setEmail('');
            setMessage('');
        }, 500);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>GỬI Ý KIẾN PHẢN HỒI</Text>
                <Text style={styles.subtitle}>
                    Chúng tôi luôn lắng nghe ý kiến của bạn để cải thiện ứng dụng tốt hơn.
                </Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Họ và tên:</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Nhập tên của bạn" 
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Email liên hệ:</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Nhập email" 
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Nội dung góp ý:</Text>
                <TextInput 
                    style={[styles.input, styles.textArea]} 
                    placeholder="Bạn muốn đóng góp gì cho DOCIFY?" 
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />

                <TouchableOpacity style={styles.button} onPress={handleSend}>
                    <Text style={styles.buttonText}>GỬI PHẢN HỒI</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>Hotline: 036.3636.363</Text>
                <Text style={styles.footerText}>Email: support@docify.vn</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { padding: 25, backgroundColor: '#EFF6FF', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#2563EB', marginBottom: 10 },
    subtitle: { textAlign: 'center', color: '#6B7280', fontSize: 14, lineHeight: 20 },
    form: { padding: 20 },
    label: { fontWeight: 'bold', marginBottom: 5, color: '#374151', marginTop: 10 },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, backgroundColor: '#F9FAFB' },
    textArea: { height: 120, textAlignVertical: 'top' },
    button: { backgroundColor: '#2563EB', padding: 15, borderRadius: 8, marginTop: 25, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    footer: { padding: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    footerText: { color: '#9CA3AF', marginBottom: 5 }
});