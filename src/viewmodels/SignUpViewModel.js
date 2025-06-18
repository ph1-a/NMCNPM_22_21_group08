// src/viewmodels/SignUpViewModel.js
import { useState } from 'react';
import { Alert } from 'react-native';
import { authApi } from '../services/api';

export const useSignUpViewModel = (navigation) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignUp = async () => {
    if (!username || !password || !confirmPassword || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const userData = {
        email: username,
        password: password,
        name: username // Using username as name for now
      };
      
      await authApi.signup(userData);
      Alert.alert('Success', `Account created for ${username}`);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Signup Failed', error.message || 'Could not create account.');
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Sign up with Google');
    Alert.alert('Info', 'Google Sign-Up is not implemented.');
  };

  const handleAppleSignUp = () => {
    console.log('Sign up with Apple');
    Alert.alert('Info', 'Apple Sign-Up is not implemented.');
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    phoneNumber,
    setPhoneNumber,
    handleSignUp,
    handleGoogleSignUp,
    handleAppleSignUp,
  };
};
