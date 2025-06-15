// src/viewmodels/AuthViewModel.js
import { useState } from 'react';
import { Alert } from 'react-native';

export const useAuthViewModel = (navigation) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleContinue = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }
    // API call to sign in would go here
    console.log('Signing in with:', { username, password });
    Alert.alert('Sign In', `Welcome back, ${username}`); 
    navigation.navigate('Home');
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