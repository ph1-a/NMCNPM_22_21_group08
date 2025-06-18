// src/viewmodels/HomeViewModel.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { searchApi, authApi } from '../services/api';

export const useHomeViewModel = (navigation) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const imageMap = {
    'food(1).jpg': require('../assets/images/food(1).jpg'),
    'food(2).jpg': require('../assets/images/food(2).jpg'),
    'food(3).jpg': require('../assets/images/food(3).jpg'),
    'food(4).jpg': require('../assets/images/food(4).jpg'),
    'food(5).jpg': require('../assets/images/food(5).jpg'),
    'food(6).jpg': require('../assets/images/food(6).jpg'),
    'food(7).jpg': require('../assets/images/food(7).jpg'),
    'food(8).jpg': require('../assets/images/food(8).jpg'),
    'food(9).jpg': require('../assets/images/food(9).jpg'),
    'food(10).jpg': require('../assets/images/food(10).jpg'),
    'food(11).jpg': require('../assets/images/food(11).jpg'),
    'food(12).jpg': require('../assets/images/food(12).jpg'),
    'food(13).jpg': require('../assets/images/food(13).jpg'),
    'food(14).jpg': require('../assets/images/food(14).jpg'),
    'food(15).jpg': require('../assets/images/food(15).jpg'),
    'food(16).jpg': require('../assets/images/food(16).jpg'),
    'food(17).jpg': require('../assets/images/food(17).jpg'),
    'food(18).jpg': require('../assets/images/food(18).jpg'),
    'food(19).jpg': require('../assets/images/food(19).jpg'),
    'food(20).jpg': require('../assets/images/food(20).jpg'),
    'food(21).jpg': require('../assets/images/food(21).jpg'),
  };

  useEffect(() => {
    loadOffers();
  }, []);

  // Transform API response to match frontend data structure (same as SearchView)
  const transformApiResults = (searchResults) => {
    // Strict validation - return empty array if no valid data
    if (!searchResults) {
      console.log('HomeViewModel: transformApiResults - searchResults is null/undefined');
      return [];
    }

    if (typeof searchResults !== 'object') {
      console.log('HomeViewModel: transformApiResults - searchResults is not an object');
      return [];
    }

    // Check if we have any valid data arrays
    const hasValidRestaurants = searchResults.restaurants && Array.isArray(searchResults.restaurants) && searchResults.restaurants.length > 0;
    const hasValidFoods = searchResults.foods && Array.isArray(searchResults.foods) && searchResults.foods.length > 0;

    if (!hasValidRestaurants && !hasValidFoods) {
      console.log('HomeViewModel: transformApiResults - no valid restaurants or foods data');
      return [];
    }

    const transformedResults = [];

    // Transform restaurants only if they exist and have data
    if (hasValidRestaurants) {
      console.log('HomeViewModel: transformApiResults - processing restaurants:', searchResults.restaurants.length);
      const restaurantResults = searchResults.restaurants
        .filter(restaurant => restaurant && restaurant.id) // Filter out invalid entries
        .map(restaurant => ({
          id: restaurant.id,
          name: restaurant.name || 'Unknown Restaurant',
          restaurant: restaurant.name || 'Unknown Restaurant',
          restaurantName: restaurant.name || 'Unknown Restaurant',
          dishName: restaurant.name || 'Unknown Restaurant',
          price: parseFloat(restaurant.price) || 0,
          rating: parseFloat(restaurant.rating) || 0,
          reviewCount: parseInt(restaurant.reviewCount) || 0,
          distance: parseFloat(restaurant.distance) || 0,
          description: restaurant.description || '',
          image: restaurant.image || require('../assets/images/restaurant.jpg'),
          reviews: Array.isArray(restaurant.reviews) ? restaurant.reviews
            .filter(review => review && review.id) // Filter out invalid reviews
            .map(review => ({
              id: review.id,
              username: review.username || 'Anonymous',
              userInitial: review.userInitial || review.username?.charAt(0)?.toUpperCase() || 'A',
              comment: review.comment || '',
              rating: parseFloat(review.rating) || 0
            })) : []
        }));
      transformedResults.push(...restaurantResults);
    }

    // Transform foods/dishes only if they exist and have data
    if (hasValidFoods) {
      console.log('HomeViewModel: transformApiResults - processing foods:', searchResults.foods.length);
      const foodResults = searchResults.foods
        .filter(food => food && food.id) // Filter out invalid entries
        .map(food => ({
          id: food.id,
          name: food.name || 'Unknown Dish',
          restaurant: food.Restaurant?.name || food.restaurantName || 'Unknown Restaurant',
          restaurantName: food.Restaurant?.name || food.restaurantName || 'Unknown Restaurant',
          dishName: food.name || 'Unknown Dish',
          price: parseFloat(food.price) || 0,
          rating: parseFloat(food.rating) || 0,
          reviewCount: parseInt(food.reviewCount) || 0,
          distance: parseFloat(food.distance) || 0,
          description: food.description || '',
          image: imageMap[food.image] || require('../assets/images/restaurant.jpg'),
          reviews: Array.isArray(food.Reviews) ? food.Reviews
            .filter(review => review && review.id) // Filter out invalid reviews
            .map(review => ({
              id: review.id,
              username: review.username || 'Anonymous',
              userInitial: review.userInitial || review.username?.charAt(0)?.toUpperCase() || 'A',
              comment: review.comment || '',
              rating: parseFloat(review.rating) || 0
            })) : []
        }));
      transformedResults.push(...foodResults);
    }

    console.log('HomeViewModel: transformApiResults - final transformed count:', transformedResults.length);
    return transformedResults;
  };

  const loadOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('HomeViewModel: Loading offers using search API');
      
      // Use search API to get popular/featured foods - using a common letter to get diverse results
      // Using 'a' as search term to get a good variety of results for the home page
      const searchResults = await searchApi.search('a', {}); // Search for foods containing 'a'
      console.log('HomeViewModel: Received search results:', searchResults);
      
      // Check if API returned valid data
      if (!searchResults) {
        console.log('HomeViewModel: API returned null/undefined');
        setOffers([]);
        return;
      }

      // Check if API returned empty results
      const hasRestaurants = searchResults.restaurants && Array.isArray(searchResults.restaurants) && searchResults.restaurants.length > 0;
      const hasFoods = searchResults.foods && Array.isArray(searchResults.foods) && searchResults.foods.length > 0;
      
      if (!hasRestaurants && !hasFoods) {
        console.log('HomeViewModel: API returned empty results');
        setOffers([]);
        return;
      }
      
      // Transform the API response
      const transformedResults = transformApiResults(searchResults);
      console.log('HomeViewModel: Transformed results:', transformedResults);
      
      // Double check transformed results are not empty
      if (!transformedResults || transformedResults.length === 0) {
        console.log('HomeViewModel: No results after transformation');
        setOffers([]);
        return;
      }
      
      // Sort by rating to show best offers first
      const sortedResults = transformedResults.sort((a, b) => b.rating - a.rating);
      
      // Limit to top 10 offers for home page
      const limitedResults = sortedResults.slice(0, 10);
      console.log('HomeViewModel: Final limited results:', limitedResults);
      
      setOffers(limitedResults);
      
    } catch (err) {
      console.error('HomeViewModel: Failed to load offers:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      // Set user-friendly error message
      const errorMessage = err.message || 'Failed to load offers';
      setError(errorMessage);
      
      // Show user-friendly error message
      Alert.alert(
        'Network Error', 
        'Unable to load food offers. Please check your connection and try again.',
        [
          { text: 'Retry', onPress: retryLoadOffers },
          { text: 'OK' }
        ]
      );
      
      // Set empty array to prevent app crashes
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get dish data by ID
  const getDishById = (dishId) => {
    return offers.find(offer => offer.id === dishId);
  };

  // Retry loading offers
  const retryLoadOffers = () => {
    loadOffers();
  };

  // Navigation handlers
  const onOrderHistoryPress = async () => {
    try {
      const isAuthenticated = authApi.isAuthenticated();
      if (!isAuthenticated) {
        Alert.alert(
          'Authentication Required',
          'Please sign in to view your order history.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign In', onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }
      console.log('Navigate to Order History');
      // navigation.navigate('OrderHistory');
    } catch (error) {
      console.error('Order history navigation error:', error);
    }
  };

  const onTrackOrderPress = async () => {
    try {
      const isAuthenticated = authApi.isAuthenticated();
      if (!isAuthenticated) {
        Alert.alert(
          'Authentication Required',
          'Please sign in to track your orders.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign In', onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }
      console.log('Navigate to Track Order');
      // navigation.navigate('TrackOrder');
    } catch (error) {
      console.error('Track order navigation error:', error);
    }
  };

  const onOfferPress = (dish) => {
    if (!dish) {
      Alert.alert('Error', 'Food item details not available.');
      return;
    }
    
    console.log(`Navigate to offer details for dish:`, dish.name || dish.dishName);
    navigation.navigate('DishDetail', { dish: dish });
  };
    
  const onSeeAllOffersPress = () => {
    console.log('Navigate to all offers');
    // Navigate to search with a broad search term to show more results
    navigation.navigate('Search', { food: 'a' });
  };

  const onCartPress = async () => {
    try {
      const isAuthenticated = authApi.isAuthenticated();
      if (!isAuthenticated) {
        Alert.alert(
          'Authentication Required',
          'Please sign in to view your cart.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign In', onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }
      console.log('Navigate to Cart');
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Cart navigation error:', error);
    }
  };

  const onPersonPress = () => {
    console.log('Navigate to Person');
    navigation.navigate("User");
  };

  const onSearchPress = () => {
    if (!searchTerm.trim()) {
      // Navigate to search with a broad search term to show search interface with results
      navigation.navigate('Search', { food: 'a' });
      return;
    }
    
    console.log(`Navigate to Search with term: ${searchTerm}`);
    navigation.navigate('Search', { food: searchTerm.trim() });
  };

  return {
    searchTerm,
    setSearchTerm,
    offers,
    loading,
    error,
    getDishById,
    retryLoadOffers,
    onOrderHistoryPress,
    onTrackOrderPress,
    onOfferPress,
    onSeeAllOffersPress,
    onCartPress,
    onPersonPress,
    onSearchPress,
  };
};