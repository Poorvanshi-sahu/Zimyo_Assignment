const { StatusCodes } = require("http-status-codes");
const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");

const createRecipe = async (req, res) => {
  const { title, ingredients, instructions, image } = req.body;
  const loggedInUserId = req.user.id;

  // find logged in user from database on the basis of id
  const loggedInUser = await User.findOne({_id:loggedInUserId})

  // create recipe with the provided fields and with the user who is creating recipe
  const recipe = await Recipe.create({
    title,
    ingredients,
    instructions,
    image,
    user:req.user.id
  });

  // add created recipe to user who created the recipe
  loggedInUser.recipes.push(recipe._id)
  await loggedInUser.save()

  res.status(StatusCodes.CREATED).json({ recipe });
};

const getAllRecipes = async (req, res) => {
  // get all the recipes created by the users
  const recipes = await Recipe.find().populate("user likes");
  res.status(StatusCodes.OK).json(recipes);
};

const getSingleRecipe = async (req, res) => {
  const id = req.params.id;

  // get recipe of requested id or particular id
  const singleRecipe = await Recipe.findOne({ _id: id }).populate("user likes");
  if (!singleRecipe) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Recipe not found" });
  }

  return res.status(StatusCodes.OK).json({ singleRecipe });
};

const updateRecipe = async (req, res) => {  
  const id = req.params.id;
  const itemsToBeUpdate = {}
  const { title, ingredients, instructions, image } = req.body;

  // check which field is supposed to get updated
  if(title){
    itemsToBeUpdate["title"] = title
  }
  
  if(ingredients){
    itemsToBeUpdate["ingredients"] = ingredients
  }

  if(instructions){
    itemsToBeUpdate["instructions"] = instructions
  }

  if(image){
    itemsToBeUpdate["image"] = image
  }

  // update only for which the values are provided
  const updatedRecipe = await Recipe.findByIdAndUpdate(
    {_id:id},
    itemsToBeUpdate,
    { new: true }
  ).populate("user likes");

  if(!updatedRecipe){
    return res.status(StatusCodes.NOT_FOUND).json({"message":"Recipe not found"})
  }

  return res.status(StatusCodes.OK).json({updatedRecipe})
};

const deleteRecipe = async (req, res) => {
    const userToDeleteId = req.params.id;
    const loggedInUserId = req.user.id;

    const loggedInUser = await User.findOne({_id:loggedInUserId})

    const recipeToDelete = await Recipe.findOne({_id:userToDeleteId})
   
    if(!recipeToDelete){
      return res.status(StatusCodes.NOT_FOUND).json({"message":"No recipe found"})
    }
    
    // if logged in user is same as creator of recipe then only delete
    if(loggedInUserId.toString() === recipeToDelete.user._id.toString()){
      const DeletedRecipe = await Recipe.findOneAndDelete({_id:recipeToDelete.id},{new:true})
      
    //If condition satisfies also delete from Logged-in user recipe list
      const index = loggedInUser.recipes.indexOf(loggedInUserId)
      loggedInUser.recipes.splice(index,1)
      await loggedInUser.save()
      return res.status(StatusCodes.OK).json({"message":"Deleted successfully"})
    }
};

const likeAndUnlikeRecipe = async (req,res)=>{  
    const id = req.params.id;
    
    const loggedInUser = req.user.id;

    const recipe = await Recipe.findOne({_id:id})
    
    if(!recipe){
        return res.status(StatusCodes.NOT_FOUND).json({"message":"No such recipe present"})
    }
  
    // If recipe is liked by current logged in user then unlike it i.e. remove its id from likes array
    if(recipe.likes.includes(loggedInUser)){      
       const index = recipe.likes.indexOf(loggedInUser)
       recipe.likes.splice(index,1 )
       await recipe.save()
       console.log(index, recipe);
          
       return res.status(StatusCodes.OK).json({"message":"Post unliked"})
    }else{
      // If recipe is not liked by current logged in user then like it i.e. add id to likes array
      recipe.likes.push(loggedInUser)
      await recipe.save()
      return res.status(StatusCodes.OK).json({"message":"Post liked", likesCount:recipe.likes.length})
    }
}

const searchRecipe = async (req, res)=>{
    const { query, instructions, ingredients } = req.query; 

    // Making of criteria or conditions to search
    let searchCriteria = {};

    // mongo queries to search on the basis of title
    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { instructions: { $regex: query, $options: 'i' } }
      ];
    }

     // mongo queries to search from array of ingredients 
    if (ingredients) {
      searchCriteria.ingredients = { $in: ingredients.split(',').map(item => item.trim())};
    }

    // search on the basis of above prepare criteria
    const recipes = await Recipe.find(searchCriteria);

    res.status(StatusCodes.OK).json({recipes})
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  likeAndUnlikeRecipe,
  searchRecipe
};
