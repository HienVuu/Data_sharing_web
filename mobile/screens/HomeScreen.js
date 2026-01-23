import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import api from '../api';

export default function HomeScreen({ navigation }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Cong nghe thong tin', 'Dien tu vien thong', 'Tu dong hoa', 'Kinh te', 'Khac'];

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

    const filteredDocs = documents.filter(doc => {
        const matchSearch = doc.title.toLowerCase().includes(searchText.toLowerCase());
        const matchCategory = selectedCategory === 'All' || doc.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Detail', { id: item._id })}
        >
            <View style={styles.cardIcon}>
                <Text style={styles.iconText}>
                    {item.fileUrl.split('.').pop().toUpperCase()}
                </Text>
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

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="🔍 Tìm kiếm tài liệu..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 10}}>
                    {categories.map((cat, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[
                                styles.catChip, 
                                selectedCategory === cat && styles.catChipActive
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[
                                styles.catText,
                                selectedCategory === cat && styles.catTextActive
                            ]}>
                                {cat === 'All' ? 'Tất cả' : cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.centered}><ActivityIndicator size="large" color="#2563EB" /></View>
            ) : (
                <FlatList
                    data={filteredDocs}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 15 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <Text style={{textAlign: 'center', marginTop: 20, color: '#666'}}>
                            Không tìm thấy tài liệu nào.
                        </Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    headerContainer: { backgroundColor: 'white', padding: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    searchInput: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 10, fontSize: 16 },
    catChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', marginRight: 8 },
    catChipActive: { backgroundColor: '#2563EB' },
    catText: { color: '#4B5563', fontWeight: '500' },
    catTextActive: { color: 'white', fontWeight: 'bold' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { 
        backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 12, 
        flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4
    },
    cardIcon: { width: 50, height: 50, backgroundColor: '#EFF6FF', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    iconText: { color: '#2563EB', fontWeight: 'bold', fontSize: 12 },
    cardContent: { flex: 1 },
    category: { fontSize: 11, color: '#2563EB', fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
    metaRow: { flexDirection: 'row' },
    metaText: { fontSize: 12, color: '#6B7280' }
});