import { db, storage } from './firebaseSetup';
import { 
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    query,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

export const createPost = async (userEmail, username, userAvatar, content, mediaFile = null, onProgress) => {
    if (!userEmail) {
        throw new Error('User ID (email) is required');
    }

    console.log('Received UID (email):', userEmail);

    try {
        let mediaUrl = null;
        let isVideo = false;
        let isImage = false;

        if (mediaFile) {
            try {
                console.log('Starting file upload process...');

                if (!mediaFile || typeof mediaFile !== 'string') {
                    throw new Error('Invalid media file');
                }

                const safeUserId = userEmail;
                const timestamp = Date.now();
                const randomString = Math.random().toString(36).substring(7);

                const response = await fetch(mediaFile);
                const blob = await response.blob();
                const fileType = blob.type;

                // 初始化 isVideo 和 isImage
                isVideo = fileType.startsWith('video/');
                isImage = fileType.startsWith('image/');

                const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
                const validTypes = isVideo ? 
                    ['video/mp4', 'video/quicktime'] : 
                    ['image/jpeg', 'image/png', 'image/gif'];

                const filename = `posts/${safeUserId}/${isVideo ? 'videos' : 'images'}/${timestamp}-${randomString}`;
                console.log('Uploading to:', filename);

                console.log('Blob created:', {
                    size: blob.size,
                    type: fileType,
                    path: filename
                });

                if (blob.size > maxSize) {
                    throw new Error(`File size exceeds ${isVideo ? '50MB' : '5MB'} limit`);
                }

                if (!validTypes.includes(fileType)) {
                    throw new Error(`Unsupported file type. Please upload ${isVideo ? 'MP4 or MOV videos' : 'JPG, PNG or GIF images'}.`);
                }

                const storageRef = ref(storage, filename);

                console.log('Creating upload task...');
                const uploadTask = uploadBytesResumable(storageRef, blob, {
                    contentType: fileType,
                });

                mediaUrl = await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload progress:', progress);
                            onProgress && onProgress(progress);
                        },
                        (error) => {
                            console.error('Upload failed:', error);
                            reject(new Error('Failed to upload media. Please try again.'));
                        },
                        async () => {
                            try {
                                const downloadUrl = await getDownloadURL(storageRef);
                                console.log('Upload completed. URL:', downloadUrl);
                                resolve(downloadUrl);
                            } catch (error) {
                                console.error('Failed to get download URL:', error);
                                reject(new Error('Failed to process uploaded media.'));
                            }
                        }
                    );
                });

            } catch (error) {
                console.error('File upload error:', error);
                throw error;
            }
        }

        if (!content && !mediaUrl) {
            throw new Error('Post must contain either text or media');
        }

        const postData = {
            userId: userEmail.trim(),
            username: username || 'Anonymous',
            userAvatar: userAvatar || null,
            content: content ? content.trim() : '',
            media: mediaUrl ? [mediaUrl] : [],
            mediaType: isVideo ? 'video' : isImage ? 'image' : null,
            createdAt: serverTimestamp(),
            likesCount: 0,
            likedBy: [],
            comments: []
        };

        console.log('Saving post to database...');
        const postRef = await addDoc(collection(db, 'Posts'), postData);
        console.log('Post created successfully:', postRef.id);
        return postRef.id;

    } catch (error) {
        console.error('Create post failed:', error);
        throw error;
    }
};

// Toggle like on a post
export const toggleLike = async (postId, userId) => {
    try {
        const postRef = doc(db, 'Posts', postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            throw new Error('Post not found');
        }

        const post = postSnap.data();
        const isLiked = post.likedBy?.includes(userId);
        const currentCount = post.likesCount || 0;

        const updatedData = isLiked
            ? {
                  likesCount: Math.max(currentCount - 1, 0),
                  likedBy: arrayRemove(userId),
              }
            : {
                  likesCount: currentCount + 1,
                  likedBy: arrayUnion(userId),
              };

        await updateDoc(postRef, updatedData);
        return !isLiked;
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};

// Add comment to a post
export const addComment = async (postId, userId, commentContent) => {
    try {
        const postRef = doc(db, 'Posts', postId);
        
        // Get commenter's user info
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        const newComment = {
            userId,
            username: userData.username || 'Unknown User',
            userAvatar: userData.profilePhoto || null,
            content: commentContent,
            createdAt: Timestamp.now() 
        };

        await updateDoc(postRef, {
            comments: arrayUnion(newComment)
        });

        return newComment;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

// Delete a post and its media
export const deletePost = async (postId, userId) => {
    try {
        const postRef = doc(db, 'Posts', postId);
        const postSnap = await getDoc(postRef);
        
        if (!postSnap.exists()) {
            throw new Error('Post not found');
        }

        const post = postSnap.data();
        
        // Verify user ownership
        if (post.userId !== userId) {
            throw new Error('Not authorized to delete this post');
        }

        // Delete associated media files
        if (post.media && post.media.length > 0) {
            for (const mediaUrl of post.media) {
                try {
                    const storageRef = ref(storage, mediaUrl);
                    await deleteObject(storageRef);
                    console.log('Media deleted successfully:', mediaUrl);
                } catch (error) {
                    console.error('Error deleting media:', error);
                    // Continue with post deletion even if media deletion fails
                }
            }
        }

        // Delete the post document
        await deleteDoc(postRef);
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

// Get posts from liked users and own posts
export const getLikedAndOwnPosts = async (currentUserEmail) => {
    try {
        // Get current user's profile and liked users
        const userRef = doc(db, 'Users', currentUserEmail);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            throw new Error('User not found');
        }

        const userData = userSnap.data();
        const likedUsers = userData.likes || [];

        // Query posts sorted by creation time
        const postsQuery = query(
            collection(db, 'Posts'),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(postsQuery);
        const posts = [];
        
        // Process and filter posts
        for (const docSnapshot of querySnapshot.docs) {
            try {
                const post = docSnapshot.data();
                
                if (likedUsers.includes(post.userId) || post.userId === currentUserEmail) {
                    const postUserRef = doc(db, 'Users', post.userId);
                    const postUserSnap = await getDoc(postUserRef);
                    const postUserData = postUserSnap.exists() ? postUserSnap.data() : {};
                    
                    posts.push({
                        id: docSnapshot.id,
                        ...post,
                        likes: post.likesCount || 0,
                        isLiked: post.likedBy?.includes(currentUserEmail) || false,
                        username: postUserData.username || 'Unknown User',
                        userAvatar: postUserData.profilePhoto || null,
                        isOwnPost: post.userId === currentUserEmail
                    });
                }
            } catch (error) {
                console.error('Error processing post:', error);
                continue;
            }
        }
        
        return posts;
    } catch (error) {
        console.error('Error getting posts:', error);
        throw error;
    }
};