// src/views/PaymentSuccess/PaymentSuccessView.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { usePaymentSuccessViewModel } from '../viewmodels/FailedLoginViewModel.js';
import { COLORS, FONTS, SIZES, STRINGS } from '../utils/Constants';

const PaymentSuccessView = () => {
  const { handleGoBack } = usePaymentSuccessViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon name="check" size={50} color={COLORS.white} />
        </View>

        <Text style={styles.title}>{STRINGS.loginErrorTitle}</Text>

        <Text style={styles.message}>{STRINGS.loginErrorMessage}</Text>

        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>{STRINGS.goBackButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary, // Note: The design shows red, but constants provide a primary purple color.
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: SIZES.base * 2,
  },
  message: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.padding * 1.5,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 2,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.white,
  },
});

export default PaymentSuccessView;