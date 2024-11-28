import { StyleSheet } from 'react-native';

// Styles for PostScreen
const postScreenStyles = StyleSheet.create({
    postContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    postLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postEmptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    postEmptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    postListContainer: {
        paddingBottom: 20,
    },
    postCard: {
        backgroundColor: '#fff',
        marginVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    postUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postUserTextInfo: {
        marginLeft: 10,
    },
    postUsernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    postOwnPostBadge: {
        backgroundColor: '#FF69B4',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    postOwnPostText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    postAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    postAvatarImage: {
        width: '100%',
        height: '100%',
    },
    postAvatarPlaceholder: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postUsername: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    postTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    postContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 15,
        color: '#333',
        lineHeight: 20,
    },
    postMediaContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#f0f0f0',
    },
    postMediaImage: {
        width: '100%',
        height: '100%',
    },
    postFooter: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    postActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    postActionText: {
        color: '#666',
        fontSize: 14,
    },
    postCommentsSection: {
        backgroundColor: '#f9f9f9',
        maxHeight: 300,
    },
    postCommentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    postCommentTextInput: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        fontSize: 14,
        maxHeight: 100,
    },
    postCommentSendButton: {
        padding: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postCommentItem: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    postCommentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    postCommentAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    postCommentUserInfo: {
        flex: 1,
    },
    postCommentUsername: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    postCommentTime: {
        fontSize: 12,
        color: '#666',
    },
    postCommentContent: {
        fontSize: 14,
        marginLeft: 40,
        color: '#333',
    },
    postDeleteButton: {
        padding: 10,
    }
    });

// Styles for CreatePostScreen
const createPostScreenStyles = StyleSheet.create({
    createPostContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    createPostContent: {
      flex: 1,
      padding: 15,
      marginBottom: 70, 
    },
    createPostInput: {
      fontSize: 16,
      color: '#333',
      minHeight: 100,
    },
    createImagePreviewContainer: {
      marginTop: 15,
      position: 'relative',
    },
    createImagePreview: {
      width: '100%',
      height: 300,
      borderRadius: 10,
    },
    createPostFooter: {
      flexDirection: 'row',
      justifyContent: 'space-around', 
      alignItems: 'center',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      backgroundColor: '#fff',
    },
    createPostMediaButton: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      width: 60,
    },
    createPostMediaButtonText: {
      marginTop: 4,
      color: '#FF69B4',
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
    },
  });

export { createPostScreenStyles, postScreenStyles };