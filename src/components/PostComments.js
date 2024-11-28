import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '../utils/timeFormatter';
import { postScreenStyles as styles } from '../styles/PostStyles';

const PostComments = ({ 
  comments = [], 
  showInput, 
  postId, 
  onComment, 
  onClose 
}) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(postId, commentText);
      setCommentText('');
    }
  };

  return (
    <View style={styles.postCommentsSection}>
      {showInput && (
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

      {comments.length > 0 && (
        <ScrollView>
          {comments.map((comment, index) => (
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
  );
};

export default PostComments;