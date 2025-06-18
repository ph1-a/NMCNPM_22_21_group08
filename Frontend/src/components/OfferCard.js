// src/components/OfferCard.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SIZES, FONTS } from '../utils/Constants';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const OfferCard = ({ item, onPress }) => {
  const handlePress = () => {
    onPress(item.id);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.dishName} numberOfLines={1}>
          {item.dishName}
        </Text>
        <View style={styles.restaurantContainer}>
          <Icon name="map-pin" size={14} color={COLORS.gray} />
          <Text style={styles.restaurantName} numberOfLines={1}>
            {item.restaurant}
          </Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#FFD700" fill="#FFD700" />
          <Text style={styles.ratingText}>4.5</Text>
          <Text style={styles.reviewText}>(120+ reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginRight: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    top: SIZES.base,
    right: SIZES.base,
    backgroundColor: COLORS.primary || '#FF6B35',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius / 2,
  },
  priceText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: SIZES.padding,
  },
  dishName: {
    ...FONTS.h3,
    color: COLORS.black,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  restaurantName: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: SIZES.base / 2,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...FONTS.body4,
    color: COLORS.black,
    marginLeft: SIZES.base / 2,
    fontWeight: '600',
  },
  reviewText: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginLeft: SIZES.base / 2,
  },
});

export default OfferCard;