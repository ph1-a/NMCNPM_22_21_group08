import { useState, useEffect, useCallback } from 'react';

const MOCK_OFFERS = [
  {
    id: '1',
    name: 'Grilled Salmon',
    restaurant: 'Restaurant A',
    restaurantName: 'Ocean Delight',
    dishName: 'Grilled Salmon',
    price: 10.99,
    rating: 4.5,
    reviewCount: 128,
    distance: 1.2,
    description: 'Fresh Atlantic salmon grilled to perfection with herbs and lemon. Served with seasonal vegetables and rice pilaf. A healthy and delicious choice for seafood lovers.',
    image: require('../assets/images/food_1.jpg'),
    reviews: [
      {
        id: 'r1',
        username: 'John Doe',
        userInitial: 'J',
        comment: 'Amazing salmon! Perfectly cooked.',
        rating: 5,
      },
      {
        id: 'r2',
        username: 'Sarah Smith',
        userInitial: 'S',
        comment: 'Great taste and fresh ingredients.',
        rating: 4,
      },
      {
        id: 'r3',
        username: 'Mike Johnson',
        userInitial: 'M',
        comment: 'Excellent presentation and flavor.',
        rating: 5,
      }
    ]
  },
  {
    id: '2',
    name: 'Beef Burger Deluxe',
    restaurant: 'Restaurant B',
    restaurantName: 'Burger Palace',
    dishName: 'Beef Burger Deluxe',
    price: 20.50,
    rating: 4.2,
    reviewCount: 256,
    distance: 0.8,
    description: 'Premium beef patty with aged cheddar, crispy bacon, lettuce, tomato, and our signature sauce. Served with golden fries and pickles. The ultimate burger experience.',
    image: require('../assets/images/food_2.jpg'),
    reviews: [
      {
        id: 'r4',
        username: 'Emily Davis',
        userInitial: 'E',
        comment: 'Best burger in town! Juicy and flavorful.',
        rating: 5,
      },
      {
        id: 'r5',
        username: 'David Wilson',
        userInitial: 'D',
        comment: 'Great portion size and taste.',
        rating: 4,
      }
    ]
  },
  {
    id: '3',
    name: 'Chicken Caesar Salad',
    restaurant: 'Restaurant C',
    restaurantName: 'Garden Fresh',
    dishName: 'Chicken Caesar Salad',
    price: 10.99,
    rating: 4.0,
    reviewCount: 89,
    distance: 2.1,
    description: 'Crisp romaine lettuce tossed with our homemade Caesar dressing, topped with grilled chicken breast, parmesan cheese, and croutons. A classic salad done right.',
    image: require('../assets/images/food_3.jpg'),
    reviews: [
      {
        id: 'r6',
        username: 'Lisa Brown',
        userInitial: 'L',
        comment: 'Fresh and tasty! Perfect portion.',
        rating: 4,
      },
      {
        id: 'r7',
        username: 'Tom Anderson',
        userInitial: 'T',
        comment: 'Great dressing and fresh ingredients.',
        rating: 4,
      }
    ]
  },
];

// Enhanced search function that can search across multiple fields
const filterOffers = (offers, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return offers;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return offers.filter(offer => {
    // Search in multiple fields
    const searchableFields = [
      offer.name,
      offer.dishName,
      offer.restaurantName,
      offer.restaurant,
      offer.description
    ];
    
    return searchableFields.some(field => 
      field && field.toLowerCase().includes(term)
    );
  });
};

// Sort offers by different criteria
const sortOffers = (offers, sortBy = 'relevance') => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    maxPrice: null,
    minRating: null,
    maxDistance: null,
  });

  // Enhanced search function that handles the new data structure
  const performSearch = async (term, currentSortBy = sortBy, currentFilters = filters) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app, this would be an actual API call:
      // const response = await fetch(`https://your-api-endpoint/search?query=${encodeURIComponent(term)}&sort=${currentSortBy}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch search results');
      // }
      // const data = await response.json();
      
      // Filter offers based on search term
      let filteredResults = filterOffers(MOCK_OFFERS, term);
      
      // Apply additional filters
      if (currentFilters.maxPrice) {
        filteredResults = filteredResults.filter(offer => offer.price <= currentFilters.maxPrice);
      }
      
      if (currentFilters.minRating) {
        filteredResults = filteredResults.filter(offer => offer.rating >= currentFilters.minRating);
      }
      
      if (currentFilters.maxDistance) {
        filteredResults = filteredResults.filter(offer => offer.distance <= currentFilters.maxDistance);
      }
      
      // Sort results
      const sortedResults = sortOffers(filteredResults, currentSortBy);
      
      setResults(sortedResults);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'An error occurred while searching');
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
    // In a real app, this could open a filter modal
    // For now, we can cycle through some basic filters
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
    
    // Utility functions
    performSearch,
  };
};