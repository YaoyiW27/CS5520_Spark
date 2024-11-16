import { db } from './firebaseSetup';
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    getDocs 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebaseSetup';

// set default profile photo
const DEFAULT_PROFILE_PHOTO = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';

// Create new user profile
export const createUserProfile = async (email, userData) => {
    try {
        const userRef = doc(db, 'Users', email);
        await setDoc(userRef, {
            email,
            username: userData.username || '',
            profilePhoto: DEFAULT_PROFILE_PHOTO,  // use default avatar
            photowall: [],     
            pronouns: userData.pronouns || '',
            age: userData.age || '',
            occupation: userData.occupation || '',
            city: userData.city || '',
            country: userData.country || '',
            hobbies: userData.hobbies || '',
            personalityTags: userData.personalityTags || [],
            favoriteBooks: userData.favoriteBooks || [],
            favoriteMovies: userData.favoriteMovies || [],
            favoriteMusic: userData.favoriteMusic || [],
            aboutMe: userData.aboutMe || '',
            likes: userData.likes || [],
        });
        return true;
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

// Get user profile
export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, 'Users', userId);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const userData = docSnap.data();
            // ensure the returned data includes all necessary fields and array fields have default values
            return {
                email: userId,
                username: userData.username || '',
                profilePhoto: userData.profilePhoto || '',
                photowall: userData.photowall || [],
                pronouns: userData.pronouns || '',
                age: userData.age || '',
                occupation: userData.occupation || '',
                city: userData.city || '',
                country: userData.country || '',
                hobbies: userData.hobbies || '',
                personalityTags: userData.personalityTags || [],
                favoriteBooks: userData.favoriteBooks || [],
                favoriteMovies: userData.favoriteMovies || [],
                favoriteMusic: userData.favoriteMusic || [],
                aboutMe: userData.aboutMe || '',
                likes: userData.likes || [],
            };
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (email, updateData) => {
    try {
        const userRef = doc(db, 'Users', email);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const currentData = docSnap.data();
            
            // 如果有 photowall 数据，检查是否需要删除照片
            if (updateData.photowall && currentData.photowall) {
                const photosToDelete = currentData.photowall.filter(
                    photo => !updateData.photowall.includes(photo)
                );
                
                // 删除不再使用的照片
                for (const photoUrl of photosToDelete) {
                    try {
                        // 从 URL 中提取存储路径
                        const photoPath = decodeURIComponent(photoUrl.split('/o/')[1].split('?')[0]);
                        const photoRef = ref(storage, photoPath);
                        await deleteObject(photoRef);
                        console.log('Deleted photo:', photoUrl);
                    } catch (error) {
                        console.error('Error deleting photo:', error);
                    }
                }
            }
            
            // 更新用户数据
            await updateDoc(userRef, updateData);
        } else {
            await setDoc(userRef, {
                email,
                ...updateData
            });
        }
        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

// 获取所有用户
export const getAllUsers = async (currentUserEmail) => {
    try {
        const usersRef = collection(db, 'Users');
        const querySnapshot = await getDocs(usersRef);
        const users = [];
        
        querySnapshot.forEach((doc) => {
            // 不包含当前用户
            if (doc.id !== currentUserEmail) {
                const userData = doc.data();
                users.push({
                    id: doc.id,  // 确保这是邮箱
                    name: userData.username || 'No Name',
                    age: userData.age || '',
                    city: userData.city || '',
                    country: userData.country || '',
                    image: userData.profilePhoto || '',
                });
            }
        });
        
        console.log('Fetched users:', users);  
        return users.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
};

export const updateUserProfilePhoto = async (email, photoUri) => {
    try {
        // Create a reference to the user's profile photo
        const storageRef = ref(storage, `profile_photos/${email}/profile.jpg`);
        
        // Convert URI to blob
        const response = await fetch(photoUri);
        const blob = await response.blob();
        
        // Upload photo to Firebase Storage
        await uploadBytes(storageRef, blob);
        
        // Get the download URL
        const photoURL = await getDownloadURL(storageRef);
        
        // Update user profile with new photo URL using profilePhoto field
        await updateUserProfile(email, { profilePhoto: photoURL });
        
        return photoURL;
    } catch (error) {
        console.error('Error updating profile photo:', error);
        throw error;
    }
};

export const updatePhotoWall = async (email, photoUri) => {
    try {
        // Create a unique filename using timestamp
        const timestamp = Date.now();
        const storageRef = ref(storage, `photo_wall/${email}/${timestamp}.jpg`);
        
        // Convert URI to blob
        const response = await fetch(photoUri);
        const blob = await response.blob();
        
        // Upload photo to Firebase Storage
        await uploadBytes(storageRef, blob);
        
        // Get the download URL
        const photoURL = await getDownloadURL(storageRef);
        
        // Get current user profile
        const userRef = doc(db, 'Users', email);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const currentPhotoWall = userData.photowall || [];
            
            // Check if maximum photos limit reached
            if (currentPhotoWall.length >= 3) {
                throw new Error('Maximum 3 photos allowed in photo wall');
            }
            
            // Add new photo URL to photowall array
            await updateDoc(userRef, {
                photowall: [...currentPhotoWall, photoURL]
            });
        }
        
        return photoURL;
    } catch (error) {
        console.error('Error updating photo wall:', error);
        throw error;
    }
};

