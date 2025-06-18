// src/viewmodels/DishDetailViewModel.js
import { useState, useEffect } from 'react';

export const useDishDetailViewModel = (navigation, route) => {
  // Get dish data from navigation params (passed from SearchView)
  const dishData = route.params?.dish;
  
  // State to track bookmark status
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Validate that dish data exists and has required properties
  const validateDishData = (data) => {
    return data && 
           data.id && 
           data.name && 
           typeof data.price === 'number' &&
           data.rating &&
           data.reviewCount !== undefined &&
           data.distance !== undefined &&
           data.restaurantName &&
           data.description &&
           data.image;
  };

  // Initialize state with received data
  const [dish] = useState(() => {
    if (validateDishData(dishData)) {
      return dishData;
    }
    return null;
  });

  const [reviews] = useState(() => {
    return dish?.reviews || [];
  });

  // Log if dish data is missing or invalid for debugging
  useEffect(() => {
    if (!dish) {
      console.warn('DishDetailView: No valid dish data received from navigation params');
      console.log('Received route params:', route.params);
    }
  }, [dish, route.params]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleBookmark = () => {
    if (!dish) return;
    
    setIsBookmarked(!isBookmarked);
    console.log(`Dish ${dish.name} ${!isBookmarked ? 'bookmarked' : 'unbookmarked'}`);
    
    // In a real app, this would save bookmark status to persistent storage
    // For example: AsyncStorage.setItem(`bookmark_${dish.id}`, JSON.stringify(!isBookmarked));
  };

  const handleOrder = () => {
    if (!dish) return;
    
    console.log(`Ordering ${dish.name} for $${dish.price}`);
    
    // Convert dish to cart item format and navigate to checkout
    const cartItem = {
      id: dish.id,
      brand: dish.restaurantName,
      name: dish.name,
      description: `${dish.rating} stars • ${dish.distance} miles`,
      price: dish.price,
      quantity: 1,
      image: dish.image,
    };

    navigation.navigate('Checkout', { 
      selectedItems: [cartItem],
      fromDishDetail: true 
    });
  };

  return {
    dish,
    reviews,
    isBookmarked,
    handleGoBack,
    toggleBookmark,
    handleOrder,
  };
};