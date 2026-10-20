import express from "express";

import cors from "cors";

import helmet from "helmet";

import cookieParser from "cookie-parser";

import pinoHttp from "pino-http";

import healthRoutes from "./routes/health.routes.js";

import errorHandler from "./middlewares/error.middleware.js";

import authRoutes from  "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import aiRoutes from  "./routes/ai.routes.js";

const app = express();


// Security
app.use(helmet());

// CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Parse Form Data
app.use(express.urlencoded({ extended: true }));

// Parse Cookies
app.use(cookieParser());

// Logger
app.use(pinoHttp());

app.use("/api/v1/health", healthRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/ai", aiRoutes);

app.use(errorHandler);

export default app;