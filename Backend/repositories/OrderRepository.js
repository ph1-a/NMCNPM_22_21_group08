const { Order, OrderItem } = require('../models');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

module.exports = {
  createOrder: async (orderData, items) => {
    const order = await Order.create(orderData);
    
    // Create order items using the provided data
    const orderItems = items.map((item) => {
      return {
        orderId: order.id,
        itemId: item.menuItemId, // Changed from foodId to menuItemId
        quantity: item.quantity,
        price: item.price // Use price from request
      };
    });

    await OrderItem.bulkCreate(orderItems);
    return order;
  },

  findOrdersByUserId: async (userId) => {
    return await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [{
            model: MenuItem,
            as: 'MenuItem'
          }]
        },
        {
          model: Restaurant,
          as: 'Restaurant'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  },

  findOrderById: async (orderId) => {
    return await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [{
            model: MenuItem,
            as: 'MenuItem'
          }]
        },
        {
          model: Restaurant,
          as: 'Restaurant'
        }
      ]
    });
  },

  updatePaymentStatus: async (orderId, status) => {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    await order.save();
    return order;
  }
};