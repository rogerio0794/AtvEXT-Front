const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { authenticateToken } = require("../middleware/auth");

// GET /api/notifications
router.get("/", authenticateToken, (req, res) => {
  const { page = 1, limit = 20, unread_only } = req.query;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM notifications WHERE user_id = ?";
  const params = [req.user.id];

  if (unread_only === "true") { query += " AND is_read = 0"; }

  const total = db.prepare(query.replace("SELECT *", "SELECT COUNT(*) as count")).get(...params).count;
  const unreadCount = db.prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0").get(req.user.id).count;

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  const notifications = db.prepare(query).all(...params);
  res.json({ notifications, total, unreadCount, page: Number(page), totalPages: Math.ceil(total / limit) });
});

// PUT /api/notifications/:id/read
router.put("/:id/read", authenticateToken, (req, res) => {
  db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  res.json({ message: "Notificação marcada como lida" });
});

// PUT /api/notifications/read-all
router.put("/read-all", authenticateToken, (req, res) => {
  db.prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?").run(req.user.id);
  res.json({ message: "Todas as notificações marcadas como lidas" });
});

// DELETE /api/notifications/:id
router.delete("/:id", authenticateToken, (req, res) => {
  db.prepare("DELETE FROM notifications WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  res.json({ message: "Notificação removida" });
});

module.exports = router;
