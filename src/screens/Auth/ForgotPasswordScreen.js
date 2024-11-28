import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { forgetPassworScreenStyles as styles } from '../../styles/AuthStyles';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../Firebase/firebaseSetup';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // email sent successfully
          navigation.navigate('VerifyEmail', { email });
        })
        .catch((error) => {
          // error occurred
          const errorMessage = error.message;
          console.error('Error sending password reset email:', errorMessage);
          Alert.alert('Failed to send email, please check if your email address is correct.');
        });
    } else {
      Alert.alert('Tip', 'Please enter your email address.');
    }
  };

  return (
    <SafeAreaView style={styles.forgetPasswordContainer}>
      <View style={styles.forgetPasswordHeader}>
        <TouchableOpacity 
          style={styles.forgetPasswordBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.forgetPasswordHeaderTitle}>Forgot Password</Text>
      </View>

      <View style={styles.forgetPasswordContent}>
        <View style={styles.forgetPasswordIconContainer}>
          <Ionicons name="lock-closed" size={50} color="#FF69B4" />
        </View>
        <Text style={styles.forgetPasswordTitle}>Reset Password</Text>
        <Text style={styles.forgetPasswordSubtitle}>
          Please enter your email address to receive a password reset link.
        </Text>

        <TextInput
          style={styles.forgetPasswordInput}
          placeholder="email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.forgetPasswordSubmitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.forgetPasswordSubmitButtonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgetPasswordReturnButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.forgetPasswordReturnButtonText}>Return to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;