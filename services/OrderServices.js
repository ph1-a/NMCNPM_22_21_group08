const OrderRepository = require('../repositories/OrderRepository');

module.exports = {
  placeOrder: async (data) => {
    const { userId, restaurantId, items, address } = data;

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderData = {
      userId,
      restaurantId,
      address,
      status: 'Pending',
      total
    };

    return await OrderRepository.createOrder(orderData, items);
  }
};

module.exports.markAsPaid = async (orderId) => {
  return await OrderRepository.updatePaymentStatus(orderId, 'Paid');
};