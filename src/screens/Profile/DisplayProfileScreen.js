import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  Text, 
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { getUserProfile } from '../../Firebase/firebaseHelper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DisplayProfileScreen = ({ route }) => {
  const { userEmail } = route.params;
  const [profile, setProfile] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile(userEmail);
        setProfile(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail]);

  const calculateAge = (birthday) => {
    if (!birthday) return '';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality with backend
  };

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Like Button */}
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={handleLike}
        >
          <Icon 
            name={isLiked ? "heart" : "heart-outline"} 
            size={30} 
            color={isLiked ? "#FF0000" : "#000000"}
          />
        </TouchableOpacity>

        {/* Profile Photo Placeholder */}
        <View style={styles.photoSection}>
          <View style={styles.photoPlaceholder}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.basicInfo}>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.subInfo}>
            {calculateAge(profile.birthday)}{profile.city ? `, ${profile.city}` : ''}
          </Text>
        </View>

        {/* Photo Wall */}
        <View style={styles.photoWallSection}>
          <Text style={styles.sectionTitle}>Photo Wall</Text>
          <Text style={styles.photoWallText}>Photo Wall: [P1] [P2] [P3] [P4] [P5] [+]</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          {profile.pronouns && (
            <View style={styles.detailSection}>
              <Text style={styles.label}>Pronouns</Text>
              <Text style={styles.value}>{profile.pronouns}</Text>
            </View>
          )}

          {profile.occupation && (
            <View style={styles.detailSection}>
              <Text style={styles.label}>Occupation</Text>
              <Text style={styles.value}>{profile.occupation}</Text>
            </View>
          )}

          {profile.hobbies && (
            <View style={styles.detailSection}>
              <Text style={styles.label}>Hobbies & Interests</Text>
              <Text style={styles.value}>{profile.hobbies}</Text>
            </View>
          )}

          {profile.personalityTags?.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.label}>Personality Tags</Text>
              <Text style={styles.value}>{profile.personalityTags.join(', ')}</Text>
            </View>
          )}

          {profile.favoriteBooks?.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.label}>Favorite Books</Text>
              <Text style={styles.value}>{profile.favoriteBooks.join(', ')}</Text>
            </View>
          )}

          {profile.favoriteMovies?.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.label}>Favorite Movies/Actors</Text>
              <Text style={styles.value}>{profile.favoriteMovies.join(', ')}</Text>
            </View>
          )}

          {profile.favoriteMusic?.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.label}>Favorite Music</Text>
              <Text style={styles.value}>{profile.favoriteMusic.join(', ')}</Text>
            </View>
          )}

          {profile.aboutMe && (
            <View style={styles.detailSection}>
              <Text style={styles.label}>About Me</Text>
              <Text style={styles.value}>{profile.aboutMe}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 40,
    color: '#999',
  },
  basicInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subInfo: {
    fontSize: 16,
    color: '#666',
  },
  photoWallSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  photoWallText: {
    fontSize: 16,
    color: '#999',
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});

export default DisplayProfileScreen;
