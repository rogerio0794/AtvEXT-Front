const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const db = require("../database/db");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

// GET /api/categories
router.get("/", authenticateToken, (req, res) => {
  const categories = db.prepare("SELECT * FROM categories ORDER BY name").all();

  // Add user progress for each category
  const withProgress = categories.map((cat) => {
    const attempted = db.prepare(`
      SELECT COUNT(DISTINCT qa.quiz_id) as count
      FROM quiz_attempts qa
      JOIN quizzes q ON q.id = qa.quiz_id
      WHERE qa.user_id = ? AND q.category_id = ?
    `).get(req.user.id, cat.id);

    const totalQuizzes = db.prepare("SELECT COUNT(*) as count FROM quizzes WHERE category_id = ? AND is_active = 1").get(cat.id).count;

    return {
      ...cat,
      userProgress: totalQuizzes > 0 ? Math.round((attempted.count / totalQuizzes) * 100) : 0,
      completedQuizzes: attempted.count,
    };
  });

  res.json({ categories: withProgress });
});

// GET /api/categories/:id
router.get("/:id", authenticateToken, (req, res) => {
  const category = db.prepare("SELECT * FROM categories WHERE id = ?").get(req.params.id);
  if (!category) return res.status(404).json({ error: "Categoria não encontrada" });

  const quizzes = db.prepare("SELECT * FROM quizzes WHERE category_id = ? AND is_active = 1 ORDER BY difficulty, title").all(req.params.id);
  res.json({ category, quizzes });
});

// POST /api/categories - teacher/admin
router.post(
  "/",
  authenticateToken,
  requireRole("teacher", "admin"),
  [
    body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
    body("difficulty").isIn(["easy", "medium", "hard"]).withMessage("Dificuldade inválida"),
  ],
  validate,
  (req, res) => {
    const { name, description, icon = "📚", color = "#1e40af", difficulty = "medium" } = req.body;
    const result = db.prepare("INSERT INTO categories (name, description, icon, color, difficulty) VALUES (?, ?, ?, ?, ?)").run(name, description, icon, color, difficulty);
    const category = db.prepare("SELECT * FROM categories WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({ category });
  }
);

// PUT /api/categories/:id
router.put("/:id", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const cat = db.prepare("SELECT id FROM categories WHERE id = ?").get(req.params.id);
  if (!cat) return res.status(404).json({ error: "Categoria não encontrada" });

  const { name, description, icon, color, difficulty } = req.body;
  const updates = [];
  const params = [];

  if (name) { updates.push("name = ?"); params.push(name); }
  if (description !== undefined) { updates.push("description = ?"); params.push(description); }
  if (icon) { updates.push("icon = ?"); params.push(icon); }
  if (color) { updates.push("color = ?"); params.push(color); }
  if (difficulty) { updates.push("difficulty = ?"); params.push(difficulty); }

  if (updates.length === 0) return res.status(400).json({ error: "Nenhum campo para atualizar" });

  params.push(req.params.id);
  db.prepare(`UPDATE categories SET ${updates.join(", ")} WHERE id = ?`).run(...params);

  const updated = db.prepare("SELECT * FROM categories WHERE id = ?").get(req.params.id);
  res.json({ category: updated });
});

// DELETE /api/categories/:id - admin only
router.delete("/:id", authenticateToken, requireRole("admin"), (req, res) => {
  const cat = db.prepare("SELECT id FROM categories WHERE id = ?").get(req.params.id);
  if (!cat) return res.status(404).json({ error: "Categoria não encontrada" });

  db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
  res.json({ message: "Categoria removida" });
});

module.exports = router;
