// src/viewmodels/PaymentSuccessViewModel.js
import { useEffect } from 'react';

export const usePaymentSuccessViewModel = (navigation) => {
  
  useEffect(() => {
    // Log successful payment when component mounts
    console.log('Payment completed successfully');
    
    // You can add additional logic here such as:
    // - Clear cart data
    // - Send analytics events
    // - Update order status
    // - Send confirmation emails
  }, []);

  const handleGoBack = () => {
    console.log('Navigating back to Home screen');
    // Navigate back to Home screen
    navigation.navigate('Home');
  };

  return {
    handleGoBack,
  };
};