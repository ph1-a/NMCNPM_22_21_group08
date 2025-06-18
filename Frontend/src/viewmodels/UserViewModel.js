// // src/viewmodels/UserViewModel.js
// import { Alert } from 'react-native';

// export const useUserViewModel = (navigation) => {

//   const handleNavigation = (screenName) => {
//     Alert.alert('Navigate', `Opening ${screenName}`);
//   };

//   const openDrawer = () => {
//     Alert.alert('Menu', 'Open navigation drawer');
//   };

//   const openProfile = () => {
//     // This could navigate to a more detailed profile edit screen
//     Alert.alert('Profile', 'Opening user profile details');
//   };

//   const onCartPress = () => console.log('Navigate to Cart');

//   const onPersonPress = () => {
//     console.log('Navigate to Person');
//     navigation.navigate("User");
//   }

//   const onHomePress = () => {
//     console.log('Navigate to Home');
//     navigation.navigate("Home");
//   }

//   return {
//     handleNavigation,
//     openDrawer,
//     openProfile,
//     onCartPress,
//     onPersonPress,
//     onHomePress,
//   };
// };

// src/viewmodels/UserViewModel.js
import { Alert } from 'react-native';
import { tokenStorage } from '../utils/tokenStorage';

export const useUserViewModel = (navigation) => {

  const handleNavigation = (screenName) => {
    Alert.alert('Navigate', `Opening ${screenName}`);
  };

  const openDrawer = () => {
    Alert.alert('Menu', 'Open navigation drawer');
  };

  const openProfile = () => {
    // This could navigate to a more detailed profile edit screen
    Alert.alert('Profile', 'Opening user profile details');
  };

  const onCartPress = () => console.log('Navigate to Cart');

  const onPersonPress = () => {
    console.log('Navigate to Person');
    navigation.navigate("User");
  }

  const onHomePress = () => {
    console.log('Navigate to Home');
    navigation.navigate("Home");
  }

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: () => {
            // Clear stored user data/tokens
            tokenStorage.removeToken();
            console.log('User logged out');
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  return {
    handleNavigation,
    openDrawer,
    openProfile,
    onCartPress,
    onPersonPress,
    onHomePress,
    handleLogout,
  };
};