import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getUserProfile } from '../../Firebase/firebaseHelper';

const DisplayProfileScreen = ({ route }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = route.params;

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
        <Image
          source={{ uri: userProfile.profilePhoto }}
          style={styles.profilePhoto}
        />
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
});

export default DisplayProfileScreen;
