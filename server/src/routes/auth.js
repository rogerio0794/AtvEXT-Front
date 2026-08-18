const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const db = require("../database/db");
const { validate } = require("../middleware/validate");
const { authenticateToken } = require("../middleware/auth");

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
    body("apelido").optional().trim(),
    body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Senha deve ter ao menos 6 caracteres"),
  ],
  validate,
  (req, res) => {
    const { name, apelido, email, password, role = "student" } = req.body;

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const allowedRoles = ["student", "teacher"];
    const safeRole = allowedRoles.includes(role) ? role : "student";

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db
      .prepare("INSERT INTO users (name, apelido, email, password_hash, role) VALUES (?, ?, ?, ?, ?)")
      .run(name, apelido || null, email, passwordHash, safeRole);

    const user = db
      .prepare("SELECT id, name, apelido, email, role, level, xp, coins, streak, avatar, created_at FROM users WHERE id = ?")
      .get(result.lastInsertRowid);

    // Welcome notification
    db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)")
      .run(user.id, "Bem-vindo ao QuizTech! 🎉", "Sua conta foi criada com sucesso. Comece estudando agora!", "success");

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.status(201).json({ user, token });
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
  ],
  validate,
  (req, res) => {
    const { email, password } = req.body;

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    // Update streak
    const today = new Date().toISOString().split("T")[0];
    const lastDate = user.last_activity_date;
    let newStreak = user.streak;

    if (lastDate) {
      const diff = Math.floor((new Date(today) - new Date(lastDate)) / 86400000);
      if (diff === 1) newStreak += 1;
      else if (diff > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    db.prepare("UPDATE users SET streak = ?, last_activity_date = ? WHERE id = ?").run(newStreak, today, user.id);

    const { password_hash, ...safeUser } = user;
    safeUser.streak = newStreak;
    safeUser.last_activity_date = today;
    // Ensure apelido is included in response
    if (!safeUser.apelido) safeUser.apelido = null;

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({ user: safeUser, token });
  }
);

// GET /api/auth/me
router.get("/me", authenticateToken, (req, res) => {
  const user = db
    .prepare("SELECT id, name, email, role, level, xp, coins, streak, avatar, last_activity_date, created_at FROM users WHERE id = ?")
    .get(req.user.id);
  res.json({ user });
});

// POST /api/auth/logout (client-side - just confirmation)
router.post("/logout", authenticateToken, (req, res) => {
  res.json({ message: "Logout realizado com sucesso" });
});

module.exports = router;
