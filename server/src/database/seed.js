require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const db = require("./db");
const { initializeSchema } = require("./schema");
const bcrypt = require("bcryptjs");

function seed() {
  initializeSchema();

  // PROTEÇÃO: executa apenas uma vez para evitar duplicação de dados
  const existing = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (existing.count > 0) {
    console.log("Banco já populado.");
    return;
  }

  console.log("Populando banco de dados para testes");

  const studentHash = bcrypt.hashSync("senha123", 10);
  const adminHash   = bcrypt.hashSync("admin2026", 10);

  const insertUser = db.prepare(`
    INSERT INTO users
      (name, apelido, email, password_hash, role, avatar, level, xp, coins, streak, last_activity_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  

  // ──────────────────────────────────────────────
  // ADMIN
  // ──────────────────────────────────────────────
  insertUser.run("Admin", null, "admin@quiztech.com", adminHash, "admin", "⚙️", 1, 0, 0, 0, null,
    "2026-08-05 08:00:00", "2026-08-05 08:00:00");

  // ──────────────────────────────────────────────
  // CONTAS DEMO (login rápido para testes)
  // ──────────────────────────────────────────────
  insertUser.run("Ana Silva", "Ana", "ana@quiztech.com", studentHash, "student", "👩‍💻",
    12, 2850, 340, 7, "2026-08-20", "2026-08-20 10:00:00", "2026-08-20 10:00:00");
  insertUser.run("Prof. João Ferreira", "Prof. João", "professor@quiztech.com",
    bcrypt.hashSync("professor123", 10), "teacher", "👨‍🏫",
    1, 0, 0, 0, null, "2026-08-20 10:00:00", "2026-08-20 10:00:00");

  
  const group = [
    ["Roberto Pereira Silva",       "Roberto Pereira",   "roberto.pereira@gmail.com",         "👩‍🎓", "2026-08-19 15:20:00"],
    ["Gabriel Henrique Santos",    "Gabi",          "gabriel.henrique@gmail.com",        "👨‍🎓", "2026-08-18 13:33:00"],   
  ];


  

  const allStudentIds = [];
  for (const [name, apelido, email, avatar, createdAt] of [...group]) {
    const id = insertUser.run(name, apelido, email, studentHash, "student", avatar, 1, 0, 0, 0, null, createdAt, createdAt).lastInsertRowid;
    allStudentIds.push(id);
  }

  
  const feedbackPool = [  
    [5, "OK"],
    [5, "OK"],    
  ];

  const feedbackIndices = new Set([
     2,3,
  ]);

  const insertFeedback = db.prepare(`
    INSERT INTO feedbacks (user_id, rating, comment) VALUES (?, ?, ?)
  `);

  let fbIdx = 0;
  for (let i = 0; i < allStudentIds.length; i++) {
    if (feedbackIndices.has(i)) {
      const [rating, comment] = feedbackPool[fbIdx++];
      insertFeedback.run(allStudentIds[i], rating, comment ?? null);
    }
  }


  const insertCategory = db.prepare(`
    INSERT INTO categories (name, description, icon, color, difficulty)
    VALUES (?, ?, ?, ?, ?)
  `);

  const categoryIds = [
    ["Matemática",            "Álgebra, geometria, funções e mais",           "📐", "#1e40af", "medium"],
    ["Informática",           "Hardware, software e sistemas operacionais",    "💻", "#1d4ed8", "easy"],
    ["Programação",           "Lógica de programação, Python, JavaScript",     "⌨️", "#2563eb", "medium"],
    ["Redes de Computadores", "TCP/IP, protocolos, segurança de redes",        "🌐", "#1e3a8a", "hard"],
    ["ENEM",                  "Conhecimentos gerais para o ENEM",              "📚", "#3b82f6", "medium"],
    ["Tecnologias",           "Tendências e tecnologias emergentes",           "🚀", "#60a5fa", "easy"],
  ].map((c) => insertCategory.run(...c).lastInsertRowid);


  const insertQuiz = db.prepare(`
    INSERT INTO quizzes (title, description, category_id, difficulty, xp_reward, coin_reward, time_limit, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const quizIds = [
    ["Equações do 2º Grau",         "Resolução de equações quadráticas e discriminante",  categoryIds[0], "medium", 100, 20, 30, rogId],
    ["Fundamentos de Hardware",     "Componentes físicos do computador e suas funções",   categoryIds[1], "easy",    60, 15, 20, rogId],
    ["Lógica de Programação",       "Algoritmos, estruturas de controle e boas práticas", categoryIds[2], "medium", 120, 25, 40, rogId],
    ["Protocolos de Rede",          "TCP/IP, HTTP, DNS e modelo OSI",                     categoryIds[3], "hard",   150, 30, 45, rogId],
    ["ENEM - Ciências da Natureza", "Física, Química e Biologia no ENEM",                 categoryIds[4], "medium", 100, 20, 35, rogId],
    ["Introdução ao Python",        "Sintaxe básica, tipos de dados e funções em Python", categoryIds[2], "easy",    80, 15, 25, rogId],
    ["Segurança da Informação",     "Criptografia, firewalls e boas práticas",             categoryIds[3], "hard",   160, 35, 50, rogId],
    ["Funções e Gráficos",          "Funções do 1º/2º grau, exponenciais e logarítmicas", categoryIds[0], "hard",   130, 28, 40, rogId],
  ].map((q) => insertQuiz.run(...q).lastInsertRowid);

  // ──────────────────────────────────────────────
  // QUESTÕES
  // ──────────────────────────────────────────────
  const insertQuestion = db.prepare(`
    INSERT INTO questions (quiz_id, text, context, alternatives, correct_alternative, explanation, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const questions = [
    // Quiz 1: Equações do 2º Grau
    [quizIds[0], "Calcule o discriminante da equação x² - 5x + 6 = 0.",
      "O discriminante (Δ) de uma equação do 2º grau ax² + bx + c = 0 é dado por Δ = b² - 4ac.",
      JSON.stringify(["Δ = 1", "Δ = 25", "Δ = -24", "Δ = 49"]), 0,
      "Δ = b² - 4ac = (-5)² - 4(1)(6) = 25 - 24 = 1", 0],
    [quizIds[0], "Quais são as raízes de x² - 5x + 6 = 0?",
      "Usando Bhaskara: x = (-b ± √Δ) / 2a, com Δ = 1.",
      JSON.stringify(["x = 2 e x = 3", "x = -2 e x = -3", "x = 1 e x = 6", "x = -1 e x = 6"]), 0,
      "x = (5 ± 1) / 2 → x₁ = 3 e x₂ = 2", 1],
    [quizIds[0], "Uma equação do 2º grau tem Δ < 0. O que significa?",
      "O discriminante determina o número de soluções reais.",
      JSON.stringify(["Duas raízes reais distintas", "Uma raiz real dupla", "Nenhuma raiz real", "Infinitas raízes"]), 2,
      "Quando Δ < 0 não há raízes reais, apenas complexas.", 2],
    [quizIds[0], "Qual é o produto das raízes de 2x² - 8x + 6 = 0?",
      "Relações de Girard: produto = c/a.",
      JSON.stringify(["3", "4", "6", "2"]), 0,
      "Produto = c/a = 6/2 = 3", 3],
    [quizIds[0], "Se x² + px + 12 = 0 tem raízes 3 e 4, qual é o valor de p?",
      "Soma das raízes = -p/1.",
      JSON.stringify(["p = -7", "p = 7", "p = -12", "p = 12"]), 0,
      "Soma = 3 + 4 = 7 = -p → p = -7", 4],
    // Quiz 2: Fundamentos de Hardware
    [quizIds[1], "Qual componente é responsável pelo processamento de dados?",
      "O computador é composto por componentes físicos com funções específicas.",
      JSON.stringify(["RAM", "CPU", "HD", "GPU"]), 1,
      "A CPU (Central Processing Unit) é o cérebro do computador.", 0],
    [quizIds[1], "O que é memória RAM?",
      "A memória é fundamental para o funcionamento do computador.",
      JSON.stringify(["Armazena dados permanentemente", "Memória de acesso aleatório e volátil", "Processa gráficos", "Conecta dispositivos"]), 1,
      "RAM é volátil — armazena dados temporariamente durante a execução.", 1],
    [quizIds[1], "Qual a função da placa-mãe?",
      "A placa-mãe conecta todos os componentes do computador.",
      JSON.stringify(["Processar imagens", "Conectar e comunicar todos os componentes", "Armazenar dados", "Fornecer energia"]), 1,
      "A placa-mãe é o circuito central que interliga CPU, RAM e armazenamento.", 2],
    [quizIds[1], "Diferença entre HD e SSD?",
      "Existem diferentes tecnologias de armazenamento.",
      JSON.stringify(["Nenhuma diferença", "SSD é mais lento e mecânico", "SSD é mais rápido e usa memória flash", "HD é mais moderno"]), 2,
      "SSD usa memória flash — muito mais rápido e resistente que o HD mecânico.", 3],
    [quizIds[1], "O que é uma fonte de alimentação (PSU)?",
      "Todo computador precisa de energia elétrica para funcionar.",
      JSON.stringify(["Armazena energia", "Converte energia AC em DC para os componentes", "Resfria o processador", "Controla o teclado"]), 1,
      "A PSU converte corrente alternada (AC) da tomada em corrente contínua (DC).", 4],
    // Quiz 3: Lógica de Programação
    [quizIds[2], "O que é um algoritmo?",
      "Algoritmos são fundamentais para resolver problemas com computadores.",
      JSON.stringify(["Um tipo de linguagem", "Uma sequência finita de passos para resolver um problema", "Um componente de hardware", "Um banco de dados"]), 1,
      "Algoritmo: sequência finita, ordenada e não ambígua de passos.", 0],
    [quizIds[2], "O que faz a estrutura 'for'?",
      "Estruturas de repetição executam um bloco múltiplas vezes.",
      JSON.stringify(["Executa código condicionalmente", "Repete um bloco por número determinado de vezes", "Define uma função", "Declara uma variável"]), 1,
      "'for' repete um bloco um número pré-determinado de vezes.", 1],
    [quizIds[2], "Saída: x=5; se x>3 então escreva('A') senão escreva('B')",
      "Estruturas condicionais redirecionam o fluxo do programa.",
      JSON.stringify(["B", "A", "5", "Erro"]), 1,
      "5 > 3 é verdadeiro → 'A' é escrito.", 2],
    [quizIds[2], "O que é uma variável em programação?",
      "Variáveis são conceito fundamental em qualquer linguagem.",
      JSON.stringify(["Um tipo de loop", "Um espaço na memória para armazenar dados", "Uma função matemática", "Um operador lógico"]), 1,
      "Variável: espaço na memória associado a um nome que guarda um valor.", 3],
    [quizIds[2], "Operador de igualdade na maioria das linguagens?",
      "Operadores de comparação são usados em condicionais.",
      JSON.stringify(["=", "==", ":=", "==="]), 1,
      "'==' compara igualdade em C, Java e Python.", 4],
    // Quiz 4: Protocolos de Rede
    [quizIds[3], "Quantas camadas possui o modelo OSI?",
      "O modelo OSI é referência para transmissão de dados em redes.",
      JSON.stringify(["4", "5", "7", "8"]), 2,
      "7 camadas: Física, Enlace, Rede, Transporte, Sessão, Apresentação e Aplicação.", 0],
    [quizIds[3], "Qual protocolo resolve nomes de domínio?",
      "Na Internet convertemos nomes amigáveis em endereços IP.",
      JSON.stringify(["HTTP", "FTP", "DNS", "SMTP"]), 2,
      "DNS (Domain Name System) converte nomes em endereços IP.", 1],
    [quizIds[3], "Principal diferença entre TCP e UDP?",
      "TCP e UDP são protocolos de transporte distintos.",
      JSON.stringify(["TCP é mais rápido e sem confirmação", "TCP garante entrega confiável; UDP é mais rápido sem garantia", "UDP garante entrega; TCP é sem conexão", "Nenhuma diferença"]), 1,
      "TCP garante entrega ordenada; UDP é rápido mas sem garantias.", 2],
    [quizIds[3], "Porta padrão do HTTP?",
      "Protocolos usam portas para identificar serviços.",
      JSON.stringify(["Porta 21", "Porta 25", "Porta 80", "Porta 443"]), 2,
      "HTTP → porta 80. HTTPS → 443. FTP → 21. SMTP → 25.", 3],
    [quizIds[3], "O que é um endereço IP?",
      "Na internet cada dispositivo precisa ser identificado.",
      JSON.stringify(["O nome do computador na rede", "Um identificador numérico único de um dispositivo na rede", "O endereço físico da placa de rede", "O nome do provedor"]), 1,
      "IP: identificador numérico único atribuído a cada dispositivo.", 4],
  ];

  for (const q of questions) insertQuestion.run(...q);

  // ──────────────────────────────────────────────
  // CONQUISTAS
  // ──────────────────────────────────────────────
  const insertAch = db.prepare(`
    INSERT INTO achievements (name, description, icon, category, xp_reward, coin_reward, condition_type, condition_value)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  [
    ["Primeiro Passo",        "Complete seu primeiro quiz",          "🎯", "inicio",    50,  10,  "quizzes_completed", 1],
    ["Estudante Dedicado",    "Complete 10 quizzes",                 "📚", "progresso", 100, 25,  "quizzes_completed", 10],
    ["Mestre dos Quizzes",    "Complete 50 quizzes",                 "🎓", "progresso", 300, 75,  "quizzes_completed", 50],
    ["Perfeito!",             "Acerte 100% em um quiz",              "⭐", "desempenho",150, 40,  "perfect_score",     1],
    ["Sequência de 3",        "Estude 3 dias seguidos",              "🔥", "sequencia",  75, 20,  "streak_days",       3],
    ["Sequência de 7",        "Estude 7 dias seguidos",              "🔥", "sequencia", 200, 50,  "streak_days",       7],
    ["Sequência de 30",       "Estude 30 dias seguidos",             "🔥", "sequencia", 600, 150, "streak_days",       30],
    ["Colecionador de XP",    "Acumule 1000 XP",                     "⚡", "xp",        100, 30,  "total_xp",          1000],
    ["Lenda do XP",           "Acumule 10000 XP",                    "⚡", "xp",        500, 120, "total_xp",          10000],
    ["Especialista em Redes", "Complete todos os quizzes de Redes",  "🌐", "categoria", 200, 60,  "category_completed",4],
    ["Craque de Matemática",  "Complete todos os quizzes de Mate",   "📐", "categoria", 200, 60,  "category_completed",1],
    ["Programador Nato",      "Complete todos os quizzes de Prog.",  "⌨️", "categoria", 200, 60,  "category_completed",3],
    ["Milionário de Moedas",  "Acumule 500 moedas",                  "🪙", "moedas",    100, 0,   "total_coins",       500],
    ["Velocista",             "Complete um quiz em menos de 5 min",  "⚡", "tempo",     100, 25,  "quiz_time",         300],
    ["Madrugador",            "Complete um quiz antes das 8h",       "🌅", "especial",   80, 20,  "time_of_day",       8],
  ].forEach((a) => insertAch.run(...a));

  // ──────────────────────────────────────────────
  // MISSÕES
  // ──────────────────────────────────────────────
  const insertMission = db.prepare(`
    INSERT INTO missions (title, description, icon, mission_type, xp_reward, coin_reward, condition_type, condition_value)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  [
    ["Quiz Diário",         "Complete 1 quiz hoje",                      "🎯", "daily",   50,  10,  "daily_quizzes",   1],
    ["Acertar em Grande",   "Acerte 10 questões hoje",                   "✅", "daily",   75,  15,  "daily_correct",   10],
    ["Nota Máxima",         "Tire 100% em um quiz hoje",                 "⭐", "daily",  100,  25,  "daily_perfect",   1],
    ["Explorador",          "Complete quizzes de 2 categorias hoje",     "🗺️","daily",   80,  20,  "daily_categories",2],
    ["Maratonista",         "Complete 3 quizzes hoje",                   "🏃", "daily",  120,  30,  "daily_quizzes",   3],
    ["Estudante da Semana", "Complete 10 quizzes essa semana",           "📅", "weekly", 300,  80,  "weekly_quizzes",  10],
    ["Sem Erros",           "Acerte 50 questões essa semana",            "🎯", "weekly", 250,  60,  "weekly_correct",  50],
    ["Imbatível",           "Mantenha sua sequência por 7 dias",         "🔥", "weekly", 400, 100,  "weekly_streak",   7],
  ].forEach((m) => insertMission.run(...m));


  const fbStats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbackPool.forEach(([r]) => fbStats[r]++);

}

seed();
