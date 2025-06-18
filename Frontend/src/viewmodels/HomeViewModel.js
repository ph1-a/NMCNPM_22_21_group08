// src/viewmodels/HomeViewModel.js
// import { useState, useEffect } from 'react';
// import { fetchOffers } from '../services/api';

// const MOCK_OFFERS = [
//   {
//     id: '1',
//     name: 'Grilled Salmon',
//     restaurant: 'Restaurant A',
//     restaurantName: 'Ocean Delight',
//     dishName: 'Grilled Salmon',
//     price: 10.99,
//     rating: 4.5,
//     reviewCount: 128,
//     distance: 1.2,
//     description: 'Fresh Atlantic salmon grilled to perfection with herbs and lemon. Served with seasonal vegetables and rice pilaf. A healthy and delicious choice for seafood lovers.',
//     image: require('../assets/images/food_1.jpg'),
//     reviews: [
//       {
//         id: 'r1',
//         username: 'John Doe',
//         userInitial: 'J',
//         comment: 'Amazing salmon! Perfectly cooked.',
//         rating: 5,
//       },
//       {
//         id: 'r2',
//         username: 'Sarah Smith',
//         userInitial: 'S',
//         comment: 'Great taste and fresh ingredients.',
//         rating: 4,
//       },
//       {
//         id: 'r3',
//         username: 'Mike Johnson',
//         userInitial: 'M',
//         comment: 'Excellent presentation and flavor.',
//         rating: 5,
//       }
//     ]
//   },
//   {
//     id: '2',
//     name: 'Beef Burger Deluxe',
//     restaurant: 'Restaurant B',
//     restaurantName: 'Burger Palace',
//     dishName: 'Beef Burger Deluxe',
//     price: 20.50,
//     rating: 4.2,
//     reviewCount: 256,
//     distance: 0.8,
//     description: 'Premium beef patty with aged cheddar, crispy bacon, lettuce, tomato, and our signature sauce. Served with golden fries and pickles. The ultimate burger experience.',
//     image: require('../assets/images/food_2.jpg'),
//     reviews: [
//       {
//         id: 'r4',
//         username: 'Emily Davis',
//         userInitial: 'E',
//         comment: 'Best burger in town! Juicy and flavorful.',
//         rating: 5,
//       },
//       {
//         id: 'r5',
//         username: 'David Wilson',
//         userInitial: 'D',
//         comment: 'Great portion size and taste.',
//         rating: 4,
//       }
//     ]
//   },
//   {
//     id: '3',
//     name: 'Chicken Caesar Salad',
//     restaurant: 'Restaurant C',
//     restaurantName: 'Garden Fresh',
//     dishName: 'Chicken Caesar Salad',
//     price: 10.99,
//     rating: 4.0,
//     reviewCount: 89,
//     distance: 2.1,
//     description: 'Crisp romaine lettuce tossed with our homemade Caesar dressing, topped with grilled chicken breast, parmesan cheese, and croutons. A classic salad done right.',
//     image: require('../assets/images/food_3.jpg'),
//     reviews: [
//       {
//         id: 'r6',
//         username: 'Lisa Brown',
//         userInitial: 'L',
//         comment: 'Fresh and tasty! Perfect portion.',
//         rating: 4,
//       },
//       {
//         id: 'r7',
//         username: 'Tom Anderson',
//         userInitial: 'T',
//         comment: 'Great dressing and fresh ingredients.',
//         rating: 4,
//       }
//     ]
//   },
// ];

// export const useHomeViewModel = (navigation) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadOffers = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchOffers();
//         setOffers(data.foods || []);
//       } catch (err) {
//         setError(err.message || 'Failed to load offers');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadOffers();
//   }, []);

//   // Helper function to get dish data by ID
//   const getDishById = (dishId) => {
//     return offers.find(offer => offer.id === dishId);
//   };

//   // In a real app, these would navigate to other screens
//   const onOrderHistoryPress = () => console.log('Navigate to Order History');
//   const onTrackOrderPress = () => console.log('Navigate to Track Order');
//   const onOfferPress = (dish) => {
//     console.log(`Navigate to offer details for dish:`, dish.name);
//     // Pass the complete dish data to DishDetailView
//     navigation.navigate('DishDetail', { dish: dish });
//   }
    
