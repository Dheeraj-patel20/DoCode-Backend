import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//basic configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//cors configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

//importing the routes
import  healthCheckRouter  from "./routes/healthCheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import problemrouter from './routes/problem.routes.js';
import submissionRouter from './routes/submission.routes.js'
import dashboardRouter from  './routes/dashboard.routes.js'
import leaderboardRouter from './routes/leaderboard.routes.js';

app.use("/api/v1/healthcheck",healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems",problemrouter);
app.use("/api/v1/submissions",submissionRouter);
app.use("/api/v1/dashboard",dashboardRouter);
app.use("/api/v1/leaderboard",leaderboardRouter);



export default app;
