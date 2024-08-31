const express = require('express');
const {
  createRecipe,
  getRecipes,
} = require('../controllers/recipeController');
const { protect } = require('../middlewares/authentication');
const router = express.Router();

router.route('/').post(protect, createRecipe).get(getRecipes);
// Add update, delete, like routes similarly

module.exports = router;
