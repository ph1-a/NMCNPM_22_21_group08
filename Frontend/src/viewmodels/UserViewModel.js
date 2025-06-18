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

//   const handleLogout = () => {
//     Alert.alert(
//       'Log out',
//       'Are you sure you want to log out?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Log out',
//           style: 'destructive',
//           onPress: () => {
//             // Clear any stored user data/tokens here if needed
//             // For example: AsyncStorage.removeItem('userToken');
//             console.log('User logged out');
//             navigation.navigate('Login');
//           },
//         },
//       ]
//     );
//   };

//   return {
//     handleNavigation,
//     openDrawer,
//     openProfile,
//     onCartPress,
//     onPersonPress,
//     onHomePress,
//     handleLogout,
//   };
// };

// src/viewmodels/UserViewModel.js
import { Alert } from 'react-native';
import { TokenStorage } from '../utils/tokenStorage';

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

  const onCartPress = () => {
    console.log('Navigate to Cart');
    navigation.navigate('Cart');
  };

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
          onPress: async () => {
            try {
              // Clear stored authentication data
              await TokenStorage.clearAll();
              console.log('User logged out - storage cleared');
              
              // Navigate to login screen
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout properly. Please try again.');
            }
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