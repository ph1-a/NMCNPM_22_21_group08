// // src/services/api.js
// const API_BASE_URL = __DEV__ 
//   ? 'http://10.0.2.2:3000/api'  // Android emulator
//   : 'https://your-production-api.com/api'; // Production

// // Token management utility
// const TokenManager = {
//   getToken: () => {
//     // In React Native, you'd use AsyncStorage
//     // For now, we'll use a simple variable
//     return global.authToken || null;
//   },
  
//   setToken: (token) => {
//     global.authToken = token;
//   },
  
//   clearToken: () => {
//     global.authToken = null;
//   }
// };

// // Enhanced error handling
// const handleApiError = async (response) => {
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.message || `API Error: ${response.status}`);
//   }
//   return response;
// };

// // Base fetch wrapper with common headers
// const apiFetch = async (url, options = {}) => {
//   const token = TokenManager.getToken();
  
//   const defaultHeaders = {
//     'Content-Type': 'application/json',
//     ...(token && { 'Authorization': `Bearer ${token}` }),
//   };

//   const config = {
//     ...options,
//     headers: {
//       ...defaultHeaders,
//       ...options.headers,
//     },
//   };

//   try {
//     const response = await fetch(url, config);
//     await handleApiError(response);
//     return await response.json();
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };

// // Auth API
// export const authApi = {
//   signup: async (userData) => {
//     const data = await apiFetch(`${API_BASE_URL}/users/signup`, {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     });
    
//     // Store token if signup returns one
//     if (data.token) {
//       TokenManager.setToken(data.token);
//     }
    
//     return data;
//   },

//   signin: async (credentials) => {
//     const data = await apiFetch(`${API_BASE_URL}/users/signin`, {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//     });
    
//     // Store token on successful login
//     if (data.token) {
//       TokenManager.setToken(data.token);
//     }
    
//     return data;
//   },

//   logout: () => {
//     TokenManager.clearToken();
//   },

//   // Check if user is authenticated
//   isAuthenticated: () => {
//     return !!TokenManager.getToken();
//   }
// };

// // Search API
// export const searchApi = {
//   search: async (query, filters = {}) => {
//     if (!query) {
//       throw new Error('Search query is required');
//     }

//     const queryParams = new URLSearchParams({
//       query,
//       ...(Object.keys(filters).length > 0 && { filters: JSON.stringify(filters) })
//     });

//     return await apiFetch(`${API_BASE_URL}/search?${queryParams}`);
//   }
// };

// // Order API - Updated to match backend structure
// export const orderApi = {
//   createOrder: async (orderData) => {
//     // Validate required fields
//     if (!orderData.userId) {
//       throw new Error('User ID is required');
//     }
//     if (!orderData.restaurantId) {
//       throw new Error('Restaurant ID is required');
//     }
//     if (!orderData.items || orderData.items.length === 0) {
//       throw new Error('Order items are required');
//     }
//     if (!orderData.address || !orderData.address.trim()) {
//       throw new Error('Delivery address is required');
//     }

//     // Structure the data to match backend expectations
//     const backendOrderData = {
//       userId: orderData.userId,
//       restaurantId: orderData.restaurantId,
//       items: orderData.items.map(item => ({
//         menuItemId: item.menuItemId,
//         quantity: item.quantity,
//         price: item.price
//       })),
//       address: orderData.address.trim(),
//       status: 'Pending', // Default status
//       // Backend will calculate total, but we can send it for validation
//       expectedTotal: orderData.total,
//       // Additional order details
//       paymentMethod: orderData.paymentMethod || 'cash',
//       subtotal: orderData.subtotal,
//       taxes: orderData.taxes,
//       shippingCost: orderData.shippingCost,
//       orderDate: new Date().toISOString()
//     };

//     console.log('Sending order data:', backendOrderData);

//     try {
//       const response = await apiFetch(`${API_BASE_URL}/orders`, {
//         method: 'POST',
//         body: JSON.stringify(backendOrderData),
//       });

//       console.log('Order created successfully:', response);
//       return response;
//     } catch (error) {
//       console.error('Create order error:', error);
//       // Provide more specific error messages
//       if (error.message.includes('401')) {
//         throw new Error('Please log in to place an order');
//       } else if (error.message.includes('400')) {
//         throw new Error('Invalid order data. Please check your order details.');
//       } else if (error.message.includes('500')) {
//         throw new Error('Server error. Please try again later.');
//       }
//       throw error;
//     }
//   },

