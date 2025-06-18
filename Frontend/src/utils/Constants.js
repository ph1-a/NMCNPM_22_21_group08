// src/utils/Constants.js
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#8A3FFC',
  white: '#FFFFFF',
  black: '#000000',
  lightGrey: '#F0F0F0',
  grey: '#A9A9A9',
  textPrimary: '#1C1C1E',
  textSecondary: '#6E6E73',
  divider: '#E5E5EA',
  borderColor: '#D1D1D6',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  largeTitle: 34,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body3: 16,
  body4: 14,
  body5: 12,

  width,
  height,
};

export const FONTS = {
  h1: { fontFamily: 'System', fontSize: SIZES.h1, fontWeight: 'bold' },
  h2: { fontFamily: 'System', fontSize: SIZES.h2, fontWeight: 'bold' },
  h3: { fontFamily: 'System', fontSize: SIZES.h3, fontWeight: 'bold' },
  h4: { fontFamily: 'System', fontSize: SIZES.h4, fontWeight: 'bold' },
  body3: { fontFamily: 'System', fontSize: SIZES.body3 },
  body4: { fontFamily: 'System', fontSize: SIZES.body4 },
  body5: { fontFamily: 'System', fontSize: SIZES.body5 },
};

export const STRINGS = {
  paymentSuccessTitle: 'Success !',
  paymentSuccessMessage: 'Your payment was successful.\nA receipt for this purchase has been sent to your email.',
  goBackButtonText: 'Go Back',

  loginErrorTitle: 'Login Failed',
  loginErrorMessage: 'Incorrect username or password.\nPlease try again.',
  
  searchPlaceholder: 'Search',
  quickAccess: 'Chức năng',
  orderHistory: 'Lịch sử',
  trackingOrder: 'Theo dõi',
  todaysBestOffer: 'Có thể bạn sẽ thích?',
};

const appTheme = { COLORS, SIZES, FONTS, STRINGS };

export default appTheme;