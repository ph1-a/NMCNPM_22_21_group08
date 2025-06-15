const { Order, OrderItem } = require('../models');
const Order = require('../models/Order');

module.exports = {
  createOrder: async (orderData, items) => {
    const order = await Order.create(orderData);
    const orderItems = items.map(item => ({
      ...item,
      orderId: order.id
    }));
    await OrderItem.bulkCreate(orderItems);
    return order;
  }
};

module.exports.updatePaymentStatus = async (orderId, status) => {
  return await Order.update({ status }, { where: { id: orderId } });
};
