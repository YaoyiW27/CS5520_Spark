import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { auth } from '../../Firebase/firebaseSetup';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { AuthContext } from '../../contexts/AuthContext'; 

const AuthOptionsScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const { setProfileComplete } = useContext(AuthContext); 

  // password warning
  const checkPasswordStrength = (pass) => {
    if (pass.length === 0) {
      setPasswordStrength('');
    } else if (pass.length > 8) {
      // check if password contains only numbers
      const hasOnlyNumbers = /^\d+$/.test(pass);
      // check if password contains both letters and numbers
      const hasLettersAndNumbers = /^(?=.*[0-9])(?=.*[a-zA-Z])/.test(pass);
      
      if (hasLettersAndNumbers) {
        setPasswordStrength('strong');
      } else if (hasOnlyNumbers || /^[a-zA-Z]+$/.test(pass)) {
        setPasswordStrength('medium');
      } else {
        setPasswordStrength('weak');
      }
    } else {
      setPasswordStrength('weak');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    checkPasswordStrength(text);
  };

  const renderPasswordStrength = () => {
    if (!isLogin && passwordStrength) {
      let strengthColor = '#ff4444'; // weak color - red
      let strengthText = 'Weak';
      let strengthWidth = '33%';
      
      if (passwordStrength === 'medium') {
        strengthColor = '#ffa700'; // medium color - orange
        strengthText = 'Medium';
        strengthWidth = '66%';
      } else if (passwordStrength === 'strong') {
        strengthColor = '#00c851'; // strong color - green
        strengthText = 'Strong';
        strengthWidth = '100%';
      }
      
      return (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthBarContainer}>
            <View 
              style={[
                styles.strengthBar, 
                { backgroundColor: strengthColor, width: strengthWidth }
              ]} 
            />
          </View>
          <Text style={[styles.strengthText, { color: strengthColor }]}>
            Password Strength: {strengthText}
          </Text>
          {passwordStrength === 'weak' && (
            <Text style={styles.strengthHint}>
              Password coule be at least 8 characters
            </Text>
          )}
          {passwordStrength === 'medium' && (
            <Text style={styles.strengthHint}>
              Password could contain letters and numbers
            </Text>
          )}
        </View>
      );
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      if (isLogin) {
        // Login logic
        await signInWithEmailAndPassword(auth, email, password);
        setProfileComplete(true);
      } else {
        // sign up logic
        try {
          setProfileComplete(false);
          // create user with email and password
          await createUserWithEmailAndPassword(auth, email, password);
          // after creating user, navigate to complete profile screen
          navigation.navigate('CompleteProfile');
        } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert(
              'Account Exists',
              'An account with this email already exists. Would you like to login instead?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Login',
                  onPress: () => setIsLogin(true)
                }
              ]
            );
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Account Exists',
          'An account with this email already exists. Would you like to login instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => setIsLogin(true) },
          ]
        );
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Weak Password', 'Password should be at least 6 characters.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      } else {
        Alert.alert('Error', 'Authentication failed. Please try again.');
      }
    }
};

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Login or Sign Up Today</Text>
        <Text style={styles.subtitle}>
          Discover New Connections and Meaningful{'\n'}
          Relationships with Our Dating App
        </Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, isLogin && styles.activeTab]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, !isLogin && styles.activeTab]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
          />
          <Pressable 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#666" />
          </Pressable>
        </View>
        
        {!isLogin && renderPasswordStrength()}

        {isLogin && (
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {isLogin ? 'Log in' : 'Sign up'}
          </Text>
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
    padding: 4,
    width: '100%',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 12,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 12,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#FF69B4',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  strengthContainer: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  strengthBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 5,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    marginBottom: 4,
  },
  strengthHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default AuthOptionsScreen;