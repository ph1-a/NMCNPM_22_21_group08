const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  distance: { type: DataTypes.FLOAT, defaultValue: 0 },
  image: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  restaurantId: { type: DataTypes.UUID, allowNull: false }
});

module.exports = MenuItem;