import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import bankRoutes from "./routes/bankRoutes.js";
import authUserRoutes from "./routes/authUserRoutes.js";
import cors from "cors";
import connectDB from "./config/db.js";
dotenv.config();
const app = express();
// cors middleware
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  console.log("hiii")
  res.send("Hellow World");
});

// Bank Routes
app.use("/api/v1/bank", bankRoutes);
app.use("/api/v1/users", authUserRoutes);

//Error handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
