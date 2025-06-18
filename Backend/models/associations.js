const Order = require('./Order');
const OrderItem = require('./OrderItem');
const MenuItem = require('./MenuItem');
const Restaurant = require('./Restaurant');

// Order associations
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// OrderItem associations
OrderItem.belongsTo(MenuItem, { foreignKey: 'itemId', as: 'MenuItem' });
MenuItem.hasMany(OrderItem, { foreignKey: 'itemId' });

// Restaurant associations
Restaurant.hasMany(Order, { foreignKey: 'restaurantId' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

// Restaurant-MenuItem associations
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

module.exports = {
  Order,
  OrderItem,
  MenuItem,
  Restaurant
}; 