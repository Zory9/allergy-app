const express = require('express');
const { textCompletion, imageCompletion } = require('../controllers/ai-completion.controller');
const { recipeGeneration, recipeModification } = require('../controllers/ai-recipe.controller');

const router = express.Router();

// Route for text completion 
router.post('/text', textCompletion);

// Route for image completion 
router.post('/image', imageCompletion);

// Route for generating recipe 
router.post('/genrecipe', recipeGeneration);

// Route for modifying recipe 
router.post('/modrecipe', recipeModification);

module.exports = router;