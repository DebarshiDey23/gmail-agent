console.log("Starting server...");

import express from "express";
import cors from "cors";
import { env } from "./config/env";

import authRoutes from "./routes/auth";
import gmailRoutes from "./routes/gmail";

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Remove this line:
// app.options("*", cors());

app.use("/auth", authRoutes);
app.use("/gmail", gmailRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));