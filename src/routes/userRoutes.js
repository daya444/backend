import { Router } from "express";
import { GetAllUser, UserLogin, userLogout, UserSignup, verifyUser } from "../controllers/User-controller.js";
import { verifyToken } from "../utils/token-manager.js";

const UserRouter = Router()

UserRouter.get('/',GetAllUser)
UserRouter.post('/signup',UserSignup)
UserRouter.post('/login',UserLogin)
UserRouter.get("/auth-status", verifyToken,  verifyUser);
UserRouter.get("/logout", verifyToken, userLogout);

export default UserRouter