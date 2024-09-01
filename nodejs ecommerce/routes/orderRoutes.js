const express = require('express');
const authentication = require('../middlewares/authentication');
const { createOrder, getOrderById, getOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/', authentication, createOrder);
router.get('/:id', authentication, getOrderById);
router.get('/', authentication, getOrders);

module.exports = router;
