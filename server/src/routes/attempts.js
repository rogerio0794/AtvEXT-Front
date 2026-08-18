const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const db = require("../database/db");
const { authenticateToken } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

function calculateXpForLevel(level) {
  return level * 250;
}

function checkAndUpdateLevel(userId) {
  const user = db.prepare("SELECT level, xp FROM users WHERE id = ?").get(userId);
  const required = calculateXpForLevel(user.level);
  if (user.xp >= required) {
    db.prepare("UPDATE users SET level = level + 1 WHERE id = ?").run(userId);
    return true;
  }
  return false;
}

function checkAchievements(userId) {
  const user = db.prepare("SELECT xp, coins, streak FROM users WHERE id = ?").get(userId);
  const totalAttempts = db.prepare("SELECT COUNT(*) as count FROM quiz_attempts WHERE user_id = ?").get(userId).count;

  const unlockedIds = db.prepare("SELECT achievement_id FROM user_achievements WHERE user_id = ?").all(userId).map((r) => r.achievement_id);
  const allAchievements = db.prepare("SELECT * FROM achievements").all();

  const newlyUnlocked = [];

  for (const ach of allAchievements) {
    if (unlockedIds.includes(ach.id)) continue;

    let unlocked = false;
    switch (ach.condition_type) {
      case "quizzes_completed": unlocked = totalAttempts >= ach.condition_value; break;
      case "total_xp": unlocked = user.xp >= ach.condition_value; break;
      case "total_coins": unlocked = user.coins >= ach.condition_value; break;
      case "streak_days": unlocked = user.streak >= ach.condition_value; break;
    }

    if (unlocked) {
      db.prepare("INSERT OR IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)").run(userId, ach.id);
      db.prepare("UPDATE users SET xp = xp + ?, coins = coins + ? WHERE id = ?").run(ach.xp_reward, ach.coin_reward, userId);
      db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)").run(
        userId,
        `Conquista desbloqueada: ${ach.name}!`,
        `${ach.icon} ${ach.description}`,
        "achievement"
      );
      newlyUnlocked.push(ach);
    }
  }

  return newlyUnlocked;
}

function updateMissionProgress(userId, correctAnswers, categoriesPlayed) {
  const today = new Date().toISOString().split("T")[0];
  const dailyMissions = db.prepare("SELECT * FROM missions WHERE mission_type = 'daily' AND is_active = 1").all();

  for (const mission of dailyMissions) {
    // Ensure user_mission row exists for today
    db.prepare("INSERT OR IGNORE INTO user_missions (user_id, mission_id, progress, completed, assigned_date) VALUES (?, ?, 0, 0, ?)")
      .run(userId, mission.id, today);

    const userMission = db.prepare("SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ? AND assigned_date = ?")
      .get(userId, mission.id, today);

    if (userMission.completed) continue;

    let newProgress = userMission.progress;

    if (mission.condition_type === "daily_quizzes") newProgress = Math.min(newProgress + 1, mission.condition_value);
    if (mission.condition_type === "daily_correct") newProgress = Math.min(newProgress + correctAnswers, mission.condition_value);
    if (mission.condition_type === "daily_categories") newProgress = Math.min(newProgress + categoriesPlayed, mission.condition_value);

    const isCompleted = newProgress >= mission.condition_value;

    db.prepare("UPDATE user_missions SET progress = ?, completed = ?, completed_at = ? WHERE user_id = ? AND mission_id = ? AND assigned_date = ?")
      .run(newProgress, isCompleted ? 1 : 0, isCompleted ? new Date().toISOString() : null, userId, mission.id, today);

    if (isCompleted && !userMission.completed) {
      db.prepare("UPDATE users SET xp = xp + ?, coins = coins + ? WHERE id = ?").run(mission.xp_reward, mission.coin_reward, userId);
      db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)").run(
        userId,
        `Missão concluída: ${mission.title}!`,
        `Você ganhou ${mission.xp_reward} XP e ${mission.coin_reward} moedas!`,
        "mission"
      );
    }
  }
}

