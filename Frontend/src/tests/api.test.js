import { fetchDishes, searchDishes, createOrder } from '../services/api';
import { searchApi } from '../services/api';

describe('API Service', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('fetchDishes', () => {
    it('should fetch dishes successfully', async () => {
      const mockDishes = [
        { id: 1, name: 'Pizza', price: 10.99 },
        { id: 2, name: 'Burger', price: 8.99 }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDishes
      });

      const result = await fetchDishes();
      expect(result).toEqual(mockDishes);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/dishes');
    });
  });

  describe('searchDishes', () => {
    it('should search dishes successfully', async () => {
      const mockResults = [
        { id: 1, name: 'Pizza', price: 10.99 }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults
      });

      const result = await searchDishes('pizza');
      expect(result).toEqual(mockResults);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/search?q=pizza');
    });
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const orderData = {
        items: [{ dishId: 1, quantity: 2 }],
        deliveryAddress: '123 Test St'
      };

      const mockResponse = { orderId: 123, status: 'pending' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await createOrder(orderData);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
    });
  });
});

describe('Frontend API Integration', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('Search API', () => {
    it('should handle search requests correctly', async () => {
      const mockResults = {
        restaurants: [
          { id: 1, name: 'Test Restaurant' }
        ],
        foods: [
          { id: 1, name: 'Test Food' }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults
      });

      const result = await searchApi.search('test');
      expect(result).toEqual(mockResults);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.any(Object)
      );
    });

    it('should handle search errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(searchApi.search('test')).rejects.toThrow('Network error');
    });
  });

  describe('API Error Handling', () => {
    it('should handle non-200 responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(searchApi.search('test')).rejects.toThrow('Search request failed');
    });
  });
}); 