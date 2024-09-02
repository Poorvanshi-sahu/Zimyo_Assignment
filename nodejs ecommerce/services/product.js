const { StatusCodes } = require("http-status-codes");
const db = require("../config/db");
const queryDatabase = require("../config/queryDatabase");
const queries = require("../config/queries").getInstance();

class Product {
  static async createProduct(reqData) {
    const { name, description, price, image, inventory } = reqData;

    const result = await queryDatabase(queries.createProduct(), [
      name,
      description,
      price,
      image,
      inventory,
    ]);

    if (!result?.insertId) {
      return {
        httpStatus: StatusCodes.BAD_REQUEST,
        body: {
          success: false,
          msg: "Product creation failed",
          data: { reqData },
        },
      };
    }

    return {
      httpStatus: StatusCodes.CREATED,
      body: {
        success: true,
        msg: "Product created",
        data: reqData,
      },
    };
  }

  static async getAllProducts() {
    const result = await queryDatabase(queries.getAllProducts());

    if (!result) {
      return {
        httpStatus: StatusCodes.OK,
        body: {
          success: false,
          msg: "Cannot fetch products",
          data: {},
        },
      };
    }

    return {
      httpStatus: StatusCodes.OK,
      body: {
        success: true,
        msg: "Products fetched successfully",
        data: result,
      },
    };
  }

  static async getProduct(reqData) {
    const id = reqData;
    const [result] = await queryDatabase(queries.getProduct(), [id]);

    if (!result) {
      return {
        httpStatus: StatusCodes.NOT_FOUND,
        body: {
          success: false,
          msg: "No Such Product Present",
          data: {},
        },
      };
    }

    return {
      httpStatus: StatusCodes.NOT_FOUND,
      body: {
        success: false,
        msg: "Product fetched successfully",
        data: result,
      },
    };
  }

  static async deleteProduct(reqData) {
    const { id } = reqData;
    const product = await queryDatabase(queries.getProduct(), [id]);

    if (!product.length > 0) {
      return {
        httpStatus: StatusCodes.NOT_FOUND,
        body: {
          success: false,
          msg: "Product not found",
          data: {},
        },
      };
    }

    const result = await queryDatabase(queries.deleteProduct(), [id]);

    if (!result?.affectedRows > 0) {
      return {
        httpStatus: StatusCodes.BAD_REQUEST,
        body: {
          success: false,
          msg: "Product deletion failed",
          data: {},
        },
      };
    }

    return {
      httpStatus: StatusCodes.OK,
      body: {
        success: true,
        msg: "Product deleted",
        data: product,
      },
    };
  }

  static async updateProduct(reqData) {
    const { id, name, description, price, image, inventory } = reqData;
  
    // Validate required parameters
    if (!id) {
      return {
        httpStatus: StatusCodes.BAD_REQUEST,
        body: {
          success: false,
          msg: "Product ID is required",
          data: {},
        },
      };
    }
  
    // Fetch the existing product
    const product = await queryDatabase(queries.getProduct(), [id]);
  
    if (!product.length) {
      return {
        httpStatus: StatusCodes.NOT_FOUND,
        body: {
          success: false,
          msg: "Product not found",
          data: {},
        },
      };
    }
  
    // Prepare the fields to update
    const updateCriteria = {};
  
    if (name) updateCriteria["name"] = name;
    if (description) updateCriteria["description"] = description;
    if (price !== undefined) updateCriteria["price"] = price; // Check for undefined to allow zero price
    if (image) updateCriteria["image"] = image;
    if (inventory !== undefined) updateCriteria["inventory"] = inventory; // Check for undefined to allow zero inventory
  
    // Construct the SET clause for the SQL query
    const setClause = Object.keys(updateCriteria)
      .map((field) => `${field} = ?`)
      .join(", ");
  
    if (!setClause) {
      return {
        httpStatus: StatusCodes.BAD_REQUEST,
        body: {
          success: false,
          msg: "No fields provided for update",
          data: {},
        },
      };
    }
  
    const values = Object.values(updateCriteria);
  
    // Execute the update query
    const result = await queryDatabase(queries.updateProduct(setClause), [
      ...values,
      id,
    ]);
  
    // Check if the update was successful
    if (result.affectedRows === 0) {
      return {
        httpStatus: StatusCodes.BAD_REQUEST,
        body: {
          success: false,
          msg: "Product not updated",
          data: {},
        },
      };
    }
  
    return {
      httpStatus: StatusCodes.OK,
      body: {
        success: true,
        msg: "Product updated successfully",
        data: {
          id,
          ...updateCriteria,
        },
      },
    };
  }
  
}

module.exports = Product;
