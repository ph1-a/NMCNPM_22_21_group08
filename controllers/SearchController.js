const SearchService = require('../services/SearchService');

module.exports = {
  search: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) return res.status(400).json({ error: 'Missing query' });

      const result = await SearchService.searchAll(q);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: 'Search failed', details: err.message });
    }
  }
};
