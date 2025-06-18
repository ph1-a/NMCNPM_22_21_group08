// // src/viewmodels/AuthViewModel.js
// import { useState, useEffect } from 'react';
// import { Alert } from 'react-native';
// import { authApi } from '../services/api';
// import { TokenStorage } from '../utils/tokenStorage';

// export const useAuthViewModel = (navigation) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Add loading state for auth check

//   // Check authentication status on mount
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // Email validation function
//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const checkAuthStatus = async () => {
//     setIsCheckingAuth(true);
//     try {
//       const token = await TokenStorage.getToken();
//       if (token) {
//         // Validate token with server
//         const isValid = await validateTokenWithServer(token);
//         if (isValid) {
//           setIsAuthenticated(true);
//           navigation.navigate('Home');
//         } else {
//           // Token is invalid, clear storage and stay on auth screen
//           await TokenStorage.clearAll();
//           setIsAuthenticated(false);
//         }
//       } else {
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       console.error('Auth check error:', error);
//       setIsAuthenticated(false);
//       // Clear potentially corrupted token
//       await TokenStorage.clearAll();
//     } finally {
//       setIsCheckingAuth(false);
//     }
//   };

//   // Validate token with server
//   const validateTokenWithServer = async (token) => {
//     try {
//       // Make a request to validate token (adjust endpoint as needed)
//       const response = await authApi.validateToken(token);
//       return response.valid === true;
//     } catch (error) {
//       console.error('Token validation error:', error);
//       // If validation fails, consider token invalid
//       return false;
//     }
//   };

//   const handleContinue = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill in both email and password.');
//       return;
//     }

//     if (!validateEmail(email)) {
//       Alert.alert('Error', 'Please enter a valid email address.');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await authApi.signin({
//         email: email.trim().toLowerCase(),
//         password: password
//       });

//       // Store token and user data
//       await TokenStorage.setToken(response.token);
//       if (response.user) {
//         await TokenStorage.setUserData(response.user);
//       }

//       setIsAuthenticated(true);
//       Alert.alert('Success', `Welcome back, ${response.user?.email || response.user?.username || email}!`);
      
//       // Clear form
//       setEmail('');
//       setPassword('');
      
//       navigation.navigate('Home');
//     } catch (error) {
//       Alert.alert('Sign In Failed', error.message || 'Please check your credentials.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       // Implement Google Sign-In here
//       console.log('Continue with Google');
//       Alert.alert('Info', 'Google Sign-In coming soon!');
//     } catch (error) {
//       Alert.alert('Error', 'Google Sign-In failed.');
//     }
//   };

//   const handleAppleSignIn = async () => {
//     try {
//       // Implement Apple Sign-In here
//       console.log('Continue with Apple');
//       Alert.alert('Info', 'Apple Sign-In coming soon!');
//     } catch (error) {
//       Alert.alert('Error', 'Apple Sign-In failed.');
//     }
//   };

//   const handleSignUp = () => {
//     navigation.navigate('SignUp');
//   };

//   const handleLogout = async () => {
//     try {
//       await TokenStorage.clearAll();
//       authApi.logout();
//       setIsAuthenticated(false);
//       setEmail('');
//       setPassword('');
//       navigation.navigate('Login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Function to handle authentication errors from API calls
//   const handleAuthError = async () => {
//     await TokenStorage.clearAll();
//     setIsAuthenticated(false);
//     navigation.navigate('Login');
//   };

//   return {
//     email,
//     setEmail,
//     password,
//     setPassword,
//     isLoading,
//     isAuthenticated,
//     isCheckingAuth, // Expose auth checking state
//     handleContinue,
//     handleGoogleSignIn,
//     handleAppleSignIn,
//     handleSignUp,
//     handleLogout,
//     handleAuthError, // Expose auth error handler
//     validateEmail,
//   };
// };

// src/viewmodels/AuthViewModel.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { authApi } from '../services/api';
import { TokenStorage } from '../utils/tokenStorage';

export const useAuthViewModel = (navigation) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    try {
      const token = await TokenStorage.getToken();
      const userData = await TokenStorage.getUserData();
      
      if (token) {
        // Check if token is still valid
        const isValid = await validateTokenWithServer(token);
        if (isValid) {
          setIsAuthenticated(true);
          // Restore user data if available
          if (userData?.email) {
            setEmail(userData.email);
          }
          // Navigate to home if already authenticated
          navigation.replace('Home');
          return;
        } else {
          // Token expired or invalid, clear storage
          await TokenStorage.clearAll();
        }
      }
      
      // If no valid token, stay on auth screen
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      // Clear potentially corrupted data
      await TokenStorage.clearAll();
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Validate token with server
  const validateTokenWithServer = async (token) => {
    try {
      // Make a request to validate token
      const response = await authApi.validateToken(token);
      return response.valid === true;
    } catch (error) {
      console.error('Token validation error:', error);
      // If server is unreachable, assume token is still valid for offline support
      // You can change this behavior based on your app's requirements
      if (error.message?.includes('Network') || error.message?.includes('timeout')) {
        console.log('Network error - assuming token is valid for offline use');
        return true;
      }
      return false;
    }
  };

  const handleContinue = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.signin({
        email: email.trim().toLowerCase(),
        password: password
      });

      // Store token and user data for persistence
      await TokenStorage.setToken(response.token);
      if (response.user) {
        await TokenStorage.setUserData(response.user);
      }

      setIsAuthenticated(true);
      Alert.alert('Success', `Welcome back, ${response.user?.email || response.user?.username || email}!`);
      
      // Don't clear email to maintain user context
      setPassword(''); // Only clear password for security
      
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Sign In Failed', error.message || 'Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Implement Google Sign-In here
      // const response = await authApi.googleSignIn();
      // await TokenStorage.setToken(response.token);
      // await TokenStorage.setUserData(response.user);
      // setIsAuthenticated(true);
      // navigation.replace('Home');
      
      console.log('Continue with Google');
      Alert.alert('Info', 'Google Sign-In coming soon!');
    } catch (error) {
      Alert.alert('Error', 'Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      // Implement Apple Sign-In here
      // const response = await authApi.appleSignIn();
      // await TokenStorage.setToken(response.token);
      // await TokenStorage.setUserData(response.user);
      // setIsAuthenticated(true);
      // navigation.replace('Home');
      
      console.log('Continue with Apple');
      Alert.alert('Info', 'Apple Sign-In coming soon!');
    } catch (error) {
      Alert.alert('Error', 'Apple Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleLogout = async () => {
    try {
      // Clear all stored authentication data
      await TokenStorage.clearAll();
      
      // Call API logout if needed
      try {
        await authApi.logout();
      } catch (error) {
        console.log('API logout error (non-critical):', error);
      }
      
      setIsAuthenticated(false);
      setEmail('');
      setPassword('');
      
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout properly. Please try again.');
    }
  };

  // Function to handle authentication errors from API calls
  const handleAuthError = async () => {
    await TokenStorage.clearAll();
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    navigation.replace('Login');
  };

  // Function to refresh token if needed
  const refreshToken = async () => {
    try {
      const currentToken = await TokenStorage.getToken();
      if (currentToken) {
        const response = await authApi.refreshToken(currentToken);
        await TokenStorage.setToken(response.token);
        return response.token;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await handleAuthError();
    }
    return null;
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isAuthenticated,
    isCheckingAuth,
    handleContinue,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleSignUp,
    handleLogout,
    handleAuthError,
    refreshToken,
    validateEmail,
    checkAuthStatus, // Expose for manual auth checks if needed
  };
};