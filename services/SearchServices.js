const { searchRestaurants, searchMenuItem } = require('../repositories/SearchRepository');

module.exports = {
  searchAll: async (q) => {
    const [restaurants, foods] = await Promise.all([
      searchRestaurants(q),
      searchMenuItem(q)
    ]);
    return { restaurants, MenuItem };
  }
};