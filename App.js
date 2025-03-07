import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import PlaceDetailsScreen from './screens/PlaceDetailsScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import AddReviewScreen from './screens/AddReviewScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} options={{ title: 'Place Details' }} />
            <Stack.Screen name="AddPlace" component={AddPlaceScreen} options={{ title: 'Add New Place' }} />
            <Stack.Screen name="AddReview" component={AddReviewScreen} options={{ title: 'Write a Review' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}