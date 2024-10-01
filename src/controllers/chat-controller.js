import User from "../models/userSchema.js";
import OpenAI from "openai"; // Import the OpenAI class

// Generate chat completion function
export const generateChatCompletion = async (req, res, next) => {
  const { message } = req.body;

  try {
    // Find the user using the ID from JWT
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    // Check if the message is provided
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }
  
    // Grab chats of the user
    const chats = user.chats.map(({ role, content }) => ({ role, content }));
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    // Configure OpenAI directly in this function
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_SECRET, // Use the API key directly here
    });

    // Get latest response from OpenAI
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chats,
    });

    user.chats.push(chatResponse.choices[0].message); // Push the AI's response to the user's chat
    await user.save(); // Save the updated user document

    return res.status(200).json({ chats: user.chats });

  } catch (error) {
    console.log(error);
    // Handle errors
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const sendChatsToUser = async (
  req,
  res,
  next
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
export const deleteChats = async (
  req,
  res,
  next
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};