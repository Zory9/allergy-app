const { OpenAI } = require("openai");

const headers = {
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
};
const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

const recipeGeneration = async (req, res) => {
  const { allergy, ingredients, cuisine, mealtype, cooktime } = req.body;

  if (!ingredients || !allergy) {
    return res.status(400).json({ error: "Question and allergy are required" });
  }

  try {
    const recipeResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "developer",
          content: [
            {
              type: "text",
              text: `
                You are a professional cook with 50 years of experience in the 
                food industry and know every possible ingredient a food might contain
                with well-known knowledge of Bulgarian traditional food as well. 
                You are also a helpful assistant that specializes in generating recipes based on 
                given main ingredients, food cuisine, mealtype and cooking time.
                It is very important that you take into account the given allergy
                of the user when generating the food recipe and NOT include it in the recipe in any way.
                You know that it is very dangerous for a person with certain allergy to
                eat a food that may contain the allergy as ingredient in some way.
                The questions will contain fields for allergy, ingredients, cuisine,
                mealtype and cooking time. The ingredients will be a mandatory field and the rest of the fields
                will be optional. When the user does not provide a value for a field,
                you should ignore it and not include it in the recipe generation process.
                If the user provides an ingredient that is related to any of the allergies of the user
                or when an ingredient may contain any of the allergies of the user and
                can be dangerous for a person with the given allergy, you should not include it in the generated recipe and you should replace it with another ingredient that is suitable for the food.
                You should answer the question in Bulgarian.
                You should return the response in JSON format with four fields.  
                The first field called "name" containing the name of the generated recipe in Bulgarian. 
                The second field called "shortDesc" containing a short description that explains the main idea 
                of the suggested recipe in one sentence.
                The third field called "description" containing the description of the recipe with 
                detailed instructions for its cooking in Bulgarian. Return the "description" in the form of 
                an ordered list separated with a newline character.
                The fourth field called "time" containing the cooking time for the food in 
                the generated recipe in Bulgarian.
                Always give 3 different recipe ideas, each containing the described fields. 
                Make the recipe ideas distinct from each other.
                Name the array of returned recipe ideas "recipes".
                `,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
                Allergy: ${allergy}; 
                Ingredients: ${ingredients};
                Cuisine: ${cuisine};
                Mealtype: ${mealtype};
                Cooking time: ${cooktime};
                Do not get influenced by the keywords in the question. 
                Do not give information that is not relevant to the context of allergies, food and recipes.
                Do not answer questions that are not related to the context of food, allergies and recipes.
              `,
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const generatedRecipes = JSON.parse(
      recipeResponse.choices[0].message.content
    );
    const recipes = generatedRecipes.recipes;

    return res.json({ recipes: recipes });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
};

const recipeModification = async (req, res) => {
  const { allergy, recipe } = req.body;

  if (!recipe || !allergy) {
    return res.status(400).json({ error: "Question and allergy are required" });
  }

  try {
    const recipeResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "developer",
          content: [
            {
              type: "text",
              text: `
                You are a professional cook with 50 years of experience in the 
                food industry and know every possible ingredient a food might contain
                with well-known knowledge of Bulgarian traditional food as well. 
                You are also a helpful assistant that specializes in modifying existing recipes based only on the
                given name of food, or also the used ingredients, or also a description of the recipe.
                The purpose of the modification is to create a recipe that is suitable for a person with certain allergy.
                You know that it is very dangerous for a person with certain allergy to
                eat a food that may contain the allergy as ingredient in some way.
                You should modify the recipe in a way that it will be suitable for a person with the given allergy.
                It is very important that you take into account the given allergy
                of the user when modifying the food recipe and NOT include it in the recipe in any way.
                If you find that the recipe contains an ingredient that is related to the allergy of the user and
                can be dangerous for a person with the given allergy,
                you should remove it from the recipe and replace it with another ingredient that is suitable 
                for a person with the given allergy and also suitable for the food.
                If the standard recipe does not contain any ingredient that is somehow related to the allergy of the user
                and are sure that the recipe is safe for a person with the given allergy,
                you should return the recipe as it is, without any modifications.
                The questions can be in the form of a name of food, or also the used ingredients, or also a description of the recipe.
                The recipe will be a mandatory field and the allergy will be a mandatory field as well.
                You should answer the question in Bulgarian.
                You should return the response in JSON format with five fields. 
                The first field called "name" containing the original name of the recipe. 
                The second field called "shortDesc" containing a short description that explains the main idea 
                of the recipe in one sentence.
                The third field called "time" containing the cooking time for the food in the modified recipe.
                The fourth field called "ingredients" containing an array of objects with the following fields (each object representing one ingredient):
                  - the first field called "original" containing the name of the original ingredient in the recipe;
                  - the second field called "isAllergen" stating if the ingredient is somehow related to the allergy of the user;
                  - the third field called "replacement" containing the name of the replacement for the original ingredient in the recipe - this field should be empty if the original ingredient is not related to the allergy of the user, i.e. when you decide that the isAllergen field is "false", this field should be empty;
                  - the fourth field called "quantity" containing the quantity of the ingredient in the recipe;
                The fifth field called "description" containing the instructions for cooking the recipe with
                steps for its cooking based on the new ingredients. Return the "description" in the form of 
                an ordered list separated with a newline character.
                If you find that the recipe does not contain any ingredient that is somehow related to the allergy of the user
                and are sure that the recipe is safe for a person with the given allergy,
                you should return an additional field called "safe" with value "true".
                `,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
                Allergy: ${allergy}; 
                Recipe: ${recipe};
                Do not get influenced by the keywords in the question. 
                Do not give information that is not relevant to the context of allergies, food and recipes.
                Do not answer questions that are not related to the context of food, allergies and recipes.
              `,
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const modifiedRecipe = JSON.parse(
      recipeResponse.choices[0].message.content
    );

    res.json({ modifiedRecipe: modifiedRecipe });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
};

module.exports = { recipeGeneration, recipeModification };
