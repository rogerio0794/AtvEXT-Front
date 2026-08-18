const db = require("./db");

function initializeSchema() {
  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      apelido TEXT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student', 'teacher', 'admin')),
      avatar TEXT,
      level INTEGER NOT NULL DEFAULT 1,
      xp INTEGER NOT NULL DEFAULT 0,
      coins INTEGER NOT NULL DEFAULT 0,
      streak INTEGER NOT NULL DEFAULT 0,
      last_activity_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT NOT NULL DEFAULT '📚',
      color TEXT NOT NULL DEFAULT '#1e40af',
      difficulty TEXT NOT NULL DEFAULT 'medium' CHECK(difficulty IN ('easy', 'medium', 'hard')),
      total_quizzes INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Quizzes table
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      difficulty TEXT NOT NULL DEFAULT 'medium' CHECK(difficulty IN ('easy', 'medium', 'hard')),
      xp_reward INTEGER NOT NULL DEFAULT 50,
      coin_reward INTEGER NOT NULL DEFAULT 10,
      time_limit INTEGER DEFAULT 30,
      total_questions INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_by INTEGER REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Questions table
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      context TEXT,
      image_url TEXT,
      alternatives TEXT NOT NULL,
      correct_alternative INTEGER NOT NULL DEFAULT 0,
      explanation TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Quiz attempts table
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      score INTEGER NOT NULL DEFAULT 0,
      total_questions INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      xp_earned INTEGER NOT NULL DEFAULT 0,
      coins_earned INTEGER NOT NULL DEFAULT 0,
      time_spent INTEGER DEFAULT 0,
      answers TEXT,
      completed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Achievements table
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '🏆',
      category TEXT NOT NULL DEFAULT 'general',
      xp_reward INTEGER NOT NULL DEFAULT 50,
      coin_reward INTEGER NOT NULL DEFAULT 20,
      condition_type TEXT NOT NULL,
      condition_value INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- User achievements table
    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
      unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, achievement_id)
    );

    -- Missions table
    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '🎯',
      mission_type TEXT NOT NULL DEFAULT 'daily' CHECK(mission_type IN ('daily', 'weekly')),
      xp_reward INTEGER NOT NULL DEFAULT 50,
      coin_reward INTEGER NOT NULL DEFAULT 10,
      condition_type TEXT NOT NULL,
      condition_value INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- User missions table
    CREATE TABLE IF NOT EXISTS user_missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mission_id INTEGER NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
      progress INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      assigned_date TEXT NOT NULL DEFAULT (date('now')),
      completed_at TEXT,
      UNIQUE(user_id, mission_id, assigned_date)
    );

    -- Notifications table
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'info' CHECK(type IN ('info', 'success', 'warning', 'achievement', 'mission')),
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Feedback table (one per user, updatable)
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id)
    );

    -- Triggers to keep quiz total_questions updated
    CREATE TRIGGER IF NOT EXISTS update_quiz_question_count_insert
    AFTER INSERT ON questions
    BEGIN
      UPDATE quizzes SET total_questions = (
        SELECT COUNT(*) FROM questions WHERE quiz_id = NEW.quiz_id
      ) WHERE id = NEW.quiz_id;
    END;

    CREATE TRIGGER IF NOT EXISTS update_quiz_question_count_delete
    AFTER DELETE ON questions
    BEGIN
      UPDATE quizzes SET total_questions = (
        SELECT COUNT(*) FROM questions WHERE quiz_id = OLD.quiz_id
      ) WHERE id = OLD.quiz_id;
    END;

    -- Trigger to keep category total_quizzes updated
    CREATE TRIGGER IF NOT EXISTS update_category_quiz_count_insert
    AFTER INSERT ON quizzes
    BEGIN
      UPDATE categories SET total_quizzes = (
        SELECT COUNT(*) FROM quizzes WHERE category_id = NEW.category_id AND is_active = 1
      ) WHERE id = NEW.category_id;
    END;

    CREATE TRIGGER IF NOT EXISTS update_category_quiz_count_delete
    AFTER DELETE ON quizzes
    BEGIN
      UPDATE categories SET total_quizzes = (
        SELECT COUNT(*) FROM quizzes WHERE category_id = OLD.category_id AND is_active = 1
      ) WHERE id = OLD.category_id;
    END;

    -- Trigger to update user updated_at
    CREATE TRIGGER IF NOT EXISTS update_user_timestamp
    AFTER UPDATE ON users
    BEGIN
      UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
    END;
  `);

  console.log("✅ Database schema initialized");
}

module.exports = { initializeSchema };
