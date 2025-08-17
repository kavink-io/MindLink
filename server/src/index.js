import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { connectDB } from "./utils/db.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import authRoutes from "./routes/auth.routes.js";
import qnaRoutes from "./routes/qna.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api", qnaRoutes);
app.use("/api/reports", reportRoutes);

await connectDB(process.env.MONGO_URI);
app.listen(process.env.PORT, () => console.log(`🚀 API http://localhost:${process.env.PORT}`));
