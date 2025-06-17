const { Op } = require('sequelize');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { Sequelize } = require('sequelize');

module.exports = {
  searchRestaurants: async (q) => {
    return await Restaurant.findAll({
      where: {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('Restaurant.name')),
            { [Op.like]: `%${q.toLowerCase()}%` }
          ),
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('Restaurant.description')),
            { [Op.like]: `%${q.toLowerCase()}%` }
          ),
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('Restaurant.location')),
            { [Op.like]: `%${q.toLowerCase()}%` }
          )
        ]
      }
    });
  },

  searchMenuItem: async (q) => {
    return await MenuItem.findAll({
      where: {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('MenuItem.name')),
            { [Op.like]: `%${q.toLowerCase()}%` }
          ),
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('MenuItem.category')),
            { [Op.like]: `%${q.toLowerCase()}%` }
          )
        ]
      },
      include: [
        {
          model: Restaurant,
          as: 'Restaurant'
        },
        {
          model: require('../models/Review'),
          as: 'Reviews',
          include: [{
            model: require('../models/User'),
            as: 'User'
          }]
        }
      ]
    });
  }
};
