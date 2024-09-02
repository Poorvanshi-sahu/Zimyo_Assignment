const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { addItemToCart, removeItemFromCart, updateItemQuantity, getCart} = require('../controllers/cartController');
const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/add',verifyToken, addItemToCart);
router.delete('/remove', verifyToken, removeItemFromCart);
router.put('/update', verifyToken, updateItemQuantity);

module.exports = router;

