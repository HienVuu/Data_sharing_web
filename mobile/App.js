import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ContactScreen from './screens/ContactScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Màn hình Đăng nhập */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        {/* Màn hình Chính */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({ 
            title: 'DOCIFY',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={async () => {
                  await AsyncStorage.removeItem('user');
                  navigation.replace('Login');
                }}
                style={styles.headerBtnLeft}
              >
                <Text style={styles.logoutText}>Đăng xuất</Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Contact')}
                style={styles.headerBtnRight}
              >
                <Text style={styles.contactText}>Liên hệ</Text>
              </TouchableOpacity>
            ),
          })} 
        />

        {/* Màn hình Chi tiết nội dung */}
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: 'Chi tiết tài liệu' }} 
        />

        {/* Màn hình Ý kiến và Liên hệ */}
        <Stack.Screen 
          name="Contact" 
          component={ContactScreen} 
          options={{ title: 'Góp ý hệ thống' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerBtnLeft: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  headerBtnRight: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
  contactText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 14,
  }
});