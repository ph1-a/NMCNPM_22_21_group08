const OrderService = require('../services/OrderService');

module.exports = {
  placeOrder: async (req, res) => {
    try {
      const order = await OrderService.placeOrder(req.body);
      res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
    } catch (err) {
      res.status(500).json({ error: 'Failed to place order', details: err.message });
    }
  }
};

module.exports.markAsPaid = async (req, res) => {
  try {
    await OrderService.markAsPaid(req.params.id);
    res.status(200).json({ message: 'Payment successful' });
  } catch (err) {
    res.status(500).json({ error: 'Payment failed', details: err.message });
  }
};