import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Start Your Dating{'\n'}Journey Today!</Text>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <FontAwesome name="magic" size={40} color="#666" style={styles.featureIcon} />
            <Text style={styles.featureText}>Smart Matching{'\n'}Algorithm</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="people" size={40} color="#666" style={styles.featureIcon} />
            <Text style={styles.featureText}>Interactive{'\n'}Profiles</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="lock" size={40} color="#666" style={styles.featureIcon} />
            <Text style={styles.featureText}>Safe and Secure{'\n'}Environment</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('AuthOptions')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By signing in you agree to our{'\n'}
          <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
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
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  signupButton: {
    backgroundColor: '#FF69B4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  terms: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  termsLink: {
    color: '#FF69B4',
  },
});

export default LoginScreen;