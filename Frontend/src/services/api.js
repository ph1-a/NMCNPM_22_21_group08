const API_BASE_URL = 'http://10.0.2.2:3000/api';

// Auth API
export const authApi = {
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },

  signin: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Signin failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Signin API error:', error);
      throw error;
    }
  },
};

// Search API
export const searchApi = {
  search: async (query, filters = {}) => {
    try {
      if (!query) {
        console.log('Search API: Empty query received');
        throw new Error('Search query is required');
      }

      const queryParams = new URLSearchParams({
        query,
        ...(Object.keys(filters).length > 0 && { filters: JSON.stringify(filters) })
      });

      const url = `${API_BASE_URL}/search?${queryParams}`;
      console.log('Search API: Making request to:', url);
      
      const response = await fetch(url);
      console.log('Search API: Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Search API: Error response:', errorData);
        throw new Error(errorData.message || `Search request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search API: Response data:', data);
      return data;
    } catch (error) {
      console.error('Search API: Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }
};

// Order API
export const orderApi = {
  createOrder: async (orderData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Order creation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Order API error:', error);
      throw error;
    }
  },

  getOrders: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Order API error:', error);
      throw error;
    }
  },

  getOrderDetails: async (orderId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      return await response.json();
    } catch (error) {
      console.error('Order API error:', error);
      throw error;
    }
  },

  markAsPaid: async (orderId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark order as paid');
      }

      return await response.json();
    } catch (error) {
      console.error('Order API error:', error);
      throw error;
    }
  }
}; 