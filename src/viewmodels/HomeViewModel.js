// src/viewmodels/HomeViewModel.js
import { useState } from 'react';

// Mock data for the 'Today's best offer' section with complete dish details
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

export const useHomeViewModel = (navigation) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [offers, setOffers] = useState(MOCK_OFFERS);

  // Helper function to get dish data by ID
  const getDishById = (dishId) => {
    return offers.find(offer => offer.id === dishId);
  };

  // In a real app, these would navigate to other screens
  const onOrderHistoryPress = () => console.log('Navigate to Order History');
  const onTrackOrderPress = () => console.log('Navigate to Track Order');
  const onOfferPress = (dish) => {
    console.log(`Navigate to offer details for dish:`, dish.name);
    // Pass the complete dish data to DishDetailView
    navigation.navigate('DishDetail', { dish: dish });
  }
    
  const onSeeAllOffersPress = () => console.log('Navigate to all offers');
  const onCartPress = () => console.log('Navigate to Cart');
  const onPersonPress = () => {
    console.log('Navigate to Person');
    navigation.navigate("User");
  }

  const onSearchPress = () => {
    console.log(`Navigate to Search`);
    navigation.navigate('Search', {food: searchTerm});
  }

  return {
    searchTerm,
    setSearchTerm,
    offers,
    getDishById,
    onOrderHistoryPress,
    onTrackOrderPress,
    onOfferPress,
    onSeeAllOffersPress,
    onCartPress,
    onPersonPress,
    onSearchPress,
  };
};
