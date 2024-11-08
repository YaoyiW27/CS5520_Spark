import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout, userName } = useContext(AuthContext);
  // Dummy data - replace with real data later
  const likesCount = 3;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Photo Section */}
        <View style={styles.photoContainer}>
          <View style={styles.photoPlaceholder}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
        </View>

        {/* Name Section */}
        <Text style={styles.nameText}>{userName}</Text>

        {/* Likes Section */}
        <TouchableOpacity 
          style={styles.likesContainer}
          onPress={() => navigation.navigate('LikedListScreen')}
        >
          <Text style={styles.likesText}>♥ Like {likesCount}</Text>
        </TouchableOpacity>

        {/* Buttons Section */}
        <TouchableOpacity style={styles.button} disabled>
          <Text style={styles.buttonText}>Edit Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('EditProfileScreen')}
        >
          <Text style={styles.buttonText}>Edit Profile Detail</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={logout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF69B4',
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FF69B4',
    fontSize: 16,
  },
  photoContainer: {
    marginTop: 20,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 30,
    color: '#666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#000',
  },
  likesContainer: {
    marginTop: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFE4E1', // Light pink
  },
  likesText: {
    color: '#FF69B4', // Hot pink
  },

});

export default ProfileScreen;