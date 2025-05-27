const pool = require("../db");

// Save generated recipe to the database
const saveGeneratedRecipe = async (req, res) => {
    const { user_id, name, shortdesc, cooktime, description } = req.body;

    if (!user_id || !name || !shortdesc || !cooktime || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Insert the recipe into the database
        const result = await pool.query(
            'INSERT INTO recipes (user_id, name, shortdesc, cooktime, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, name, shortdesc, cooktime, description]
        );

        res.status(201).json({ message: 'Recipe added successfully', recipe: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get generated recipes by user id
const getGeneratedRecipesByUserId = async (req, res) => {
    const user_id = req?.query.id;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM recipes WHERE user_id = $1',
            [user_id]
        );

        res.status(200).json({ recipes: result.rows });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Save modified recipe and its ingredients
const saveModifiedRecipe = async (req, res) => {
    const { user_id, name, shortdesc, cooktime, description, safe, ingredients } = req.body;

    if (!user_id || !name || !shortdesc || !cooktime || !description || !ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ message: 'All fields including ingredients are required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Insert the recipe
        const recipeResult = await client.query(
            `INSERT INTO modified_recipes (user_id, name, shortdesc, cooktime, description, safe)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [user_id, name, shortdesc, cooktime, description, safe]
        );

        const recipeId = recipeResult.rows[0].id;

        // Insert each ingredient
        const ingredientPromises = ingredients.map((ingredient) => {
            const { original, isAllergen, replacement, quantity } = ingredient;
            return client.query(
                `INSERT INTO ingredients (recipe_id, original, is_allergen, replacement, quantity)
                 VALUES ($1, $2, $3, $4, $5)`,
                [recipeId, original, isAllergen, replacement || null, quantity]
            );
        });

        await Promise.all(ingredientPromises);

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Recipe and ingredients added successfully',
            recipe: recipeResult.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saving recipe:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        client.release();
    }
};

// Get all modified recipes by user id
const getModifiedRecipesByUserId = async (req, res) => {
    const user_id = req?.query.id;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Get all modified recipes
        const recipeResult = await pool.query(
            `SELECT * FROM modified_recipes WHERE user_id = $1`,
            [user_id]
        );

        const recipes = recipeResult.rows;

        // Get related ingredients for each recipe
        for (const recipe of recipes) {
            const ingredientsResult = await pool.query(
                `SELECT original, is_allergen, replacement, quantity 
                 FROM ingredients 
                 WHERE recipe_id = $1`,
                [recipe.id]
            );

            recipe.ingredients = ingredientsResult.rows;
        }

        res.status(200).json({ recipes });
    } catch (error) {
        console.error('Error retrieving recipes with ingredients:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { saveGeneratedRecipe, getGeneratedRecipesByUserId, saveModifiedRecipe, getModifiedRecipesByUserId };