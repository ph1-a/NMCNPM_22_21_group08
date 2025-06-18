// src/components/LoadingOverlay.js
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const LoadingOverlay = ({ 
  visible = false, 
  message = 'Loading...', 
  transparent = true,
  color = '#007AFF',
  size = 'large'
}) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size={size} color={color} />
          {message && <Text style={[styles.message, { color }]}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

// Inline loading component (without modal)
export const InlineLoading = ({ 
  message = 'Loading...', 
  color = '#007AFF',
  size = 'small',
  style = {}
}) => {
  return (
    <View style={[styles.inlineContainer, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={[styles.inlineMessage, { color }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inlineMessage: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadingOverlay;