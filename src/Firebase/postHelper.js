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

const uriToBlob = async (uri) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error('Error converting URI to blob:', error);
        throw error;
    }
};

export const createPost = async (userId, content, mediaFile = null, onProgress) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    try {
        let mediaUrl = null;

        if (mediaFile) {
            try {
                console.log('Starting file upload process...');
                
                if (!mediaFile || typeof mediaFile !== 'string') {
                    throw new Error('Invalid media file');
                }

                const safeUserId = userId.replace(/\./g, '_');
                const timestamp = Date.now();
                const randomString = Math.random().toString(36).substring(7);
                const filename = `posts/${safeUserId}/${timestamp}-${randomString}`;
                const storageRef = ref(storage, filename);

                console.log('Fetching file from URI...');
                const response = await fetch(mediaFile);
                const blob = await response.blob();
                console.log('Blob created:', {
                    size: blob.size,
                    type: blob.type
                });

                if (blob.size > 5 * 1024 * 1024) {
                    throw new Error('File size exceeds 5MB limit');
                }

                const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!validTypes.includes(blob.type)) {
                    throw new Error('Unsupported file type. Please upload JPG, PNG or GIF images.');
                }

                console.log('Creating upload task...');
                const uploadTask = uploadBytesResumable(storageRef, blob, {
                    contentType: blob.type,
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
                            reject(new Error('Failed to upload image. Please try again.'));
                        },
                        async () => {
                            try {
                                const downloadUrl = await getDownloadURL(storageRef);
                                console.log('Upload completed. URL:', downloadUrl);
                                resolve(downloadUrl);
                            } catch (error) {
                                console.error('Failed to get download URL:', error);
                                reject(new Error('Failed to process uploaded image.'));
                            }
                        }
                    );
                });

            } catch (error) {
                console.error('File upload error:', error);
                throw new Error(error.message || 'Failed to upload image');
            }
        }

        if (!content && !mediaUrl) {
            throw new Error('Post must contain either text or image');
        }

        const postData = {
            userId: userId.trim(),
            content: content ? content.trim() : '',
            media: mediaUrl ? [mediaUrl] : [],
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


export const getAllPosts = async () => {
    try {
        const postsQuery = query(
            collection(db, 'Posts'),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(postsQuery);
        const posts = [];
        
        for (const docSnapshot of querySnapshot.docs) {
            try {
                const post = docSnapshot.data();
                const userRef = doc(db, 'Users', post.userId);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.exists() ? userSnap.data() : {};
                
                posts.push({
                    id: docSnapshot.id,
                    ...post,
                    username: userData.username || 'Unknown User',
                    userAvatar: userData.profilePhoto || null
                });
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

// Toggle like
export const toggleLike = async (postId, userId) => {
    try {
        const postRef = doc(db, 'Posts', postId);
        const postSnap = await getDoc(postRef);
        
        if (!postSnap.exists()) {
            throw new Error('Post not found');
        }

        const post = postSnap.data();
        const isLiked = post.likedBy?.includes(userId);

        if (isLiked) {
            // Remove like
            await updateDoc(postRef, {
                likesCount: (post.likesCount || 1) - 1,
                likedBy: arrayRemove(userId)
            });
            return false;
        } else {
            // Add like
            await updateDoc(postRef, {
                likesCount: (post.likesCount || 0) + 1,
                likedBy: arrayUnion(userId)
            });
            return true;
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};

// Add comment
export const addComment = async (postId, userId, commentContent) => {
    try {
        const postRef = doc(db, 'Posts', postId);
        
        // Get user info
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

// Get a single post by ID
export const getPostById = async (postId) => {
    try {
        const postDoc = await getDoc(doc(db, 'Posts', postId));
        if (!postDoc.exists()) {
            throw new Error('Post not found');
        }

        const postData = postDoc.data();
        // Get author information
        const userDoc = await getDoc(doc(db, 'Users', postData.userId));
        const userData = userDoc.data();

        return {
            id: postDoc.id,
            ...postData,
            username: userData.username,
            userAvatar: userData.profilePhoto
        };
    } catch (error) {
        console.error('Error getting post:', error);
        throw error;
    }
};

// Delete post
export const deletePost = async (postId, userId) => {
    try {
        const postRef = doc(db, 'Posts', postId);
        const postSnap = await getDoc(postRef);
        
        if (!postSnap.exists()) {
            throw new Error('Post not found');
        }

        const post = postSnap.data();
        
        // Check if user is authorized to delete
        if (post.userId !== userId) {
            throw new Error('Not authorized to delete this post');
        }

        // Delete media if exists
        if (post.media && post.media.length > 0) {
            for (const mediaUrl of post.media) {
                try {
                    // Convert HTTP URL to storage path
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