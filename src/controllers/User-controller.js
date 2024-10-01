import User from "../models/userSchema.js"
import {compare, hash} from "bcrypt"
import { CreateToken } from "../utils/token-manager.js"


export const GetAllUser = async(req  ,res) => {


    try{
        const users = await User.find()
        res.status(200).json({message: "ok",users})


    } catch(e){
        console.log(e)
        res.status(500).json({message: "error", cause : error.message})

    }
 
  
}

export const UserSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

   
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        
        const hashedPassword = await hash(password, 12);

       
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        //create and store cookies


        //clear tokens
        res.clearCookie("auth_token", {
            path: "/",
            httpOnly: true,
            signed: true,
        });
        

        //create a token

        const token = CreateToken(user._id.toString(), user.email);

        const expries = new Date();
        expries.setDate(expries.getDate() + 7);


        res.cookie("auth_token", token, { 
            expires: expries,
            httpOnly: true,
            signed : true,
            path: "/"
           
          })



        return res.status(200).json({
            message: "ok",
            name: user.name, email: user.email,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "error", cause: e.message });
    }
};

export const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

       
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
            
        }

        //clear tokens
        res.clearCookie("auth_token", {
            path: "/",
            httpOnly: true,
            signed: true,
        });
        

        //create a token

        const token = CreateToken(user._id.toString(), user.email);

        const expries = new Date();
        expries.setDate(expries.getDate() + 7);


        res.cookie("auth_token", token, { 
            expires: expries,
            httpOnly: true,
            signed : true,
            path: "/"
           
          })


        return res.status(200).json({
            message: "Login successful",
            name: user.name, email: user.email,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "error", cause: e.message });
    }
};

export const verifyUser = async (req, res, next) => {
    try {
      // Retrieve user by ID stored in the decoded JWT token
      const user = await User.findById(res.locals.jwtData.id);
      
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
      
      // Ensure the user ID matches the ID in the JWT data
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
      }
  
      // If everything is fine, return user data
      return res
        .status(200)
        .json({ message: "OK", name: user.name, email: user.email });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR", cause: error.message });
    }
  };
export const userLogout = async (
    req,
    res,
    next
  ) => {
    try {
      // Find the user by the token's data (JWT payload stored in res.locals.jwtData)
      const user = await User.findById(res.locals.jwtData.id);
      
      if (!user) {
        return res.status(401).json({ message: "User not registered or Token malfunctioned" });
      }
  
      // Ensure the user ID matches the one stored in the JWT token
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).json({ message: "Permissions didn't match" });
      }
  
      // Clear the 'auth_token' cookie
      res.clearCookie("auth_token", {
        httpOnly: true,
        signed: true,
        path: "/",
        domain: "localhost" // Adjust the domain if required (e.g., for production)
      });
  
      return res.status(200).json({
        message: "Logout successful",
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR", cause: error.message });
    }
  };
  
  