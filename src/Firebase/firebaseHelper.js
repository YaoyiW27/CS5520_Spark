import { db } from './firebaseSetup';
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    getDocs 
} from 'firebase/firestore';

// 设置默认头像 URL 常量
const DEFAULT_PROFILE_PHOTO = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';

// Create new user profile
export const createUserProfile = async (email, userData) => {
    try {
        const userRef = doc(db, 'Users', email);
        await setDoc(userRef, {
            email,
            username: userData.username || '',
            profilePhoto: DEFAULT_PROFILE_PHOTO,  // 使用默认头像
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
            // If document doesn't exist, create it with default photo
            await setDoc(userRef, {
                email,
                profilePhoto: DEFAULT_PROFILE_PHOTO,  // 确保新创建的文档也有默认头像
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

// 获取所有用户
export const getAllUsers = async (currentUserEmail) => {
    try {
        const usersRef = collection(db, 'Users');
        const querySnapshot = await getDocs(usersRef);
        const users = [];
        
        querySnapshot.forEach((doc) => {
            // 不包含当前用户
            if (doc.id !== currentUserEmail) {
                users.push({
                    id: doc.id,
                    name: doc.data().username,  // 匹配现有的卡片显示格式
                    age: doc.data().birthday,   // 使用生日字段
                    city: doc.data().city,
                    country: doc.data().country,
                    image: doc.data().profilePhoto
                });
            }
        });
        
        return users.sort(() => Math.random() - 0.5);  // 随机排序
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
};

