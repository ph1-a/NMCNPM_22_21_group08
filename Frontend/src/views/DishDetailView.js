// src/views/DishDetailView/DishDetailView.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDishDetailViewModel } from '../viewmodels/DishDetailViewModel';
import { COLORS, SIZES, FONTS } from '../utils/Constants';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ReviewCard = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{review.userInitial}</Text>
      </View>
      <View style={styles.reviewUserInfo}>
        <Text style={styles.reviewUsername}>{review.username}</Text>
        <Text style={styles.reviewComment}>{review.comment}</Text>
      </View>
    </View>
    <View style={styles.reviewRatingBox}>
      <Text style={styles.reviewRatingText}>{review.rating}/5</Text>
      <Icon name="star" size={12} color={COLORS.textPrimary} />
    </View>
  </View>
);

const DishDetailView = ({navigation, route}) => {
  const {
    dish,
    reviews,
    isBookmarked,
    handleGoBack,
    toggleBookmark,
    handleOrder,
  } = useDishDetailViewModel(navigation, route);

  // Show loading or error state if no dish data
  if (!dish || !dish.id) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No dish data available</Text>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.orderButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleBookmark}>
            <Icon name="bookmark" size={24} color={isBookmarked ? COLORS.primary : COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.dishInfoContainer}>
          <Image source={dish.image} style={styles.dishImage} />
          <View style={styles.dishTitleContainer}>
            <Text style={styles.dishName}>{dish.name}</Text>
            <Text style={styles.dishPrice}>${dish.price?.toFixed(2) || '0.00'}</Text>
            <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
              <Text style={styles.orderButtonText}>Order</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.restaurantInfoContainer}>
            <Text style={styles.restaurantName}>{dish.restaurantName}</Text>
            <View style={styles.metaContainer}>
                <Icon name="star" size={14} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{dish.rating} ({dish.reviewCount} reviews)</Text>
                <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} style={{ marginLeft: SIZES.base * 2 }}/>
                <Text style={styles.metaText}>{dish.distance} miles</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{dish.name}'s Description</Text>
            <Text style={styles.descriptionText}>{dish.description}</Text>
        </View>

        {reviews && reviews.length > 0 && (
          <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
          </View>
        )}

      </ScrollView>
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home-outline" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="cart-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
         <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person-outline" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100, // Space for tab bar
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  errorText: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SIZES.base,
    paddingBottom: SIZES.padding,
  },
  dishInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  dishImage: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius * 2,
    marginRight: SIZES.base * 2,
  },
  dishTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dishName: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
  },
  dishPrice: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SIZES.base * 2,
  },
  orderButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.base * 3,
    borderRadius: SIZES.radius * 2,
    alignSelf: 'flex-start',
  },
  orderButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: '600',
  },
  restaurantInfoContainer: {
    marginBottom: SIZES.padding,
  },
  restaurantName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base / 2,
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  descriptionText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.base * 2,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: SIZES.base,
    borderColor: COLORS.divider,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8D9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base * 1.5,
  },
  avatarText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  reviewUserInfo: {
      flex: 1,
  },
  reviewUsername: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  reviewComment: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  reviewRatingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginLeft: SIZES.base,
  },
  reviewRatingText: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
    marginRight: SIZES.base / 2,
    fontWeight: '600',
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
  backButton: {
    padding: 10,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 24,
  },
});

export default DishDetailView;