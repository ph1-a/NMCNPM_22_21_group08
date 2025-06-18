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
const sortOffers = (offers, sortBy = 'price_low') => {
  const sortedOffers = [...offers];
  
  switch (sortBy) {
    case 'rating':
      return sortedOffers.sort((a, b) => b.rating - a.rating);
    case 'price_low':
      return sortedOffers.sort((a, b) => a.price - b.price);
    case 'price_high':
      return sortedOffers.sort((a, b) => b.price - a.price);
    case 'distance':
      return sortedOffers.sort((a, b) => a.distance - b.distance);
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
  const [filters, setFilters] = useState({
    maxPrice: null,
    minRating: null,
    maxDistance: null,
  });

  useEffect(() => {
    if (initialTerm) {
      setSearchTerm(initialTerm);
    }
  }, [initialTerm]);

  // Transform API response to match frontend data structure
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
          image: imageMap[food.image],
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

    console.log('SearchViewModel: transformApiResults - final transformed count:', transformedResults.length);
    return transformedResults;
  };

  // Enhanced search function using the API
  const performSearch = async (term, currentSortBy = sortBy, currentFilters = filters) => {
    console.log('SearchViewModel: Starting search with term:', term);
    
    if (!term || term.trim() === '') {
      console.log('SearchViewModel: Empty search term, clearing results');
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('SearchViewModel: Calling search API with term:', term, 'filters:', currentFilters);
      
      // Call the search API
      const searchResults = await searchApi.search(term, currentFilters);
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
      
      // Sort results
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
  };

  // Trigger search when searchTerm, sortBy, or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm, sortBy, filters);
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortBy, filters]);

  // Navigation handlers
  const onOrderPress = useCallback((item) => {
    console.log(`Order pressed for item: ${item.id}`);
    
    // Transform offer to cart item format
    const cartItem = {
      id: item.id,
      brand: item.restaurantName,
      name: item.dishName || item.name,
      description: `${item.rating} ⭐ • ${item.distance} miles • ${item.reviewCount} reviews`,
      price: item.price,
      quantity: 1,
      image: item.image,
    };
    
    navigation.navigate('Checkout', { 
      selectedItems: [cartItem],
      foodItem: item 
    });
  }, [navigation]);

  const onItemPress = useCallback((item) => {
    console.log(`Item pressed: ${item.id}`);
    
    // Navigate to dish detail with the complete offer data
    navigation.navigate('DishDetail', { 
      dish: item 
    });
  }, [navigation]);

  const onEditSearch = useCallback(() => {
    console.log('Clear search input');
    setSearchTerm('');
    setResults([]);
    setError(null);
  }, []);

  const onFilterPress = useCallback(() => {
    console.log('Filter button pressed');
    // Cycle through price filters
    const currentMaxPrice = filters.maxPrice;
    const priceFilters = [null, 15, 25, 35]; // null means no filter
    const currentIndex = priceFilters.indexOf(currentMaxPrice);
    const nextIndex = (currentIndex + 1) % priceFilters.length;
    
    setFilters(prev => ({
      ...prev,
      maxPrice: priceFilters[nextIndex]
    }));
  }, [filters.maxPrice]);

  const onSortPress = useCallback(() => {
    console.log('Sort button pressed');
    // Cycle through sort options
    const sortOptions = ['relevance', 'rating', 'price_low', 'price_high', 'distance', 'reviews'];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  }, [sortBy]);

  const onCartPress = useCallback(() => {
    console.log('Navigate to cart');
    navigation.navigate('Cart');
  }, [navigation]);

  const onPersonPress = useCallback(() => {
    console.log('Navigate to user profile');
    navigation.navigate('User');
  }, [navigation]);

  const onHomePress = useCallback(() => {
    console.log('Navigate to home');
    navigation.navigate('Home');
  }, [navigation]);

  // Retry search function for error recovery
  const retrySearch = useCallback(() => {
    if (searchTerm) {
      performSearch(searchTerm, sortBy, filters);
    }
  }, [searchTerm, sortBy, filters]);

  // Helper function to get current sort display text
  const getSortDisplayText = () => {
    const sortLabels = {
      relevance: 'Relevance',
      rating: 'Rating',
      price_low: 'Price: Low to High',
      price_high: 'Price: High to Low',
      distance: 'Distance',
      reviews: 'Most Reviewed'
    };
    return sortLabels[sortBy] || 'Sort';
  };

  // Helper function to get current filter display text
  const getFilterDisplayText = () => {
    if (filters.maxPrice) {
      return `Under $${filters.maxPrice}`;
    }
    if (filters.minRating) {
      return `${filters.minRating}+ Stars`;
    }
    if (filters.maxDistance) {
      return `Within ${filters.maxDistance} miles`;
    }
    return 'Filter';
  };

  return {
    // Search state
    searchTerm,
    setSearchTerm,
    results,
    resultCount: results.length,
    isLoading,
    error,
    
    // Sort and filter state
    sortBy,
    setSortBy,
    filters,
    setFilters,
    getSortDisplayText,
    getFilterDisplayText,
    
    // Action handlers
    onOrderPress,
    onItemPress,
    onEditSearch,
    onFilterPress,
    onSortPress,
    onCartPress,
    onPersonPress,
    onHomePress,
    retrySearch,
    
    // Utility functions
    performSearch,
  };
};