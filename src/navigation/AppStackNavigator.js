import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './bottomTabNavigator'; 
import LikedListScreen from '../screens/Profile/LikedListScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

const AppStack = createNativeStackNavigator();

const AppStackNavigator = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >

      <AppStack.Screen name="Main" component={BottomTabNavigator} />

      <AppStack.Screen 
        name="LikedListScreen" 
        component={LikedListScreen} 
        options={{ 
          headerShown: true,  
          title: 'Liked By',
          headerTintColor: '#FF69B4', 
        }} 
      />

      <AppStack.Screen 
        name="EditProfileScreen" 
        component={EditProfileScreen} 
        options={{ 
          headerShown: true,  
          title: 'Edit Profile',
          headerTintColor: '#FF69B4', 
        }} 
      />
    </AppStack.Navigator>
  );
};

export default AppStackNavigator;