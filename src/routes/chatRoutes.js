import { Router } from "express";


import { verifyToken } from "../utils/token-manager.js";

import { deleteChats, generateChatCompletion, sendChatsToUser } from "../controllers/chat-controller.js";


 export const chatRouter = Router()


chatRouter.post(
    "/new",
    verifyToken,
    generateChatCompletion
  );

chatRouter.get("/all-chats", verifyToken, sendChatsToUser);
chatRouter.delete("/delete", verifyToken, deleteChats);




