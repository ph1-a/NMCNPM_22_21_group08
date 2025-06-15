const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Restaurant = require('./Restaurant');

const Food = sequelize.define('MenuItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT }
});

MenuItem.belongsTo(Restaurant); // MenuItem.restaurantId

module.exports = MenuItem;