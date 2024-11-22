import { db } from './firebaseSetup';
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    getDocs,
    Timestamp,
    addDoc,
    query,
    where,
    deleteDoc
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
            
            // check if any photos were removed from the photowall
            if (updateData.photowall && currentData.photowall) {
                const photosToDelete = currentData.photowall.filter(
                    photo => !updateData.photowall.includes(photo)
                );
                
                // delete photos from storage
                for (const photoUrl of photosToDelete) {
                    try {
                        const photoPath = decodeURIComponent(photoUrl.split('/o/')[1].split('?')[0]);
                        const photoRef = ref(storage, photoPath);
                        await deleteObject(photoRef);
                        console.log('Deleted photo:', photoUrl);
                    } catch (error) {
                        console.error('Error deleting photo:', error);
                    }
                }
            }
            
            // update user profile
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

// get all users
export const getAllUsers = async (currentUserEmail) => {
    try {
        const usersRef = collection(db, 'Users');
        const querySnapshot = await getDocs(usersRef);
        const users = [];
        
        querySnapshot.forEach((doc) => {
            if (doc.id !== currentUserEmail) {
                const userData = doc.data();
                users.push({
                    id: doc.id,  // make sure it's user's email
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

// uppload user profile photo
export const updateUserProfilePhoto = async (email, photoUri) => {
    try {
        // generate unique filename
        const timestamp = Date.now();
        const filename = `profile_photos/${email}/profile_${timestamp}.jpg`;
        const storageRef = ref(storage, filename);

        // get photo data
        const response = await fetch(photoUri);
        const blob = await response.blob();

        // upload photo
        await uploadBytes(storageRef, blob);

        // get download URL
        const downloadURL = await getDownloadURL(storageRef);

        // update user profile 
        const userRef = doc(db, 'Users', email);
        await updateDoc(userRef, {
            profilePhoto: downloadURL
        });

        return downloadURL;
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        throw error;
    }
};

// update user photo wall
export const updatePhotoWall = async (email, photoUri) => {
    try {
        const timestamp = Date.now();
        const filename = `photo_wall/${email}/photo_${timestamp}.jpg`;
        const storageRef = ref(storage, filename);

        const response = await fetch(photoUri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        const userRef = doc(db, 'Users', email);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const currentPhotoWall = userData.photowall || [];

        if (currentPhotoWall.length >= 3) {
            throw new Error('Maximum 3 photos allowed in photo wall');
        }

        await updateDoc(userRef, {
            photowall: [...currentPhotoWall, downloadURL]
        });

        return downloadURL;
    } catch (error) {
        console.error('Error updating photo wall:', error);
        throw error;
    }
};


// update user location
export const updateUserLocation = async (email, locationData) => {
    try {
        const userRef = doc(db, 'Users', email);
        await updateDoc(userRef, {
            location: {
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                isVirtual: locationData.isVirtual || false,
                lastUpdated: Timestamp.now()
            }
        });
        return true;
    } catch (error) {
        console.error('Error updating user location:', error);
        throw error;
    }
};

// get nearby users
export const getNearbyUsers = async (currentLocation, maxDistance = 10) => {
    try {
        const usersRef = collection(db, 'Users');
        const querySnapshot = await getDocs(usersRef);
        const nearbyUsers = [];

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.location) {
                const distance = calculateDistance(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    userData.location.latitude,
                    userData.location.longitude
                );

                if (distance <= maxDistance) {
                    const profileImage = userData.profilePhoto || 'https://via.placeholder.com/150';
                    console.log(`Fetched user: ${doc.id}, profileImage: ${profileImage}`);
                    nearbyUsers.push({
                        id: doc.id,
                        userName: userData.username || 'Unknown User',
                        profileImage,
                        age: userData.age || '',
                        gender: userData.gender || 'other',
                        location: {
                            latitude: userData.location.latitude,
                            longitude: userData.location.longitude,
                            isVirtual: userData.location.isVirtual || false 
                        },
                        distance: Math.round(distance * 10) / 10
                    });
                }
            }
        });

        // sort nearby users by distance
        return nearbyUsers.sort((a, b) => a.distance - b.distance);
    } catch (error) {
        console.error('Error getting nearby users:', error);
        throw error;
    }
};

// calculate distance between two locations
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // earth radius in km
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI/180);
}

// 添加新的提醒到 Firestore
export const addReminder = async (userEmail, reminderData) => {
    try {
        const remindersRef = collection(db, 'reminders');
        const docRef = await addDoc(remindersRef, {
            userEmail,
            description: reminderData.description,
            date: reminderData.date,
            status: reminderData.status,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding reminder:', error);
        throw error;
    }
};

// 获取用户的所有提醒
export const getUserReminders = async (userEmail) => {
    try {
        const remindersRef = collection(db, 'reminders');
        const q = query(remindersRef, where('userEmail', '==', userEmail));
        const querySnapshot = await getDocs(q);
        
        const reminders = [];
        querySnapshot.forEach((doc) => {
            reminders.push({
                id: doc.id,
                ...doc.data(),
                date: new Date(doc.data().date)
            });
        });
        
        return reminders;
    } catch (error) {
        console.error('Error getting reminders:', error);
        throw error;
    }
};

// 删除提醒
export const deleteReminder = async (reminderId) => {
    try {
        const reminderRef = doc(db, 'reminders', reminderId);
        await deleteDoc(reminderRef);
    } catch (error) {
        console.error('Error deleting reminder:', error);
        throw error;
    }
};

// 更新提醒状态
export const updateReminderStatus = async (reminderId, status) => {
    try {
        const reminderRef = doc(db, 'reminders', reminderId);
        await updateDoc(reminderRef, { status });
    } catch (error) {
        console.error('Error updating reminder status:', error);
        throw error;
    }
};