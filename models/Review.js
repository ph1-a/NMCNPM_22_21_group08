const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const MenuItem = require('./MenuItem');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  menuItemId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userInitial: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(MenuItem, { foreignKey: 'menuItemId' });
MenuItem.hasMany(Review, { foreignKey: 'menuItemId' });

module.exports = Review; 