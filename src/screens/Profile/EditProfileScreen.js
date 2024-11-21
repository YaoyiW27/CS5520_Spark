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

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  
  // Initialize state with empty values
  const [name, setName] = useState('');
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
        // mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
        compress: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        setUploading(true);
        const photoURL = await updatePhotoWall(user.email, result.assets[0].uri);
        setPhotoWall([...photoWall, photoURL]);
        setUploading(false);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo');
      setUploading(false);
    }
  };

  const handleDeletePhoto = (photoUrl, index) => {
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
          onPress: () => {
            const newPhotoWall = photoWall.filter((_, i) => i !== index);
            setPhotoWall(newPhotoWall);
          }
        }
      ]
    );
  };

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
            {photoWall.length < 3 && (
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={handlePhotoWallUpload}
                disabled={uploading}
              >
                <Text style={styles.addPhotoButtonText}>
                  {uploading ? 'Uploading...' : '+'}
                </Text>
              </TouchableOpacity>
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
          <TextInput
            style={styles.input}
            value={hobbies}
            onChangeText={setHobbies}
            placeholder="Enter your hobbies and interests"
          />

          <Text style={styles.label}>Personality Tags</Text>
          <TextInput
            style={styles.input}
            value={tags}
            onChangeText={setTags}
            placeholder="Add personality tags"
          />

          <Text style={styles.label}>Favorite Books</Text>
          <TextInput
            style={styles.input}
            value={books}
            onChangeText={setBooks}
            placeholder="Enter your favorite books"
          />

          <Text style={styles.label}>Favorite Movies/Actors</Text>
          <TextInput
            style={styles.input}
            value={movies}
            onChangeText={setMovies}
            placeholder="Enter your favorite movies or actors"
          />

          <Text style={styles.label}>Favorite Music</Text>
          <TextInput
            style={styles.input}
            value={music}
            onChangeText={setMusic}
            placeholder="Enter your favorite music"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  photoWallContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  photoWallImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addPhotoButtonText: {
    fontSize: 30,
    color: '#FF69B4',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF69B4',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  aboutMeInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FF69B4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWallHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  photoWallTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  photoWallDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  photoWrapper: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default EditProfileScreen;
