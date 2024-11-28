import { StyleSheet } from 'react-native';

// Styles for forgetPassworScreen
const forgetPassworScreenStyles = StyleSheet.create({
    forgetPasswordContainer: {
        flex: 1,
        backgroundColor: '#fff',
      },
      forgetPasswordHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      },
      forgetPasswordBackButton: {
        padding: 8,
      },
      forgetPasswordHeaderTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 16,
      },
      forgetPasswordContent: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
      },
      forgetPasswordIconContainer: {
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
      forgetPasswordTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      forgetPasswordSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
      },
      forgetPasswordInput: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        marginBottom: 20,
      },
      forgetPasswordSubmitButton: {
        backgroundColor: '#FF69B4',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
      },
      forgetPasswordSubmitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      },
      forgetPasswordReturnButton: {
        padding: 15,
        width: '100%',
        alignItems: 'center',
      },
      forgetPasswordReturnButtonText: {
        color: '#666',
        fontSize: 16,
      },
});

// Styles for LoginScreen
const loginScreenStyles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loginContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    loginTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    loginFeatures: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
    },
    loginFeatureItem: {
        alignItems: 'center',
    },
    loginFeatureIcon: {
        marginBottom: 8,
    },
    loginFeatureText: {
        fontSize: 12,
        textAlign: 'center',
        color: '#666',
    },
    loginSignupButton: {
        backgroundColor: '#FF69B4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loginTerms: {
        marginTop: 20,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    loginTermsLink: {
        color: '#FF69B4',
    },
    sparkContainer: {
      alignItems: 'center', 
      marginBottom: 20, 
    },
    
    sparkAnimation: {
      width: 100,
      height: 100,
      color: '#FF69B4',
    },
    
    sparkTitle: {
      fontSize: 42,
      fontWeight: 'bold',
      color: '#FF69B4',
      textAlign: 'center',
      marginTop: -20, 
    },
});

// Styles for VerifyEmailScreen
const verifyEmailScreenStyles = StyleSheet.create({
    emailContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    emailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    emailBackButton: {
        padding: 8,
    },
    emailHeaderTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 16,
    },
    emailContent: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emailIconContainer: {
        marginBottom: 20,
    },
    emailTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emailSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    email: {
        color: '#FF69B4',
    },
    emailSubmitButton: {
        backgroundColor: '#FF69B4',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    emailSubmitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emailResendButton: {
        padding: 15,
        width: '100%',
        alignItems: 'center',
    },
    emailResendButtonText: {
        color: '#666',
        fontSize: 16,
    },
    emailInstructions: {
      textAlign: 'center',
      color: '#666',
      marginHorizontal: 20,
      marginVertical: 15,
      lineHeight: 20,
    },
    
    emailResendButtonDisabled: {
      opacity: 0.6,
    }
});

export { forgetPassworScreenStyles, loginScreenStyles, verifyEmailScreenStyles };