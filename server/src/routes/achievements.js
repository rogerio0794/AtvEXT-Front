const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/achievements - all achievements with user unlock status
router.get("/", authenticateToken, (req, res) => {
  const all = db.prepare("SELECT * FROM achievements ORDER BY category, condition_value").all();
  const unlocked = db.prepare("SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ?").all(req.user.id);
  const unlockedMap = Object.fromEntries(unlocked.map((u) => [u.achievement_id, u.unlocked_at]));

  const achievements = all.map((ach) => ({
    ...ach,
    unlocked: !!unlockedMap[ach.id],
    unlocked_at: unlockedMap[ach.id] || null,
  }));

  const stats = {
    total: all.length,
    unlocked: unlocked.length,
    percentage: Math.round((unlocked.length / all.length) * 100),
  };

  res.json({ achievements, stats });
});

// GET /api/achievements/user/:userId
router.get("/user/:userId", authenticateToken, (req, res) => {
  const targetId = Number(req.params.userId);
  if (req.user.id !== targetId && !["teacher", "admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Acesso não autorizado" });
  }

  const unlocked = db.prepare(`
    SELECT a.*, ua.unlocked_at
    FROM achievements a
    JOIN user_achievements ua ON ua.achievement_id = a.id
    WHERE ua.user_id = ?
    ORDER BY ua.unlocked_at DESC
  `).all(targetId);

  res.json({ achievements: unlocked });
});

module.exports = router;
