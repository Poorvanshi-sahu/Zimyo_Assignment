const { cartServices: Cart } = require("../services");
const { StatusCodes } = require("http-status-codes");

const getCart = async (req,res)=>{
    try {
        const reqData = req._decoded.id;
        const resp = await Cart.getCart(reqData)
        return res.status(resp.httpStatus).json(resp.body)
    } catch (error) {
        return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something Went Wrong", data: {} });
    }
}

const addItemToCart = async (req, res) => {
    try {
        const userId = req._decoded.id;
        const reqData = { productId, quantity } = req.body;
        reqData["userId"] = userId
        const resp = await Cart.addItemToCart(reqData)
        return res.status(resp.httpStatus).json(resp.body)
    } catch (error) {
        return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something Went Wrong", data: {} });
    }
};

const removeItemFromCart = async (req, res) => {
    try {
        const userId = req._decoded.id;
        const reqData = { productId } = req.body;
        reqData["userId"] = userId
        const resp = await Cart.removeItemFromCart(reqData)
        return res.status(resp.httpStatus).json(resp.body)
    } catch (error) {
        return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something Went Wrong", data: {} });
    }
};

const updateItemQuantity = async (req, res) => {
    try {
        const reqData = { productId, quantity } = req.body;
        reqData["userId"] = req._decoded.id;
        const resp = await Cart.updateItemQuantity(reqData)
        return res.status(resp.httpStatus).json(resp.body)
    } catch (error) {
        return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something Went Wrong", data: {} });
    }
};

module.exports = {addItemToCart, removeItemFromCart, updateItemQuantity, getCart}