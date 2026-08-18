const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const db = require("../database/db");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

// GET /api/questions?quiz_id=X
router.get("/", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const { quiz_id } = req.query;
  if (!quiz_id) return res.status(400).json({ error: "quiz_id é obrigatório" });

  const questions = db.prepare("SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_index").all(quiz_id);
  const parsed = questions.map((q) => ({ ...q, alternatives: JSON.parse(q.alternatives) }));
  res.json({ questions: parsed });
});

// GET /api/questions/:id
router.get("/:id", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const question = db.prepare("SELECT * FROM questions WHERE id = ?").get(req.params.id);
  if (!question) return res.status(404).json({ error: "Questão não encontrada" });
  res.json({ question: { ...question, alternatives: JSON.parse(question.alternatives) } });
});

// POST /api/questions
router.post(
  "/",
  authenticateToken,
  requireRole("teacher", "admin"),
  [
    body("quiz_id").isInt({ min: 1 }).withMessage("quiz_id inválido"),
    body("text").trim().notEmpty().withMessage("Texto é obrigatório"),
    body("alternatives").isArray({ min: 2 }).withMessage("Deve ter ao menos 2 alternativas"),
    body("correct_alternative").isInt({ min: 0 }).withMessage("Alternativa correta inválida"),
  ],
  validate,
  (req, res) => {
    const { quiz_id, text, context, image_url, alternatives, correct_alternative, explanation, order_index = 0 } = req.body;

    const quiz = db.prepare("SELECT id FROM quizzes WHERE id = ?").get(quiz_id);
    if (!quiz) return res.status(400).json({ error: "Quiz não encontrado" });

    if (correct_alternative >= alternatives.length) {
      return res.status(400).json({ error: "Índice da alternativa correta inválido" });
    }

    const result = db.prepare(`
      INSERT INTO questions (quiz_id, text, context, image_url, alternatives, correct_alternative, explanation, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(quiz_id, text, context, image_url, JSON.stringify(alternatives), correct_alternative, explanation, order_index);

    const question = db.prepare("SELECT * FROM questions WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({ question: { ...question, alternatives: JSON.parse(question.alternatives) } });
  }
);

// PUT /api/questions/:id
router.put("/:id", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const question = db.prepare("SELECT * FROM questions WHERE id = ?").get(req.params.id);
  if (!question) return res.status(404).json({ error: "Questão não encontrada" });

  const { text, context, image_url, alternatives, correct_alternative, explanation, order_index } = req.body;
  const updates = [];
  const params = [];

  if (text) { updates.push("text = ?"); params.push(text); }
  if (context !== undefined) { updates.push("context = ?"); params.push(context); }
  if (image_url !== undefined) { updates.push("image_url = ?"); params.push(image_url); }
  if (alternatives) { updates.push("alternatives = ?"); params.push(JSON.stringify(alternatives)); }
  if (correct_alternative !== undefined) { updates.push("correct_alternative = ?"); params.push(correct_alternative); }
  if (explanation !== undefined) { updates.push("explanation = ?"); params.push(explanation); }
  if (order_index !== undefined) { updates.push("order_index = ?"); params.push(order_index); }

  if (updates.length === 0) return res.status(400).json({ error: "Nenhum campo para atualizar" });

  params.push(req.params.id);
  db.prepare(`UPDATE questions SET ${updates.join(", ")} WHERE id = ?`).run(...params);

  const updated = db.prepare("SELECT * FROM questions WHERE id = ?").get(req.params.id);
  res.json({ question: { ...updated, alternatives: JSON.parse(updated.alternatives) } });
});

// DELETE /api/questions/:id
router.delete("/:id", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const q = db.prepare("SELECT id FROM questions WHERE id = ?").get(req.params.id);
  if (!q) return res.status(404).json({ error: "Questão não encontrada" });

  db.prepare("DELETE FROM questions WHERE id = ?").run(req.params.id);
  res.json({ message: "Questão removida" });
});

module.exports = router;
