// src/views/UserView/UserView.js
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
import { useUserViewModel } from '../viewmodels/UserViewModel';
import { COLORS, SIZES, FONTS } from '../utils/Constants';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ActionCard = ({ iconName, text, onPress }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Icon name={iconName} size={24} color={COLORS.primary} />
    </View>
    <Text style={styles.cardText}>{text}</Text>
  </TouchableOpacity>
);

const SettingCard = ({ iconName, text, onPress }) => (
    <TouchableOpacity style={styles.settingCard} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={22} color={COLORS.primary} />
      </View>
      <Text style={styles.cardText}>{text}</Text>
    </TouchableOpacity>
  );

const UserView = ({navigation}) => {
  const {
    handleNavigation,
    openDrawer,
    openProfile,
    onHomePress,
    onCartPress,
    onPersonPress,
    handleLogout,
  } = useUserViewModel(navigation);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={openDrawer}>
            <Icon name="menu" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openProfile}>
            <Image
              source={require('../assets/images/avatar.jpg')}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* Order Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          <View style={styles.cardGroup}>
            <ActionCard
                iconName="file-text"
                text="View Order History"
                onPress={() => handleNavigation('Order History')}
            />
            <ActionCard
                iconName="truck"
                text="Track Order Status"
                onPress={() => handleNavigation('Track Order')}
            />
            <ActionCard
                iconName="star"
                text="Rating"
                onPress={() => handleNavigation('Rating')}
            />
          </View>
        </View>

        {/* Setting Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Setting</Text>
          <View style={styles.settingCardsContainer}>
            <SettingCard
                iconName="lock"
                text="Security"
                onPress={() => handleNavigation('Security')}
            />
            <SettingCard
                iconName="home"
                text="Address"
                onPress={() => handleNavigation('Address')}
            />
          </View>
          <View style={styles.settingCardsContainer}>
            <SettingCard
                iconName="log-out"
                text="Log out"
                onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.bottomTabItem} onPress={onHomePress}>
          <Ionicons name="home-outline" size={26} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTabItem} onPress={onCartPress}>
          <Ionicons name="cart-outline" size={28} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTabItem} onPress={onPersonPress}>
          <Ionicons name="person" size={26} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base * 1.5,
  },
  cardGroup: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
  },
  settingCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  settingCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base * 2,
  },
  cardText: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: '600'
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingBottom: SIZES.padding,
  },
  bottomTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserView;