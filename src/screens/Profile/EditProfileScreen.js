import React, { useState, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { userProfile, setUserProfile } = useContext(AuthContext);
  
  // Initialize state with values from context
  const [name, setName] = useState(userProfile.userName);
  const [pronouns, setPronouns] = useState(userProfile.pronouns);
  const [birthday, setBirthday] = useState(userProfile.birthday);
  const [occupation, setOccupation] = useState(userProfile.occupation);
  const [city, setCity] = useState(userProfile.city);
  const [hobbies, setHobbies] = useState(userProfile.hobbies);
  const [tags, setTags] = useState(userProfile.tags);
  const [books, setBooks] = useState(userProfile.books);
  const [movies, setMovies] = useState(userProfile.movies);
  const [music, setMusic] = useState(userProfile.music);
  const [aboutMe, setAboutMe] = useState(userProfile.aboutMe);

  const handleSave = () => {
    // Update all profile fields at once
    setUserProfile({
      userName: name,
      pronouns,
      birthday,
      occupation,
      city,
      hobbies,
      tags,
      books,
      movies,
      music,
      aboutMe
    });
    navigation.goBack();
  };

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
});

export default EditProfileScreen;
