// src/viewmodels/SignUpViewModel.js
import { useState } from 'react';
import { Alert } from 'react-native';

export const useSignUpViewModel = (navigation) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignUp = () => {
    if (!username || !password || !confirmPassword || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    console.log('Signing up with:', { username, password, phoneNumber });
    Alert.alert('Success', `Account created for ${username}`);
    navigation.navigate('Login'); // hoặc điều hướng sang Home nếu cần
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
