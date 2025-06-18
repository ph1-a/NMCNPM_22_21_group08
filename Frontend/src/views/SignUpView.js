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
  ActivityIndicator,
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
    email,
    setEmail,
    isLoading,
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
                placeholder="Email"
                placeholderTextColor={COLORS.grey}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={COLORS.grey}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.grey}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
              <TextInput
                style={styles.input}
                placeholder="Re-enter Password"
                placeholderTextColor={COLORS.grey}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor={COLORS.grey}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.disabledButton]}
                onPress={handleSignUp}
                activeOpacity={0.8}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>

            <OrDivider />

            <View style={styles.socialLoginContainer}>
              <TouchableOpacity
                style={[styles.socialButton, isLoading && styles.disabledButton]}
                onPress={handleGoogleSignUp}
                activeOpacity={0.8}
                disabled={isLoading}>
                <Image
                  source={require('../assets/icons/google.png')}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, isLoading && styles.disabledButton]}
                onPress={handleAppleSignUp}
                activeOpacity={0.8}
                disabled={isLoading}>
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
  disabledButton: {
    opacity: 0.6,
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