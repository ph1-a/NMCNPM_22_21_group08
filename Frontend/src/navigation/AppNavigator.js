import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Auth Screens
import AuthView from '../views/AuthView';
import SignUpView from '../views/SignUpView';
import HomeView from '../views/HomeView';
import DishDetailView from '../views/DishDetailView';
import UserView from '../views/UserView';
import SearchView from '../views/SearchView';
import CheckoutView from '../views/CheckoutView';
import PaymentSuccessView from '../views/PaymentSuccessView';

// Main Screens
// import HomeView from '../views/HomeView/HomeView';
// import CartView from '../views/CartView/CartView';
// import UserProfileView from '../views/UserView/UserProfileView';

// // Tab
// const Tab = createBottomTabNavigator();

// const MainTab = () => (
//   <Tab.Navigator>
//     <Tab.Screen name="Home" component={HomeView} />
//     {/* <Tab.Screen name="Cart" component={CartView} />
//     <Tab.Screen name="User" component={UserProfileView} /> */}
//   </Tab.Navigator>
// );

// Stack
const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={AuthView} />
      <Stack.Screen name="SignUp" component={SignUpView} />
      <Stack.Screen name="Home" component={HomeView} />
      <Stack.Screen name="DishDetail" component={DishDetailView} />
      <Stack.Screen name ="User" component={UserView} />
      <Stack.Screen name="Checkout" component={CheckoutView} />
      <Stack.Screen name ="Search" component={SearchView} />
      <Stack.Screen name ="PaymentSuccess" component={PaymentSuccessView}/>
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
