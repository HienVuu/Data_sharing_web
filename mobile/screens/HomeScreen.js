import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import api from '../api';

export default function HomeScreen({ navigation }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDocuments();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Detail', { id: item._id })}
        >
            <View style={styles.cardIcon}>
                <Text style={styles.iconText}>DOC</Text>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>{item.views} lượt xem</Text>
                    <Text style={styles.metaText}> • </Text> 
                    <Text style={styles.metaText}>
                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={documents}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 15 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { 
        backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 12, 
        flexDirection: 'row', alignItems: 'center', elevation: 3
    },
    cardIcon: { width: 60, height: 60, backgroundColor: '#EFF6FF', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    iconText: { color: '#2563EB', fontWeight: 'bold' },
    cardContent: { flex: 1 },
    category: { fontSize: 11, color: '#2563EB', fontWeight: '700', marginBottom: 4 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
    metaRow: { flexDirection: 'row' },
    metaText: { fontSize: 12, color: '#6B7280' }
});