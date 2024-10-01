import express from "express";
import { config } from "dotenv";
import appRouter from "./src/routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config(); // Load environment variables
const app = express();

// CORS configuration
app.use(cors({
  origin: "https://66fc420df914aaa5ff72f43f--gbt-turbo.netlify.app", // No trailing slash
  credentials: true,  // Enable credentials to allow cookies
}));

// Parse JSON requests
app.use(express.json());

// Middleware to parse cookies, using secret from environment variables
app.use(cookieParser(process.env.COOKIE_SECRET));

// Route definitions
app.use("/api/v1", appRouter);

// Optional: Middleware to handle errors (for better debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error stack for debugging
  res.status(500).send('Something broke!');  // Send a 500 Internal Server Error response
});

export default app;
