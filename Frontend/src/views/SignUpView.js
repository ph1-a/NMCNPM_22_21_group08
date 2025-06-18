// src/views/SignUpView/SignUpView.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSignUpViewModel } from '../viewmodels/SignUpViewModel';
import { COLORS, SIZES, FONTS } from '../utils/Constants';

const OrDivider = () => (
  <View style={styles.dividerContainer}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>or</Text>
    <View style={styles.dividerLine} />
  </View>
);

const SignUpView = ({ navigation }) => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    phoneNumber,
    setPhoneNumber,
    handleSignUp,
    handleGoogleSignUp,
    handleAppleSignUp,
  } = useSignUpViewModel(navigation);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Text style={styles.brandTitle}>A & H</Text>
              <Text style={styles.title}>Sign Up</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={COLORS.grey}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.grey}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Re-enter Password"
                placeholderTextColor={COLORS.grey}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor={COLORS.grey}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSignUp}
                activeOpacity={0.8}>
                <Text style={styles.primaryButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>

            <OrDivider />

            <View style={styles.socialLoginContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignUp}
                activeOpacity={0.8}>
                <Image
                  source={require('../assets/icons/google.png')}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleSignUp}
                activeOpacity={0.8}>
                <Image
                  source={require('../assets/icons/apple.png')}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By clicking continue, you agree to our{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 1.5,
  },
  brandTitle: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginBottom: SIZES.padding * 0.75,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    ...FONTS.body3,
    height: 52,
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
    color: COLORS.textPrimary,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: SIZES.base,
  },
  primaryButtonText: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.padding * 1.2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  dividerText: {
    ...FONTS.body4,
    color: COLORS.grey,
    marginHorizontal: SIZES.base * 2,
  },
  socialLoginContainer: {
    width: '100%',
    gap: SIZES.base * 2,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGrey,
    height: 52,
    borderRadius: SIZES.radius,
    width: '100%',
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: SIZES.base * 1.5,
  },
  socialButtonText: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
  },
  footer: {
    marginTop: SIZES.padding * 2,
    alignItems: 'center',
  },
  footerText: {
    ...FONTS.body5,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
});

export default SignUpView;