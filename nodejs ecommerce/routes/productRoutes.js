const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const authentication = require('../middlewares/authentication');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id',authentication, getProductById);
router.post('/',authentication, createProduct);
router.put('/:id',authentication, updateProduct);
router.delete('/:id',authentication, deleteProduct);

module.exports = router;
