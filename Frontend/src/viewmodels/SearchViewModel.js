import { useState, useEffect, useCallback } from 'react';
import { searchApi } from '../services/api';

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

// Sort offers by different criteria
const sortOffers = (offers, sortBy = 'relevance') => {
  const sortedOffers = [...offers];
  
  switch (sortBy) {
    case 'rating':
      return sortedOffers.sort((a, b) => b.rating - a.rating); // Descending for rating
    case 'price_low':
      return sortedOffers.sort((a, b) => a.price - b.price); // Ascending for price
    case 'price_high':
      return sortedOffers.sort((a, b) => b.price - a.price); // Descending for price
    case 'distance':
      return sortedOffers.sort((a, b) => a.distance - b.distance); // Ascending for distance
    case 'reviews':
      return sortedOffers.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sortedOffers; // Keep original order for relevance
  }
};

export const useSearchViewModel = (navigation, route) => {
  const initialTerm = route?.params?.food || '';
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (initialTerm) {
      setSearchTerm(initialTerm);
    }
  }, [initialTerm]);

  // Transform API response to match frontend data structure (FIXED - now matches HomeViewModel)
  const transformApiResults = (searchResults) => {
    // Strict validation - return empty array if no valid data
    if (!searchResults) {
      console.log('SearchViewModel: transformApiResults - searchResults is null/undefined');
      return [];
    }

    if (typeof searchResults !== 'object') {
      console.log('SearchViewModel: transformApiResults - searchResults is not an object');
      return [];
    }

    // Check if we have any valid data arrays
    const hasValidRestaurants = searchResults.restaurants && Array.isArray(searchResults.restaurants) && searchResults.restaurants.length > 0;
    const hasValidFoods = searchResults.foods && Array.isArray(searchResults.foods) && searchResults.foods.length > 0;

    if (!hasValidRestaurants && !hasValidFoods) {
      console.log('SearchViewModel: transformApiResults - no valid restaurants or foods data');
      return [];
    }

    const transformedResults = [];

    // Transform restaurants only if they exist and have data
    if (hasValidRestaurants) {
      console.log('SearchViewModel: transformApiResults - processing restaurants:', searchResults.restaurants.length);
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
          type: 'restaurant',
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

    // Transform foods/dishes only if they exist and have data (FIXED - now handles Reviews array like HomeViewModel)
    if (hasValidFoods) {
      console.log('SearchViewModel: transformApiResults - processing foods:', searchResults.foods.length);
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
          image: imageMap[food.image] || require('../assets/images/food(1).jpg'),
          type: 'dish',
          // FIXED: Now handles both Reviews (capital R) and reviews (lowercase r) like HomeViewModel
          reviews: Array.isArray(food.Reviews) ? food.Reviews
            .filter(review => review && review.id) // Filter out invalid reviews
            .map(review => ({
              id: review.id,
              username: review.username || 'Anonymous',
              userInitial: review.userInitial || review.username?.charAt(0)?.toUpperCase() || 'A',
              comment: review.comment || '',
              rating: parseFloat(review.rating) || 0
            })) : Array.isArray(food.reviews) ? food.reviews
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

    console.log('SearchViewModel: transformApiResults - total transformed results:', transformedResults.length);
    return transformedResults;
  };

  // Enhanced search function using the API
  const performSearch = useCallback(async (term, currentSortBy = sortBy) => {
    console.log('SearchViewModel: Starting search with term:', term, 'sort:', currentSortBy);
    
    if (!term || term.trim() === '') {
      console.log('SearchViewModel: Empty search term, clearing results');
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('SearchViewModel: Calling search API with term:', term, 'sort:', currentSortBy);
      
      // Check if searchApi has the search method, otherwise use the default function
      let searchResults;
      if (searchApi && typeof searchApi.search === 'function') {
        searchResults = await searchApi.search(term, {
          sortBy: currentSortBy
        });
      } else if (typeof searchApi === 'function') {
        searchResults = await searchApi(term);
      } else {
        throw new Error('Search API not available');
      }
      
      console.log('SearchViewModel: Received search results:', searchResults);
      
      // Check if API returned valid data
      if (!searchResults) {
        console.log('SearchViewModel: API returned null/undefined');
        setResults([]);
        return;
      }

      // Check if API returned empty results
      const hasRestaurants = searchResults.restaurants && Array.isArray(searchResults.restaurants) && searchResults.restaurants.length > 0;
      const hasFoods = searchResults.foods && Array.isArray(searchResults.foods) && searchResults.foods.length > 0;
      
      if (!hasRestaurants && !hasFoods) {
        console.log('SearchViewModel: API returned empty results');
        setResults([]);
        return;
      }
      
      // Transform the API response
      const transformedResults = transformApiResults(searchResults);
      console.log('SearchViewModel: Transformed results:', transformedResults);
      
      // Double check transformed results are not empty
      if (!transformedResults || transformedResults.length === 0) {
        console.log('SearchViewModel: No results after transformation');
        setResults([]);
        return;
      }
      
      // Apply client-side sorting (in case API doesn't handle it)
      const sortedResults = sortOffers(transformedResults, currentSortBy);
      console.log('SearchViewModel: Final sorted results:', sortedResults);
      
      setResults(sortedResults);
      
      // Clear any previous errors on successful search
      if (error) {
        setError(null);
      }
    } catch (err) {
      console.error('SearchViewModel: Error during search:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      // Set user-friendly error message
      const errorMessage = err.message || 'Unable to search at this time. Please try again.';
      setError(errorMessage);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, error]);

  // Effect to trigger search when searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    } else {
      setResults([]);
    }
  }, [searchTerm, performSearch]);

  // Sort functions that handle cycling through sort options
  const onPriceSort = useCallback(() => {
    let newSortBy;
    if (sortBy === 'price_low') {
      newSortBy = 'price_high';
    } else if (sortBy === 'price_high') {
      newSortBy = 'relevance';
    } else {
      newSortBy = 'price_low';
    }
    
    setSortBy(newSortBy);
    if (searchTerm && results.length > 0) {
      // Apply sorting to existing results immediately for better UX
      const sortedResults = sortOffers(results, newSortBy);
      setResults(sortedResults);
    }
  }, [sortBy, searchTerm, results]);

  const onRatingSort = useCallback(() => {
    const newSortBy = sortBy === 'rating' ? 'relevance' : 'rating';
    setSortBy(newSortBy);
    if (searchTerm && results.length > 0) {
      // Apply sorting to existing results immediately for better UX
      const sortedResults = sortOffers(results, newSortBy);
      setResults(sortedResults);
    }
  }, [sortBy, searchTerm, results]);

  const onDistanceSort = useCallback(() => {
    const newSortBy = sortBy === 'distance' ? 'relevance' : 'distance';
    setSortBy(newSortBy);
    if (searchTerm && results.length > 0) {
      // Apply sorting to existing results immediately for better UX
      const sortedResults = sortOffers(results, newSortBy);
      setResults(sortedResults);
    }
  }, [sortBy, searchTerm, results]);

  // Retry search function
  const retrySearch = useCallback(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    }
  }, [searchTerm, performSearch]);

  // Navigation handlers
  const onOrderPress = useCallback((item) => {
    console.log('SearchViewModel: onOrderPress - item:', item);
    // Navigate to DishDetail with the complete item data including reviews
    if (!item) {
      console.error('SearchViewModel: onOrderPress - item is null/undefined');
      return;
    }
    
    console.log('SearchViewModel: Navigating to DishDetail with item:', item.name || item.dishName);
    navigation.navigate('DishDetail', { dish: item });
  }, [navigation]);

  const onEditSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setError(null);
    setSortBy('relevance');
  }, []);

  const onHomePress = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const onCartPress = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  const onPersonPress = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  // Computed values
  const resultCount = results.length;

  return {
    // Search state
    searchTerm,
    setSearchTerm,
    results,
    resultCount,
    isLoading,
    error,
    
    // Sort state
    sortBy,
    setSortBy,
    
    // Action handlers
    onOrderPress,
    onEditSearch,
    onPriceSort,
    onRatingSort,
    onDistanceSort,
    onHomePress,
    onCartPress,
    onPersonPress,
    retrySearch,
    
    // Utility functions
    performSearch,
  };
};