import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import BottomTabNavigator from './bottomTabNavigator';
import PostScreen from '../screens/Post/PostScreen';
import CreatePostScreen from '../screens/Post/CreatePostScreen';
import LikedListScreen from '../screens/Profile/LikedListScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import DisplayProfileScreen from '../screens/Profile/DisplayProfileScreen';
import FilterScreen from '../screens/Discover/FilterScreen';
import NotificationScreen from '../screens/Profile/NotificationScreen';
import SearchScreen from '../screens/Home/SearchScreen';
import InboxScreen from '../screens/Profile/InboxScreen';
const AppStack = createNativeStackNavigator();

const AppStackNavigator = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen 
        name="Main" 
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      <AppStack.Screen
        name="DisplayProfile"
        component={DisplayProfileScreen}
        options={() => ({
          headerShown: true,
          headerTitle: "Profile Details",
          headerTitleStyle: {
            color: '#FF69B4',
            fontSize: 18,
          },
          headerTintColor: '#FF69B4',
        })}
      />

      <AppStack.Screen 
        name="FilterScreen" 
        component={FilterScreen} 
        options={{ 
          headerShown: true,
          title: 'Filters',
          headerTitleStyle: {
            color: '#FF69B4',
            fontSize: 18,
          },
          headerTintColor: '#FF69B4',
        }} 
      />

      <AppStack.Screen
        name="Post"
        component={PostScreen}
        options={({ navigation }) => ({
          headerTitleAlign: 'center',
          headerTitle: 'Post',
          headerTitleStyle: {
            color: '#FF69B4',
            fontSize: 18,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('CreatePost')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="add-circle" size={28} color="#FF69B4" />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
        })}
      />

      <AppStack.Screen 
        name="CreatePost" 
        component={CreatePostScreen} 
        options={({ navigation }) => ({
          headerTitleAlign: 'center',
          headerTitle: 'Create Post',
          headerTitleStyle: {
            color: '#FF69B4',
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Text style={{ color: '#FF69B4', fontSize: 16 }}>Main</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 15,
                paddingHorizontal: 15,
                paddingVertical: 5,
                backgroundColor: '#f0f0f0',
                borderRadius: 15,
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={{ 
                color: '#666',
                fontSize: 14,
                fontWeight: '500'
              }}>Post</Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: false, 
          headerStyle: {
            backgroundColor: '#fff',
          },
        })} 
      />

      <AppStack.Screen 
        name="LikedListScreen" 
        component={LikedListScreen} 
        options={{ 
          headerShown: true,
          title: 'Liked List',
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

      <AppStack.Screen
      name="NotificationScreen"
      component={NotificationScreen}
      options={({ navigation }) => ({
        title: 'Notifications',
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => navigation.setParams({ showModal: true })}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
          ),
        })}
      />

      <AppStack.Screen name="Search" component={SearchScreen}
        options={{
          headerShown: true,
          title: 'Search',
          headerTintColor: '#FF69B4',
        }}
      />

      <AppStack.Screen 
        name="InboxScreen" 
        component={InboxScreen}
        options={{ 
          headerShown: true,
          title: 'Inbox',
          headerTintColor: '#FF69B4',
        }}
      />
    </AppStack.Navigator>
  );
};

export default AppStackNavigator;