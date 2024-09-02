const { productServices: Product } = require("../services");
const { StatusCodes } = require("http-status-codes");

const createProduct = async (req, res) => {
  try {
    // if userRole is user throw error
    // return res
    // .status(StatusCodes.INTERNAL_SERVER_ERROR)
    // .json({ success: false, msg: "Something Went Wrong", data: {} });
    const reqData = { name, description, price, image, inventory } = req.body;
    reqData.userId = req._decoded.id;
    const resp = await Product.createProduct(reqData);
    res.status(resp.httpStatus).json(resp.body);
  } catch (error) {
    res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, msg: "Something Went Wrong", data: {} });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const resp = await Product.getAllProducts();
    res.status(resp.httpStatus).json(resp.body);
  } catch (error) {
    res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, msg: "Something Went Wrong", data: {} });
  }
};

const getProduct = async (req, res) => {
  try {
    const resp = await Product.getProduct(req.params.id);
    res.status(resp.httpStatus).json(resp.body);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something Went Wrong", data: {} });
  }
};

const deleteProduct = async (req, res) => {
    try {
        // if userRole is user throw error
        // return res
        // .status(StatusCodes.INTERNAL_SERVER_ERROR)
        // .json({ success: false, msg: "Something Went Wrong", data: {} });
        const resp = await Product.deleteProduct(req.params.id);
        return res.status(resp.httpStatus).json(resp.body);
    } catch (error) {
        return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something Went Wrong", data: {} });
    }
  };

  const updateProduct = async (req, res) => {
    try {
        const reqData = {name, description, price, image, inventory } = req.body;
        reqData.id = req.params.id;
        const resp = await Product.updateProduct(reqData);
        return res.status(resp.httpStatus).json(resp.body);
    } catch (error) {
        res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something Went Wrong", data: {} });
    }
  };

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
