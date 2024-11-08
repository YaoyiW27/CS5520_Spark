import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './bottomTabNavigator'; 
import ProfileScreen from '../screens/Profile/ProfileScreen'; 

const AppStack = createNativeStackNavigator();

const AppStackNavigator = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen name="Main" component={BottomTabNavigator} />
      <AppStack.Screen name="Settings" component={ProfileScreen} />
    </AppStack.Navigator>
  );
};

export default AppStackNavigator;