// POST /api/attempts - submit a quiz attempt
router.post(
  "/",
  authenticateToken,
  [
    body("quiz_id").isInt({ min: 1 }).withMessage("quiz_id inválido"),
    body("answers").isArray().withMessage("Respostas inválidas"),
    body("time_spent").optional().isInt({ min: 0 }).withMessage("Tempo inválido"),
  ],
  validate,
  (req, res) => {
    const { quiz_id, answers, time_spent = 0 } = req.body;

    const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ? AND is_active = 1").get(quiz_id);
    if (!quiz) return res.status(404).json({ error: "Quiz não encontrado" });

    const questions = db.prepare("SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_index").all(quiz_id);
    if (questions.length === 0) return res.status(400).json({ error: "Quiz sem questões" });

    // Grade answers
    let correctAnswers = 0;
    const gradedAnswers = questions.map((q, i) => {
      const userAnswer = answers[i];
      const isCorrect = userAnswer === q.correct_alternative;
      if (isCorrect) correctAnswers++;
      return { questionId: q.id, userAnswer, correctAnswer: q.correct_alternative, isCorrect };
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const xpEarned = Math.round(quiz.xp_reward * (score / 100));
    const coinsEarned = Math.round(quiz.coin_reward * (score / 100));

    // Perfect score bonus
    const isPerfect = score === 100;
    const perfectBonus = isPerfect ? Math.round(quiz.xp_reward * 0.5) : 0;

    // Save attempt
    const result = db.prepare(`
      INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct_answers, xp_earned, coins_earned, time_spent, answers)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, quiz_id, score, questions.length, correctAnswers, xpEarned + perfectBonus, coinsEarned, time_spent, JSON.stringify(gradedAnswers));

    // Update user XP and coins
    db.prepare("UPDATE users SET xp = xp + ?, coins = coins + ?, last_activity_date = ? WHERE id = ?")
      .run(xpEarned + perfectBonus, coinsEarned, new Date().toISOString().split("T")[0], req.user.id);

    // Check level up
    const leveledUp = checkAndUpdateLevel(req.user.id);

    // Check achievements
    const newAchievements = checkAchievements(req.user.id);

    // Check perfect score achievement
    if (isPerfect) {
      const perfectAch = db.prepare("SELECT * FROM achievements WHERE condition_type = 'perfect_score' LIMIT 1").get();
      if (perfectAch) {
        const alreadyHas = db.prepare("SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?").get(req.user.id, perfectAch.id);
        if (!alreadyHas) {
          db.prepare("INSERT OR IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)").run(req.user.id, perfectAch.id);
          db.prepare("UPDATE users SET xp = xp + ?, coins = coins + ? WHERE id = ?").run(perfectAch.xp_reward, perfectAch.coin_reward, req.user.id);
          newAchievements.push(perfectAch);
        }
      }
    }

    // Get category for mission tracking
    const categoryAttempts = db.prepare(`
      SELECT COUNT(DISTINCT q.category_id) as count FROM quiz_attempts qa
      JOIN quizzes q ON q.id = qa.quiz_id
      WHERE qa.user_id = ? AND date(qa.completed_at) = date('now')
    `).get(req.user.id).count;

    updateMissionProgress(req.user.id, correctAnswers, categoryAttempts === 1 ? 1 : 0);

    const attempt = db.prepare("SELECT * FROM quiz_attempts WHERE id = ?").get(result.lastInsertRowid);
    const updatedUser = db.prepare("SELECT id, name, level, xp, coins, streak FROM users WHERE id = ?").get(req.user.id);

    res.status(201).json({
      attempt: { ...attempt, gradedAnswers },
      user: updatedUser,
      rewards: { xpEarned: xpEarned + perfectBonus, coinsEarned, isPerfect, perfectBonus },
      leveledUp,
      newAchievements,
    });
  }
);

// GET /api/attempts - user's own attempts
router.get("/", authenticateToken, (req, res) => {
  const { quiz_id, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT qa.*, q.title as quiz_title, q.difficulty, c.name as category_name, c.icon as category_icon
    FROM quiz_attempts qa
    JOIN quizzes q ON q.id = qa.quiz_id
    JOIN categories c ON c.id = q.category_id
    WHERE qa.user_id = ?
  `;
  const params = [req.user.id];

  if (quiz_id) { query += " AND qa.quiz_id = ?"; params.push(quiz_id); }

  const total = db.prepare(query.replace(
    "SELECT qa.*, q.title as quiz_title, q.difficulty, c.name as category_name, c.icon as category_icon",
    "SELECT COUNT(*) as count"
  )).get(...params).count;

  query += " ORDER BY qa.completed_at DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  const attempts = db.prepare(query).all(...params);
  res.json({ attempts, total, page: Number(page), totalPages: Math.ceil(total / limit) });
});

// GET /api/attempts/:id
router.get("/:id", authenticateToken, (req, res) => {
  const attempt = db.prepare(`
    SELECT qa.*, q.title as quiz_title, q.difficulty, c.name as category_name
    FROM quiz_attempts qa
    JOIN quizzes q ON q.id = qa.quiz_id
    JOIN categories c ON c.id = q.category_id
    WHERE qa.id = ? AND qa.user_id = ?
  `).get(req.params.id, req.user.id);

  if (!attempt) return res.status(404).json({ error: "Tentativa não encontrada" });

  const questions = db.prepare("SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_index").all(attempt.quiz_id);
  const parsedQuestions = questions.map((q) => ({ ...q, alternatives: JSON.parse(q.alternatives) }));

  res.json({ attempt: { ...attempt, answers: JSON.parse(attempt.answers || "[]") }, questions: parsedQuestions });
});

module.exports = router;
