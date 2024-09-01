const express = require('express');
const authentication  = require('../middlewares/authentication');
const { getCartItems, addToCart, updateCartItem, removeCartItem } = require('../controllers/cartController');

const router = express.Router();

router.get('/', authentication, getCartItems);
router.post('/', authentication, addToCart);
router.put('/:id', authentication, updateCartItem);
router.delete('/:id', authentication, removeCartItem);

module.exports = router;
