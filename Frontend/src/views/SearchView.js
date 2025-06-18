// export default SearchView;
import React, { useState, useCallback, useRef, memo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSearchViewModel } from '../viewmodels/SearchViewModel';
import { COLORS, SIZES, FONTS } from '../utils/Constants';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Restaurant Card Component
const RestaurantCard = memo(
  ({ item, onRestaurantPress }) => {
    console.log(`RestaurantCard rendered: ${item.id}`);
    return (
      <TouchableOpacity style={styles.restaurantCardContainer} onPress={() => onRestaurantPress(item)}>
        <Image source={item.image} style={styles.restaurantCardImage} />
        <View style={styles.restaurantCardContent}>
          <View style={styles.restaurantCardHeader}>
            <Text style={styles.restaurantCardTitle}>{item.name}</Text>
            <View style={styles.restaurantRatingContainer}>
              <Icon name="star" size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.restaurantRatingText}>{item.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.restaurantDescription} numberOfLines={2}>
            {item.description || 'Delicious food and great service'}
          </Text>
          
          <View style={styles.restaurantMetaContainer}>
            <View style={styles.restaurantMetaItem}>
              <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.restaurantMetaText}>{item.distance} miles</Text>
            </View>
            <View style={styles.restaurantMetaItem}>
              <Icon name="users" size={16} color={COLORS.textSecondary} />
              <Text style={styles.restaurantMetaText}>{item.reviewCount} reviews</Text>
            </View>
            <View style={styles.restaurantMetaItem}>
              <Icon name="clock" size={16} color={COLORS.textSecondary} />
              <Text style={styles.restaurantMetaText}>25-35 min</Text>
            </View>
          </View>
          
          <View style={styles.restaurantFooter}>
            <Text style={styles.restaurantPriceRange}>$${Math.max(5, item.price - 5)} - ${item.price + 10}</Text>
            <TouchableOpacity style={styles.viewMenuButton}>
              <Text style={styles.viewMenuButtonText}>View Menu</Text>
              <Icon name="arrow-right" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item.id === nextProps.item.id &&
    prevProps.onRestaurantPress === nextProps.onRestaurantPress,
);

