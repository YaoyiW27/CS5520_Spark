import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './AuthStackNavigator';
import AppStackNavigator from './AppStackNavigator';
import { AuthContext } from '../contexts/AuthContext';

const RootNavigator = () => {
  const { isLoggedIn, user, profileComplete } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {user ? (
        profileComplete ? (
          <AppStackNavigator />
        ) : (
          <AuthStackNavigator />
        )
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;