const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.put('/:id/pay', OrderController.markAsPaid);
router.post('/', OrderController.placeOrder);

module.exports = router;
