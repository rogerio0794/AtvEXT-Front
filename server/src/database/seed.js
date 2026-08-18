require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const db = require("./db");
const { initializeSchema } = require("./schema");
const bcrypt = require("bcryptjs");

async function seed() {
  initializeSchema();

  const existing = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (existing.count > 0) {
    console.log("⚠️  Database already has data. Run with --force to reseed.");
    if (!process.argv.includes("--force")) return;
    console.log("🔄 Forcing reseed...");
    db.exec(`
      DELETE FROM user_missions;
      DELETE FROM user_achievements;
      DELETE FROM notifications;
      DELETE FROM quiz_attempts;
      DELETE FROM questions;
      DELETE FROM quizzes;
      DELETE FROM missions;
      DELETE FROM achievements;
      DELETE FROM categories;
      DELETE FROM users;
    `);
  }

  console.log("🌱 Seeding database...");

  // --- Users ---
  const passwordHash = bcrypt.hashSync("senha123", 10);
  const teacherHash = bcrypt.hashSync("professor123", 10);

  const insertUser = db.prepare(`
    INSERT INTO users (name, apelido, email, password_hash, role, avatar, level, xp, coins, streak, last_activity_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const today = new Date().toISOString().split("T")[0];
  const users = [
    ["Ana Silva", "Ana", "ana@quiztech.com", passwordHash, "student", "👩‍💻", 12, 2850, 340, 7, today],
    ["Carlos Mendes", "Carlos", "carlos@quiztech.com", passwordHash, "student", "👨‍🎓", 10, 2100, 210, 3, today],
    ["Beatriz Santos", "Bea", "beatriz@quiztech.com", passwordHash, "student", "👩‍🎓", 15, 4200, 520, 14, today],
    ["Rafael Costa", "Rafa", "rafael@quiztech.com", passwordHash, "student", "👨‍💻", 8, 1450, 130, 1, today],
    ["Mariana Lima", "Mari", "mariana@quiztech.com", passwordHash, "student", "👩‍🏫", 11, 2600, 290, 5, today],
    ["Prof. João Ferreira", "Prof. João", "professor@quiztech.com", teacherHash, "teacher", "👨‍🏫", 1, 0, 0, 0, null],
    ["Admin", null, "admin@quiztech.com", bcrypt.hashSync("admin123", 10), "admin", "⚙️", 1, 0, 0, 0, null],
  ];

  const userIds = users.map((u) => insertUser.run(...u).lastInsertRowid);

  // --- Categories ---
  const insertCategory = db.prepare(`
    INSERT INTO categories (name, description, icon, color, difficulty)
    VALUES (?, ?, ?, ?, ?)
  `);

  const categories = [
    ["Matemática", "Álgebra, geometria, funções e mais", "📐", "#1e40af", "medium"],
    ["Informática", "Hardware, software e sistemas operacionais", "💻", "#1d4ed8", "easy"],
    ["Programação", "Lógica de programação, Python, JavaScript", "⌨️", "#2563eb", "medium"],
    ["Redes de Computadores", "TCP/IP, protocolos, segurança de redes", "🌐", "#1e3a8a", "hard"],
    ["ENEM", "Conhecimentos gerais para o ENEM", "📚", "#3b82f6", "medium"],
    ["Tecnologias", "Tendências e tecnologias emergentes", "🚀", "#60a5fa", "easy"],
  ];

  const categoryIds = categories.map((c) => insertCategory.run(...c).lastInsertRowid);

  // --- Quizzes ---
  const insertQuiz = db.prepare(`
    INSERT INTO quizzes (title, description, category_id, difficulty, xp_reward, coin_reward, time_limit, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const quizzes = [
    ["Equações do 2º Grau", "Resolução de equações quadráticas e análise de discriminante", categoryIds[0], "medium", 100, 20, 30, userIds[5]],
    ["Fundamentos de Hardware", "Componentes físicos do computador e suas funções", categoryIds[1], "easy", 60, 15, 20, userIds[5]],
    ["Lógica de Programação", "Algoritmos, estruturas de controle e boas práticas", categoryIds[2], "medium", 120, 25, 40, userIds[5]],
    ["Protocolos de Rede", "TCP/IP, HTTP, DNS e modelo OSI", categoryIds[3], "hard", 150, 30, 45, userIds[5]],
    ["ENEM - Ciências da Natureza", "Física, Química e Biologia no ENEM", categoryIds[4], "medium", 100, 20, 35, userIds[5]],
    ["Introdução ao Python", "Sintaxe básica, tipos de dados e funções em Python", categoryIds[2], "easy", 80, 15, 25, userIds[5]],
    ["Segurança da Informação", "Criptografia, firewalls e boas práticas de segurança", categoryIds[3], "hard", 160, 35, 50, userIds[5]],
    ["Funções e Gráficos", "Funções do 1º e 2º grau, exponenciais e logarítmicas", categoryIds[0], "hard", 130, 28, 40, userIds[5]],
  ];

  const quizIds = quizzes.map((q) => insertQuiz.run(...q).lastInsertRowid);

  // --- Questions ---
  const insertQuestion = db.prepare(`
    INSERT INTO questions (quiz_id, text, context, alternatives, correct_alternative, explanation, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Quiz 1: Equações do 2º Grau
  const q1 = [
    [quizIds[0], "Calcule o discriminante da equação x² - 5x + 6 = 0.",
      "O discriminante (Δ) de uma equação do 2º grau ax² + bx + c = 0 é dado pela fórmula Δ = b² - 4ac. Ele determina a natureza das raízes da equação.",
      JSON.stringify(["Δ = 1", "Δ = 25", "Δ = -24", "Δ = 49"]), 0,
      "Δ = b² - 4ac = (-5)² - 4(1)(6) = 25 - 24 = 1", 0],
    [quizIds[0], "Quais são as raízes de x² - 5x + 6 = 0?",
      "Usando a fórmula de Bhaskara: x = (-b ± √Δ) / 2a, onde Δ = 1 (calculado anteriormente).",
      JSON.stringify(["x = 2 e x = 3", "x = -2 e x = -3", "x = 1 e x = 6", "x = -1 e x = 6"]), 0,
      "x = (5 ± 1) / 2. Portanto x₁ = 3 e x₂ = 2", 1],
    [quizIds[0], "Uma equação do 2º grau tem Δ < 0. O que isso significa?",
      "O discriminante determina o número de soluções reais de uma equação quadrática.",
      JSON.stringify(["Duas raízes reais distintas", "Uma raiz real dupla", "Nenhuma raiz real", "Infinitas raízes"]), 2,
      "Quando Δ < 0, a equação não possui raízes reais, apenas raízes complexas.", 2],
    [quizIds[0], "Qual é o produto das raízes de 2x² - 8x + 6 = 0?",
      "Relações de Girard: para ax² + bx + c = 0, a soma das raízes é -b/a e o produto é c/a.",
      JSON.stringify(["3", "4", "6", "2"]), 0,
      "Produto = c/a = 6/2 = 3", 3],
    [quizIds[0], "Se x² + px + 12 = 0 tem raízes 3 e 4, qual é o valor de p?",
      "Use as relações de Girard: soma das raízes = -p/1 = -(p).",
      JSON.stringify(["p = -7", "p = 7", "p = -12", "p = 12"]), 0,
      "Soma = 3 + 4 = 7. Mas soma = -p, logo p = -7", 4],
  ];

  // Quiz 2: Fundamentos de Hardware
  const q2 = [
    [quizIds[1], "Qual componente é responsável pelo processamento de dados no computador?",
      "O computador é composto por diversos componentes físicos com funções específicas.",
      JSON.stringify(["RAM", "CPU", "HD", "GPU"]), 1,
      "A CPU (Central Processing Unit) é o cérebro do computador, responsável por executar instruções.", 0],
    [quizIds[1], "O que é memória RAM?",
      "A memória é fundamental para o funcionamento do computador.",
      JSON.stringify(["Armazena dados permanentemente", "Memória de acesso aleatório e volátil", "Processa gráficos", "Conecta dispositivos"]), 1,
      "RAM (Random Access Memory) é uma memória volátil usada para armazenar dados temporariamente durante a execução de programas.", 1],
    [quizIds[1], "Qual a função da placa-mãe?",
      "A placa-mãe é o componente central que conecta todos os outros.",
      JSON.stringify(["Processar imagens", "Conectar e comunicar todos os componentes", "Armazenar dados", "Fornecer energia"]), 1,
      "A placa-mãe é o circuito principal que conecta e permite a comunicação entre CPU, RAM, armazenamento e outros componentes.", 2],
    [quizIds[1], "Qual a diferença entre HD e SSD?",
      "Existem diferentes tipos de dispositivos de armazenamento.",
      JSON.stringify(["Nenhuma diferença", "SSD é mais lento e usa partes mecânicas", "SSD é mais rápido e usa memória flash", "HD é mais moderno"]), 2,
      "SSD (Solid State Drive) usa memória flash, sendo muito mais rápido e resistente que o HD (Hard Disk Drive) que usa discos magnéticos mecânicos.", 3],
    [quizIds[1], "O que é uma fonte de alimentação (PSU)?",
      "Todo computador precisa de energia elétrica para funcionar.",
      JSON.stringify(["Armazena energia para emergências", "Converte energia AC em DC para os componentes", "Resfria o processador", "Controla o teclado"]), 1,
      "A PSU (Power Supply Unit) converte a corrente alternada (AC) da tomada em corrente contínua (DC) usada pelos componentes do computador.", 4],
  ];

  // Quiz 3: Lógica de Programação
  const q3 = [
    [quizIds[2], "O que é um algoritmo?",
      "Algoritmos são fundamentais para a programação e resolução de problemas.",
      JSON.stringify(["Um tipo de linguagem de programação", "Uma sequência finita de passos para resolver um problema", "Um componente de hardware", "Um banco de dados"]), 1,
      "Um algoritmo é uma sequência finita, ordenada e não ambígua de passos que resolve um problema ou realiza uma tarefa.", 0],
    [quizIds[2], "O que faz a estrutura de repetição 'for' em programação?",
      "Estruturas de repetição são usadas para executar um bloco de código múltiplas vezes.",
      JSON.stringify(["Executa código condicionalmente", "Repete um bloco por um número determinado de vezes", "Define uma função", "Declara uma variável"]), 1,
      "O 'for' é uma estrutura de repetição que executa um bloco de código um número pré-determinado de vezes, controlado por um contador.", 1],
    [quizIds[2], "Qual é a saída do seguinte pseudocódigo? x = 5; se x > 3 então escreva('A') senão escreva('B')",
      "Estruturas condicionais redirecionam o fluxo do programa com base em condições.",
      JSON.stringify(["B", "A", "5", "Erro"]), 1,
      "Como x = 5 e 5 > 3 é verdadeiro, a condição é satisfeita e 'A' é escrito.", 2],
    [quizIds[2], "O que é uma variável em programação?",
      "Variáveis são um conceito fundamental em qualquer linguagem de programação.",
      JSON.stringify(["Um tipo de loop", "Um espaço na memória para armazenar dados", "Uma função matemática", "Um operador lógico"]), 1,
      "Uma variável é um espaço na memória do computador associado a um nome, que armazena um valor que pode ser modificado durante a execução.", 3],
    [quizIds[2], "Qual operador é usado para comparar igualdade em maioria das linguagens?",
      "Operadores de comparação são usados em estruturas condicionais.",
      JSON.stringify(["=", "==", ":=", "==="]), 1,
      "O operador '==' é usado para comparar igualdade em linguagens como C, Java e Python. Algumas linguagens como JavaScript também aceitam '===' para comparação estrita.", 4],
  ];

  // Quiz 4: Protocolos de Rede
  const q4 = [
    [quizIds[3], "Quantas camadas possui o modelo OSI?",
      "O modelo OSI (Open Systems Interconnection) é uma referência para entender como os dados são transmitidos em redes.",
      JSON.stringify(["4", "5", "7", "8"]), 2,
      "O modelo OSI possui 7 camadas: Física, Enlace, Rede, Transporte, Sessão, Apresentação e Aplicação.", 0],
    [quizIds[3], "Qual protocolo é usado para resolução de nomes de domínio?",
      "Na Internet, precisamos converter nomes amigáveis (como google.com) em endereços IP.",
      JSON.stringify(["HTTP", "FTP", "DNS", "SMTP"]), 2,
      "O DNS (Domain Name System) converte nomes de domínio legíveis em endereços IP que os computadores usam para se comunicar.", 1],
    [quizIds[3], "Qual é a principal diferença entre TCP e UDP?",
      "TCP e UDP são protocolos de transporte com características distintas.",
      JSON.stringify(["TCP é mais rápido e sem confirmação", "TCP garante entrega confiável; UDP é mais rápido sem garantia", "UDP garante entrega; TCP é sem conexão", "Nenhuma diferença"]), 1,
      "TCP (Transmission Control Protocol) garante a entrega ordenada e confiável dos dados. UDP (User Datagram Protocol) é mais rápido, mas não garante entrega nem ordem.", 2],
    [quizIds[3], "Em que faixa está a porta padrão do protocolo HTTP?",
      "Protocolos de rede usam portas para identificar serviços específicos.",
      JSON.stringify(["Porta 21", "Porta 25", "Porta 80", "Porta 443"]), 2,
      "O HTTP usa a porta 80 por padrão. O HTTPS usa a porta 443. FTP usa 21 e SMTP usa 25.", 3],
    [quizIds[3], "O que é um endereço IP?",
      "Na internet, cada dispositivo precisa ser identificado de forma única.",
      JSON.stringify(["O nome do computador na rede", "Um identificador numérico único de um dispositivo na rede", "O endereço físico da placa de rede", "O nome do provedor de internet"]), 1,
      "Um endereço IP (Internet Protocol) é um identificador numérico único atribuído a cada dispositivo em uma rede, permitindo seu endereçamento e roteamento.", 4],
  ];

  for (const row of [...q1, ...q2, ...q3, ...q4]) {
    insertQuestion.run(...row);
  }

  // --- Achievements ---
  const insertAchievement = db.prepare(`
    INSERT INTO achievements (name, description, icon, category, xp_reward, coin_reward, condition_type, condition_value)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const achievements = [
    ["Primeiro Passo", "Complete seu primeiro quiz", "🎯", "inicio", 50, 10, "quizzes_completed", 1],
    ["Estudante Dedicado", "Complete 10 quizzes", "📚", "progresso", 100, 25, "quizzes_completed", 10],
    ["Mestre dos Quizzes", "Complete 50 quizzes", "🎓", "progresso", 300, 75, "quizzes_completed", 50],
    ["Perfeito!", "Acerte 100% em um quiz", "⭐", "desempenho", 150, 40, "perfect_score", 1],
    ["Sequência de 3", "Estude 3 dias seguidos", "🔥", "sequencia", 75, 20, "streak_days", 3],
    ["Sequência de 7", "Estude 7 dias seguidos", "🔥", "sequencia", 200, 50, "streak_days", 7],
    ["Sequência de 30", "Estude 30 dias seguidos", "🔥", "sequencia", 600, 150, "streak_days", 30],
    ["Colecionador de XP", "Acumule 1000 XP", "⚡", "xp", 100, 30, "total_xp", 1000],
    ["Lenda do XP", "Acumule 10000 XP", "⚡", "xp", 500, 120, "total_xp", 10000],
    ["Especialista em Redes", "Complete todos os quizzes de Redes", "🌐", "categoria", 200, 60, "category_completed", 4],
    ["Craque de Matemática", "Complete todos os quizzes de Matemática", "📐", "categoria", 200, 60, "category_completed", 1],
    ["Programador Nato", "Complete todos os quizzes de Programação", "⌨️", "categoria", 200, 60, "category_completed", 3],
    ["Milionário de Moedas", "Acumule 500 moedas", "🪙", "moedas", 100, 0, "total_coins", 500],
    ["Velocista", "Complete um quiz em menos de 5 minutos", "⚡", "tempo", 100, 25, "quiz_time", 300],
    ["Madrugador", "Complete um quiz antes das 8h", "🌅", "especial", 80, 20, "time_of_day", 8],
  ];

  const achievementIds = achievements.map((a) => insertAchievement.run(...a).lastInsertRowid);

  // --- Missions ---
  const insertMission = db.prepare(`
    INSERT INTO missions (title, description, icon, mission_type, xp_reward, coin_reward, condition_type, condition_value)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const missions = [
    ["Quiz Diário", "Complete 1 quiz hoje", "🎯", "daily", 50, 10, "daily_quizzes", 1],
    ["Acertar em Grande", "Acerte 10 questões hoje", "✅", "daily", 75, 15, "daily_correct", 10],
    ["Nota Máxima", "Tire 100% em um quiz hoje", "⭐", "daily", 100, 25, "daily_perfect", 1],
    ["Explorador", "Complete quizzes de 2 categorias diferentes hoje", "🗺️", "daily", 80, 20, "daily_categories", 2],
    ["Maratonista", "Complete 3 quizzes hoje", "🏃", "daily", 120, 30, "daily_quizzes", 3],
    ["Estudante da Semana", "Complete 10 quizzes essa semana", "📅", "weekly", 300, 80, "weekly_quizzes", 10],
    ["Sem Erros", "Acerte 50 questões essa semana", "🎯", "weekly", 250, 60, "weekly_correct", 50],
    ["Imbatível", "Mantenha sua sequência por 7 dias", "🔥", "weekly", 400, 100, "weekly_streak", 7],
  ];

  missions.forEach((m) => insertMission.run(...m));

  // --- User Achievements (for Ana Silva - userIds[0]) ---
  const insertUserAchievement = db.prepare(`
    INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
    VALUES (?, ?, ?)
  `);

  const anaAchievements = [0, 1, 3, 4, 5, 7];
  anaAchievements.forEach((i) => {
    insertUserAchievement.run(userIds[0], achievementIds[i], new Date(Date.now() - Math.random() * 30 * 86400000).toISOString());
  });

  // --- Quiz Attempts ---
  const insertAttempt = db.prepare(`
    INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct_answers, xp_earned, coins_earned, time_spent, answers, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAttempt.run(userIds[0], quizIds[0], 80, 5, 4, 80, 16, 720, JSON.stringify([0, 0, 2, 0, 0]), new Date(Date.now() - 2 * 86400000).toISOString());
  insertAttempt.run(userIds[0], quizIds[1], 100, 5, 5, 60, 15, 540, JSON.stringify([1, 1, 1, 2, 1]), new Date(Date.now() - 86400000).toISOString());
  insertAttempt.run(userIds[0], quizIds[2], 60, 5, 3, 72, 15, 900, JSON.stringify([1, 1, 1, 1, 1]), new Date().toISOString());
  insertAttempt.run(userIds[1], quizIds[0], 60, 5, 3, 60, 12, 800, JSON.stringify([0, 0, 2, 3, 0]), new Date(Date.now() - 86400000).toISOString());
  insertAttempt.run(userIds[2], quizIds[0], 100, 5, 5, 100, 20, 600, JSON.stringify([0, 0, 2, 0, 0]), new Date(Date.now() - 3600000).toISOString());
  insertAttempt.run(userIds[2], quizIds[1], 100, 5, 5, 60, 15, 480, JSON.stringify([1, 1, 1, 2, 1]), new Date(Date.now() - 7200000).toISOString());

  // --- User Missions for today ---
  const insertUserMission = db.prepare(`
    INSERT OR IGNORE INTO user_missions (user_id, mission_id, progress, completed, assigned_date)
    VALUES (?, ?, ?, ?, date('now'))
  `);

  // Ana's missions today
  const missionRows = db.prepare("SELECT id FROM missions WHERE mission_type = 'daily'").all();
  missionRows.forEach((m, i) => {
    const progress = i === 0 ? 1 : i === 1 ? 10 : i === 2 ? 1 : 0;
    const completed = i < 2 ? 1 : 0;
    insertUserMission.run(userIds[0], m.id, progress, completed);
  });

  // --- Notifications ---
  const insertNotif = db.prepare(`
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (?, ?, ?, ?)
  `);

  insertNotif.run(userIds[0], "Bem-vinda ao QuizTech! 🎉", "Sua conta foi criada com sucesso. Comece estudando agora!", "success");
  insertNotif.run(userIds[0], "Conquista desbloqueada!", "Você ganhou a conquista 'Primeiro Passo' 🎯", "achievement");
  insertNotif.run(userIds[0], "Missão concluída!", "Você completou a missão 'Quiz Diário' e ganhou 50 XP!", "mission");
  insertNotif.run(userIds[0], "Sequência de 7 dias! 🔥", "Incrível! Você está estudando há 7 dias seguidos!", "success");

  console.log("✅ Database seeded successfully!");
  console.log("👥 Users created:");
  console.log("   - ana@quiztech.com / senha123 (aluna)");
  console.log("   - carlos@quiztech.com / senha123 (aluno)");
  console.log("   - beatriz@quiztech.com / senha123 (aluna)");
  console.log("   - professor@quiztech.com / professor123 (professor)");
  console.log("   - admin@quiztech.com / admin123 (admin)");
}

seed().catch(console.error);
