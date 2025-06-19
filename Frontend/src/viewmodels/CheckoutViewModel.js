import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { orderApi } from '../services/api';

const TAX_RATE = 0.08; // 8% tax
const DELIVERY_FEE = 2.99;

export const useCheckoutViewModel = (navigation, initialItems = []) => {
  const [cartItems, setCartItems] = useState(initialItems);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove item if quantity becomes 0 or less
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const { subtotal, totalItems, taxes, total, shippingCost } = useMemo(() => {
    const sub = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const tax = sub * TAX_RATE;
    const shipping = DELIVERY_FEE;
    const finalTotal = sub + tax + shipping;
    
    return {
      subtotal: sub,
      totalItems: count,
      taxes: tax,
      shippingCost: shipping,
      total: finalTotal,
    };
  }, [cartItems]);

  const handlePlaceOrder = async (userId, restaurantId) => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }

    if (!deliveryAddress.trim()) {
      Alert.alert('Missing Address', 'Please enter your delivery address.');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare order data to match backend structure
      const orderData = {
        userId,
        restaurantId,
        items: cartItems.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        address: deliveryAddress.trim(),
        paymentMethod,
        subtotal,
        taxes,
        shippingCost,
        total
      };

      const response = await orderApi.createOrder(orderData);
      
      Alert.alert(
        'Order Placed Successfully!', 
        `Your order total is $${total.toFixed(2)}. Thank you for your purchase!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear cart and navigate to success page
              setCartItems([]);
              navigation.navigate('PaymentSuccess', { orderId: response.orderId });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Order placement error:', error);
      Alert.alert(
        'Order Failed', 
        error.message || 'Could not place order. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const updateDeliveryAddress = (address) => {
    setDeliveryAddress(address);
  };

  const updatePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  return {
    // State
    cartItems,
    deliveryAddress,
    paymentMethod,
    isLoading,
    
    // Computed values
    subtotal,
    totalItems,
    taxes,
    shippingCost,
    total,
    
    // Actions
    setCartItems,
    handleChangeQuantity,
    handlePlaceOrder,
    handleGoBack,
    handleNavigation,
    updateDeliveryAddress,
    updatePaymentMethod,
  };
};