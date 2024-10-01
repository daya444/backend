import express from "express";
import { config } from "dotenv";
import appRouter from "./src/routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();
const app = express();


app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true 
}));

app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Route definitions
app.use("/api/v1", appRouter);

// Optional: Middleware to handle errors (for better debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
