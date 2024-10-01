import { Router } from "express";

import UserRouter from "./userRoutes.js";
import { chatRouter } from "./chatRoutes.js";


const appRouter = Router()

appRouter.use("/user",UserRouter)
appRouter.use("/chats",chatRouter)


export default appRouter