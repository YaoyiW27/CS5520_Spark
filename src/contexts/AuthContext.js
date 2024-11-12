import React, { createContext, useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native'; 
import { auth } from '../Firebase/firebaseSetup';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // Auth states
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // User profile states
    const [userName, setUserName] = useState('TextName');
    const [userProfile, setUserProfile] = useState({
        userName: '',
        pronouns: '',
        age: '',
        occupation: '',
        city: '',
        country: '',
        hobbies: '',
        tags: '',
        books: '',
        movies: '',
        music: '',
        aboutMe: ''
    });

    useEffect(() => {
        let isSubscribed = true;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (!isSubscribed) return;

                if (user) {
                    setUser(user);
                    setIsLoggedIn(true);
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                    setUserProfile({
                        userName: '',
                        pronouns: '',
                        age: '',
                        occupation: '',
                        city: '',
                        country: '',
                        hobbies: '',
                        tags: '',
                        books: '',
                        movies: '',
                        music: '',
                        aboutMe: ''
                    });
                    setUserName('TextName');
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                if (isSubscribed) {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } finally {
                if (isSubscribed) {
                    setLoading(false);
                }
            }
        });

        return () => {
            isSubscribed = false;
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (userProfile.userName) {
            setUserName(userProfile.userName);
        } else {
            setUserName('TextName');
        }
    }, [userProfile.userName]);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert(
                "Logout Error",
                "Failed to logout. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetStates = () => {
        setUser(null);
        setIsLoggedIn(false);
        setUserName('TextName');
        setUserProfile({
            userName: '',
            pronouns: '',
            age: '',
            occupation: '',
            city: '',
            country: '',
            hobbies: '',
            tags: '',
            books: '',
            movies: '',
            music: '',
            aboutMe: ''
        });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF69B4" />
            </View>
        );
    }

    return (
        <AuthContext.Provider 
            value={{ 
                isLoggedIn, 
                user, 
                loading,
                userName, 
                setUserName, 
                userProfile, 
                setUserProfile,
                logout: handleLogout,
                resetStates
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;