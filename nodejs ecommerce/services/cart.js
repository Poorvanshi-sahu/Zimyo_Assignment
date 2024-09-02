const { StatusCodes } = require("http-status-codes");
const queryDatabase = require("../config/queryDatabase");
const queries = require("../config/queries").getInstance();


class Cart{
  static async getCart(reqData) {
    const userId = reqData

      // Fetch cart for the user
      const [cart] = await queryDatabase(queries.getCartByUserId(), [userId]);

      if (!cart) {
        return {
            httpStatus:StatusCodes.NOT_FOUND,
            body:{
                success:false,
                msg:"Nothing in cart",
                data:{}
            }
        }
      }

      // Fetch items in the cart
      const items = await queryDatabase(queries.getCartItems(), [cart.id]);

      return {
        httpStatus:StatusCodes.OK,
            body:{
                success:true,
                msg:"Cart items",
                data:items
            }
      }
    
  }

  static async addItemToCart(reqData) {
    const { userId, productId, quantity } = reqData;

      // Get or create the cart for the user
      let [cart] = await queryDatabase(queries.getCartByUserId(), [userId]);

      if (!cart) {
        // Create a new cart if none exists
        const result = await queryDatabase(queries.createCart(), [userId]);
        cart = { id: result.insertId };
      }

      // Add item to the cart
      const addedToCart = await queryDatabase(queries.addItemToCart(), [cart.id, productId, quantity]);
      console.log(addedToCart);
      
      if(!addedToCart?.insertId){
         return {
            httpStatus:StatusCodes.BAD_REQUEST,
            body:{
                success:false,
                msg:"Failed To Add To Cart",
                data:{}
            }
         }
      }

    //if items added to cart
    return {
        httpStatus:StatusCodes.OK,
        body:{
            success:true,
            msg:"Added To Cart",
            data:reqData
        }
     }
  }

  static async removeItemFromCart(reqData) {
      // Get the cart for the user
      const {productId, userId} = reqData;
      const [cart] = await queryDatabase(queries.getCartByUserId(), [userId]);

      if (!cart) {
        return {
            httpStatus:StatusCodes.NOT_FOUND,
            body:{
                success:false,
                msg:"Cart Not Found",
                data:{}
            }
        }
      }

      // Remove item from the cart
      const itemRemoved = await queryDatabase(queries.removeItemFromCart(), [cart.id, productId]);

      if(!itemRemoved?.affectedRows){
          return {
            httpStatus:StatusCodes.BAD_REQUESt,
            body:{
                success:false,
                msg:"Failed To Remove Item From Cart",
                data:{}
            }
          }
      }
     
      return{
        httpStatus:StatusCodes.OK,
        body:{
            success:true,
            msg:"Removed from Cart",
            data:reqData
        }
      }
  }

  static async updateItemQuantity(reqData) {
    const { productId, quantity, userId } = reqData

      // Get the cart for the user
      const [cart] = await queryDatabase(queries.getCartByUserId(), [userId]);

      if (!cart) {
        return {
            httpStatus:StatusCodes.NOT_FOUND,
            body:{
                success:false,
                msg:"Cart Not Found",
                data:{}
            }
        }
      }

      // Update item quantity in the cart
      const updatedQuantity = await queryDatabase(queries.updateItemQuantity(), [quantity, cart.id, productId]);

      if(!updatedQuantity?.affectedRows){
        return {
            httpStatus:StatusCodes.BAD_REQUEST,
            body:{
                success:false,
                msg:"Failed to update quantity, check item is present",
                data:{}
            }
        }
      }

      return {
        httpStatus:StatusCodes.OK,
        body:{
            success:true,
            msg:"Updated successfully",
            data:reqData
        }
    }
  }

}

module.exports = Cart;
