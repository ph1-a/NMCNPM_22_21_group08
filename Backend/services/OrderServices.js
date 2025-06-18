const OrderRepository = require('../repositories/OrderRepository');
const MenuItem = require('../models/MenuItem');

module.exports = {
  placeOrder: async (data) => {
    const { userId, restaurantId, items, address } = data;

    // If restaurantId is not provided, try to get it from the first menu item
    let finalRestaurantId = restaurantId;
    if (!finalRestaurantId && items && items.length > 0) {
      const firstMenuItem = await MenuItem.findByPk(items[0].foodId);
      if (firstMenuItem) {
        finalRestaurantId = firstMenuItem.restaurantId;
      }
    }

    const orderData = {
      userId,
      restaurantId: finalRestaurantId, // This can be null now
      address,
      status: 'Pending',
      total: 0 // Will be calculated in repository
    };

    return await OrderRepository.createOrder(orderData, items);
  },

  getUserOrders: async (userId) => {
    return await OrderRepository.findOrdersByUserId(userId);
  },

  getOrderById: async (orderId) => {
    return await OrderRepository.findOrderById(orderId);
  },

  markAsPaid: async (orderId) => {
    return await OrderRepository.updatePaymentStatus(orderId, 'Paid');
  }
};