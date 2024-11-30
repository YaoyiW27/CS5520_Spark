import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getLikedAndOwnPosts,
  toggleLike, 
  addComment, 
  deletePost 
} from '../../Firebase/postHelper';
import PostCard from '../../components/PostCard';
import { postScreenStyles as styles } from '../../styles/PostStyles';

const PostScreen = () => {
  const navigation = useNavigation();
  const { user, isLoggedIn, resetStates } = useAuth(); // add resetStates
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      resetStates(); // reset states if user is not logged in
      return;
    }
  }, [isLoggedIn, user]);

  const fetchPosts = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const fetchedPosts = await getLikedAndOwnPosts(user.email);
      setPosts(fetchedPosts);
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
                const currentLikes = post.likes || 0;
                return {
                    ...post,
                    isLiked,
                    likes: isLiked ? currentLikes + 1 : Math.max(currentLikes - 1, 0)
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