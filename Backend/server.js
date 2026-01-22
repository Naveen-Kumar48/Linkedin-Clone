import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
const app = express();
app.use(express.json());

app.use(cors());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static('uploads'))
app.use('/uploads', express.static('uploads'))
const PORT = process.env.PORT 

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
