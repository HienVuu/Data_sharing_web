import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({ 
            title: 'DOCIFY',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={async () => {
                  await AsyncStorage.removeItem('user');
                  navigation.replace('Login');
                }}
                style={{ marginLeft: 10 }}
              >
                <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>Đăng xuất</Text>
              </TouchableOpacity>
            ),
          })} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: 'Chi tiết tài liệu' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}