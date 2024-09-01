// controllers/productController.js
const Product = require('../models/productModel');

const getAllProducts = async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
};
const getProductById = async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
};

const createProduct = async (req, res) => {
    const { name, description, price, imageUrl, inventory } = req.body;

    const product = await Product.create({
        name,
        description,
        price,
        imageUrl,
        inventory,
    });

    res.status(201).json(product);
};
const updateProduct = async (req, res) => {
    const { name, description, price, imageUrl, inventory } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.inventory = inventory || product.inventory;

    await product.save();

    res.json(product);
};

const deleteProduct = async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();

    res.json({ message: 'Product removed' });
};

module.exports = {getAllProducts, getProductById, createProduct, updateProduct, deleteProduct}
