import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  Image 
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import PostComments from './PostComments';
import { formatTime } from '../utils/timeFormatter';
import { postScreenStyles as styles } from '../styles/PostStyles';

const PostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onDelete, 
  currentUserId 
}) => {
  const [showComments, setShowComments] = React.useState(false);
  const [showCommentInput, setShowCommentInput] = React.useState(false);
  const isOwnPost = post.userId === currentUserId;

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
              {isOwnPost && (
                <View style={styles.postOwnPostBadge}>
                  <Text style={styles.postOwnPostText}>Me</Text>
                </View>
              )}
            </View>
            <Text style={styles.postTime}>{formatTime(post.createdAt)}</Text>
          </View>
        </View>
        {isOwnPost && (
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
          {post.mediaType === 'video' ? (
            <Video
              source={{ uri: post.media[0] }}
              style={styles.postMediaVideo}
              resizeMode="contain"
              useNativeControls
              isLooping
            />
          ) : (
            <Image 
              source={{ uri: post.media[0] }}
              style={styles.postMediaImage}
              resizeMode="cover"
            />
          )}
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
            <Text style={styles.postActionText}>{post.likesCount || 0}</Text>
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
        <PostComments
          comments={post.comments}
          showInput={showCommentInput}
          postId={post.id}
          onComment={onComment}
          onClose={() => {
            setShowComments(false);
            setShowCommentInput(false);
          }}
        />
      )}
    </View>
  );
};

export default PostCard;