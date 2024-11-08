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
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { updateUserProfile, getUserProfile } from '../../Firebase/firebaseHelper';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  
  // Initialize state with empty values
  const [name, setName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [birthday, setBirthday] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [tags, setTags] = useState('');
  const [books, setBooks] = useState('');
  const [movies, setMovies] = useState('');
  const [music, setMusic] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  // Fetch and set initial data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile(user.email);
        if (profile) {
          setName(profile.username || '');
          setPronouns(profile.pronouns || '');
          setBirthday(profile.birthday || '');
          setOccupation(profile.occupation || '');
          setCity(profile.city || '');
          setHobbies(profile.hobbies || '');
          setTags(profile.personalityTags?.join(', ') || '');
          setBooks(profile.favoriteBooks?.join(', ') || '');
          setMovies(profile.favoriteMovies?.join(', ') || '');
          setMusic(profile.favoriteMusic?.join(', ') || '');
          setAboutMe(profile.aboutMe || '');
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
        birthday,
        occupation,
        city,
        hobbies,
        personalityTags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        favoriteBooks: books.split(',').map(book => book.trim()).filter(book => book),
        favoriteMovies: movies.split(',').map(movie => movie.trim()).filter(movie => movie),
        favoriteMusic: music.split(',').map(item => item.trim()).filter(item => item),
        aboutMe
      };

      await updateUserProfile(user.email, updatedProfile);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    }
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
          <Text style={styles.photoText}>Your Photo</Text>
          <Text style={styles.photoWallText}>Photo Wall: [P1] [P2] [P3] [P4] [P5] [+]</Text>
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

          <Text style={styles.label}>Birthday</Text>
          <TextInput
            style={styles.input}
            value={birthday}
            onChangeText={setBirthday}
            placeholder="yyyy-mm-dd"
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
  photoWallText: {
    fontSize: 16,
    color: '#999',
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
});

export default EditProfileScreen;
