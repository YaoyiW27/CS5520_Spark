import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  StyleSheet, 
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext'; 
import { 
  getLikedAndOwnPosts,
  toggleLike, 
  addComment, 
  deletePost 
} from '../../Firebase/postHelper';
import { postScreenStyles as styles } from '../../styles/PostStyles';

const formatTime = (timestamp) => {
  if (!timestamp || !timestamp.toDate) return '';
  
  const now = new Date();
  const postTime = timestamp.toDate();
  const diffMs = now - postTime;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};

const PostCard = ({ post, onLike, onComment, onDelete, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
      setShowCommentInput(false);
      setShowComments(true);
    }
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postUserInfo}>
          <TouchableOpacity style={styles.postAvatar}>
            {post.userAvatar ? (
              <Image source={{ uri: post.userAvatar }} style={styles.postAvatarImage} />
            ) : (
              <View style={[styles.postAvatarImage, styles.postAvatarPlaceholder]}>
                <Ionicons name="person" size={20} color="#666" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.postUserTextInfo}>
            <View style={styles.postUsernameContainer}>
              <Text style={styles.postUsername}>{post.username}</Text>
              {post.isOwnPost && (
                <View style={styles.postOwnPostBadge}>
                  <Text style={styles.postOwnPostText}>Me</Text>
                </View>
              )}
            </View>
            <Text style={styles.postTime}>{post.time}</Text>
          </View>
        </View>
        {post.isOwnPost && (
          <TouchableOpacity 
            style={styles.postDeleteButton} 
            onPress={() => onDelete(post.id)}
          >
            <Ionicons name="trash-outline" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.postContent}>{post.content}</Text>
      
      {post.media && post.media.length > 0 && (
        <View style={styles.postMediaContainer}>
          <Image 
            source={{ uri: post.media[0] }}  
            style={styles.postMediaImage}
            resizeMode="cover"
          />
        </View>
      )}
      
      <View style={styles.postFooter}>
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.postActionButton} 
            onPress={() => onLike(post.id)}
          >
            <Ionicons 
              name={post.isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={post.isLiked ? "#FF69B4" : "#666"} 
            />
            <Text style={styles.postActionText}>{post.likes || 0}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.postActionButton}
            onPress={() => {
              setShowComments(!showComments);
              setShowCommentInput(!showComments);
            }}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#666" />
            <Text style={styles.postActionText}>
              {post.comments ? post.comments.length : 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {(showComments || showCommentInput) && (
        <View style={styles.postCommentsSection}>
          {showCommentInput && (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
              <View style={styles.postCommentInputContainer}>
                <TextInput
                  style={styles.postCommentTextInput}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <TouchableOpacity 
                  style={[
                    styles.postCommentSendButton,
                    !commentText.trim() && styles.sendButtonDisabled
                  ]}
                  onPress={handleSubmitComment}
                  disabled={!commentText.trim()}
                >
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color={commentText.trim() ? "#FF69B4" : "#ccc"} 
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}

          {showComments && post.comments && post.comments.length > 0 && (
            <ScrollView>
              {post.comments.map((comment, index) => (
                <View key={index} style={styles.postCommentItem}>
                  <View style={styles.postCommentHeader}>
                    {comment.userAvatar ? (
                      <Image 
                        source={{ uri: comment.userAvatar }} 
                        style={styles.postCommentAvatar} 
                      />
                    ) : (
                      <View style={[styles.postCommentAvatar, styles.postAvatarPlaceholder]}>
                        <Ionicons name="person" size={16} color="#666" />
                      </View>
                    )}
                    <View style={styles.postCommentUserInfo}>
                      <Text style={styles.postCommentUsername}>{comment.username}</Text>
                      <Text style={styles.postCommentTime}>
                        {formatTime(comment.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.postCommentContent}>{comment.content}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const PostScreen = () => {
  const navigation = useNavigation();
  const { user, isLoggedIn } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigation.replace('Login');
      return;
    }
  }, [isLoggedIn, user]);

  const fetchPosts = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const fetchedPosts = await getLikedAndOwnPosts(user.email);
      const formattedPosts = fetchedPosts.map(post => ({
        ...post,
        isLiked: post.likedBy?.includes(user.email) || false,
        likes: post.likesCount || 0,
        time: formatTime(post.createdAt)
      }));
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user?.email) {
      fetchPosts();
      const unsubscribe = navigation.addListener('focus', fetchPosts);
      return unsubscribe;
    }
  }, [user?.email]);

  const handleLike = async (postId) => {
    try {
      const isLiked = await toggleLike(postId, user.email);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const newComment = await addComment(postId, user.email, commentText);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId, user.email);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <View style={styles.postLoadingContainer}>
        <ActivityIndicator size={40} color="#FF69B4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.postContainer}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard 
            post={item}
            onLike={handleLike}
            onComment={handleComment}
            onDelete={handleDelete}
            currentUserId={user?.email}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postListContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.postEmptyContainer}>
            <Text style={styles.postEmptyText}>
              No posts yet. Like some users to see their posts!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default PostScreen;