const { query } = require("express");

class Queries {
  static getInstance() {
    return new Queries();
  }

  // User table query starts here
  createUser() {
    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    return query;
  }

  getUser() {
    const query = "SELECT * FROM users WHERE email = ?";
    return query;
  }

  getProfile() {
    const query = "SELECT id, username, email, role FROM users WHERE id = ?";
    return query;
  }

  getAllProfiles() {
    const query = "SELECT * from users";
    return query;
  }

  updateProfileRole() {
    const query = "UPDATE users SET role = 'admin' WHERE id = ?";
    return query;
  }

  // User table query ends here

  // Product table query starts here
  createProduct() {
    const query =
      "INSERT INTO products (name, description, price, image, inventory) VALUES (?, ?, ?, ?, ?)";
    return query;
  }

  getAllProducts() {
    const query = "SELECT * FROM products";
    return query;
  }

  getProduct() {
    const query = "SELECT * FROM products WHERE id = ?";
    return query;
  }

  deleteProduct() {
    const query = "DELETE FROM products WHERE id = ?";
    return query;
  }

  updateProduct(setClause) {
    const query = `UPDATE products SET ${setClause} WHERE id = ?`;
    return query;
  }

  // Product table query ends here

  // Cart table query starts here
  getCartByUserId() {
    const query = "SELECT * FROM cart WHERE user_id = ?";
    return query;
  }

  createCart() {
    const query = "INSERT INTO cart (user_id) VALUES (?)";
    return query;
  }

  addItemToCart() {
    const query = `INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;
    return query;
  }

  removeItemFromCart() {
    const query = "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?";
    return query;
  }

  getCartItems() {
    const query = "SELECT * FROM cart_items WHERE cart_id = ?";
    return query;
  }
  
  updateItemQuantity() {
    const query = "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?";
    return query;
  }

  // Product table query ends here
}

module.exports = Queries;
