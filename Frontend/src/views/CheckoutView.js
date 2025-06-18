// src/views/CheckoutView/CheckoutView.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../utils/Constants';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { orderApi } from '../services/api';
import { tokenStorage } from '../utils/tokenStorage';

const CheckoutItemCard = ({ item, onQuantityChange }) => (
  <View style={styles.itemCard}>
    <Image 
      source={{ uri: item.image }} 
      style={styles.itemImage}
      resizeMode="cover"
    />
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemBrand}>{item.brand}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <View style={styles.priceQuantityContainer}>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
          >
            <Icon name="minus" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            <Icon name="plus" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const CheckoutView = ({ navigation, route }) => {
  const { selectedItems = [], fromDishDetail = false, fromSearch = false } = route.params || {};
  const [items, setItems] = useState(selectedItems);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleQuantityChange = (itemId, newQuantity) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const deliveryFee = 2.99;
  const tax = calculateSubtotal() * 0.08; // 8% tax
  const total = calculateSubtotal() + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }
    if (!deliveryAddress.trim()) {
      Alert.alert('Missing Address', 'Please enter your delivery address.');
      return;
    }

    try {
      const token = tokenStorage.getToken();
      if (!token) {
        Alert.alert('Authentication Required', 'Please sign in to place an order.');
        return;
      }

      const orderData = {
        items: items.map(item => ({
          foodId: item.id,
          quantity: item.quantity
        })),
        address: deliveryAddress
      };
      await orderApi.createOrder(orderData, token);
      navigation.navigate('PaymentSuccess');
    } catch (error) {
      Alert.alert('Order Failed', error.message || 'Could not place order.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Order Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          {items.map(item => (
            <CheckoutItemCard
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </View>

        {/* Delivery Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressContainer}>
            <Icon name="map-pin" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.addressInput}
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Enter your delivery address"
              multiline
            />
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('card')}
          >
            <Icon name="credit-card" size={20} color={COLORS.textPrimary} />
            <Text style={styles.paymentText}>Credit/Debit Card</Text>
            {paymentMethod === 'card' && <Icon name="check" size={20} color={COLORS.primary} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'cash' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Icon name="dollar-sign" size={20} color={COLORS.textPrimary} />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
            {paymentMethod === 'cash' && <Icon name="check" size={20} color={COLORS.primary} />}
          </TouchableOpacity>
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${calculateSubtotal().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order • ${total.toFixed(2)}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.base,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backButton: {
    padding: 10,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 24,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  container: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  section: {
    marginTop: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.base * 1.5,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SIZES.base * 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base * 1.5,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base / 2,
  },
  itemBrand: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 2,
  },
  itemDescription: {
    ...FONTS.body5,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base,
  },
  quantityButton: {
    padding: SIZES.base,
  },
  quantityText: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginHorizontal: SIZES.base,
    minWidth: 30,
    textAlign: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
  },
  addressInput: {
    ...FONTS.body3,
    flex: 1,
    marginLeft: SIZES.base,
    color: COLORS.textPrimary,
    minHeight: 50,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base * 2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SIZES.base,
  },
  selectedPayment: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  paymentText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    marginLeft: SIZES.base * 1.5,
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  summaryLabel: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SIZES.base,
    marginTop: SIZES.base,
    marginBottom: 0,
  },
  totalLabel: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  totalValue: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius * 2,
    paddingVertical: SIZES.base * 2,
    alignItems: 'center',
  },
  placeOrderText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default CheckoutView;