import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getUserProfile, updateUserProfile } from '../../Firebase/firebaseHelper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../contexts/AuthContext';

const DisplayProfileScreen = ({ route }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { userId } = route.params;
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.log('Fetching profile for userId:', userId);
        const profile = await getUserProfile(userId);
        console.log('Received profile:', profile);

        if (profile) {
          const safeProfile = {
            username: profile.username || 'No Name',
            profilePhoto: profile.profilePhoto || 'default_photo_url',
            city: profile.city || '',
            country: profile.country || '',
            occupation: profile.occupation || '',
            hobbies: profile.hobbies || '',
            personalityTags: Array.isArray(profile.personalityTags) ? profile.personalityTags : [],
            favoriteBooks: Array.isArray(profile.favoriteBooks) ? profile.favoriteBooks : [],
            favoriteMovies: Array.isArray(profile.favoriteMovies) ? profile.favoriteMovies : [],
            favoriteMusic: Array.isArray(profile.favoriteMusic) ? profile.favoriteMusic : [],
            aboutMe: profile.aboutMe || '',
          };
          console.log('Safe profile:', safeProfile);
          setUserProfile(safeProfile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user) {
        const currentUserProfile = await getUserProfile(user.email);
        setIsLiked(currentUserProfile?.likes?.includes(userId) || false);
      }
    };
    checkIfLiked();
  }, [user, userId]);

  const handleLike = async () => {
    try {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      const currentUserProfile = await getUserProfile(user.email);
      const currentLikes = currentUserProfile?.likes || [];
      
      let newLikes;
      if (newLikedState) {
        newLikes = [...new Set([...currentLikes, userId])];
      } else {
        newLikes = currentLikes.filter(id => id !== userId);
      }

      await updateUserProfile(user.email, { likes: newLikes });
    } catch (error) {
      console.error('Error updating likes:', error);
      setIsLiked(!isLiked);
      Alert.alert('Error', 'Failed to update like status');
    }
  };

  const renderSection = (title, content, isArray = false) => {
    if (!content) return null;
    if (isArray && (!Array.isArray(content) || content.length === 0)) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionText}>
          {isArray ? content.join(', ') : content}
        </Text>
      </View>
    );
  };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>No profile found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topSection}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: userProfile.profilePhoto }}
              style={styles.profilePhoto}
            />
          </View>
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={handleLike}
          >
            <Icon 
              name={isLiked ? "heart" : "heart-outline"} 
              size={40} 
              color={isLiked ? "#FF0000" : "#000000"}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{userProfile.username}</Text>
        <Text style={styles.location}>{userProfile.city}, {userProfile.country}</Text>
      </View>

      {renderSection('Occupation', userProfile.occupation)}
      {renderSection('Hobbies', userProfile.hobbies)}
      {renderSection('Personality', userProfile.personalityTags, true)}
      {renderSection('Favorite Books', userProfile.favoriteBooks, true)}
      {renderSection('Favorite Movies', userProfile.favoriteMovies, true)}
      {renderSection('Favorite Music', userProfile.favoriteMusic, true)}
      {renderSection('About Me', userProfile.aboutMe)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  topSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: 10,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  photoContainer: {
    alignItems: 'center',
  },
  likeButton: {
    position: 'absolute',
    right: 0,
    top: '80%',
    padding: 10,
  },
});

export default DisplayProfileScreen;
