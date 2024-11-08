import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './AuthStackNavigator';
import AppStackNavigator from './AppStackNavigator';
import { AuthContext } from '../contexts/AuthContext';

const RootNavigator = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

export default RootNavigator;