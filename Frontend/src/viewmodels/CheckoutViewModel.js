import { useState, useMemo } from 'react';
import { Alert } from 'react-native';

const MOCK_CART_ITEMS = [
  {
    id: '1',
    brand: 'Brand',
    name: 'Product name',
    description: 'Description',
    price: 10.99,
    quantity: 1,
    image: require('../assets/images/food_1.jpg'),
  },
  {
    id: '2',
    brand: 'Brand',
    name: 'Product name',
    description: 'Description',
    price: 8.99,
    quantity: 1,
    image: require('../assets/images/food_2.jpg'),
  },
];

const TAX_RATE = 0.08; // 8% tax

export const useCheckoutViewModel = (navigation) => {
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

  const handleChangeQuantity = (itemId, change) => {
    setCartItems(prevItems =>
      prevItems
        .map(item => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0) // Remove item if quantity is 0
    );
  };
  
  const { subtotal, totalItems, taxes, total, shippingCost } = useMemo(() => {
    const sub = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const tax = sub * TAX_RATE;
    const shipping = 0; // Free shipping as per UI
    const finalTotal = sub + tax + shipping;
    
    return {
      subtotal: sub,
      totalItems: count,
      taxes: tax,
      shippingCost: shipping,
      total: finalTotal,
    };
  }, [cartItems]);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }
    Alert.alert('Order Placed!', `Your total is ${total.toFixed(2)}. Thank you for your purchase.`);
    // Here you would typically clear the cart and navigate to an order confirmation screen.
    // navigation.navigate('PaymentSuccess');
    try {
  navigation.navigate('PaymentSuccess');
} catch (error) {
  console.error('Navigation error:', error);
}
  };
  
  const handleGoBack = () => {
      console.log('Navigate back');
  };
  
  const handleNavigation = (screen) => {
      Alert.alert('Navigate', `Navigating to ${screen} screen.`);
  };

  return {
    cartItems,
    setCartItems, // Export this so the view can update cart items
    handleChangeQuantity,
    subtotal,
    totalItems,
    taxes,
    shippingCost,
    total,
    handlePlaceOrder,
    handleGoBack,
    handleNavigation,
  };
};