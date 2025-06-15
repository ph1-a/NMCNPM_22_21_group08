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

const HomeView = ({ navigation }) => {
  const {
    searchTerm,
    setSearchTerm,
    offers,
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

  const renderBestOffers = () => (
    <View style={styles.section}>
      {renderSectionHeader(STRINGS.todaysBestOffer, onSeeAllOffersPress)}
      <View style={styles.divider}/>
      <FlatList
        data={offers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OfferCard 
            item={item} 
            onPress={() => onOfferPress(item)} // Pass the complete item data
          />
        )}
        contentContainerStyle={{ paddingLeft: SIZES.padding }}
      />
    </View>
  );
  
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
});

export default HomeView;