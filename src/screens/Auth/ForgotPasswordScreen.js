import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) {
      navigation.navigate('VerifyEmail', { email });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={50} color="#FF69B4" />
        </View>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.returnButtonText}>Return to Login</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#FF69B4',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  returnButton: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;