// models/CartItem.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connect');
const User = require('./userModel');
const Product = require('./productModel');

const CartItem = sequelize.define('CartItem', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

CartItem.belongsTo(User);
CartItem.belongsTo(Product);

module.exports = CartItem;

