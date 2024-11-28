import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { createUserProfile } from '../../Firebase/firebaseHelper';
import { auth } from '../../Firebase/firebaseSetup';
import { useAuth } from '../../contexts/AuthContext';

const CompleteProfileScreen = () => {
  const navigation = useNavigation();
  const { setUserProfile, setProfileComplete } = useAuth(); 
  
  // Form states
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch user's location using GeoJS API when component mounts (External API)
    const fetchLocation = async () => {
      setLoadingLocation(true);
      try {
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data = await response.json();
        setLocation(`${data.city}, ${data.country}`);
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Location Error', 'Failed to fetch location. Please enter manually.');
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchLocation();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !gender || !age.trim() || !location.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      setIsSubmitting(true); 
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      // Split location into city and country
      const [city, country] = location.split(',').map(str => str.trim());

      const userData = {
        name,
        gender,
        age,
        location,
        username: name,
        city,
        country,
      };
  
      await createUserProfile(currentUser.email, userData);
      setUserProfile(userData);
      setProfileComplete(true);
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Please provide the following information to continue
        </Text>

        {/* Name Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            editable={!isSubmitting} 
          />
        </View>

        {/* Gender Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              enabled={!isSubmitting}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Non-binary" value="Non-binary" />
            </Picker>
          </View>
        </View>

        {/* Age Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            value={age}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '');
              setAge(numericText);
            }}
            editable={!isSubmitting}
            keyboardType="numeric"
          />
        </View>

        {/* Location Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Location</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.input}
              placeholder="City, Country"
              value={location}
              onChangeText={setLocation}
              editable={!loadingLocation && !isSubmitting}
            />
            {loadingLocation && (
              <ActivityIndicator 
                style={styles.locationLoader} 
                size="small" 
                color="#FF69B4" 
              />
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Continue</Text>
          )}
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
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  pickerContainer: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
  },
  locationLoader: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  submitButton: {
    backgroundColor: '#FF69B4',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  submitButtonDisabled: {
    backgroundColor: '#ffb6c1',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CompleteProfileScreen;