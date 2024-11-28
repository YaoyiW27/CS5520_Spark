import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getMatchNotifications } from '../Firebase/firebaseHelper';
import { useNavigation } from '@react-navigation/native';
import SwipeScreen from '../screens/Home/SwipeScreen';
import MapScreen from '../screens/Discover/MapScreen';
import PostScreen from '../screens/Post/PostScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../Firebase/firebaseSetup'; // ensure db is imported

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.email) return;

    // create a realtime listener for the notifications collection
    const notificationsRef = collection(db, 'matches');
    const q = query(
      notificationsRef,
      where('users', 'array-contains', user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hasUnread = snapshot.docs.some(doc => {
        const notification = doc.data();
        return !notification.isRead || !notification.isRead[user.email];
      });
      setHasUnreadMessages(hasUnread);
    });

    // clean up the listener
    return () => unsubscribe();
  }, [user]);

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
        options={({ navigation }) => ({
          headerTitle: 'Home',
          headerTitleStyle: {
            color: '#FF69B4',
            fontSize: 18,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Search')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="search" size={24} color="#FF69B4" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Home Tab',
        })}
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
        options={({ navigation }) => ({
          headerTitle: 'Profile',
          headerTitleStyle: {
            color: '#FF69B4',
            fontSize: 18,
          },
          headerRight: () => (
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('InboxScreen');
                }}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="mail" size={24} color="#FF69B4" />
                {hasUnreadMessages && (
                  <View style={{
                    position: 'absolute',
                    right: -6,
                    top: -6,
                    backgroundColor: 'red',
                    borderRadius: 6,
                    width: 12,
                    height: 12,
                  }} />
                )}
              </TouchableOpacity>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Profile Tab',
        })}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;