import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { updateUserProfile, getUserProfile, updatePhotoWall } from '../../Firebase/firebaseHelper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { editProfileScreenStyles as styles } from '../../styles/ProfileStyles';
import TagSelector from '../../components/TagSelector';


const HOBBY_SUGGESTIONS = [
  'Reading', 'Travel', 'Photography', 'Cooking', 'Gaming',
  'Music', 'Sports', 'Art', 'Movies', 'Dancing'
];

const PERSONALITY_SUGGESTIONS = [
  'Outgoing', 'Creative', 'Adventurous', 'Calm', 'Funny',
  'Ambitious', 'Caring', 'Optimistic', 'Intellectual', 'Romantic'
];

const MOVIE_SUGGESTIONS = [
  'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Romance',
  'Horror', 'Documentary', 'Animation', 'Thriller', 'Fantasy'
];

const MUSIC_SUGGESTIONS = [
  'Pop', 'Rock', 'Jazz', 'Classical', 'Hip Hop',
  'R&B', 'Country', 'Electronic', 'Folk', 'Metal'
];

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  
  // Initialize state with empty values
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [tags, setTags] = useState('');
  const [books, setBooks] = useState('');
  const [movies, setMovies] = useState('');
  const [music, setMusic] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [photoWall, setPhotoWall] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch and set initial data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile(user.email);
        if (profile) {
          setName(profile.username || '');
          setGender(profile.gender || '');
          setPronouns(profile.pronouns || '');
          setAge(profile.age || '');
          setOccupation(profile.occupation || '');
          setCity(profile.city || '');
          setCountry(profile.country || '');
          setHobbies(profile.hobbies || '');
          setTags(profile.personalityTags?.join(', ') || '');
          setBooks(profile.favoriteBooks?.join(', ') || '');
          setMovies(profile.favoriteMovies?.join(', ') || '');
          setMusic(profile.favoriteMusic?.join(', ') || '');
          setAboutMe(profile.aboutMe || '');
          setPhotoWall(profile.photowall || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user.email]);

  const handleSave = async () => {
    try {
      const updatedProfile = {
        username: name,
        gender,
        pronouns,
        age,
        occupation,
        city,
        country,
        hobbies,
        personalityTags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        favoriteBooks: books.split(',').map(book => book.trim()).filter(book => book),
        favoriteMovies: movies.split(',').map(movie => movie.trim()).filter(movie => movie),
        favoriteMusic: music.split(',').map(item => item.trim()).filter(item => item),
        aboutMe,
        photowall: photoWall
      };

      await updateUserProfile(user.email, updatedProfile);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handlePhotoWallUpload = async () => {
    try {
        // Check if the local state already has 3 photos
        if (photoWall.length >= 3) {
            Alert.alert('Limit Reached', 'Maximum 3 photos allowed in photo wall');
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant permission to access your photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
            compress: 0.5,
        });

        if (!result.canceled && result.assets[0].uri) {
            setUploading(true);
            try {
                // Upload photo and update the photo wall
                const photoURL = await updatePhotoWall(user.email, result.assets[0].uri);
                setPhotoWall([...photoWall, photoURL]);
            } catch (uploadError) {
                // Handle errors from `updatePhotoWall`
                if (uploadError.message.includes('Maximum 3 photos allowed')) {
                    Alert.alert('Limit Reached', 'You cannot upload more than 3 photos.');
                } else {
                    Alert.alert('Error', 'Failed to upload photo. Please try again.');
                }
            }
            setUploading(false);
        }
    } catch (error) {
        Alert.alert('Error', 'Failed to upload photo');
        setUploading(false);
    }
};

  const handleDeletePhoto = async (photoUrl, index) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // First update local state
              const newPhotoWall = photoWall.filter((_, i) => i !== index);
              setPhotoWall(newPhotoWall);

              // Update the user's profile in the database with the new photowall
              await updateUserProfile(user.email, { photowall: newPhotoWall });

              // The photo deletion from storage is handled inside updateUserProfile
              // when it detects that a photo has been removed from the photowall array
            } catch (error) {
              console.error('Error deleting photo:', error);
              Alert.alert('Error', 'Failed to delete photo');
              // Revert local state if database update fails
              setPhotoWall(photoWall);
            }
          }
        }
      ]
    );
  };

  const handleCameraPress = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your camera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
        compress: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        setUploading(true);
        try {
          const photoURL = await updatePhotoWall(user.email, result.assets[0].uri);
          setPhotoWall([...photoWall, photoURL]);
        } catch (error) {
          console.error('Error uploading photo:', error);
          Alert.alert('Error', 'Failed to upload photo');
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // 将字符串转换为数组的辅助函数
  const stringToArray = (str) => str.split(',').map(item => item.trim()).filter(Boolean);
  const arrayToString = (arr) => arr.join(', ');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.photoSection}>
          <Text style={styles.photoText}>Your Profile Details</Text>
          
          <View style={styles.photoWallHeader}>
            <Text style={styles.photoWallTitle}>Photo Wall</Text>
            <Text style={styles.photoWallDescription}>
              Add up to 3 photos to showcase your interests and lifestyle
            </Text>
          </View>

          <View style={styles.photoWallContainer}>
            <View style={styles.photoRow}>
              {photoWall.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image
                    source={{ uri: photo }}
                    style={styles.photoWallImage}
                  />
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeletePhoto(photo, index)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            {photoWall.length < 3 && (
              <View style={styles.addButtonsRow}>
                <TouchableOpacity
                  style={[styles.addPhotoButton, styles.cameraButton]}
                  onPress={handleCameraPress}
                  disabled={uploading}
                >
                  <Ionicons name="camera" size={24} color="#FF69B4" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handlePhotoWallUpload}
                  disabled={uploading}
                >
                  <Text style={styles.addPhotoButtonText}>
                    {uploading ? 'Uploading...' : '+'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>User Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
            placeholder="Enter your gender"
          />

          <Text style={styles.label}>Pronouns</Text>
          <TextInput
            style={styles.input}
            value={pronouns}
            onChangeText={setPronouns}
            placeholder="Enter your pronouns"
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
          />

          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.input}
            value={occupation}
            onChangeText={setOccupation}
            placeholder="Enter your occupation"
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Enter your city"
          />

          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder="Enter your country"
          />

          <Text style={styles.label}>Hobbies & Interests</Text>
          <TagSelector
            suggestions={HOBBY_SUGGESTIONS}
            selectedTags={stringToArray(hobbies)}
            onTagsChange={(tags) => setHobbies(arrayToString(tags))}
            placeholder="Add a hobby..."
          />

          <Text style={styles.label}>Personality Tags</Text>
          <TagSelector
            suggestions={PERSONALITY_SUGGESTIONS}
            selectedTags={stringToArray(tags)}
            onTagsChange={(tags) => setTags(arrayToString(tags))}
            placeholder="Add a personality trait..."
          />

          <Text style={styles.label}>Favorite Books</Text>
          <TextInput
            style={styles.input}
            value={books}
            onChangeText={setBooks}
            placeholder="Enter your favorite books"
          />

          <Text style={styles.label}>Favorite Movies/Genres</Text>
          <TagSelector
            suggestions={MOVIE_SUGGESTIONS}
            selectedTags={stringToArray(movies)}
            onTagsChange={(tags) => setMovies(arrayToString(tags))}
            placeholder="Add a movie or genre..."
          />

          <Text style={styles.label}>Favorite Music</Text>
          <TagSelector
            suggestions={MUSIC_SUGGESTIONS}
            selectedTags={stringToArray(music)}
            onTagsChange={(tags) => setMusic(arrayToString(tags))}
            placeholder="Add a music genre..."
          />

          <Text style={styles.label}>About Me</Text>
          <TextInput
            style={[styles.input, styles.aboutMeInput]}
            value={aboutMe}
            onChangeText={setAboutMe}
            placeholder="Write something about yourself"
            multiline
            onEndEditing={() => Keyboard.dismiss()}
            blurOnSubmit={true}
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
