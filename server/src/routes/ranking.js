const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { authenticateToken } = require("../middleware/auth");

// GET /api/ranking - global ranking by XP
router.get("/", authenticateToken, (req, res) => {
  const { period = "all", category_id, limit = 50 } = req.query;

  let query;
  const params = [];

  if (period === "week" || period === "month") {
    const days = period === "week" ? 7 : 30;
    query = `
      SELECT u.id, u.name, u.avatar, u.level,
             SUM(qa.xp_earned) as xp,
             COUNT(qa.id) as quizzes_completed,
             AVG(qa.score) as avg_score
      FROM quiz_attempts qa
      JOIN users u ON u.id = qa.user_id
      WHERE qa.completed_at >= datetime('now', '-${days} days')
      ${category_id ? "AND qa.quiz_id IN (SELECT id FROM quizzes WHERE category_id = ?)" : ""}
      AND u.role = 'student'
      GROUP BY u.id
      ORDER BY xp DESC
      LIMIT ?
    `;
    if (category_id) params.push(category_id);
    params.push(Number(limit));
  } else {
    query = `
      SELECT u.id, u.name, u.avatar, u.level, u.xp, u.streak,
             (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = u.id) as quizzes_completed,
             (SELECT AVG(score) FROM quiz_attempts WHERE user_id = u.id) as avg_score
      FROM users u
      WHERE u.role = 'student'
      ORDER BY u.xp DESC
      LIMIT ?
    `;
    params.push(Number(limit));
  }

  const users = db.prepare(query).all(...params);

  const ranked = users.map((u, i) => ({
    position: i + 1,
    ...u,
    avg_score: u.avg_score ? Math.round(u.avg_score) : 0,
  }));

  // Current user position
  const userPosition = ranked.findIndex((r) => r.id === req.user.id) + 1;
  const userEntry = ranked.find((r) => r.id === req.user.id);

  res.json({ ranking: ranked, userPosition, userEntry });
});

// GET /api/ranking/category/:id
router.get("/category/:id", authenticateToken, (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.name, u.avatar, u.level,
           SUM(qa.xp_earned) as xp,
           COUNT(qa.id) as quizzes_completed,
           AVG(qa.score) as avg_score
    FROM quiz_attempts qa
    JOIN users u ON u.id = qa.user_id
    JOIN quizzes q ON q.id = qa.quiz_id
    WHERE q.category_id = ? AND u.role = 'student'
    GROUP BY u.id
    ORDER BY xp DESC
    LIMIT 50
  `).all(req.params.id);

  const ranked = users.map((u, i) => ({
    position: i + 1,
    ...u,
    avg_score: u.avg_score ? Math.round(u.avg_score) : 0,
  }));

  res.json({ ranking: ranked });
});

module.exports = router;
