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
    deleteDoc,
    orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebaseSetup';

// Set default profile photo
const DEFAULT_PROFILE_PHOTO = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';

// Create new user profile
export const createUserProfile = async (email, userData) => {
    try {
        const userRef = doc(db, 'Users', email);
        await setDoc(userRef, {
            email,
            username: userData.username || '',
            profilePhoto: DEFAULT_PROFILE_PHOTO,  // Use default avatar
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
            // Include location field (optional)
            location: userData.location || null,
            gender: userData.gender || '',  // Added gender field
            name: userData.name || '',      // Added name field
            likedBy: userData.likedBy || [],
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
            // Ensure the returned data includes all necessary fields and array fields have default values
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
                location: userData.location || null,  // Include location field
                gender: userData.gender || '',        // Include gender field
                name: userData.name || '',            // Include name field
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
            
            // Check if any photos were removed from the photowall
            if (updateData.photowall && currentData.photowall) {
                const photosToDelete = currentData.photowall.filter(
                    photo => !updateData.photowall.includes(photo)
                );
                
                // Delete photos from storage
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
            
            // Update user profile
            await updateDoc(userRef, updateData);
        } else {
            // If the user document doesn't exist, create it with the provided data
            await setDoc(userRef, {
                email,
                profilePhoto: DEFAULT_PROFILE_PHOTO,  // Use default avatar
                photowall: [],
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

        // Check if the photo limit is exceeded
        if (currentPhotoWall.length >= 3) {
            throw new Error('Maximum 3 photos allowed in photo wall');
        }

        await updateDoc(userRef, {
            photowall: [...currentPhotoWall, downloadURL]
        });

        return downloadURL;
    } catch (error) {
        throw error; // Keep throwing the error for the caller to handle it
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

// add reminder
export const addReminder = async (userEmail, reminderData) => {
    try {
        const remindersRef = collection(db, 'reminders');
        const docRef = await addDoc(remindersRef, {
            userEmail,
            matchId: reminderData.matchId,
            matchName: reminderData.matchName,
            location: reminderData.location,
            date: reminderData.date,
            alertType: reminderData.alertType,
            reminderStatus: 'pending',
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding reminder:', error);
        throw error;
    }
};

// get user reminders
export const getUserReminders = async (userEmail) => {
    try {
        const remindersRef = collection(db, 'reminders');
        const q = query(
            remindersRef, 
            where('userEmail', '==', userEmail),
            orderBy('date', 'desc')  // add order by date
        );
        
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

// delete reminder
export const deleteReminder = async (reminderId) => {
    try {
        const reminderRef = doc(db, 'reminders', reminderId);
        await deleteDoc(reminderRef);
    } catch (error) {
        console.error('Error deleting reminder:', error);
        throw error;
    }
};


// update reminder status
export const updateReminderStatus = async (reminderId, reminderStatus) => {
    try {
        const reminderRef = doc(db, 'reminders', reminderId);
        await updateDoc(reminderRef, { reminderStatus });
    } catch (error) {
        console.error('Error updating reminder status:', error);
        throw error;
    }
};

// update likedBy list
export const updateUserLikedBy = async (userId, likedByUserId, isLiking) => {
    try {
        const userRef = doc(db, 'Users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            let likedBy = userData.likedBy || [];
            
            if (isLiking && !likedBy.includes(likedByUserId)) {
                likedBy.push(likedByUserId);
            } else if (!isLiking) {
                likedBy = likedBy.filter(id => id !== likedByUserId);
            }
            
            await updateDoc(userRef, { likedBy });
        }
    } catch (error) {
        console.error('Error updating likedBy list:', error);
        throw error;
    }
};

// check if mutual likes
export const checkMatch = async (user1Id, user2Id) => {
    try {
        const user1Doc = await getDoc(doc(db, 'Users', user1Id));
        const user2Doc = await getDoc(doc(db, 'Users', user2Id));
        
        const user1Data = user1Doc.data();
        const user2Data = user2Doc.data();
        
        return user1Data.likes?.includes(user2Id) && user2Data.likes?.includes(user1Id);
    } catch (error) {
        console.error('Error checking match:', error);
        throw error;
    }
};

// check if two users have an existing match
const checkExistingMatch = async (user1Id, user2Id) => {
    try {
        const matchesRef = collection(db, 'matches');
        const q = query(
            matchesRef,
            where('users', 'array-contains', user1Id)
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.find(doc => {
            const data = doc.data();
            return data.users.includes(user2Id);
        });
    } catch (error) {
        console.error('Error checking existing match:', error);
        throw error;
    }
};

// create or delete match
export const handleMatch = async (user1Id, user2Id) => {
    try {
        const isMatched = await checkMatch(user1Id, user2Id);
        const existingMatch = await checkExistingMatch(user1Id, user2Id);

        if (isMatched && !existingMatch) {
            // if matched and no match record, create new match
            const matchesRef = collection(db, 'matches');
            const timestamp = new Date().toISOString();
            
            const user1Profile = await getUserProfile(user1Id);
            const user2Profile = await getUserProfile(user2Id);
            
            await addDoc(matchesRef, {
                users: [user1Id, user2Id],
                user1Name: user1Profile.username,
                user2Name: user2Profile.username,
                timestamp,
                isRead: {
                    [user1Id]: false,
                    [user2Id]: false
                }
            });
        } else if (!isMatched && existingMatch) {
            // if not matched but there is a match record, delete the record
            await deleteDoc(doc(db, 'matches', existingMatch.id));
        }
    } catch (error) {
        console.error('Error handling match:', error);
        throw error;
    }
};

// update user likes list
export const updateUserLikes = async (userId, likedUserId, isLiking) => {
    try {
        const userRef = doc(db, 'Users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            let likes = userData.likes || [];
            
            if (isLiking && !likes.includes(likedUserId)) {
                likes.push(likedUserId);
            } else if (!isLiking) {
                likes = likes.filter(id => id !== likedUserId);
            }
            
            await updateDoc(userRef, { likes });
            
            // handle match status
            await handleMatch(userId, likedUserId);
            
            // update the other user's likedBy list
            await updateUserLikedBy(likedUserId, userId, isLiking);
        }
    } catch (error) {
        console.error('Error updating likes:', error);
        throw error;
    }
};

// get match notifications
export const getMatchNotifications = async (userId) => {
    try {
        const matchesRef = collection(db, 'matches');
        const q = query(
            matchesRef,
            where('users', 'array-contains', userId),
            orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const notifications = [];
        
        querySnapshot.forEach((doc) => {
            notifications.push({
                id: doc.id,
                ...doc.data(),
                timestamp: new Date(doc.data().timestamp)  // ensure timestamp format is correct
            });
        });
        
        return notifications;
    } catch (error) {
        console.error('Error getting match notifications:', error);
        throw error;
    }
};

// mark notification as read
export const markNotificationAsRead = async (notificationId, userId) => {
    try {
        const notificationRef = doc(db, 'matches', notificationId);
        // get current document data
        const docSnap = await getDoc(notificationRef);
        if (docSnap.exists()) {
            const currentData = docSnap.data();
            const updatedIsRead = {
                ...currentData.isRead,
                [userId]: true
            };
            // update the whole isRead object
            await updateDoc(notificationRef, {
                isRead: updatedIsRead
            });
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

// add date invitation notification
export const addDateInvitation = async (senderEmail, receiverEmail, dateDetails) => {
  try {
    const notificationRef = collection(db, 'dateInvitations');
    await addDoc(notificationRef, {
      senderEmail,
      receiverEmail,
      dateDetails: {
        senderName: dateDetails.senderName,
        location: dateDetails.location,
        date: dateDetails.date
      },
      createdAt: new Date().toISOString(),
      isRead: {
        [receiverEmail]: false
      }
    });
  } catch (error) {
    console.error('Error adding date invitation:', error);
    throw error;
  }
};