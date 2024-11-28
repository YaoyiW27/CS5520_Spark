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
import { createPost } from '../../Firebase/postHelper';
import { useAuth } from '../../contexts/AuthContext';
import MediaPicker from '../../components/MediaPicker';
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

        <MediaPicker onMediaSelect={setImage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;