// Dish Card Component (existing format)
const DishCard = memo(
  ({ item, onOrderPress, onItemPress }) => {
    console.log(`DishCard rendered: ${item.id}`);
    return (
      <TouchableOpacity style={styles.dishCardContainer} onPress={() => onItemPress(item)}>
        <Image source={item.image} style={styles.dishCardImage} />
        <View style={styles.dishCardDetailsContainer}>
          <Text style={styles.dishCardTitle}>{item.name}</Text>
          <Text style={styles.dishRestaurantName}>{item.restaurantName}</Text>
          <View style={styles.dishCardMetaContainer}>
            <Icon name="star" size={14} color={COLORS.textSecondary} />
            <Text style={styles.dishCardMetaText}>
              {item.rating} ({item.reviewCount} reviews)
            </Text>
            <Ionicons
              name="location-outline"
              size={14}
              color={COLORS.textSecondary}
              style={{ marginLeft: SIZES.base }}
            />
            <Text style={styles.dishCardMetaText}>{item.distance} miles</Text>
          </View>
          <View style={styles.dishCardFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.dishCardPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.dishCardPortionText}>/ portion</Text>
            </View>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={(e) => {
                e.stopPropagation();
                onOrderPress(item);
              }}
            >
              <Text style={styles.orderButtonText}>Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item.id === nextProps.item.id &&
    prevProps.onOrderPress === nextProps.onOrderPress &&
    prevProps.onItemPress === nextProps.onItemPress,
);

// Combined Search Result Card
const SearchResultCard = memo(
  ({ item, onOrderPress, onItemPress, onRestaurantPress }) => {
    // Determine if this is a restaurant or dish based on the data
    // If it has a restaurantName that's different from name, it's likely a dish
    // If name === restaurantName or no restaurantName, it's likely a restaurant
    const isRestaurant = !item.restaurantName || item.name === item.restaurantName || item.type === 'restaurant';
    
    if (isRestaurant) {
      return (
        <RestaurantCard 
          item={item} 
          onRestaurantPress={onRestaurantPress}
        />
      );
    } else {
      return (
        <DishCard 
          item={item} 
          onOrderPress={onOrderPress}
          onItemPress={onItemPress}
        />
      );
    }
  },
  (prevProps, nextProps) =>
    prevProps.item.id === nextProps.item.id &&
    prevProps.onOrderPress === nextProps.onOrderPress &&
    prevProps.onItemPress === nextProps.onItemPress &&
    prevProps.onRestaurantPress === nextProps.onRestaurantPress,
);

// Search Input Component (unchanged)
const SearchInput = memo(
  ({ value, onChangeText, onSubmitEditing, onClear, inputRef }) => {
    console.log('SearchInput rendered');
    return (
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={22}
          color={COLORS.textPrimary}
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder="Search restaurants or dishes..."
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={onClear}>
          <Icon name="x" size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.value === nextProps.value &&
    prevProps.onChangeText === nextProps.onChangeText &&
    prevProps.onSubmitEditing === nextProps.onSubmitEditing &&
    prevProps.onClear === nextProps.onClear,
);

// Filter Bar Component (unchanged)
const FilterBar = memo(
  ({ onFilterPress, onSortPress, resultCount }) => {
    console.log('FilterBar rendered');
    return (
      <View style={styles.filterBar}>
        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <Text style={styles.filterButtonText}>Filter</Text>
            <Icon name="chevron-down" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={onSortPress}>
            <Text style={styles.filterButtonText}>Sort</Text>
            <Icon name="chevron-down" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.resultsText}>{resultCount} result(s)</Text>
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.resultCount === nextProps.resultCount &&
    prevProps.onFilterPress === nextProps.onFilterPress &&
    prevProps.onSortPress === nextProps.onSortPress,
);

const SearchView = ({ navigation, route }) => {
  console.log('SearchView rendered');
  const {
    searchTerm,
    setSearchTerm,
    results,
    resultCount,
    isLoading,
    error,
    onOrderPress,
    onEditSearch,
    onFilterPress,
    onSortPress,
    onHomePress,
    onCartPress,
    onPersonPress,
  } = useSearchViewModel(navigation, route);

  const [inputText, setInputText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const inputRef = useRef(null);

  // Handle dish item press - navigate to dish detail
  const handleItemPress = useCallback((item) => {
    const dishData = {
      id: item.id,
      name: item.name,
      price: item.price,
      rating: item.rating,
      reviewCount: item.reviewCount,
      distance: item.distance,
      restaurantName: item.restaurantName || `Restaurant for ${item.name}`,
      description: item.description || `Delicious ${item.name} with ${item.rating} stars rating. Located ${item.distance} miles away with ${item.reviewCount} reviews from satisfied customers.`,
      image: item.image,
      reviews: item.reviews || [
        {
          id: '1',
          userInitial: 'J',
          username: 'John Doe',
          comment: 'Great food and excellent service!',
          rating: item.rating
        },
        {
          id: '2',
          userInitial: 'S',
          username: 'Sarah Smith',
          comment: 'Loved the taste and presentation.',
          rating: item.rating
        }
      ]
    };

    navigation.navigate('DishDetail', { dish: dishData });
  }, [navigation]);

  // Handle restaurant press - navigate to restaurant detail or menu
  const handleRestaurantPress = useCallback((item) => {
    // You can navigate to a restaurant detail page or menu page
    // For now, let's create a restaurant detail structure
    const restaurantData = {
      id: item.id,
      name: item.name,
      rating: item.rating,
      reviewCount: item.reviewCount,
      distance: item.distance,
      description: item.description || `Great restaurant with ${item.rating} stars rating.`,
      image: item.image,
      priceRange: `$${Math.max(5, item.price - 5)} - $${item.price + 10}`,
      reviews: item.reviews || []
    };

    // Navigate to restaurant detail (you'll need to create this screen)
    navigation.navigate('RestaurantDetail', { restaurant: restaurantData });
  }, [navigation]);

  // Handle order press for dishes
  const handleOrderPress = useCallback((item) => {
    const cartItem = {
      id: item.id,
      brand: item.restaurantName || 'Restaurant',
      name: item.name,
      description: `${item.rating} stars • ${item.distance} miles`,
      price: item.price,
      quantity: 1,
      image: item.image,
    };

    setSelectedItems([cartItem]);
    
    navigation.navigate('Checkout', { 
      selectedItems: [cartItem],
      fromSearch: true 
    });
  }, [navigation]);

  // Memoized callbacks
  const memoizedSetInputText = useCallback((text) => {
    setInputText(text);
  }, []);

  const memoizedHandleSubmit = useCallback(() => {
    if (inputText.trim()) {
      setSearchTerm(inputText.trim());
    }
    inputRef.current?.blur();
  }, [inputText, setSearchTerm]);

  const memoizedOnEditSearch = useCallback(() => {
    setInputText('');
    onEditSearch();
    inputRef.current?.focus();
  }, [onEditSearch]);

  const renderListHeader = useCallback(
    () => (
      <>
        <SearchInput
          value={inputText}
          onChangeText={memoizedSetInputText}
          onSubmitEditing={memoizedHandleSubmit}
          onClear={memoizedOnEditSearch}
          inputRef={inputRef}
        />
        <FilterBar
          onFilterPress={onFilterPress}
          onSortPress={onSortPress}
          resultCount={resultCount}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </>
    ),
    [
      inputText,
      memoizedSetInputText,
      memoizedHandleSubmit,
      memoizedOnEditSearch,
      onFilterPress,
      onSortPress,
      resultCount,
      isLoading,
      error,
    ],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <SearchResultCard 
            item={item} 
            onOrderPress={handleOrderPress}
            onItemPress={handleItemPress}
            onRestaurantPress={handleRestaurantPress}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={onHomePress}>
          <Ionicons name="home" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={onCartPress}>
          <Ionicons name="cart-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={onPersonPress}>
          <Ionicons name="person-outline" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  listContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base * 2,
    marginTop: SIZES.base,
    marginBottom: SIZES.padding,
    height: 50,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  searchIcon: {
    marginRight: SIZES.base,
  },
  searchInput: {
    ...FONTS.h3,
    flex: 1,
    color: COLORS.textPrimary,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius * 2,
    borderWidth: 1,
    borderColor: COLORS.divider,
    gap: SIZES.base / 2,
  },
  filterButtonText: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
  },
  resultsText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },

  // Restaurant Card Styles
  restaurantCardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  restaurantCardImage: {
    width: '100%',
    height: 180,
  },
  restaurantCardContent: {
    padding: SIZES.base * 2.5,
  },
  restaurantCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  restaurantCardTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SIZES.base,
  },
  restaurantRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  restaurantRatingText: {
    ...FONTS.body3,
    color: '#F57C00',
    marginLeft: SIZES.base / 2,
    fontWeight: '600',
  },
  restaurantDescription: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SIZES.base * 1.5,
  },
  restaurantMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base * 2,
  },
  restaurantMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  restaurantMetaText: {
    ...FONTS.body5,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base / 2,
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantPriceRange: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '600',
  },
  viewMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F8FF',
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  viewMenuButtonText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: SIZES.base / 2,
  },

  // Dish Card Styles (existing styles with prefix)
  dishCardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  dishCardImage: {
    width: '100%',
    height: 150,
  },
  dishCardDetailsContainer: {
    padding: SIZES.base * 2,
  },
  dishCardTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base / 2,
  },
  dishRestaurantName: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
    fontStyle: 'italic',
  },
  dishCardMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },
  dishCardMetaText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base / 2,
  },
  dishCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dishCardPrice: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  dishCardPortionText: {
    ...FONTS.body5,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base / 2,
  },
  orderButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 1.25,
    paddingHorizontal: SIZES.base * 3,
    borderRadius: SIZES.radius,
  },
  orderButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
  },

  // Common Styles
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingBottom: SIZES.padding,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorContainer: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    ...FONTS.body4,
    color: COLORS.error,
  },
});

export default SearchView;
