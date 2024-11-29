import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  Alert,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { createPostScreenStyles as styles } from '../styles/PostStyles';

const MediaPicker = ({ onMediaSelect }) => {
  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleImagePick = async () => {
    if (!await requestPermission()) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',  // 修改这里
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
        compress: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
        
        if (fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert('File too large', 'Please choose an image under 5MB');
          return;
        }

        onMediaSelect(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleVideoPick = async () => {
    if (!await requestPermission()) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'videos',  // 修改这里
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0].uri) {
        const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);

        if (fileInfo.size > 50 * 1024 * 1024) {
          Alert.alert('File too large', 'Please choose a video under 50MB');
          return;
        }

        onMediaSelect(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const handleCameraLaunch = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your camera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
        compress: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);

        if (fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert('File too large', 'Please choose an image under 5MB');
          return;
        }

        onMediaSelect(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  return (
    <View style={styles.createPostFooter}>
      <TouchableOpacity 
        style={styles.createPostMediaButton}
        onPress={handleCameraLaunch}
      >
        <Ionicons name="camera" size={24} color="#FF69B4" />
        <Text style={styles.createPostMediaButtonText}>Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.createPostMediaButton}
        onPress={handleImagePick}
      >
        <Ionicons name="image" size={24} color="#FF69B4" />
        <Text style={styles.createPostMediaButtonText}>Photo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.createPostMediaButton}
        onPress={handleVideoPick}
      >
        <Ionicons name="videocam" size={24} color="#FF69B4" />
        <Text style={styles.createPostMediaButtonText}>Video</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MediaPicker;