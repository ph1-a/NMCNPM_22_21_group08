// src/viewmodels/AuthViewModel.js
import { useState } from 'react';
import { Alert } from 'react-native';
import { authApi } from '../services/api';
import { tokenStorage } from '../utils/tokenStorage';

export const useAuthViewModel = (navigation) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleContinue = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    try {
      const result = await authApi.signin({ email: username, password });
      tokenStorage.setToken(result.token);
      console.log('Signing in with:', { username, password });
      Alert.alert('Sign In', `Welcome back, ${username}`); 
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  const handleGoogleSignIn = () => {
    // Google Sign-In logic
    console.log('Continue with Google');
    Alert.alert('Info', 'Google Sign-In is not implemented.');
  };

  const handleAppleSignIn = () => {
    // Apple Sign-In logic
    console.log('Continue with Apple');
    Alert.alert('Info', 'Apple Sign-In is not implemented.');
  };

  const handleSignUp = () => {
    // Navigation to Sign Up screen
    // console.log('Navigate to Sign Up');
    // Alert.alert('Info', 'Sign Up screen is not available.');
    navigation.navigate('SignUp'); // ✅ điều hướng tới màn SignUp
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    handleContinue,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleSignUp,
  };
};