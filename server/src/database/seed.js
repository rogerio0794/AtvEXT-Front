require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const db = require("./db");
const { initializeSchema } = require("./schema");
const bcrypt = require("bcryptjs");

function seed() {
  initializeSchema();

  // PROTEÇÃO: executa apenas uma vez. Nunca apaga nem reseed.
  const existing = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (existing.count > 0) {
    console.log("✅ Banco já populado. Seed ignorado (execução única protegida).");
    return;
  }

  console.log("🌱 Populando banco de dados pela primeira vez...");

  const studentHash = bcrypt.hashSync("senha123", 10);
  const teacherHash = bcrypt.hashSync("ifsc@2026", 10);
  const adminHash   = bcrypt.hashSync("admin2026", 10);

  const insertUser = db.prepare(`
    INSERT INTO users
      (name, apelido, email, password_hash, role, avatar, level, xp, coins, streak, last_activity_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // ──────────────────────────────────────────────
  // PROFESSORES
  // ──────────────────────────────────────────────
  const teachers = [
    ["Rogério Pereira Junior", "Rogério",  "rogerio.pereira@ifsc.edu.br",   "👨‍🏫", "2026-08-05 08:30:00"],
    ["Marcos Moecke",          "Marcos",   "marcos.moecke@ifsc.edu.br",     "👨‍🏫", "2026-08-21 13:30:00"],
    ["Alberto Torresini",      "Alberto",  "torresini.ederson@ifsc.edu.br", "👨‍🏫", "2026-08-21 13:42:00"],
  ];

  const teacherIds = teachers.map(([name, apelido, email, avatar, createdAt]) =>
    insertUser.run(name, apelido, email, teacherHash, "teacher", avatar, 1, 0, 0, 0, null, createdAt, createdAt).lastInsertRowid
  );
  const rogId = teacherIds[0];

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

  // ──────────────────────────────────────────────
  // ALUNOS — 61 no total
  // ~80% @gmail.com | ~20% @hotmail.com  (12 hotmail, 49 gmail)
  // ~30% apelidos inusitados (18 alunos)
  // Formato: [name, apelido, email, avatar, created_at]
  // ──────────────────────────────────────────────

  // GRUPO 1 — 18 alunos · 18/08/2026 a partir das 13:30
  // @hotmail: posições globais 4 (Diego), 9 (Gabriela), 14 (Patolino123)
  const group1 = [
    ["Ana Carolina Silva",       "Ana Carolina",   "ana.carolina@gmail.com",         "👩‍🎓", "2026-08-21 13:30:00"],
    ["Bruno Henrique Santos",    "Bruno",          "bruno.henrique@gmail.com",        "👨‍🎓", "2026-08-21 13:33:00"],
    ["sixSeven",                 "sixSeven",       "sixseven@gmail.com",              "🎮",   "2026-08-21 13:37:00"],
    ["Camila Ferreira Oliveira", "Camila",         "camila.ferreira@gmail.com",       "👩‍💻", "2026-08-21 13:41:00"],
    ["Diego Alves Costa",        "Diego",          "diego.alves@hotmail.com",         "👨‍💻", "2026-08-21 13:45:00"],
    ["zeBotijão Nascimento",     "zeBotijão",      "zebotijao@gmail.com",             "🦝",   "2026-08-21 13:49:00"],
    ["Eduarda Lima Martins",     "Eduarda",        "eduarda.lima@gmail.com",          "👩‍🎓", "2026-08-21 13:53:00"],
    ["Felipe Rodrigues Neto",    "Felipe",         "felipe.rodrigues@gmail.com",      "👨‍🎓", "2026-08-21 13:57:00"],
    ["juninhoDoPneu",            "juninhoDoPneu",  "juninhopneu@gmail.com",           "🚗",   "2026-08-21 14:02:00"],
    ["Gabriela Nascimento Cruz", "Gabi",           "gabriela.nascimento@hotmail.com", "👩‍💻", "2026-08-21 14:06:00"],
    ["Henrique Souza Alves",     "Henrique",       "henrique.souza@gmail.com",        "👨‍💻", "2026-08-21 14:10:00"],
    ["DestroyerBR",              "DestroyerBR",    "destroyerbr@gmail.com",           "💥",   "2026-08-21 14:14:00"],
    ["Isabela Carvalho Pinto",   "Isabela",        "isabela.carvalho@gmail.com",      "👩‍🎓", "2026-08-21 14:19:00"],
    ["João Pedro Mendes",        "João Pedro",     "joao.pedro@gmail.com",            "👨‍🎓", "2026-08-21 14:23:00"],
    ["Patolino123",              "Patolino123",    "patolino123@hotmail.com",         "🦆",   "2026-08-21 14:27:00"],
    ["Larissa Rocha Pereira",    "Larissa",        "larissa.rocha@gmail.com",         "👩‍💻", "2026-08-21 14:32:00"],
    ["Matheus Barbosa Lima",     "Matheus",        "matheus.barbosa@gmail.com",       "👨‍💻", "2026-08-21 14:37:00"],
    ["RobocopZika",              "RobocopZika",    "robocopzika@gmail.com",           "🤖",   "2026-08-21 14:41:00"],
  ];

  // GRUPO 2 — 25 alunos · 18/08/2026 a partir das 15:40
  // @hotmail: posições globais 19 (Otávio), 24 (Sabrina), 29 (Xavier), 34 (Vitória), 39 (Paulo)
  const group2 = [
    ["Natalia Cunha Freitas",    "Nati",           "natalia.cunha@gmail.com",         "👩‍🎓", "2026-08-21 15:40:00"],
    ["Otávio Pinto Marques",     "Otávio",         "otavio.pinto@hotmail.com",        "👨‍🎓", "2026-08-21 15:44:00"],
    ["TiaoTrator",               "TiaoTrator",     "tiaotrator@gmail.com",            "🚜",   "2026-08-21 15:48:00"],
    ["Priscila Melo Teixeira",   "Pri",            "priscila.melo@gmail.com",         "👩‍💻", "2026-08-21 15:52:00"],
    ["Rafael Batista Santos",    "Rafael",         "rafael.batista@gmail.com",        "👨‍💻", "2026-08-21 15:56:00"],
    ["BatatinhaNerd",            "BatatinhaNerd",  "batatinhanerd@gmail.com",         "🥔",   "2026-08-21 16:01:00"],
    ["Sabrina Castro Moreira",   "Sabrina",        "sabrina.castro@hotmail.com",      "👩‍🎓", "2026-08-21 16:05:00"],
    ["Thiago Nunes Cardoso",     "Thiago",         "thiago.nunes@gmail.com",          "👨‍🎓", "2026-08-21 16:09:00"],
    ["SorveteFrito",             "SorveteFrito",   "sorvetefrito@gmail.com",          "🍦",   "2026-08-21 16:13:00"],
    ["Valentina Moreira Dias",   "Val",            "valentina.moreira@gmail.com",     "👩‍💻", "2026-08-21 16:17:00"],
    ["Wellington Araújo Lima",   "Wellington",     "wellington.araujo@gmail.com",     "👨‍💻", "2026-08-21 16:21:00"],
    ["XavierDaGaláxia",         "XavierDaGaláxia","xavirgalaxia@hotmail.com",        "🌌",   "2026-08-21 16:26:00"],
    ["Yasmin Cardoso Costa",     "Yasmin",         "yasmin.cardoso@gmail.com",        "👩‍🎓", "2026-08-21 16:30:00"],
    ["Amanda Freitas Ribeiro",   "Amanda",         "amanda.freitas@gmail.com",        "👩‍💻", "2026-08-21 16:34:00"],
    ["MascaradoBR",              "MascaradoBR",    "mascaradobr@gmail.com",           "🎭",   "2026-08-21 16:38:00"],
    ["Lucas Monteiro Gomes",     "Lucas",          "lucas.monteiro@gmail.com",        "👨‍💻", "2026-08-21 16:43:00"],
    ["Vitória Ribeiro Machado",  "Vitória",        "vitoria.ribeiro@hotmail.com",     "👩‍🎓", "2026-08-21 16:47:00"],
    ["ZéMarmitex",               "ZéMarmitex",     "zemarmitex@gmail.com",            "🍱",   "2026-08-21 16:51:00"],
    ["Guilherme Lemos Vieira",   "Guilherme",      "guilherme.lemos@gmail.com",       "👨‍🎓", "2026-08-21 16:55:00"],
    ["Fernanda Correia Souza",   "Fê",             "fernanda.correia@gmail.com",      "👩‍💻", "2026-08-21 17:00:00"],
    ["CabroEstressado",          "CabroEstressado","cabroestressado@gmail.com",       "😤",   "2026-08-21 17:05:00"],
    ["Paulo Henrique Dias",      "Paulo",          "paulo.henrique@hotmail.com",      "👨‍💻", "2026-08-21 17:09:00"],
    ["Leticia Marques Silva",    "Leticia",        "leticia.marques@gmail.com",       "👩‍🎓", "2026-08-21 17:14:00"],
    ["DomingoSeco",              "DomingoSeco",    "domingoseco@gmail.com",           "☀️",   "2026-08-21 17:18:00"],
    ["Leonardo Castro Borges",   "Leo",            "leonardo.castro@gmail.com",       "👨‍🎓", "2026-08-21 17:23:00"],
  ];

  // GRUPO 3 — 18 alunos · 19/08/2026 a partir das 13:30
  // @hotmail: posições globais 44 (Carlos), 49 (Vinicius), 54 (GatoGordinho), 59 (Luciana)
  const group3 = [
    ["Marina Fonseca Azevedo",   "Marina",         "marina.fonseca@gmail.com",        "👩‍💻", "2026-08-21 13:30:00"],
    ["Carlos Eduardo Vieira",    "Carlão",         "carlos.vieira@hotmail.com",       "👨‍💻", "2026-08-21 13:33:00"],
    ["Bianca Tavares Rocha",     "Bianca",         "bianca.tavares@gmail.com",        "👩‍🎓", "2026-08-21 13:37:00"],
    ["PitombaDaLua",             "PitombaDaLua",   "pitombalua@gmail.com",            "🌙",   "2026-08-21 13:41:00"],
    ["Rodrigo Machado Costa",    "Rodrigo",        "rodrigo.machado@gmail.com",       "👨‍🎓", "2026-08-21 13:46:00"],
    ["Talita Gomes Ferreira",    "Talita",         "talita.gomes@gmail.com",          "👩‍💻", "2026-08-21 13:50:00"],
    ["Vinicius Azevedo Santos",  "Vini",           "vinicius.azevedo@hotmail.com",    "👨‍💻", "2026-08-21 13:54:00"],
    ["NinjaDoPix",               "NinjaDoPix",     "ninjadopix@gmail.com",            "🥷",   "2026-08-21 13:59:00"],
    ["Renata Campos Lima",       "Renata",         "renata.campos@gmail.com",         "👩‍🎓", "2026-08-21 14:03:00"],
    ["André Ferraz Oliveira",    "André",          "andre.ferraz@gmail.com",          "👨‍🎓", "2026-08-21 14:07:00"],
    ["Claudia Borges Melo",      "Claudia",        "claudia.borges@gmail.com",        "👩‍💻", "2026-08-21 14:12:00"],
    ["GatoGordinhoBR",           "GatoGordinhoBR", "gatogordinho@hotmail.com",        "🐱",   "2026-08-21 14:16:00"],
    ["Marcelo Batista Cruz",     "Marcelo",        "marcelo.batista@gmail.com",       "👨‍💻", "2026-08-21 14:20:00"],
    ["Aline Moura Pinto",        "Aline",          "aline.moura@gmail.com",           "👩‍🎓", "2026-08-21 14:25:00"],
    ["Fabio Cavalcanti Neto",    "Fabio",          "fabio.cavalcanti@gmail.com",      "👨‍🎓", "2026-08-21 14:29:00"],
    ["TocinhoDaSorte",           "TocinhoDaSorte", "tocinhoda@gmail.com",             "🐷",   "2026-08-21 14:33:00"],
    ["Luciana Queiroz Alves",    "Lu",             "luciana.queiroz@hotmail.com",     "👩‍💻", "2026-08-21 14:37:00"],
    ["Tiago Andrade Mendes",     "Tiago",          "tiago.andrade@gmail.com",         "👨‍💻", "2026-08-21 14:42:00"],
  ];

  // Inserir alunos e guardar IDs na ordem de inserção
  const allStudentIds = [];
  for (const [name, apelido, email, avatar, createdAt] of [...group1, ...group2, ...group3]) {
    const id = insertUser.run(name, apelido, email, studentHash, "student", avatar, 1, 0, 0, 0, null, createdAt, createdAt).lastInsertRowid;
    allStudentIds.push(id);
  }

  // ──────────────────────────────────────────────
  // FEEDBACKS — 60% dos alunos = 37 de 61
  // Maioria 4★ | alguns 5★, 3★, 2★, 1★
  // Índices selecionados (0-based): distribuídos ao longo dos 3 grupos
  // ──────────────────────────────────────────────

  // [rating, comment | null]  — 37 entradas exatas
  const feedbackPool = [
    // 5★ (6 feedbacks)
    [5, "Simplesmente incrível! Uso todo dia"],
    [5, "Adorei! O sistema de XP vicia demais"],
    [5, "Melhor plataforma de estudos que já usei"],
    [5, "O ranking é muito competitivo e divertido"],
    [5, "Os quizzes são desafiadores, amei muito!"],
    [5, "Perfeito para estudar de forma divertida!"],
    // 4★ (21 feedbacks — maioria)
    [4, "Gostei muito da plataforma!"],
    [4, "Legal, bem divertido de usar"],
    [4, "As missões diárias são animadas"],
    [4, "O sistema de gamificação é sensacional"],
    [4, "Interface bem intuitiva e fácil de usar"],
    [4, "Muito bom, recomendo para todos!"],
    [4, "Ótima para estudar para o ENEM"],
    [4, "Bem feito! Parabéns aos desenvolvedores"],
    [4, "Gostei bastante, fácil de usar"],
    [4, "O sistema de conquistas é bacana"],
    [4, "Muito útil! Já aprendi bastante aqui"],
    [4, null],
    [4, "Quero mais questões de programação!"],
    [4, "Bem intuitivo e divertido"],
    [4, "O sistema de XP me motiva a continuar"],
    [4, null],
    [4, "Gostei bastante, continua assim!"],
    [4, "As conquistas me motivam a não parar de estudar"],
    [4, "Legal! O ranking me faz querer estudar mais"],
    [4, "Muito bom para revisar o conteúdo da escola"],
    [4, null],
    // 3★ (7 feedbacks)
    [3, "Poderia ter mais questões em cada quiz"],
    [3, "Falta mais animações nas respostas"],
    [3, "As perguntas poderiam ser mais engraçadas para engajamento"],
    [3, "Poderia ter mais categorias de quiz"],
    [3, "Bom, o visual poderia ser mais chamativo"],
    [3, "Bom, mas poderia ter mais conteúdo"],
    [3, "Tem potencial, poderia ter mais questões difíceis"],
    // 2★ (2 feedbacks)
    [2, "Precisa melhorar bastante ainda"],
    [2, "Achei um pouco simples, esperava mais"],
    // 1★ (1 feedback)
    [1, "Não me engajou muito, poderia ser mais dinâmico"],
  ];
  // Total: 6+21+7+2+1 = 37 ✓

  // Índices dos 37 alunos que darão feedback (distribuídos nos 3 grupos)
  // 37/61 = 60.6%
  const feedbackIndices = new Set([
     0,  1,  2,  4,  5,  6,  8,  9, 10, 12,
    13, 14, 16, 17, 18, 20, 21, 22, 24, 25,
    26, 28, 30, 31, 33, 35, 37, 38, 40, 42,
    43, 45, 47, 49, 51, 53, 56,
  ]); // 37 índices ✓

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

  // ──────────────────────────────────────────────
  // CATEGORIAS
  // ──────────────────────────────────────────────
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

  // ──────────────────────────────────────────────
  // QUIZZES
  // ──────────────────────────────────────────────
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

  // ──────────────────────────────────────────────
  // RESUMO FINAL
  // ──────────────────────────────────────────────
  const gmailCount = [...group1, ...group2, ...group3].filter(([,,,, , email]) =>
    (email ?? "").includes("@gmail")
  ).length;

  // recount properly
  const allStudents = [...group1, ...group2, ...group3];
  const gmailC = allStudents.filter(s => s[2].includes("@gmail")).length;
  const hotmailC = allStudents.filter(s => s[2].includes("@hotmail")).length;

  const fbStats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbackPool.forEach(([r]) => fbStats[r]++);

  console.log("\n✅ Banco populado com sucesso!\n");
  console.log(`👥 Usuários: ${allStudents.length} alunos + ${teachers.length} professores + 1 admin`);

}

seed();
