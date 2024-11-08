import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './bottomTabNavigator'; 
import ProfileScreen from '../screens/Profile/ProfileScreen'; 

const AppStack = createNativeStackNavigator();

const AppStackNavigator = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false, // 根据需要显示或隐藏标题栏
      }}
    >
      <AppStack.Screen name="Main" component={BottomTabNavigator} />
      <AppStack.Screen name="Settings" component={ProfileScreen} />
      {/* 可以在这里添加更多的屏幕 */}
    </AppStack.Navigator>
  );
}

export default AppStackNavigator;