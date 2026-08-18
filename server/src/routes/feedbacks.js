const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const db = require("../database/db");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

// GET /api/feedbacks/mine - current user's own feedback
router.get("/mine", authenticateToken, (req, res) => {
  const feedback = db
    .prepare("SELECT * FROM feedbacks WHERE user_id = ?")
    .get(req.user.id);
  res.json({ feedback: feedback || null });
});

// POST /api/feedbacks - submit or update feedback (students only)
router.post(
  "/",
  authenticateToken,
  requireRole("student"),
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Avaliação deve ser entre 1 e 5"),
    body("comment").optional().trim().isLength({ max: 1000 }).withMessage("Comentário muito longo"),
  ],
  validate,
  (req, res) => {
    const { rating, comment } = req.body;

    const existing = db.prepare("SELECT id FROM feedbacks WHERE user_id = ?").get(req.user.id);

    if (existing) {
      db.prepare(`
        UPDATE feedbacks SET rating = ?, comment = ?, updated_at = datetime('now')
        WHERE user_id = ?
      `).run(rating, comment || null, req.user.id);
    } else {
      db.prepare(`
        INSERT INTO feedbacks (user_id, rating, comment) VALUES (?, ?, ?)
      `).run(req.user.id, rating, comment || null);
    }

    const feedback = db.prepare("SELECT * FROM feedbacks WHERE user_id = ?").get(req.user.id);
    res.status(existing ? 200 : 201).json({ feedback, updated: !!existing });
  }
);

// GET /api/feedbacks - teacher/admin: list all feedbacks
router.get("/", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const { rating, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT f.*, u.name as user_name, u.apelido as user_apelido, u.avatar as user_avatar, u.level as user_level
    FROM feedbacks f
    JOIN users u ON u.id = f.user_id
    WHERE 1=1
  `;
  const params = [];

  if (rating) {
    query += " AND f.rating = ?";
    params.push(Number(rating));
  }

  const total = db
    .prepare(query.replace("SELECT f.*, u.name as user_name, u.apelido as user_apelido, u.avatar as user_avatar, u.level as user_level", "SELECT COUNT(*) as count"))
    .get(...params).count;

  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      ROUND(AVG(rating), 1) as avg_rating,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as stars5,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as stars4,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as stars3,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as stars2,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as stars1
    FROM feedbacks
  `).get();

  query += " ORDER BY f.updated_at DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  const feedbacks = db.prepare(query).all(...params);

  res.json({
    feedbacks,
    stats,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
});

// DELETE /api/feedbacks/:id - admin only
router.delete("/:id", authenticateToken, requireRole("admin"), (req, res) => {
  db.prepare("DELETE FROM feedbacks WHERE id = ?").run(req.params.id);
  res.json({ message: "Feedback removido" });
});

module.exports = router;
