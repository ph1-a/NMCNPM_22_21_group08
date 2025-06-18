// src/viewmodels/SignUpViewModel.js
import { useState } from 'react';
import { Alert } from 'react-native';
import { authApi } from '../services/api';
import { TokenStorage } from '../utils/tokenStorage';

export const useSignUpViewModel = (navigation) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Minimum 6 characters
  };

  const handleSignUp = async () => {
    // Validation - email is now required
    if (!email || !username || !password || !confirmPassword || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password: password,
        phoneNumber: phoneNumber.trim(),
      };

      const response = await authApi.signup(userData);

      // Store token and user data if provided
      if (response.token) {
        await TokenStorage.setToken(response.token);
      }
      if (response.user) {
        await TokenStorage.setUserData(response.user);
      }

      Alert.alert(
        'Success', 
        `Account created successfully for ${email}!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setEmail('');
              setUsername('');
              setPassword('');
              setConfirmPassword('');
              setPhoneNumber('');
              
              // Navigate based on whether user is automatically logged in
              if (response.token) {
                navigation.navigate('Home');
              } else {
                navigation.navigate('Login');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Sign Up Failed', 
        error.message || 'An error occurred during registration. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      // Implement Google Sign-Up here
      console.log('Sign up with Google');
      Alert.alert('Info', 'Google Sign-Up coming soon!');
    } catch (error) {
      Alert.alert('Error', 'Google Sign-Up failed.');
    }
  };

  const handleAppleSignUp = async () => {
    try {
      // Implement Apple Sign-Up here
      console.log('Sign up with Apple');
      Alert.alert('Info', 'Apple Sign-Up coming soon!');
    } catch (error) {
      Alert.alert('Error', 'Apple Sign-Up failed.');
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    phoneNumber,
    setPhoneNumber,
    isLoading,
    handleSignUp,
    handleGoogleSignUp,
    handleAppleSignUp,
    handleBackToLogin,
    // Expose validation functions for real-time validation
    validateEmail,
    validatePhone,
    validatePassword,
  };
};
