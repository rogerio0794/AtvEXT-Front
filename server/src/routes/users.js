const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const db = require("../database/db");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

// GET /api/users - teacher/admin only
router.get("/", authenticateToken, requireRole("teacher", "admin"), (req, res) => {
  const { page = 1, limit = 20, search = "", role } = req.query;
  const offset = (page - 1) * limit;

  let query = "SELECT id, name, email, role, level, xp, coins, streak, avatar, created_at FROM users WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (name LIKE ? OR email LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (role) {
    query += " AND role = ?";
    params.push(role);
  }

  const total = db.prepare(query.replace("SELECT id, name, email, role, level, xp, coins, streak, avatar, created_at", "SELECT COUNT(*) as count")).get(...params).count;
  query += " ORDER BY xp DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  const users = db.prepare(query).all(...params);
  res.json({ users, total, page: Number(page), totalPages: Math.ceil(total / limit) });
});

// GET /api/users/:id
router.get("/:id", authenticateToken, (req, res) => {
  const targetId = Number(req.params.id);
  if (req.user.id !== targetId && !["teacher", "admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Acesso não autorizado" });
  }

  const user = db
    .prepare("SELECT id, name, email, role, level, xp, coins, streak, avatar, last_activity_date, created_at FROM users WHERE id = ?")
    .get(targetId);

  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  const totalAttempts = db.prepare("SELECT COUNT(*) as count FROM quiz_attempts WHERE user_id = ?").get(targetId).count;
  const avgScore = db.prepare("SELECT AVG(score) as avg FROM quiz_attempts WHERE user_id = ?").get(targetId).avg || 0;
  const achievementsCount = db.prepare("SELECT COUNT(*) as count FROM user_achievements WHERE user_id = ?").get(targetId).count;

  res.json({ user: { ...user, totalAttempts, avgScore: Math.round(avgScore), achievementsCount } });
});

// PUT /api/users/:id
router.put(
  "/:id",
  authenticateToken,
  [
    body("name").optional().trim().notEmpty().withMessage("Nome não pode ser vazio"),
    body("email").optional().isEmail().withMessage("Email inválido").normalizeEmail(),
  ],
  validate,
  (req, res) => {
    const targetId = Number(req.params.id);
    if (req.user.id !== targetId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }

    const { name, apelido, email, avatar } = req.body;
    const updates = [];
    const params = [];

    if (name) { updates.push("name = ?"); params.push(name); }
    if (apelido !== undefined) { updates.push("apelido = ?"); params.push(apelido || null); }
    if (email) {
      const existing = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, targetId);
      if (existing) return res.status(409).json({ error: "Email já cadastrado por outro usuário" });
      updates.push("email = ?"); params.push(email);
    }
    if (avatar !== undefined) { updates.push("avatar = ?"); params.push(avatar); }

    if (updates.length === 0) return res.status(400).json({ error: "Nenhum campo para atualizar" });

    params.push(targetId);
    db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...params);

    const updated = db.prepare("SELECT id, name, email, role, level, xp, coins, streak, avatar FROM users WHERE id = ?").get(targetId);
    res.json({ user: updated });
  }
);

// PUT /api/users/:id/password
router.put(
  "/:id/password",
  authenticateToken,
  [
    body("currentPassword").notEmpty().withMessage("Senha atual é obrigatória"),
    body("newPassword").isLength({ min: 6 }).withMessage("Nova senha deve ter ao menos 6 caracteres"),
  ],
  validate,
  (req, res) => {
    if (req.user.id !== Number(req.params.id)) {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }

    const { currentPassword, newPassword } = req.body;
    const user = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(req.user.id);

    if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(401).json({ error: "Senha atual incorreta" });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(newHash, req.user.id);

    res.json({ message: "Senha alterada com sucesso" });
  }
);

// DELETE /api/users/:id - admin only
router.delete("/:id", authenticateToken, requireRole("admin"), (req, res) => {
  const targetId = Number(req.params.id);
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(targetId);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  db.prepare("DELETE FROM users WHERE id = ?").run(targetId);
  res.json({ message: "Usuário removido com sucesso" });
});

module.exports = router;
