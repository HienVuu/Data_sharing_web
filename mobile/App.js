import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ContactScreen from './screens/ContactScreen';
import ProfileScreen from './screens/ProfileScreen';
import UploadScreen from './screens/UploadScreen';

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
            title: 'Docify Mobile',
            headerLeft: () => null,
            headerRight: () => (
              <View style={styles.headerRightRow}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Upload')}
                  style={styles.uploadBtn}
                >
                  <Text style={styles.uploadText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Profile')}
                  style={styles.profileBtn}
                >
                  <Text style={styles.profileText}>👤</Text>
                </TouchableOpacity>
              </View>
            )
          })} 
        />

        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: 'Chi tiết tài liệu' }} 
        />

        <Stack.Screen 
          name="Contact" 
          component={ContactScreen} 
          options={{ title: 'Góp ý hệ thống' }} 
        />

        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Tài khoản' }} 
        />

        <Stack.Screen 
          name="Upload" 
          component={UploadScreen} 
          options={{ title: 'Tải tài liệu lên' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  uploadBtn: {
    marginRight: 15,
    backgroundColor: '#2563EB',
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  uploadText: {
    fontSize: 20,
    color: 'white',
    marginTop: -2
  },
  profileBtn: {
    marginRight: 15,
    justifyContent: 'center'
  },
  profileText: {
    fontSize: 24
  }
});