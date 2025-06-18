// Token storage utility
let authToken = null;

export const tokenStorage = {
  setToken: (token) => {
    authToken = token;
    // In a real app, you would use AsyncStorage here
    // AsyncStorage.setItem('authToken', token);
  },

  getToken: () => {
    // In a real app, you would use AsyncStorage here
    // return AsyncStorage.getItem('authToken');
    return authToken;
  },

  removeToken: () => {
    authToken = null;
    // In a real app, you would use AsyncStorage here
    // AsyncStorage.removeItem('authToken');
  },

  isAuthenticated: () => {
    return !!authToken;
  }
}; 