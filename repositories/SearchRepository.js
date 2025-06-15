const { Op } = require('sequelize');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

module.exports = {
  searchRestaurants: async (q) => {
    return await Restaurant.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { location: { [Op.iLike]: `%${q}%` } }
        ]
      }
    });
  },

  searchMenuItem: async (q) => {
    return await Food.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { category: { [Op.iLike]: `%${q}%` } }
        ]
      },
      include: ['Restaurant']
    });
  }
};