//   const onSeeAllOffersPress = () => console.log('Navigate to all offers');
//   const onCartPress = () => console.log('Navigate to Cart');
//   const onPersonPress = () => {
//     console.log('Navigate to Person');
//     navigation.navigate("User");
//   }

//   const onSearchPress = () => {
//     console.log(`Navigate to Search`);
//     navigation.navigate('Search', {food: searchTerm});
//   }

//   return {
//     searchTerm,
//     setSearchTerm,
//     offers,
//     loading,
//     error,
//     getDishById,
//     onOrderHistoryPress,
//     onTrackOrderPress,
//     onOfferPress,
//     onSeeAllOffersPress,
//     onCartPress,
//     onPersonPress,
//     onSearchPress,
//   };
// };

// src/viewmodels/HomeViewModel.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { searchApi, authApi } from '../services/api';

export const useHomeViewModel = (navigation) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOffers();
  }, []);

  // Transform API response to match frontend data structure
  const transformApiResults = (searchResults) => {
    if (!searchResults || (!searchResults.restaurants && !searchResults.foods)) {
      return [];
    }

    const transformedResults = [];

    // Transform restaurants
    if (searchResults.restaurants && Array.isArray(searchResults.restaurants)) {
      const restaurantResults = searchResults.restaurants.map(restaurant => ({
        id: restaurant.id || `restaurant_${Date.now()}_${Math.random()}`,
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
        reviews: Array.isArray(restaurant.reviews) ? restaurant.reviews.map(review => ({
          id: review.id || `review_${Date.now()}_${Math.random()}`,
          username: review.username || 'Anonymous',
          userInitial: review.userInitial || review.username?.charAt(0)?.toUpperCase() || 'A',
          comment: review.comment || '',
          rating: parseFloat(review.rating) || 0
        })) : []
      }));
      transformedResults.push(...restaurantResults);
    }

    // Transform foods/dishes
    if (searchResults.foods && Array.isArray(searchResults.foods)) {
      const foodResults = searchResults.foods.map(food => ({
        id: food.id || `food_${Date.now()}_${Math.random()}`,
        name: food.name || 'Unknown Dish',
        restaurant: food.Restaurant?.name || food.restaurantName || 'Unknown Restaurant',
        restaurantName: food.Restaurant?.name || food.restaurantName || 'Unknown Restaurant',
        dishName: food.name || 'Unknown Dish',
        price: parseFloat(food.price) || 0,
        rating: parseFloat(food.rating) || 0,
        reviewCount: parseInt(food.reviewCount) || 0,
        distance: parseFloat(food.distance) || 0,
        description: food.description || '',
        image: food.image || require('../assets/images/restaurant.jpg'),
        reviews: Array.isArray(food.Reviews) ? food.Reviews.map(review => ({
          id: review.id || `review_${Date.now()}_${Math.random()}`,
          username: review.username || 'Anonymous',
          userInitial: review.userInitial || review.username?.charAt(0)?.toUpperCase() || 'A',
          comment: review.comment || '',
          rating: parseFloat(review.rating) || 0
        })) : []
      }));
      transformedResults.push(...foodResults);
    }

    return transformedResults;
  };

  const loadOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('HomeViewModel: Loading offers using search API with query "a"');
      
      // Use search API to find all foods beginning with "a"
      const searchResults = await searchApi.search('a', {});
      console.log('HomeViewModel: Received search results:', searchResults);
      
      // Transform the API response
      const transformedResults = transformApiResults(searchResults);
      console.log('HomeViewModel: Transformed results:', transformedResults);
      
      // Filter to only show foods that actually start with "a" (case insensitive)
      const filteredResults = transformedResults.filter(item => {
        const name = item.dishName || item.name || '';
        return name.toLowerCase().startsWith('a');
      });
      
      console.log('HomeViewModel: Filtered results starting with "a":', filteredResults);
      setOffers(filteredResults);
      
    } catch (err) {
      console.error('HomeViewModel: Failed to load offers:', err);
      setError(err.message || 'Failed to load offers');
      
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
    // You could navigate to search with a broader query or a dedicated offers page
    navigation.navigate('Search', { food: '' });
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
      Alert.alert('Search', 'Please enter something to search for.');
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