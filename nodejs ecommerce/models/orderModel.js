const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connect');
const User = require('./userModel');
const Product = require('./productModel');

const Order = sequelize.define('Order', {
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
    },
});

Order.belongsTo(User);
Order.belongsTo(Product);

module.exports = Order;