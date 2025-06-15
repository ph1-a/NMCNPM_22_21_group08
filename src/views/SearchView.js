// import React, { useState, useCallback, useRef, memo } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import { useSearchViewModel } from '../viewmodels/SearchViewModel';
// import { COLORS, SIZES, FONTS } from '../utils/Constants';
// import Icon from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// // Tối ưu SearchResultCard
// const SearchResultCard = memo(
//   ({ item, onOrderPress }) => {
//     console.log(`SearchResultCard rendered: ${item.id}`); // Debug render
//     return (
//       <View style={styles.cardContainer}>
//         <Image source={item.image} style={styles.cardImage} />
//         <View style={styles.cardDetailsContainer}>
//           <Text style={styles.cardTitle}>{item.name}</Text>
//           <View style={styles.cardMetaContainer}>
//             <Icon name="star" size={14} color={COLORS.textSecondary} />
//             <Text style={styles.cardMetaText}>
//               {item.rating} ({item.reviewCount} reviews)
//             </Text>
//             <Ionicons
//               name="location-outline"
//               size={14}
//               color={COLORS.textSecondary}
//               style={{ marginLeft: SIZES.base }}
//             />
//             <Text style={styles.cardMetaText}>{item.distance} miles</Text>
//           </View>
//           <View style={styles.cardFooter}>
//             <View style={styles.priceContainer}>
//               <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
//               <Text style={styles.cardPortionText}>/ portion</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.orderButton}
//               onPress={() => onOrderPress(item)}
//             >
//               <Text style={styles.orderButtonText}>Order</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   },
//   (prevProps, nextProps) =>
//     prevProps.item.id === nextProps.item.id &&
//     prevProps.onOrderPress === nextProps.onOrderPress,
// );

// // Tối ưu SearchInput
// const SearchInput = memo(
//   ({ value, onChangeText, onSubmitEditing, onClear, inputRef }) => {
//     console.log('SearchInput rendered'); // Debug render
//     return (
//       <View style={styles.searchContainer}>
//         <Icon
//           name="search"
//           size={22}
//           color={COLORS.textPrimary}
//           style={styles.searchIcon}
//         />
//         <TextInput
//           ref={inputRef}
//           style={styles.searchInput}
//           value={value}
//           onChangeText={onChangeText}
//           onSubmitEditing={onSubmitEditing}
//           placeholder="Tìm kiếm món ăn..."
//           returnKeyType="search"
//           autoCorrect={false}
//           autoCapitalize="none"
//         />
//         <TouchableOpacity onPress={onClear}>
//           <Icon name="x" size={18} color={COLORS.textPrimary} />
//         </TouchableOpacity>
//       </View>
//     );
//   },
//   (prevProps, nextProps) =>
//     prevProps.value === nextProps.value &&
//     prevProps.onChangeText === nextProps.onChangeText &&
//     prevProps.onSubmitEditing === nextProps.onSubmitEditing &&
//     prevProps.onClear === nextProps.onClear,
// );

// // Tối ưu FilterBar
// const FilterBar = memo(
//   ({ onFilterPress, onSortPress, resultCount }) => {
//     console.log('FilterBar rendered'); // Debug render
//     return (
//       <View style={styles.filterBar}>
//         <View style={styles.filterButtonsContainer}>
//           <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
//             <Text style={styles.filterButtonText}>Lọc</Text>
//             <Icon name="chevron-down" size={16} color={COLORS.textPrimary} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.filterButton} onPress={onSortPress}>
//             <Text style={styles.filterButtonText}>Sắp xếp</Text>
//             <Icon name="chevron-down" size={16} color={COLORS.textPrimary} />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.resultsText}>{resultCount} kết quả</Text>
//       </View>
//     );
//   },
//   (prevProps, nextProps) =>
//     prevProps.resultCount === nextProps.resultCount &&
//     prevProps.onFilterPress === nextProps.onFilterPress &&
//     prevProps.onSortPress === nextProps.onSortPress,
// );

// const SearchView = ({ navigation, route }) => {
//   console.log('SearchView rendered'); // Debug render
//   const {
//     searchTerm,
//     setSearchTerm,
//     results,
//     resultCount,
//     isLoading,
//     error,
//     onOrderPress,
//     onEditSearch,
//     onFilterPress,
//     onSortPress,
//     onHomePress,
//     onCartPress,
//     onPersonPress,
//   } = useSearchViewModel(navigation, route);

//   const [inputText, setInputText] = useState('');
//   const [selectedItems, setSelectedItems] = useState([]);
//   const inputRef = useRef(null);

