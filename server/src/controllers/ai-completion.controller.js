const { OpenAI } = require("openai");
const axios = require('axios');

const headers = {
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
};
const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

const textCompletion = async (req, res) => {
  const { question, allergy } = req.body;

  if (!question || !allergy) {
    return res.status(400).json({ error: "Question and allergy are required" });
  }

  try {
    const response = await openai.chat.completions.create({
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
                You are also a helpful assistant that specializes in answering questions 
                regarding food allergies by advising people on what they are allowed to eat 
                and warning them if the food is dangerous for them.
                You carefully take into account the existing allergy because
                you know that it is very dangerous for a person with certain allergy to
                eat a food that may contain the allergy as ingredient in some way.
                You analyze each existing part of a food, so if you have information that the food 
                might contain the allergy as an igredient even in a little form somewhere, 
                you should mark it as dangerous.
                The questions can be in the form of full sentences or 
                just a phrase that refers to the name of a particular food. 
                You should answer the question in Bulgarian by taking into account 
                the allergy of the user and displaying a "Опасно" text when there is 
                even a small possibility that the food may contain the particular 
                allergen with a comprehensive description (3-4 sentences) of how exactly the ingredient 
                exists in the food. If the food does not contain the allergen, 
                you should answer with the word "Безопасно" and a comprehensive 
                description (3-4 sentences) of how the ingredient is not contained in the particular food at all.
                You should return the response in JSON format with two fields. 
                The first field called "keyword" containing one of the mentioned keywords (i.e. "Опасно"/"Безопасно"). 
                The second field called "details" containing the short description of the answer as instructed. 
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
                Question: ${question};
                Do not get influenced by the keywords in the question. 
                Do not give information that is not relevant to the context of allergies and food.
                Do not answer questions that are not related to the context of food and allergies.
                Show an empty "keyword" field if the question is not related to the context of food and allergies.
                In the "details" field, explain that this question is not relevant if the question is not related to the context of food and allergies.
              `,
            },
          ],
        },
      ],
      response_format: { "type": "json_object" }
    });

    res.json({ answer: response.choices[0].message });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
};

const imageCompletion = async (req, res) => {
  const { image, allergy } = req.body;

  if (!image || !allergy) {
    return res.status(400).json({ error: "Image and allergy are required" });
  }

  try {
    const response = await openai.chat.completions.create({
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
                You are also a helpful assistant that specializes in analyzing pictures of food, 
                carefully takes into account the existing allergy of a user, and determines if the displayed 
                food might contain an ingredient related to the allergy of the user.
                After analyzing the picture, you advise people on what they are allowed to eat 
                and warn them if the food is dangerous for them.
                You carefully take into account the existing allergy of the user because
                you know that it is very dangerous for a person with certain allergy to
                eat a food that may contain the allergy as ingredient in some way.
                You analyze each existing part of the food in the image, 
                so if you have information that the food might contain the allergy 
                as an igredient even in a little form somewhere, you should mark it as dangerous.
                You should analyze the image and provide an answer in Bulgarian by taking into account 
                the allergy of the user and displaying the keyword "Опасно" when there is 
                even a small possibility that the food in the image may contain the particular 
                allergen with a comprehensive description (3-4 sentences) of how exactly the ingredient 
                exists in the food. If the food in the image does not contain the allergen, 
                you should answer with the keyword "Безопасно" and a comprehensive description (3-4 sentences)
                of how the ingredient is not contained in the particular food at all. 
                You should return the response in JSON format with two fields. 
                The first field called "keyword" containing one of the mentioned keywords (i.e. "Опасно"/"Безопасно"). 
                The second field called "details" containing the description of the answer as instructed. 
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
                Does the food displayed in this image contain ${allergy}? 
                Do not give information that is not relevant to the context of allergies and food. 
                Do not give an answer if the image is not related to food or allergies.
                Show an empty "keyword" field if the question is not related to the context of food and allergies.
                In the "details" field, explain that this question is not relevant if the question is not related to the context of food and allergies.
              `,
            },
            {
              type: "image_url",
              image_url: { url: `${image}` },
            },
          ],
        },
      ],
      response_format: { "type": "json_object" }
    });

    res.json({ answer: response.choices[0].message });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
};


module.exports = { textCompletion, imageCompletion };
