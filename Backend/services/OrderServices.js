const OrderRepository = require('../repositories/OrderRepository');

module.exports = {
  placeOrder: async (data) => {
    const { userId, restaurantId, items, address, expectedTotal } = data;

    const orderData = {
      userId,
      restaurantId,
      address,
      status: 'Pending',
      total: expectedTotal // Use expectedTotal directly
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