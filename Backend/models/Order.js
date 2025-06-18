const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID, // Keep as UUID to match your DB schema
    allowNull: false
  },
  restaurantId: {
    type: DataTypes.UUID, // Keep as UUID to match your DB schema
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending'
  },
  total: {
    type: DataTypes.FLOAT, // Changed to FLOAT to match your DB schema
    allowNull: false
  }
});

module.exports = Order;