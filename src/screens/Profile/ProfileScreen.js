import React, { useContext, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { getUserProfile, updateUserProfilePhoto } from '../../Firebase/firebaseHelper';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const DEFAULT_PROFILE_PHOTO = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout, user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        try {
          const profile = await getUserProfile(user.email);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      if (user?.email) {
        fetchUserProfile();
      }
    }, [user?.email])
  );

  const likesCount = userProfile?.likes?.length || 0;

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos.');
        return;
      }

      // Pick the image
      const result = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
        compress: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        setUploading(true);
        try {
          await updateUserProfilePhoto(user.email, result.assets[0].uri);
          // Refresh user profile to get the new photo
          const profile = await getUserProfile(user.email);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error uploading photo:', error);
          Alert.alert('Error', 'Failed to upload photo');
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Photo Section */}
        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: userProfile?.profilePhoto || DEFAULT_PROFILE_PHOTO }}
              style={styles.photo}
            />
          </TouchableOpacity>
        </View>

        {/* Name Section */}
        <Text style={styles.nameText}>
          {userProfile?.username || 'Loading...'}
        </Text>

        {/* Likes Section */}
        <TouchableOpacity 
          style={styles.likesContainer}
          onPress={() => navigation.navigate('LikedListScreen')}
        >
          <Text style={styles.likesText}>♥ Like {likesCount}</Text>
        </TouchableOpacity>

        {/* Buttons Section */}
        <TouchableOpacity 
          style={styles.button}
          onPress={pickImage}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? 'Uploading...' : 'Edit Photo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('EditProfileScreen')}
        >
          <Text style={styles.buttonText}>Edit Profile Detail</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={logout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF69B4',
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FF69B4',
    fontSize: 16,
  },
  photoContainer: {
    marginTop: 20,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 30,
    color: '#666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#000',
  },
  likesContainer: {
    marginTop: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFE4E1', // Light pink
  },
  likesText: {
    color: '#FF69B4', // Hot pink
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

});

export default ProfileScreen;