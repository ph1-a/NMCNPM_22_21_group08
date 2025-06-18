// src/utils/networkUtils.js
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

class NetworkManager {
  constructor() {
    this.isConnected = true;
    this.connectionType = 'unknown';
    this.listeners = [];
    this.retryQueue = [];
    
    this.init();
  }

  init() {
    // Subscribe to network state updates
    NetInfo.addEventListener(state => {
      const wasConnected = this.isConnected;
      this.isConnected = state.isConnected;
      this.connectionType = state.type;

      // Notify listeners
      this.listeners.forEach(listener => listener(state));

      // Process retry queue if connection restored
      if (!wasConnected && this.isConnected) {
        this.processRetryQueue();
      }

      // Show connection status
      if (!wasConnected && this.isConnected) {
        Alert.alert('Connection Restored', 'You are back online!');
      } else if (wasConnected && !this.isConnected) {
        Alert.alert('No Internet', 'Please check your internet connection.');
      }
    });
  }

  // Add network state listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Check current network state
  async getCurrentState() {
    const state = await NetInfo.fetch();
    return state;
  }

  // Add request to retry queue
  addToRetryQueue(requestFunction, maxRetries = 3) {
    this.retryQueue.push({
      request: requestFunction,
      maxRetries,
      currentRetries: 0
    });
  }

  // Process pending requests when connection restored
  async processRetryQueue() {
    const queue = [...this.retryQueue];
    this.retryQueue = [];

    for (const item of queue) {
      try {
        await item.request();
      } catch (error) {
        item.currentRetries++;
        if (item.currentRetries < item.maxRetries) {
          this.retryQueue.push(item);
        } else {
          console.error('Max retries reached for request:', error);
        }
      }
    }
  }

  // Wrapper for API calls with network check
  async withNetworkCheck(apiCall, options = {}) {
    const { showAlert = true, addToRetryQueue = false } = options;

    if (!this.isConnected) {
      const errorMessage = 'No internet connection. Please check your network settings.';
      
      if (showAlert) {
        Alert.alert('Network Error', errorMessage);
      }

      if (addToRetryQueue) {
        this.addToRetryQueue(apiCall);
      }

      throw new Error(errorMessage);
    }

    try {
      return await apiCall();
    } catch (error) {
      // Check if error is network related
      if (error.message.includes('Network request failed') || 
          error.message.includes('timeout')) {
        
        if (addToRetryQueue) {
          this.addToRetryQueue(apiCall);
        }

        if (showAlert) {
          Alert.alert(
            'Network Error', 
            'Request failed. Please try again later.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Retry', onPress: () => this.withNetworkCheck(apiCall, options) }
            ]
          );
        }
      }
      throw error;
    }
  }
}

// Create singleton instance
export const networkManager = new NetworkManager();

// Hook for using network state in components
import { useState, useEffect } from 'react';

export const useNetworkState = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const unsubscribe = networkManager.addListener((state) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Get initial state
    networkManager.getCurrentState().then(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return unsubscribe;
  }, []);

  return { isConnected, connectionType };
};