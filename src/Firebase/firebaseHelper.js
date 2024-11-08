import { db } from './firebaseSetup';
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc 
} from 'firebase/firestore';

// Create new user profile
export const createUserProfile = async (email, userData) => {
    try {
        const userRef = doc(db, 'Users', email);
        await setDoc(userRef, {
            email,
            username: userData.username || '',
            profilePhoto: '',  // 暂时为空
            photowall: [],     // 暂时为空数组
            pronouns: userData.pronouns || '',
            birthday: userData.birthday || '',
            occupation: userData.occupation || '',
            city: userData.city || '',
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
export const getUserProfile = async (email) => {
    try {
        const userRef = doc(db, 'Users', email);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
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
        // Check if document exists
        const docSnap = await getDoc(userRef);
        
        if (!docSnap.exists()) {
            // If document doesn't exist, create it
            await setDoc(userRef, {
                email,
                ...updateData
            });
        } else {
            // If document exists, update it
            await updateDoc(userRef, updateData);
        }
        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
