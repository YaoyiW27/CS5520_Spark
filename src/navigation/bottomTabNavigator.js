import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import SwipeScreen from '../screens/Home/SwipeScreen';
import MapScreen from '../screens/Discover/MapScreen';
import PostScreen from '../screens/Post/PostScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF69B4', 
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={SwipeScreen}
        options={{
          headerTitle: 'Home',
          headerTitleStyle: {
            color: '#FF69B4',
            fontSize: 18,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Home Tab',
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={MapScreen}
        options={{
          headerTitle: 'Discover',
          headerTitleStyle: {
            color: '#FF69B4',
            fontSize: 18,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Discover Tab',
        }}
      />
      <Tab.Screen 
        name="Post" 
        component={PostScreen}
        options={({ navigation }) => ({
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Post Tab',
        })}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerTitle: 'Profile',
          headerTitleStyle: {
            color: '#FF69B4',
            fontSize: 18,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Profile Tab',
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;