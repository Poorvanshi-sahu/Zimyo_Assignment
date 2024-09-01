const express = require('express');
const { createRecipe, getAllRecipes, getSingleRecipe, updateRecipe, deleteRecipe, likeAndUnlikeRecipe, searchRecipe} = require('../controllers/recipeController');
const { protect } = require('../middlewares/authentication');
const router = express.Router();

router.post("/create",protect, createRecipe);
router.get("/getAllRecipes",protect, getAllRecipes);
router.get("/getSingleRecipe/:id",protect,getSingleRecipe);
router.post("/updateRecipe/:id",protect, updateRecipe);
router.delete("/deleteRecipe/:id",protect, deleteRecipe);
router.post("/likeAndUnlikeRecipe/:id",protect, likeAndUnlikeRecipe)
router.post("/searchRecipe",protect, searchRecipe) 

module.exports = router;
