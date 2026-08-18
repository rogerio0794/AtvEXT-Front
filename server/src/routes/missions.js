const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/missions - user's daily missions for today
router.get("/", authenticateToken, (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  // Assign daily missions for today if not done yet
  const dailyMissions = db.prepare("SELECT * FROM missions WHERE mission_type = 'daily' AND is_active = 1").all();
  for (const mission of dailyMissions) {
    db.prepare("INSERT OR IGNORE INTO user_missions (user_id, mission_id, progress, completed, assigned_date) VALUES (?, ?, 0, 0, ?)")
      .run(req.user.id, mission.id, today);
  }

  const missions = db.prepare(`
    SELECT m.*, um.progress, um.completed, um.completed_at
    FROM missions m
    LEFT JOIN user_missions um ON um.mission_id = m.id AND um.user_id = ? AND um.assigned_date = ?
    WHERE m.is_active = 1
    ORDER BY m.mission_type, m.xp_reward DESC
  `).all(req.user.id, today);

  const stats = {
    total: missions.filter((m) => m.mission_type === "daily").length,
    completed: missions.filter((m) => m.mission_type === "daily" && m.completed).length,
    totalXpAvailable: missions.filter((m) => m.mission_type === "daily").reduce((s, m) => s + m.xp_reward, 0),
    xpEarned: missions.filter((m) => m.mission_type === "daily" && m.completed).reduce((s, m) => s + m.xp_reward, 0),
  };

  res.json({ missions, stats, today });
});

// GET /api/missions/weekly - weekly missions
router.get("/weekly", authenticateToken, (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const weekStart = startOfWeek.toISOString().split("T")[0];

  const weeklyMissions = db.prepare("SELECT * FROM missions WHERE mission_type = 'weekly' AND is_active = 1").all();
  for (const mission of weeklyMissions) {
    db.prepare("INSERT OR IGNORE INTO user_missions (user_id, mission_id, progress, completed, assigned_date) VALUES (?, ?, 0, 0, ?)")
      .run(req.user.id, mission.id, weekStart);
  }

  const missions = db.prepare(`
    SELECT m.*, um.progress, um.completed, um.completed_at
    FROM missions m
    LEFT JOIN user_missions um ON um.mission_id = m.id AND um.user_id = ? AND um.assigned_date = ?
    WHERE m.mission_type = 'weekly' AND m.is_active = 1
    ORDER BY m.xp_reward DESC
  `).all(req.user.id, weekStart);

  res.json({ missions, weekStart });
});

// GET /api/missions/history
router.get("/history", authenticateToken, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const history = db.prepare(`
    SELECT m.title, m.icon, m.mission_type, m.xp_reward, m.coin_reward,
           um.completed, um.completed_at, um.assigned_date
    FROM user_missions um
    JOIN missions m ON m.id = um.mission_id
    WHERE um.user_id = ? AND um.completed = 1
    ORDER BY um.completed_at DESC
    LIMIT ? OFFSET ?
  `).all(req.user.id, Number(limit), Number(offset));

  res.json({ history });
});

module.exports = router;
