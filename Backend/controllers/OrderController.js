const OrderServices = require('../services/OrderServices');

module.exports = {
  placeOrder: async (req, res) => {
    try {
      const orderData = {
        ...req.body,
        userId: req.userId || req.body.userId // Use userId from auth middleware or request body
      };
      const order = await OrderServices.placeOrder(orderData);
      res.status(201).json({ 
        message: 'Order placed successfully', 
        orderId: order.id,
        total: order.total 
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to place order', details: err.message });
    }
  },

  getUserOrders: async (req, res) => {
    try {
      const userId = req.userId || req.query.userId;
      const orders = await OrderServices.getUserOrders(userId);
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      const order = await OrderServices.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (err) {
      res.status(404).json({ error: 'Order not found', details: err.message });
    }
  },

  markAsPaid: async (req, res) => {
    try {
      await OrderServices.markAsPaid(req.params.id);
      res.status(200).json({ message: 'Payment successful' });
    } catch (err) {
      res.status(500).json({ error: 'Payment failed', details: err.message });
    }
  }
};