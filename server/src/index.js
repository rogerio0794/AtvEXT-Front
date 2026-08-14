require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { initializeSchema } = require("./database/schema");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");
const quizRoutes = require("./routes/quizzes");
const questionRoutes = require("./routes/questions");
const attemptRoutes = require("./routes/attempts");
const achievementRoutes = require("./routes/achievements");
const missionRoutes = require("./routes/missions");
const rankingRoutes = require("./routes/ranking");
const notificationRoutes = require("./routes/notifications");
const teacherRoutes = require("./routes/teacher");
const feedbackRoutes = require("./routes/feedbacks");

const app = express();
const PORT = process.env.PORT || 3001;

// Security & middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database schema
initializeSchema();

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "QuizTech API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/feedbacks", feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.path}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Erro interno do servidor" : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 QuizTech API rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação de rotas: http://localhost:${PORT}/api/health`);
  console.log(`🌱 Para popular o banco: npm run seed\n`);
});

module.exports = app;
