import { OpenAI } from "openai"; // Importing the OpenAI class

export const configureOpenAI = () => {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET, // Set the API key
  });
  return openai; // Return the OpenAI client instance
};
