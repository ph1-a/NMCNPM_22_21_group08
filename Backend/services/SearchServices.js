const { searchRestaurants, searchMenuItem } = require('../repositories/SearchRepository');

module.exports = {
  searchAll: async (query) => {
    try {
      // Search for both restaurants and menu items
      const [restaurants, foods] = await Promise.all([
        searchRestaurants(query),
        searchMenuItem(query)
      ]);

      return {
        restaurants,
        foods
      };
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to perform search');
    }
  }
};