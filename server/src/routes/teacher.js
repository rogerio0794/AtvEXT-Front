const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/teacher/stats - teacher dashboard overview
router.get("/stats", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;
  const totalQuizzes = db.prepare("SELECT COUNT(*) as count FROM quizzes WHERE is_active = 1").get().count;
  const totalAttempts = db.prepare("SELECT COUNT(*) as count FROM quiz_attempts").get().count;
  const avgScore = db.prepare("SELECT AVG(score) as avg FROM quiz_attempts").get().avg || 0;

  const topQuizzes = db.prepare(`
    SELECT q.id, q.title, c.name as category_name, c.icon as category_icon,
           COUNT(qa.id) as attempts, AVG(qa.score) as avg_score
    FROM quiz_attempts qa
    JOIN quizzes q ON q.id = qa.quiz_id
    JOIN categories c ON c.id = q.category_id
    GROUP BY q.id
    ORDER BY attempts DESC
    LIMIT 5
  `).all().map((q) => ({ ...q, avg_score: Math.round(q.avg_score || 0) }));

  const recentActivity = db.prepare(`
    SELECT u.name, u.avatar, q.title as quiz_title, qa.score, qa.completed_at
    FROM quiz_attempts qa
    JOIN users u ON u.id = qa.user_id
    JOIN quizzes q ON q.id = qa.quiz_id
    ORDER BY qa.completed_at DESC
    LIMIT 10
  `).all();

  const quizzesByCategory = db.prepare(`
    SELECT c.name, c.icon, c.color, COUNT(q.id) as count
    FROM categories c
    LEFT JOIN quizzes q ON q.category_id = c.id AND q.is_active = 1
    GROUP BY c.id
    ORDER BY count DESC
  `).all();

  const dailyAttempts = db.prepare(`
    SELECT date(completed_at) as date, COUNT(*) as count, AVG(score) as avg_score
    FROM quiz_attempts
    WHERE completed_at >= datetime('now', '-7 days')
    GROUP BY date(completed_at)
    ORDER BY date ASC
  `).all().map((d) => ({ ...d, avg_score: Math.round(d.avg_score || 0) }));

  res.json({
    stats: {
      totalStudents,
      totalQuizzes,
      totalAttempts,
      avgScore: Math.round(avgScore),
    },
    topQuizzes,
    recentActivity,
    quizzesByCategory,
    dailyAttempts,
  });
});

// GET /api/teacher/reports - detailed reports
router.get("/reports", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const { quiz_id, category_id, from_date, to_date } = req.query;

  let query = `
    SELECT qa.id, u.name as student_name, u.email, q.title as quiz_title,
           c.name as category_name, qa.score, qa.correct_answers, qa.total_questions,
           qa.xp_earned, qa.time_spent, qa.completed_at
    FROM quiz_attempts qa
    JOIN users u ON u.id = qa.user_id
    JOIN quizzes q ON q.id = qa.quiz_id
    JOIN categories c ON c.id = q.category_id
    WHERE 1=1
  `;
  const params = [];

  if (quiz_id) { query += " AND qa.quiz_id = ?"; params.push(quiz_id); }
  if (category_id) { query += " AND q.category_id = ?"; params.push(category_id); }
  if (from_date) { query += " AND date(qa.completed_at) >= ?"; params.push(from_date); }
  if (to_date) { query += " AND date(qa.completed_at) <= ?"; params.push(to_date); }

  query += " ORDER BY qa.completed_at DESC LIMIT 200";

  const attempts = db.prepare(query).all(...params);
  res.json({ attempts });
});

module.exports = router;
