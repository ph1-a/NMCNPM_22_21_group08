// src/views/HomeView.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SIZES, FONTS, STRINGS } from '../utils/Constants';
import { useHomeViewModel } from '../viewmodels/HomeViewModel';
import OfferCard from '../components/OfferCard';

const QuickAccessButton = ({ iconName, label, onPress }) => (
  <TouchableOpacity style={styles.quickAccessButton} onPress={onPress}>
    <View style={styles.quickAccessIconContainer}>
      <Icon name={iconName} size={28} color={COLORS.black} />
    </View>
    <Text style={styles.quickAccessLabel}>{label}</Text>
  </TouchableOpacity>
);

const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary || COLORS.black} />
    <Text style={styles.loadingText}>Loading offers...</Text>
  </View>
);

const ErrorView = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <Icon name="wifi-off" size={48} color={COLORS.gray} />
    <Text style={styles.errorTitle}>Connection Error</Text>
    <Text style={styles.errorMessage}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const EmptyOffersView = () => (
  <View style={styles.emptyContainer}>
    <Icon name="package" size={48} color={COLORS.gray} />
    <Text style={styles.emptyTitle}>No Offers Available</Text>
    <Text style={styles.emptyMessage}>Check back later for delicious deals!</Text>
  </View>
);

const HomeView = ({ navigation }) => {
  const {
    searchTerm,
    setSearchTerm,
    offers,
    loading,
    error,
    retryLoadOffers,
    onOrderHistoryPress,
    onTrackOrderPress,
    onOfferPress,
    onSeeAllOffersPress,
    onCartPress,
    onPersonPress,
    onSearchPress,
  } = useHomeViewModel(navigation);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{STRINGS.mainMenuTitle}</Text>
    </View>
  );

  const renderSearchBar = () => (
    <TouchableOpacity style={styles.searchContainer} onPress={onSearchPress}>
      <Icon name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={STRINGS.searchPlaceholder}
        placeholderTextColor={COLORS.gray}
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={onSearchPress}
        returnKeyType="search"
      />
    </TouchableOpacity>
  );

  const renderSectionHeader = (title, onPress) => (
    <TouchableOpacity style={styles.sectionHeaderContainer} onPress={onPress}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <Icon name="chevron-right" size={22} color={COLORS.gray} />
    </TouchableOpacity>
  );

  const renderQuickAccess = () => (
    <View style={styles.section}>
      {renderSectionHeader(STRINGS.quickAccess)}
      <View style={styles.quickAccessContainer}>
        <QuickAccessButton iconName="clipboard" label={STRINGS.orderHistory} onPress={onOrderHistoryPress} />
        <QuickAccessButton iconName="truck" label={STRINGS.trackingOrder} onPress={onTrackOrderPress} />
      </View>
    </View>
  );

  const renderBestOffers = () => {
    if (loading) {
      return (
        <View style={styles.section}>
          {renderSectionHeader(STRINGS.todaysBestOffer, onSeeAllOffersPress)}
          <View style={styles.divider}/>
          <LoadingView />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.section}>
          {renderSectionHeader(STRINGS.todaysBestOffer, onSeeAllOffersPress)}
          <View style={styles.divider}/>
          <ErrorView error={error} onRetry={retryLoadOffers} />
        </View>
      );
    }

    if (!offers || offers.length === 0) {
      return (
        <View style={styles.section}>
          {renderSectionHeader(STRINGS.todaysBestOffer, onSeeAllOffersPress)}
          <View style={styles.divider}/>
          <EmptyOffersView />
        </View>
      );
    }

    return (
      <View style={styles.section}>
        {renderSectionHeader(STRINGS.todaysBestOffer, onSeeAllOffersPress)}
        <View style={styles.divider}/>
        <FlatList
          data={offers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <OfferCard 
              item={item} 
              onPress={() => onOfferPress(item)}
            />
          )}
          contentContainerStyle={{ paddingLeft: SIZES.padding }}
        />
      </View>
    );
  };
  
  const renderBottomNav = () => (
    <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.navButton}>
            <Icon name="home" size={28} color={COLORS.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={onCartPress}>
            <Icon name="shopping-cart" size={28} color={COLORS.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={onPersonPress}>
            <Icon name="user" size={28} color={COLORS.gray} />
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={retryLoadOffers}
            colors={[COLORS.primary || COLORS.black]}
          />
        }
      >
        {renderHeader()}
        {renderSearchBar()}
        {renderQuickAccess()}
        {renderBestOffers()}
      </ScrollView>
      {renderBottomNav()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding2,
    paddingBottom: SIZES.base,
  },
  headerTitle: {
    ...FONTS.h1,
    color: COLORS.black,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    paddingHorizontal: SIZES.base,
    marginBottom: SIZES.padding,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: SIZES.base,
  },
  searchInput: {
    ...FONTS.body3,
    flex: 1,
    color: COLORS.black,
  },
  section: {
    marginBottom: SIZES.padding2 * 1.5,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 1.5,
  },
  sectionHeaderTitle: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    justifyContent: 'space-between',
  },
  quickAccessButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SIZES.base,
  },
  quickAccessIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.base,
  },
  quickAccessLabel: {
    ...FONTS.body4,
    color: COLORS.black,
    textAlign: 'center',
  },
  bottomNavContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding2,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.base,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 0.01,
    marginBottom: 30,
  },
  // Loading states
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginTop: 10,
  },
  // Error states
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: SIZES.padding,
  },
  errorTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary || COLORS.black,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default HomeView;