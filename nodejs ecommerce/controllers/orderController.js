const Order = require('../models/orderModel');
const CartItem = require('../models/cartModel');

const createOrder = async (req, res) => {
    const cartItems = await CartItem.findAll({ where: { UserId: req.user.id } });

    if (cartItems.length === 0) {
        return res.status(400).json({ message: 'No items in the cart' });
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + item.quantity * item.Product.price, 0);

    const order = await Order.create({
        UserId: req.user.id,
        totalAmount,
    });

    // Clear Cart
    await CartItem.destroy({ where: { UserId: req.user.id } });

    res.status(201).json(order);
};

const getOrderById = async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
};

const getOrders = async (req, res) => {
    const orders = await Order.findAll({ where: { UserId: req.user.id } });
    res.json(orders);
};

module.exports = {createOrder, getOrderById, getOrders}