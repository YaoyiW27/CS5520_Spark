import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createPost } from '../../Firebase/postHelper';
import { useAuth } from '../../contexts/AuthContext';
import * as FileSystem from 'expo-file-system';
import { createPostScreenStyles as styles } from '../../styles/PostStyles';

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (!user) {
      Alert.alert(
        'Authentication Required',
        'Please login to create posts',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }
  }, [user, navigation]);

  const pickImage = async () => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.images, 
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2, 
            compress: 0.5,
        });

        console.log('Image picker result:', result);

        if (!result.canceled && result.assets[0].uri) {
            const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
            console.log('File info:', fileInfo);

            if (fileInfo.size > 5 * 1024 * 1024) {
                Alert.alert('File too large', 'Please choose an image under 5MB');
                return;
            }

            setImage(result.assets[0].uri);
        }
    } catch (error) {
        console.error('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickVideo = async () => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'videos',
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
            videoMaxDuration: 60,  
        });

        console.log('Video picker result:', result);

        if (!result.canceled && result.assets[0].uri) {
            // check video file size
            const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
            console.log('Video file info:', fileInfo);

            // limit video size to 50MB
            if (fileInfo.size > 50 * 1024 * 1024) {
                Alert.alert('File too large', 'Please choose a video under 50MB');
                return;
            }

            setImage(result.assets[0].uri);
        }
    } catch (error) {
        console.error('Error picking video:', error);
        Alert.alert('Error', 'Failed to pick video');
    }
  };

  const handlePost = async () => {
    if (!content && !image) {
        Alert.alert('Error', 'Please add some content or media');
        return;
    }

    try {
        setIsPosting(true);

        await createPost(
            user.email, 
            content, 
            image,
            (progress) => {
                setUploadProgress(progress);
            }
        );
        
        navigation.goBack();
    } catch (error) {
        console.error('Post creation error:', error);
        Alert.alert(
            'Upload Error',
            error.message || 'Failed to create post. Please try again.',
            [{ text: 'OK' }]
        );
    } finally {
        setIsPosting(false);
    }
  };

  const handleCameraPress = async () => {
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
        console.log('File info:', fileInfo);

        if (fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert('File too large', 'Please choose an image under 5MB');
          return;
        }

        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity
                style={{
                    marginRight: 15,
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    backgroundColor: (content || image) && !isPosting ? '#FF69B4' : '#f0f0f0',
                    borderRadius: 15,
                    opacity: isPosting ? 0.5 : 1,
                }}
                onPress={handlePost}
                disabled={(!content && !image) || isPosting}
            >
                <Text style={{ 
                    color: (content || image) && !isPosting ? '#fff' : '#666',
                    fontWeight: (content || image) && !isPosting ? 'bold' : 'normal'
                }}>
                    {isPosting ? 'Posting...' : 'Post'}
                </Text>
            </TouchableOpacity>
        ),
    });
  }, [navigation, content, image, isPosting]);

  return (
    <SafeAreaView style={styles.createPostContainer}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.createPostContainer}
        >
            <ScrollView style={styles.createPostContent}>
                <TextInput
                    style={styles.createPostInput}
                    placeholder="What's on your mind?"
                    multiline
                    value={content}
                    onChangeText={setContent}
                    autoFocus
                />
                
                {image && (
                    <View style={styles.createImagePreviewContainer}>
                        <Image source={{ uri: image }} style={styles.createImagePreview} />
                        <TouchableOpacity 
                            style={styles.removeImageButton}
                            onPress={() => setImage(null)}
                        >
                            <Ionicons name="close-circle" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <View style={styles.createPostFooter}>
                <TouchableOpacity 
                    style={styles.createPostMediaButton}
                    onPress={handleCameraPress}
                >
                    <Ionicons name="camera" size={24} color="#FF69B4" />
                    <Text style={styles.createPostMediaButtonText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.createPostMediaButton}
                    onPress={pickImage}
                >
                    <Ionicons name="image" size={24} color="#FF69B4" />
                    <Text style={styles.createPostMediaButtonText}>Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.createPostMediaButton}
                    onPress={pickVideo}
                >
                    <Ionicons name="videocam" size={24} color="#FF69B4" />
                    <Text style={styles.createPostMediaButtonText}>Video</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;