//   getOrders: async () => {
//     try {
//       return await apiFetch(`${API_BASE_URL}/orders`);
//     } catch (error) {
//       console.error('Get orders error:', error);
//       throw new Error('Failed to fetch orders');
//     }
//   },

//   getOrderDetails: async (orderId) => {
//     if (!orderId) {
//       throw new Error('Order ID is required');
//     }

//     try {
//       return await apiFetch(`${API_BASE_URL}/orders/${orderId}`);
//     } catch (error) {
//       console.error('Get order details error:', error);
//       throw new Error('Failed to fetch order details');
//     }
//   },

//   markAsPaid: async (orderId) => {
//     if (!orderId) {
//       throw new Error('Order ID is required');
//     }

//     try {
//       return await apiFetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
//         method: 'PUT',
//       });
//     } catch (error) {
//       console.error('Mark as paid error:', error);
//       throw new Error('Failed to mark order as paid');
//     }
//   },

//   // Update order status
//   updateOrderStatus: async (orderId, status) => {
//     if (!orderId) {
//       throw new Error('Order ID is required');
//     }
//     if (!status) {
//       throw new Error('Status is required');
//     }

//     try {
//       return await apiFetch(`${API_BASE_URL}/orders/${orderId}/status`, {
//         method: 'PUT',
//         body: JSON.stringify({ status }),
//       });
//     } catch (error) {
//       console.error('Update order status error:', error);
//       throw new Error('Failed to update order status');
//     }
//   },

//   // Cancel order
//   cancelOrder: async (orderId, reason = '') => {
//     if (!orderId) {
//       throw new Error('Order ID is required');
//     }

//     try {
//       return await apiFetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
//         method: 'PUT',
//         body: JSON.stringify({ reason }),
//       });
//     } catch (error) {
//       console.error('Cancel order error:', error);
//       throw new Error('Failed to cancel order');
//     }
//   }
// };

// // Export token manager for use in components
// export { TokenManager };

// Enhanced error handling - UPDATED FUNCTION

// const handleApiError = async (response) => {
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
    
//     // Handle authentication errors specifically
//     if (response.status === 401) {
//       TokenManager.clearToken();
//       // Trigger auth error callback if available
//       if (global.authErrorCallback) {
//         global.authErrorCallback();
//       }
//       throw new Error('Authentication failed. Please log in again.');
//     }
    
//     throw new Error(errorData.message || `API Error: ${response.status}`);
//   }
//   return response;
// };

// // Auth API - UPDATED FUNCTIONS
// export const authApi = {
//   signup: async (userData) => {
//     const data = await apiFetch(`${API_BASE_URL}/users/signup`, {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     });
    
//     // Store token if signup returns one
//     if (data.token) {
//       TokenManager.setToken(data.token);
//     }
    
//     return data;
//   },

//   signin: async (credentials) => {
//     const data = await apiFetch(`${API_BASE_URL}/users/signin`, {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//     });
    
//     // Store token on successful login
//     if (data.token) {
//       TokenManager.setToken(data.token);
//     }
    
//     return data;
//   },

//   // NEW FUNCTION - Add token validation
//   validateToken: async (token) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/validate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ token }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         return { valid: true, ...data };
//       } else {
//         return { valid: false };
//       }
//     } catch (error) {
//       console.error('Token validation error:', error);
//       return { valid: false };
//     }
//   },

//   logout: () => {
//     TokenManager.clearToken();
//   },

//   // Check if user is authenticated
//   isAuthenticated: () => {
//     return !!TokenManager.getToken();
//   },

//   // NEW FUNCTION - Set auth error callback
//   setAuthErrorCallback: (callback) => {
//     global.authErrorCallback = callback;
//   }
// };

// src/services/api.js
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Android emulator
  : 'https://your-production-api.com/api'; // Production

// Token management utility
const TokenManager = {
  getToken: () => {
    // In React Native, you'd use AsyncStorage
    // For now, we'll use a simple variable
    return global.authToken || null;
  },
  
  setToken: (token) => {
    global.authToken = token;
  },
  
  clearToken: () => {
    global.authToken = null;
  }
};

