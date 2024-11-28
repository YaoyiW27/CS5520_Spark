import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { loginScreenStyles as styles } from '../../styles/AuthStyles';

const LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.loginContainer}>
      <View style={styles.loginContent}>
        {/* Spark title with pink glitter animation */}
        <View style={styles.sparkContainer}>
          <LottieView
            source={require('../../../assets/sparkle.json')} // Glitter animation
            autoPlay
            loop
            style={[styles.sparkAnimation, { tintColor: '#FF69B4' }]}
          />
          <Text style={styles.sparkTitle}>Spark</Text>
        </View>

        {/* Main title */}
        <Text style={styles.loginTitle}>Start Your Dating{'\n'}Journey Today 💗</Text>

        {/* Features section */}
        <View style={styles.loginFeatures}>
          <View style={styles.loginFeatureItem}>
            <FontAwesome name="magic" size={40} color="#666" style={styles.loginFeatureIcon} />
            <Text style={styles.loginFeatureText}>Smart Matching{'\n'}Algorithm</Text>
          </View>
          <View style={styles.loginFeatureItem}>
            <MaterialIcons name="people" size={40} color="#666" style={styles.loginFeatureIcon} />
            <Text style={styles.loginFeatureText}>Interactive{'\n'}Profiles</Text>
          </View>
          <View style={styles.loginFeatureItem}>
            <FontAwesome name="lock" size={40} color="#666" style={styles.loginFeatureIcon} />
            <Text style={styles.loginFeatureText}>Safe and Secure{'\n'}Environment</Text>
          </View>
        </View>

        {/* Get Started button */}
        <TouchableOpacity
          style={styles.loginSignupButton}
          onPress={() => navigation.navigate('AuthOptions')}
        >
          <Text style={styles.loginButtonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Terms and conditions */}
        <Text style={styles.loginTerms}>
          By signing in you agree to our{'\n'}
          <Text style={styles.loginTermsLink}>Terms & Conditions</Text> and{' '}
          <Text style={styles.loginTermsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;