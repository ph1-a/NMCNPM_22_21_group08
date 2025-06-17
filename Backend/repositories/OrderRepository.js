const { Order, OrderItem } = require('../models');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

module.exports = {
  createOrder: async (orderData, items) => {
    const order = await Order.create(orderData);
    
    // Fetch menu items to get prices
    const menuItems = await Promise.all(
      items.map(item => MenuItem.findByPk(item.foodId))
    );

    // Create order items with proper mapping
    const orderItems = items.map((item, index) => {
      const menuItem = menuItems[index];
      if (!menuItem) {
        throw new Error(`Menu item ${item.foodId} not found`);
      }
      return {
        orderId: order.id,
        itemId: item.foodId,
        quantity: item.quantity,
        price: menuItem.price
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