// Enhanced error handling
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle authentication errors specifically
    if (response.status === 401) {
      TokenManager.clearToken();
      // Trigger auth error callback if available
      if (global.authErrorCallback) {
        global.authErrorCallback();
      }
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response;
};

// Base fetch wrapper with common headers
const apiFetch = async (url, options = {}) => {
  const token = TokenManager.getToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    await handleApiError(response);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authApi = {
  signup: async (userData) => {
    const data = await apiFetch(`${API_BASE_URL}/users/signup`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token if signup returns one
    if (data.token) {
      TokenManager.setToken(data.token);
    }
    
    return data;
  },

  signin: async (credentials) => {
    const data = await apiFetch(`${API_BASE_URL}/users/signin`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token on successful login
    if (data.token) {
      TokenManager.setToken(data.token);
    }
    
    return data;
  },

  // Token validation
  validateToken: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        return { valid: true, ...data };
      } else {
        return { valid: false };
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  },

  logout: () => {
    TokenManager.clearToken();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!TokenManager.getToken();
  },

  // Set auth error callback
  setAuthErrorCallback: (callback) => {
    global.authErrorCallback = callback;
  }
};

// Search API
export const searchApi = {
  search: async (query, filters = {}) => {
    if (!query) {
      throw new Error('Search query is required');
    }

    const queryParams = new URLSearchParams({
      query,
      ...(Object.keys(filters).length > 0 && { filters: JSON.stringify(filters) })
    });

    return await apiFetch(`${API_BASE_URL}/search?${queryParams}`);
  }
};

// Order API
export const orderApi = {
  createOrder: async (orderData) => {
    // Validate required fields
    if (!orderData.userId) {
      throw new Error('User ID is required');
    }
    if (!orderData.restaurantId) {
      throw new Error('Restaurant ID is required');
    }
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order items are required');
    }
    if (!orderData.address || !orderData.address.trim()) {
      throw new Error('Delivery address is required');
    }

    // Structure the data to match backend expectations
    const backendOrderData = {
      userId: orderData.userId,
      restaurantId: orderData.restaurantId,
      items: orderData.items.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price
      })),
      address: orderData.address.trim(),
      status: 'Pending', // Default status
      // Backend will calculate total, but we can send it for validation
      expectedTotal: orderData.total,
      // Additional order details
      paymentMethod: orderData.paymentMethod || 'cash',
      subtotal: orderData.subtotal,
      taxes: orderData.taxes,
      shippingCost: orderData.shippingCost,
      orderDate: new Date().toISOString()
    };

    console.log('Sending order data:', backendOrderData);

    try {
      const response = await apiFetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        body: JSON.stringify(backendOrderData),
      });

      console.log('Order created successfully:', response);
      return response;
    } catch (error) {
      console.error('Create order error:', error);
      // Provide more specific error messages
      if (error.message.includes('401')) {
        throw new Error('Please log in to place an order');
      } else if (error.message.includes('400')) {
        throw new Error('Invalid order data. Please check your order details.');
      } else if (error.message.includes('500')) {
        throw new Error('Server error. Please try again later.');
      }
      throw error;
    }
  },

  getOrders: async () => {
    try {
      return await apiFetch(`${API_BASE_URL}/orders`);
    } catch (error) {
      console.error('Get orders error:', error);
      throw new Error('Failed to fetch orders');
    }
  },

  getOrderDetails: async (orderId) => {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    try {
      return await apiFetch(`${API_BASE_URL}/orders/${orderId}`);
    } catch (error) {
      console.error('Get order details error:', error);
      throw new Error('Failed to fetch order details');
    }
  },

  markAsPaid: async (orderId) => {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    try {
      return await apiFetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Mark as paid error:', error);
      throw new Error('Failed to mark order as paid');
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    if (!orderId) {
      throw new Error('Order ID is required');
    }
    if (!status) {
      throw new Error('Status is required');
    }

    try {
      return await apiFetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Update order status error:', error);
      throw new Error('Failed to update order status');
    }
  },

  // Cancel order
  cancelOrder: async (orderId, reason = '') => {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    try {
      return await apiFetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      throw new Error('Failed to cancel order');
    }
  }
};

// Export token manager for use in components
export { TokenManager };