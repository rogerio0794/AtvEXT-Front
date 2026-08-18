const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const db = require("../database/db");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

// GET /api/quizzes
router.get("/", authenticateToken, (req, res) => {
  const { category_id, difficulty, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT q.*, c.name as category_name, c.icon as category_icon, c.color as category_color
    FROM quizzes q
    JOIN categories c ON c.id = q.category_id
    WHERE q.is_active = 1
  `;
  const params = [];

  if (category_id) { query += " AND q.category_id = ?"; params.push(category_id); }
  if (difficulty) { query += " AND q.difficulty = ?"; params.push(difficulty); }
  if (search) { query += " AND (q.title LIKE ? OR q.description LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }

  const countQuery = query.replace(
    "SELECT q.*, c.name as category_name, c.icon as category_icon, c.color as category_color",
    "SELECT COUNT(*) as count"
  );
  const total = db.prepare(countQuery).get(...params).count;

  query += " ORDER BY q.created_at DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  const quizzes = db.prepare(query).all(...params).map((quiz) => {
    const attempt = db.prepare(`
      SELECT score, completed_at FROM quiz_attempts
      WHERE user_id = ? AND quiz_id = ?
      ORDER BY completed_at DESC LIMIT 1
    `).get(req.user.id, quiz.id);

    return { ...quiz, lastAttempt: attempt || null };
  });

  res.json({ quizzes, total, page: Number(page), totalPages: Math.ceil(total / limit) });
});

// GET /api/quizzes/:id
router.get("/:id", authenticateToken, (req, res) => {
  const quiz = db.prepare(`
    SELECT q.*, c.name as category_name, c.icon as category_icon, c.color as category_color
    FROM quizzes q
    JOIN categories c ON c.id = q.category_id
    WHERE q.id = ? AND q.is_active = 1
  `).get(req.params.id);

  if (!quiz) return res.status(404).json({ error: "Quiz não encontrado" });

  const questions = db.prepare("SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_index").all(quiz.id);

  const parsedQuestions = questions.map((q) => ({
    ...q,
    alternatives: JSON.parse(q.alternatives),
  }));

  const attempts = db.prepare(`
    SELECT id, score, correct_answers, total_questions, xp_earned, coins_earned, time_spent, completed_at
    FROM quiz_attempts
    WHERE user_id = ? AND quiz_id = ?
    ORDER BY completed_at DESC
  `).all(req.user.id, quiz.id);

  res.json({ quiz, questions: parsedQuestions, attempts });
});

// POST /api/quizzes - teacher/admin
router.post(
  "/",
  authenticateToken,
  requireRole("teacher", "admin"),
  [
    body("title").trim().notEmpty().withMessage("Título é obrigatório"),
    body("category_id").isInt({ min: 1 }).withMessage("Categoria inválida"),
    body("difficulty").isIn(["easy", "medium", "hard"]).withMessage("Dificuldade inválida"),
    body("xp_reward").optional().isInt({ min: 0 }).withMessage("XP inválido"),
  ],
  validate,
  (req, res) => {
    const { title, description, category_id, difficulty = "medium", xp_reward = 50, coin_reward = 10, time_limit = 30 } = req.body;

    const cat = db.prepare("SELECT id FROM categories WHERE id = ?").get(category_id);
    if (!cat) return res.status(400).json({ error: "Categoria não encontrada" });

    const result = db.prepare(`
      INSERT INTO quizzes (title, description, category_id, difficulty, xp_reward, coin_reward, time_limit, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, category_id, difficulty, xp_reward, coin_reward, time_limit, req.user.id);

    const quiz = db.prepare(`
      SELECT q.*, c.name as category_name FROM quizzes q
      JOIN categories c ON c.id = q.category_id WHERE q.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ quiz });
  }
);

// PUT /api/quizzes/:id
router.put("/:id", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz não encontrado" });

  const { title, description, category_id, difficulty, xp_reward, coin_reward, time_limit, is_active } = req.body;
  const updates = [];
  const params = [];

  if (title) { updates.push("title = ?"); params.push(title); }
  if (description !== undefined) { updates.push("description = ?"); params.push(description); }
  if (category_id) { updates.push("category_id = ?"); params.push(category_id); }
  if (difficulty) { updates.push("difficulty = ?"); params.push(difficulty); }
  if (xp_reward !== undefined) { updates.push("xp_reward = ?"); params.push(xp_reward); }
  if (coin_reward !== undefined) { updates.push("coin_reward = ?"); params.push(coin_reward); }
  if (time_limit !== undefined) { updates.push("time_limit = ?"); params.push(time_limit); }
  if (is_active !== undefined) { updates.push("is_active = ?"); params.push(is_active ? 1 : 0); }

  if (updates.length === 0) return res.status(400).json({ error: "Nenhum campo para atualizar" });

  updates.push("updated_at = datetime('now')");
  params.push(req.params.id);
  db.prepare(`UPDATE quizzes SET ${updates.join(", ")} WHERE id = ?`).run(...params);

  const updated = db.prepare(`
    SELECT q.*, c.name as category_name FROM quizzes q
    JOIN categories c ON c.id = q.category_id WHERE q.id = ?
  `).get(req.params.id);

  res.json({ quiz: updated });
});

// DELETE /api/quizzes/:id
router.delete("/:id", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const quiz = db.prepare("SELECT id FROM quizzes WHERE id = ?").get(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz não encontrado" });

  db.prepare("DELETE FROM quizzes WHERE id = ?").run(req.params.id);
  res.json({ message: "Quiz removido" });
});

module.exports = router;
