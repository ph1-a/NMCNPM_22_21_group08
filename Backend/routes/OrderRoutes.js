const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const auth = require('../middleware/auth');

router.get('/', auth, OrderController.getUserOrders);
router.get('/:id', auth, OrderController.getOrderDetails);
router.put('/:id/pay', auth, OrderController.markAsPaid);
router.post('/', auth, OrderController.placeOrder);

module.exports = router;
