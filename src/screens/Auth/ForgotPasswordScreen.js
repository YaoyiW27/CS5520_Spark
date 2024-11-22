import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity,
  TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { forgetPassworScreenStyles as styles } from '../../styles/AuthStyles';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) {
      navigation.navigate('VerifyEmail', { email });
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
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <TextInput
          style={styles.forgetPasswordInput}
          placeholder="Email"
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