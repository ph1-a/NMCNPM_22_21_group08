require('./associations');

const User = require('./User');
const Restaurant = require('./Restaurant');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');
const Transaction = require('./Transaction');

module.exports = {
  User,
  Restaurant,
  MenuItem,
  Order,
  OrderItem,
  Review,
  Transaction
}; 