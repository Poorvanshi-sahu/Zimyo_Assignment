const Recipe = require('../models/recipeModel');

const createRecipe = async (req, res) => {
  const { title, ingredients, instructions } = req.body;

  try {
    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      user: req.user.id,
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('user', 'name');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add update, delete, like, and search functions similarly

module.exports = { createRecipe, getRecipes };
