import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import postRoutes from "./routes/post.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(postRoutes)
const PORT = process.env.PORT || 9090;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

  }
};

start();
