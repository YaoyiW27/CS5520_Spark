import React, { useState } from 'react';
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
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Comment = ({ comment }) => (
  <View style={styles.commentContainer}>
    <View style={styles.commentHeader}>
      <View style={styles.commentUserInfo}>
        {comment.userAvatar ? (
          <Image source={{ uri: comment.userAvatar }} style={styles.commentAvatar} />
        ) : (
          <View style={[styles.commentAvatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={16} color="#666" />
          </View>
        )}
        <View>
          <Text style={styles.commentUsername}>{comment.username}</Text>
          <Text style={styles.commentTime}>{comment.time}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.commentText}>{comment.text}</Text>
  </View>
);

const PostCard = ({ post, onLike, onComment }) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(commentText);
      setCommentText('');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity style={styles.avatar}>
            {post.userAvatar ? (
              <Image source={{ uri: post.userAvatar }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={20} color="#666" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.userTextInfo}>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.time}>{post.time}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.content}>{post.content}</Text>
      
      {post.media && (
        <View style={styles.mediaContainer}>
          <Image 
            source={{ uri: post.media }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        </View>
      )}
      
      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onLike}>
            <Ionicons 
              name={post.isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={post.isLiked ? "#FF69B4" : "#666"} 
            />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowComments(!showComments)}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#666" />
            <Text style={styles.actionText}>{post.comments.length}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          <ScrollView style={styles.commentsList}>
            {post.comments.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))}
          </ScrollView>
          
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          >
            <View style={styles.commentInput}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
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
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
};

const PostScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    {
      id: '1',
      username: 'Bob',
      userAvatar: null,
      time: '27 min ago',
      content: "I'm happy today. The weather is beautiful and I just had a great lunch with friends!",
      likes: 3,
      isLiked: false,
      media: 'https://picsum.photos/400/300',
      comments: [
        {
          username: 'Alice',
          userAvatar: 'https://picsum.photos/50/50',
          time: '15 min ago',
          text: 'Looks amazing!'
        },
        {
          username: 'John',
          userAvatar: null,
          time: '5 min ago',
          text: 'Great view!'
        }
      ]
    },
    // 更多帖子...
  ]);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId, commentText) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              username: 'Me',
              userAvatar: null,
              time: 'Just now',
              text: commentText
            }
          ]
        };
      }
      return post;
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard 
            post={item}
            onLike={() => handleLike(item.id)}
            onComment={(text) => handleComment(item.id, text)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextInfo: {
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  mediaContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    color: '#666',
    fontSize: 14,
  },
  moreButton: {
    padding: 5,
  },
  commentsSection: {
    backgroundColor: '#f9f9f9',
    maxHeight: 300, 
  },
  commentsList: {
    padding: 15,
    maxHeight: 250, 
  },
  commentInput: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
    padding: 0,
  },
  sendButton: {
    padding: 5,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default PostScreen;