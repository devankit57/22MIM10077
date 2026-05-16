import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import Log from "./middleware/logger";

import notificationRoutes from "./routes/notificationRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", authRoutes);

app.use("/notifications", notificationRoutes);

app.get("/", async (_, res) => {

  await Log({
    stack: "backend",
    level: "info",
    package: "route",
    message: "root route accessed"
  });

  res.json({
    success: true,
    message: "notification system backend running"
  });

});

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `server running on ${PORT}`
  );

});