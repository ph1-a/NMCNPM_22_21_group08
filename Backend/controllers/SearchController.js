const SearchServices = require('../services/SearchServices');

module.exports = {
  search: async (req, res) => {
    try {
      const { query, filters } = req.query;
      
      if (!query) {
        return res.status(400).json({ 
          error: 'Search query is required' 
        });
      }

      const results = await SearchServices.searchAll(query);
      
      // Apply any additional filters if provided
      if (filters) {
        const filterParams = JSON.parse(filters);
        if (filterParams.maxPrice) {
          results.foods = results.foods.filter(food => food.price <= filterParams.maxPrice);
        }
        if (filterParams.minRating) {
          results.restaurants = results.restaurants.filter(restaurant => restaurant.rating >= filterParams.minRating);
        }
      }

      res.json(results);
    } catch (err) {
      console.error('Search controller error:', err);
      res.status(500).json({ 
        error: 'An error occurred while performing the search' 
      });
    }
  }
};