//   // Handle order press - add item to selected items and navigate to checkout
//   const handleOrderPress = useCallback((item) => {
//     // Convert search result item to cart item format
//     const cartItem = {
//       id: item.id,
//       brand: 'Restaurant', // You can modify this based on your data structure
//       name: item.name,
//       description: `${item.rating} stars • ${item.distance} miles`,
//       price: item.price,
//       quantity: 1,
//       image: item.image,
//     };

//     // Set the selected items (you can accumulate multiple items if needed)
//     setSelectedItems([cartItem]);
    
//     // Navigate to checkout with the selected data
//     navigation.navigate('Checkout', { 
//       selectedItems: [cartItem],
//       fromSearch: true 
//     });
//   }, [navigation]);

//   // Memoize các callback
//   const memoizedSetInputText = useCallback((text) => {
//     setInputText(text);
//   }, []);

//   const memoizedHandleSubmit = useCallback(() => {
//     if (inputText.trim()) {
//       setSearchTerm(inputText.trim());
//     }
//     inputRef.current?.blur();
//   }, [inputText, setSearchTerm]);

//   const memoizedOnEditSearch = useCallback(() => {
//     setInputText('');
//     onEditSearch();
//     inputRef.current?.focus();
//   }, [onEditSearch]);

//   const renderListHeader = useCallback(
//     () => (
//       <>
//         <SearchInput
//           value={inputText}
//           onChangeText={memoizedSetInputText}
//           onSubmitEditing={memoizedHandleSubmit}
//           onClear={memoizedOnEditSearch}
//           inputRef={inputRef}
//         />
//         <FilterBar
//           onFilterPress={onFilterPress}
//           onSortPress={onSortPress}
//           resultCount={resultCount}
//         />
//         {isLoading && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={COLORS.primary} />
//           </View>
//         )}
//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}
//       </>
//     ),
//     [
//       inputText,
//       memoizedSetInputText,
//       memoizedHandleSubmit,
//       memoizedOnEditSearch,
//       onFilterPress,
//       onSortPress,
//       resultCount,
//       isLoading,
//       error,
//     ],
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <FlatList
//         data={results}
//         renderItem={({ item }) => (
//           <SearchResultCard item={item} onOrderPress={handleOrderPress} />
//         )}
//         keyExtractor={(item) => item.id}
//         ListHeaderComponent={renderListHeader}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//         initialNumToRender={10}
//         maxToRenderPerBatch={10}
//         windowSize={5}
//       />
//       <View style={styles.bottomTabBar}>
//         <TouchableOpacity style={styles.tabItem} onPress={onHomePress}>
//           <Ionicons name="home" size={26} color={COLORS.textPrimary} />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tabItem} onPress={onCartPress}>
//           <Ionicons name="cart-outline" size={28} color={COLORS.textPrimary} />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tabItem} onPress={onPersonPress}>
//           <Ionicons name="person-outline" size={26} color={COLORS.textPrimary} />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F7F7F7',
//   },
//   listContainer: {
//     paddingHorizontal: SIZES.padding,
//     paddingBottom: 100,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     paddingHorizontal: SIZES.base * 2,
//     marginTop: SIZES.base,
//     marginBottom: SIZES.padding,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#EFEFEF',
//   },
//   searchIcon: {
//     marginRight: SIZES.base,
//   },
//   searchInput: {
//     ...FONTS.h3,
//     flex: 1,
//     color: COLORS.textPrimary,
//   },
//   filterBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: SIZES.padding,
//   },
//   filterButtonsContainer: {
//     flexDirection: 'row',
//     gap: SIZES.base,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     paddingHorizontal: SIZES.base * 1.5,
//     paddingVertical: SIZES.base,
//     borderRadius: SIZES.radius * 2,
//     borderWidth: 1,
//     borderColor: COLORS.divider,
//     gap: SIZES.base / 2,
//   },
//   filterButtonText: {
//     ...FONTS.body4,
//     color: COLORS.textPrimary,
//   },
//   resultsText: {
//     ...FONTS.body4,
//     color: COLORS.textSecondary,
//   },
//   cardContainer: {
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     marginBottom: SIZES.padding,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardImage: {
//     width: '100%',
//     height: 150,
//   },
//   cardDetailsContainer: {
//     padding: SIZES.base * 2,
//   },
//   cardTitle: {
//     ...FONTS.h3,
//     color: COLORS.textPrimary,
//     marginBottom: SIZES.base,
//   },
//   cardMetaContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: SIZES.base * 2,
//   },
//   cardMetaText: {
//     ...FONTS.body4,
//     color: COLORS.textSecondary,
//     marginLeft: SIZES.base / 2,
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//   },
//   cardPrice: {
//     ...FONTS.h2,
//     color: COLORS.textPrimary,
//   },
//   cardPortionText: {
//     ...FONTS.body5,
//     color: COLORS.textSecondary,
//     marginLeft: SIZES.base / 2,
//   },
//   orderButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: SIZES.base * 1.25,
//     paddingHorizontal: SIZES.base * 3,
//     borderRadius: SIZES.radius,
//   },
//   orderButtonText: {
//     ...FONTS.h4,
//     color: COLORS.white,
//   },
//   bottomTabBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     height: 90,
//     backgroundColor: COLORS.white,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.divider,
//     paddingBottom: SIZES.padding,
//   },
//   tabItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     padding: SIZES.padding,
//   },
//   errorContainer: {
//     alignItems: 'center',
//     padding: SIZES.padding,
//   },
//   errorText: {
//     ...FONTS.body4,
//     color: COLORS.error,
//   },
// });

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

// Tối ưu SearchResultCard
const SearchResultCard = memo(
  ({ item, onOrderPress, onItemPress }) => {
    console.log(`SearchResultCard rendered: ${item.id}`); // Debug render
    return (
      <TouchableOpacity style={styles.cardContainer} onPress={() => onItemPress(item)}>
        <Image source={item.image} style={styles.cardImage} />
        <View style={styles.cardDetailsContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.cardMetaContainer}>
            <Icon name="star" size={14} color={COLORS.textSecondary} />
            <Text style={styles.cardMetaText}>
              {item.rating} ({item.reviewCount} reviews)
            </Text>
            <Ionicons
              name="location-outline"
              size={14}
              color={COLORS.textSecondary}
              style={{ marginLeft: SIZES.base }}
            />
            <Text style={styles.cardMetaText}>{item.distance} miles</Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.cardPortionText}>/ portion</Text>
            </View>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent card press when order button is pressed
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

// Tối ưu SearchInput
const SearchInput = memo(
  ({ value, onChangeText, onSubmitEditing, onClear, inputRef }) => {
    console.log('SearchInput rendered'); // Debug render
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
          placeholder="Tìm kiếm món ăn..."
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

// Tối ưu FilterBar
const FilterBar = memo(
  ({ onFilterPress, onSortPress, resultCount }) => {
    console.log('FilterBar rendered'); // Debug render
    return (
      <View style={styles.filterBar}>
        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <Text style={styles.filterButtonText}>Lọc</Text>
            <Icon name="chevron-down" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={onSortPress}>
            <Text style={styles.filterButtonText}>Sắp xếp</Text>
            <Icon name="chevron-down" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.resultsText}>{resultCount} kết quả</Text>
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.resultCount === nextProps.resultCount &&
    prevProps.onFilterPress === nextProps.onFilterPress &&
    prevProps.onSortPress === nextProps.onSortPress,
);

const SearchView = ({ navigation, route }) => {
  console.log('SearchView rendered'); // Debug render
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

  // Handle item press - navigate to dish detail with full dish data
  const handleItemPress = useCallback((item) => {
    // Transform search result item to dish detail format
    const dishData = {
      id: item.id,
      name: item.name,
      price: item.price,
      rating: item.rating,
      reviewCount: item.reviewCount,
      distance: item.distance,
      restaurantName: `Restaurant for ${item.name}`, // You can modify this based on your data structure
      description: `Delicious ${item.name} with ${item.rating} stars rating. Located ${item.distance} miles away with ${item.reviewCount} reviews from satisfied customers.`,
      image: item.image,
      reviews: [
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

  // Handle order press - add item to selected items and navigate to checkout
  const handleOrderPress = useCallback((item) => {
    // Convert search result item to cart item format
    const cartItem = {
      id: item.id,
      brand: 'Restaurant', // You can modify this based on your data structure
      name: item.name,
      description: `${item.rating} stars • ${item.distance} miles`,
      price: item.price,
      quantity: 1,
      image: item.image,
    };

    // Set the selected items (you can accumulate multiple items if needed)
    setSelectedItems([cartItem]);
    
    // Navigate to checkout with the selected data
    navigation.navigate('Checkout', { 
      selectedItems: [cartItem],
      fromSearch: true 
    });
  }, [navigation]);

  // Memoize các callback
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
  cardContainer: {
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
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardDetailsContainer: {
    padding: SIZES.base * 2,
  },
  cardTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
  },
  cardMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },
  cardMetaText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base / 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardPrice: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  cardPortionText: {
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