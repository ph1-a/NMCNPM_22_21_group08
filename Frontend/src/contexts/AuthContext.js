// // src/contexts/AuthContext.js
// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import { TokenStorage } from '../utils/tokenStorage';

// // Auth actions
// const AUTH_ACTIONS = {
//   SET_LOADING: 'SET_LOADING',
//   SET_USER: 'SET_USER',
//   SET_TOKEN: 'SET_TOKEN',
//   LOGOUT: 'LOGOUT',
//   SET_ERROR: 'SET_ERROR',
//   CLEAR_ERROR: 'CLEAR_ERROR'
// };

// // Initial state
// const initialState = {
//   user: null,
//   token: null,
//   isLoading: true,
//   isAuthenticated: false,
//   error: null
// };

// // Auth reducer
// const authReducer = (state, action) => {
//   switch (action.type) {
//     case AUTH_ACTIONS.SET_LOADING:
//       return {
//         ...state,
//         isLoading: action.payload
//       };
    
//     case AUTH_ACTIONS.SET_USER:
//       return {
//         ...state,
//         user: action.payload,
//         isAuthenticated: !!action.payload,
//         error: null
//       };
    
//     case AUTH_ACTIONS.SET_TOKEN:
//       return {
//         ...state,
//         token: action.payload,
//         isAuthenticated: !!action.payload
//       };
    
//     case AUTH_ACTIONS.LOGOUT:
//       return {
//         ...state,
//         user: null,
//         token: null,
//         isAuthenticated: false,
//         error: null
//       };
    
//     case AUTH_ACTIONS.SET_ERROR:
//       return {
//         ...state,
//         error: action.payload,
//         isLoading: false
//       };
    
//     case AUTH_ACTIONS.CLEAR_ERROR:
//       return {
//         ...state,
//         error: null
//       };
    
//     default:
//       return state;
//   }
// };

// // Create context
// const AuthContext = createContext();

// // Auth provider component
// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // Load stored auth data on app start
//   useEffect(() => {
//     loadStoredAuth();
//   }, []);

//   const loadStoredAuth = async () => {
//     try {
//       dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
//       const [token, userData] = await Promise.all([
//         TokenStorage.getToken(),
//         TokenStorage.getUserData()
//       ]);

//       if (token) {
//         dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: token });
//       }
      
//       if (userData) {
//         dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
//       }
//     } catch (error) {
//       console.error('Error loading stored auth:', error);
//       dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: 'Failed to load authentication data' });
//     } finally {
//       dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
//     }
//   };

//   // Auth actions
//   const login = async (token, userData) => {
//     try {
//       await TokenStorage.setToken(token);
//       await TokenStorage.setUserData(userData);
      
//       dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: token });
//       dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
//     } catch (error) {
//       console.error('Error during login:', error);
//       dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: 'Failed to save login data' });
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await TokenStorage.clearAll();
//       dispatch({ type: AUTH_ACTIONS.LOGOUT });
//     } catch (error) {
//       console.error('Error during logout:', error);
//       dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: 'Failed to logout' });
//     }
//   };

//   const updateUser = async (userData) => {
//     try {
//       await TokenStorage.setUserData(userData);
//       dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
//     } catch (error) {
//       console.error('Error updating user:', error);
//       dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: 'Failed to update user data' });
//     }
//   };

//   const clearError = () => {
//     dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
//   };

//   const value = {
//     ...state,
//     actions: {
//       login,
//       logout,
//       updateUser,
//       clearError
//     }
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export { AUTH_ACTIONS };

// UPDATED loadStoredAuth function
const loadStoredAuth = async () => {
  try {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    const [token, userData] = await Promise.all([
      TokenStorage.getToken(),
      TokenStorage.getUserData()
    ]);

    if (token) {
      // Validate token with server before setting auth state
      const validationResult = await validateTokenWithServer(token);
      
      if (validationResult.valid) {
        dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: token });
        if (userData) {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
        }
      } else {
        // Token is invalid, clear stored data
        await TokenStorage.clearAll();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } else {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  } catch (error) {
    console.error('Error loading stored auth:', error);
    // Clear potentially corrupted data
    await TokenStorage.clearAll();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  } finally {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
  }
};

// NEW FUNCTION - Add token validation helper
const validateTokenWithServer = async (token) => {
  try {
    // Import authApi dynamically to avoid circular dependency
    const { authApi } = await import('../services/api');
    return await authApi.validateToken(token);
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false };
  }
};

// NEW FUNCTION - Add auth error handler
const handleAuthError = async () => {
  try {
    await TokenStorage.clearAll();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  } catch (error) {
    console.error('Error handling auth error:', error);
  }
};

// UPDATED AuthProvider component - only add the handleAuthError setup
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
    
    // Set up global auth error handler
    const { authApi } = require('../services/api');
    authApi.setAuthErrorCallback(handleAuthError);
  }, []);

  // ... rest of the existing code remains the same

  const value = {
    ...state,
    actions: {
      login,
      logout,
      updateUser,
      clearError,
      handleAuthError // Add this to expose the handler
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};