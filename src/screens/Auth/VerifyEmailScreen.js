import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { verifyEmailScreenStyles as styles } from '../../styles/AuthStyles';

const VerifyEmailScreen = ({ navigation, route }) => {
  const { email } = route.params || {};

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
          A magic code to sign in was sent to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <TouchableOpacity
          style={styles.emailSubmitButton}
          onPress={() => navigation.navigate('AuthOptions')}
        >
          <Text style={styles.emailSubmitButtonText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.emailResendButton}
          onPress={() => { /* Resend code */
          }}
        >
          <Text style={styles.emailResendButtonText}>Resend Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmailScreen;