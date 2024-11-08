import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  Text, 
  TextInput, 
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('TextName');
    const [bio, setBio] = useState('');
  
    const handleSave = () => {
      // TODO: Implement save functionality
      navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#999"
              />

        <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Write something about yourself"
            placeholderTextColor="#999"
            multiline
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
    },
    inputContainer: {
      flex: 1,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
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
      bioInput: {
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