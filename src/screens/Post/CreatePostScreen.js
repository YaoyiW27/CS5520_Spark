import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  StyleSheet, 
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

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const getFileInfo = async (fileUri) => {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      return fileInfo;
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
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView style={styles.content}>
                <TextInput
                    style={styles.input}
                    placeholder="What's on your mind?"
                    multiline
                    value={content}
                    onChangeText={setContent}
                    autoFocus
                />
                
                {image && (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                        <TouchableOpacity 
                            style={styles.removeImageButton}
                            onPress={() => setImage(null)}
                        >
                            <Ionicons name="close-circle" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.mediaButton}
                    onPress={pickImage}
                >
                    <Ionicons name="image" size={24} color="#FF69B4" />
                    <Text style={styles.mediaButtonText}>Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.mediaButton}
                    onPress={pickVideo}
                >
                    <Ionicons name="videocam" size={24} color="#FF69B4" />
                    <Text style={styles.mediaButtonText}>Video</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FF69B4',
    marginLeft: 10,
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FF69B4',
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postButtonTextDisabled: {
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  input: {
    fontSize: 16,
    color: '#333',
    minHeight: 100,
  },
  imagePreviewContainer: {
    marginTop: 15,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    padding: 5,
  },
  mediaButtonText: {
    marginLeft: 5,
    color: '#FF69B4',
    fontWeight: '500',
  },
});

export default CreatePostScreen;