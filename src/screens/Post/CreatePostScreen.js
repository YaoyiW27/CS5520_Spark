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
import { Video } from 'expo-av';
import { createPost } from '../../Firebase/postHelper';
import { useAuth } from '../../contexts/AuthContext';
import MediaPicker from '../../components/MediaPicker';
import { createPostScreenStyles as styles } from '../../styles/PostStyles';

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
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

  const handlePost = async () => {
    if (!content && !media) {
      Alert.alert('Error', 'Please add some content or media');
      return;
    }

    try {
      setIsPosting(true);
      await createPost(
        user.email,
        user.displayName || 'Anonymous',
        user.photoURL || null,
        content, 
        media,
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
            backgroundColor: (content || media) && !isPosting ? '#FF69B4' : '#f0f0f0',
            borderRadius: 15,
            opacity: isPosting ? 0.5 : 1,
          }}
          onPress={handlePost}
          disabled={(!content && !media) || isPosting}
        >
          <Text style={{ 
            color: (content || media) && !isPosting ? '#fff' : '#666',
            fontWeight: (content || media) && !isPosting ? 'bold' : 'normal'
          }}>
            {isPosting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, content, media, isPosting]);

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

          {media && (
            <View style={styles.mediaPreviewContainer}>
              {mediaType === 'video' ? (
                <Video
                  source={{ uri: media }}
                  style={styles.mediaPreview}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                />
              ) : (
                <Image 
                  source={{ uri: media }}
                  style={styles.mediaPreview}
                  resizeMode="cover"
                />
              )}
              <TouchableOpacity 
                style={styles.removeMediaButton}
                onPress={() => {
                  setMedia(null);
                  setMediaType(null);
                }}
              >
                <Ionicons name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <MediaPicker 
          onMediaSelect={(uri, type) => {
            setMedia(uri);
            setMediaType(type.startsWith('video/') ? 'video' : 'image');
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;