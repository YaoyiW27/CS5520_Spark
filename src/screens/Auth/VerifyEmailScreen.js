import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { verifyEmailScreenStyles as styles } from '../../styles/AuthStyles';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../Firebase/firebaseSetup';

const VerifyEmailScreen = ({ navigation, route }) => {
  const { email } = route.params || {};
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Error', 'Email address is missing.');
      return;
    }

    setIsResending(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Success', 
        'Password reset email has been resent successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error resending password reset email:', error);
      Alert.alert(
        'Error',
        'Failed to resend email. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.emailContainer}>
      <View style={styles.emailHeader}>
        <TouchableOpacity 
          style={styles.emailBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.emailHeaderTitle}>Verify Email</Text>
      </View>

      <View style={styles.emailContent}>
        <View style={styles.emailIconContainer}>
          <Ionicons name="mail" size={50} color="#FF69B4" />
        </View>
        <Text style={styles.emailTitle}>Email Sent!</Text>
        <Text style={styles.emailSubtitle}>
          A password reset link has been sent to:{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>
        <Text style={styles.emailInstructions}>
          Please check your email inbox and click the reset link to set a new password.
          If you don't see the email, please check your spam folder.
        </Text>

        <TouchableOpacity
          style={styles.emailSubmitButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.emailSubmitButtonText}>Return to Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.emailResendButton,
            isResending && styles.emailResendButtonDisabled
          ]}
          onPress={handleResend}
          disabled={isResending}
        >
          {isResending ? (
            <ActivityIndicator color="#FF69B4" />
          ) : (
            <Text style={styles.emailResendButtonText}>
              Resend Reset Link
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmailScreen;