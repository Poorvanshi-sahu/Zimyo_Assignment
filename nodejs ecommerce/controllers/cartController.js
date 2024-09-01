// controllers/cartController.js
const CartItem = require('../models/cartModel.js');
const Product = require('../models/productModel');

const getCartItems = async (req, res) => {
    const cartItems = await CartItem.findAll({ where: { UserId: req.user.id }, include: Product });
    res.json(cartItems);
};

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const cartItem = await CartItem.create({
        UserId: req.user.id,
        ProductId: productId,
        quantity,
    });

    res.status(201).json(cartItem);
};

const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    const cartItem = await CartItem.findByPk(req.params.id);

    if (!cartItem) {
        return res.status(404).json({ message: 'CartItem not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
};

const removeCartItem = async (req, res) => {
    const cartItem = await CartItem.findByPk(req.params.id);

    if (!cartItem) {
        return res.status(404).json({ message: 'CartItem not found' });
    }

    await cartItem.destroy();

    res.json({ message: 'CartItem removed' });
};

module.exports = {getCartItems, addToCart, updateCartItem, removeCartItem}