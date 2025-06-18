// // src/utils/tokenStorage.js
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const TOKEN_KEY = 'auth_token';
// const USER_KEY = 'user_data';

// export const TokenStorage = {
//   // Token methods
//   setToken: async (token) => {
//     try {
//       await AsyncStorage.setItem(TOKEN_KEY, token);
//     } catch (error) {
//       console.error('Error storing token:', error);
//       throw error;
//     }
//   },

//   getToken: async () => {
//     try {
//       return await AsyncStorage.getItem(TOKEN_KEY);
//     } catch (error) {
//       console.error('Error retrieving token:', error);
//       return null;
//     }
//   },

//   removeToken: async () => {
//     try {
//       await AsyncStorage.removeItem(TOKEN_KEY);
//     } catch (error) {
//       console.error('Error removing token:', error);
//     }
//   },

//   // User data methods
//   setUserData: async (userData) => {
//     try {
//       await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
//     } catch (error) {
//       console.error('Error storing user data:', error);
//       throw error;
//     }
//   },

//   getUserData: async () => {
//     try {
//       const userData = await AsyncStorage.getItem(USER_KEY);
//       return userData ? JSON.parse(userData) : null;
//     } catch (error) {
//       console.error('Error retrieving user data:', error);
//       return null;
//     }
//   },

//   removeUserData: async () => {
//     try {
//       await AsyncStorage.removeItem(USER_KEY);
//     } catch (error) {
//       console.error('Error removing user data:', error);
//     }
//   },

//   // Clear all stored data
//   clearAll: async () => {
//     try {
//       await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
//     } catch (error) {
//       console.error('Error clearing storage:', error);
//     }
//   }
// };

// src/utils/tokenStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';
const LOGIN_TIME_KEY = '@login_time';

export const TokenStorage = {
  // Store authentication token
  setToken: async (token) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      // Store login time for session management
      await AsyncStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  },

  // Get authentication token
  getToken: async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },

  // Store user data
  setUserData: async (userData) => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  },

  // Get user data
  getUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  },

  // Get login time
  getLoginTime: async () => {
    try {
      const loginTime = await AsyncStorage.getItem(LOGIN_TIME_KEY);
      return loginTime ? parseInt(loginTime, 10) : null;
    } catch (error) {
      console.error('Error retrieving login time:', error);
      return null;
    }
  },

  // Check if session is expired (optional - you can set a session timeout)
  isSessionExpired: async (maxSessionTime = 30 * 24 * 60 * 60 * 1000) => { // 30 days default
    try {
      const loginTime = await TokenStorage.getLoginTime();
      if (!loginTime) return true;
      
      const currentTime = Date.now();
      return (currentTime - loginTime) > maxSessionTime;
    } catch (error) {
      console.error('Error checking session expiry:', error);
      return true;
    }
  },

  // Clear all stored authentication data
  clearAll: async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_DATA_KEY, LOGIN_TIME_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  // Clear only token (keep user data for faster re-login)
  clearToken: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(LOGIN_TIME_KEY);
    } catch (error) {
      console.error('Error clearing token:', error);
      throw error;
    }
  },

  // Check if user has any stored authentication data
  hasStoredAuth: async () => {
    try {
      const token = await TokenStorage.getToken();
      const userData = await TokenStorage.getUserData();
      return !!(token && userData);
    } catch (error) {
      console.error('Error checking stored auth:', error);
      return false;
    }
  },
};