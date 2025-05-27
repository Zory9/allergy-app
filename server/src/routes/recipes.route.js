const express = require('express');
const { saveGeneratedRecipe, getGeneratedRecipesByUserId, saveModifiedRecipe, getModifiedRecipesByUserId } = require('../controllers/recipes.controller');

const router = express.Router();

// Route for saving generated recipe
router.post('/savegen', saveGeneratedRecipe);

// Route for saving modified recipe
router.post('/savemod', saveModifiedRecipe);

// Route for obtaining generated recipes
router.get('/getgen', getGeneratedRecipesByUserId);

// Route for obtaining modified recipes
router.get('/getmod', getModifiedRecipesByUserId);

module.exports = router;