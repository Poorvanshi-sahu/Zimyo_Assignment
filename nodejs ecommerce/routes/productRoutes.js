const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {createProduct, getAllProducts, getProduct, deleteProduct, updateProduct} = require("../controllers/productController")

router.post('/create', verifyToken, createProduct);
// user can see products even if not log in
router.get('/getAllProducts', getAllProducts);
router.get('/getProduct/:id',verifyToken, getProduct);
router.delete('/deleteProduct/:id',verifyToken, deleteProduct);
router.post('/updateProduct/:id',verifyToken, updateProduct);

module.exports = router;
