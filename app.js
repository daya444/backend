import express from "express";
import { config } from "dotenv";
import appRouter from "./src/routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config(); // Load environment variables
const app = express();

// CORS configuration
app.use(cors({
  origin: [
    "https://gbt-turbo.netlify.app",
    "http://localhost:5173"
  ],
  credentials: true, // Allow cookies
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
