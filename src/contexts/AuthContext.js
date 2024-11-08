import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../Firebase/firebaseSetup';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('TextName');
    const [userProfile, setUserProfile] = useState({
        userName: '',
        pronouns: '',
        birthday: '',
        occupation: '',
        city: '',
        hobbies: '',
        tags: '',
        books: '',
        movies: '',
        music: '',
        aboutMe: ''
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoggedIn(!!user);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        setUserName(userProfile.userName || 'TextName');
    }, [userProfile.userName]);

    const logout = () => {
        signOut(auth)
            .then(() => {
                setIsLoggedIn(false);
                setUser(null);
            })
            .catch((error) => {
                console.error("Logout failed: ", error);
            });
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, logout, userName, setUserName, userProfile, setUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;