require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const db = require("./db");
const { initializeSchema } = require("./schema");
const bcrypt = require("bcryptjs");

function seed() {
  initializeSchema();

  // PROTEÇÃO: executa apenas uma vez. Nunca apaga nem reseed.
  const existing = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (existing.count > 0) {
    console.log("Banco já populado. Seed ignorado (execução única protegida).");
    return;
  }

  console.log("Populando banco de dados pela primeira vez...");

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
    12, 2850, 340, 7, "2026-08-19", "2026-08-19 10:00:00", "2026-08-19 10:00:00");
  insertUser.run("Prof. João Ferreira", "Prof. João", "professor@quiztech.com",
    bcrypt.hashSync("professor123", 10), "teacher", "👨‍🏫",
    1, 0, 0, 0, null, "2026-08-19 10:00:00", "2026-08-19 10:00:00");

  // Contas para testes de feedback, conquistas e missões , caso não consiga criar as contas reais com os alunos

  const group = [
    ["Ana Carolina Silva",       "Ana Carolina",   "ana.carolina09@gmail.com",        "👩‍🎓", "2026-08-19 10:30:00"],
    ["Kauan Motta Braga",        "Kauan",          "kauan.mb09@gmail.com",            "👨‍🎓", "2026-08-19 10:30:00"],    
  ]; 
  const studentLevels = [1, 2];


  function studentStats(level, idx) {
    const base = (level - 1) * 250;
    const xp = base + ((idx * 37 + 13) % 221);
    const coins = Math.floor(xp / 8);
    const streakPool = [0, 0, 1, 1, 2, 3, 5, 7, 10, 14];
    const streak = streakPool[(idx * 3 + level) % streakPool.length];
    return { xp, coins, streak };
  }

  // Inserir alunos e guardar IDs na ordem de inserção
  const allStudentIds = [];
  const studentsList = [...group];
  for (let i = 0; i < studentsList.length; i++) {
    const [name, apelido, email, avatar, createdAt] = studentsList[i];
    const level = studentLevels[i];
    const { xp, coins, streak } = studentStats(level, i);
    const id = insertUser.run(name, apelido, email, studentHash, "student", avatar, level, xp, coins, streak, null, createdAt, createdAt).lastInsertRowid;
    allStudentIds.push(id);
  }

    const feedbackPool = [
   
    [5, "Muito legal, aprendemos bastante!"],
    [5, "BOM"],    
  ];

  const feedbackIndices = new Set([0,  1]); 


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
    ["Geometria Plana",             "Áreas, perímetros, ângulos e figuras planas",         categoryIds[0], "medium",  90, 18, 30, rogId],
    ["Programação Básica",          "Variáveis, tipos, loops, condicionais e funções",    categoryIds[2], "easy",    70, 14, 25, rogId],
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
    // Quiz 5: ENEM - Ciências da Natureza
    [quizIds[4], "O que enuncia a 1ª Lei de Newton (Inércia)?",
      "As Leis de Newton são fundamentais para a mecânica clássica.",
      JSON.stringify(["F = m × a", "Ação e reação são iguais e opostas", "Um corpo em repouso tende a permanecer em repouso, e em movimento tende a continuar em movimento", "Energia não se cria nem se destrói"]), 2,
      "1ª Lei: princípio da inércia — todo corpo mantém seu estado até que uma força atue.", 0],
    [quizIds[4], "O número atômico de um elemento representa:",
      "A tabela periódica organiza elementos por suas propriedades atômicas.",
      JSON.stringify(["O número de nêutrons", "A massa do átomo", "O número de prótons no núcleo", "O número de elétrons na última camada"]), 2,
      "O número atômico (Z) é o número de prótons, que define a identidade química do elemento.", 1],
    [quizIds[4], "A fotossíntese produz:",
      "As plantas convertem energia luminosa em energia química.",
      JSON.stringify(["CO₂ e H₂O", "Glicose e O₂", "ATP e CO₂", "Proteínas e lipídeos"]), 1,
      "6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂. Glicose é o produto energético e O₂ é liberado.", 2],
    [quizIds[4], "Qual a unidade de pressão no Sistema Internacional?",
      "Grandezas físicas possuem unidades padronizadas no SI.",
      JSON.stringify(["Newton (N)", "Joule (J)", "Pascal (Pa)", "Watt (W)"]), 2,
      "Pascal (Pa) = N/m². É a unidade de pressão no SI.", 3],
    [quizIds[4], "Ácido + base em uma reação de neutralização produz:",
      "Reações ácido-base são comuns em Química.",
      JSON.stringify(["Mais ácido", "Sal e água", "Um gás inflamável", "Um óxido"]), 1,
      "Neutralização: ácido + base → sal + água. Exemplo: HCl + NaOH → NaCl + H₂O.", 4],
    // Quiz 6: Introdução ao Python
    [quizIds[5], "Como exibir texto na tela em Python?",
      "Python possui funções nativas para entrada e saída.",
      JSON.stringify(["echo 'texto'", "console.log('texto')", "print('texto')", "printf('texto')"]), 2,
      "print() é a função padrão de saída em Python.", 0],
    [quizIds[5], "Como criar uma lista em Python?",
      "Listas são uma das estruturas de dados mais usadas em Python.",
      JSON.stringify(["lista = {1, 2, 3}", "lista = [1, 2, 3]", "lista = (1, 2, 3)", "lista = <1, 2, 3>"]), 1,
      "Listas usam colchetes []. Chaves {} criam conjuntos/dicionários; parênteses () criam tuplas.", 1],
    [quizIds[5], "Como comentar uma linha de código em Python?",
      "Comentários documentam o código sem afetar sua execução.",
      JSON.stringify(["// comentário", "/* comentário */", "# comentário", "-- comentário"]), 2,
      "Em Python, # inicia um comentário de linha.", 2],
    [quizIds[5], "O que gera range(5)?",
      "range() é usada frequentemente em loops for.",
      JSON.stringify(["[1, 2, 3, 4, 5]", "Gera os números 0, 1, 2, 3, 4", "Cria 5 variáveis", "Repete 6 vezes"]), 1,
      "range(5) gera 0, 1, 2, 3, 4 — começa em 0 e vai até n-1.", 3],
    [quizIds[5], "Como definir uma função em Python?",
      "Funções permitem reutilizar blocos de código.",
      JSON.stringify(["function minha_func():", "def minha_func():", "func minha_func():", "void minha_func():"]), 1,
      "Python usa a palavra-chave 'def' para definir funções.", 4],
    // Quiz 7: Segurança da Informação
    [quizIds[6], "O que é um firewall?",
      "Proteção de redes envolve diversas ferramentas e técnicas.",
      JSON.stringify(["Um tipo de vírus", "Um software de backup automático", "Um sistema que monitora e filtra o tráfego de rede", "Um banco de dados criptografado"]), 2,
      "Firewall: barreira que inspeciona e filtra pacotes de rede conforme regras de segurança.", 0],
    [quizIds[6], "O que é phishing?",
      "Ataques de engenharia social exploram o comportamento humano.",
      JSON.stringify(["Sobrecarga de um servidor (DoS)", "Invasão de redes Wi-Fi", "Fraude que engana o usuário para roubar dados pessoais", "Criptografia de arquivos por ransomware"]), 2,
      "Phishing: e-mails/sites falsos que imitam entidades confiáveis para roubar credenciais.", 1],
    [quizIds[6], "Para que serve o protocolo HTTPS?",
      "Protocolos de aplicação determinam como os dados são transmitidos.",
      JSON.stringify(["Transferência de arquivos FTP", "Comunicação HTTP com criptografia TLS/SSL", "Resolução de nomes DNS", "Envio de e-mails"]), 1,
      "HTTPS = HTTP + TLS/SSL. Garante confidencialidade e integridade da comunicação.", 2],
    [quizIds[6], "O que é autenticação de dois fatores (2FA)?",
      "Autenticação forte reduz o risco de acesso não autorizado.",
      JSON.stringify(["Digitar a senha duas vezes", "Usar dois métodos distintos de verificação de identidade", "Dois usuários com o mesmo login", "Dupla criptografia de arquivos"]), 1,
      "2FA exige algo que você sabe (senha) + algo que você tem (token/SMS) ou é (biometria).", 3],
    [quizIds[6], "O que é criptografia simétrica?",
      "Existem dois modelos principais de criptografia.",
      JSON.stringify(["Usa duas chaves diferentes (pública e privada)", "Usa a mesma chave para cifrar e decifrar", "Não usa chaves", "Só funciona offline"]), 1,
      "Simétrica: mesma chave para cifrar/decifrar (ex.: AES). Assimétrica: par de chaves (ex.: RSA).", 4],
    // Quiz 8: Funções e Gráficos
    [quizIds[7], "Dada f(x) = 2x + 3, qual é f(4)?",
      "Funções do 1º grau têm a forma f(x) = ax + b.",
      JSON.stringify(["9", "10", "11", "12"]), 2,
      "f(4) = 2(4) + 3 = 8 + 3 = 11.", 0],
    [quizIds[7], "O que representa o coeficiente angular de uma reta?",
      "A equação de uma reta é y = ax + b, onde 'a' é o coeficiente angular.",
      JSON.stringify(["O ponto onde a reta cruza o eixo y", "O valor de x quando y = 0", "A inclinação da reta", "O valor de y quando x = 0"]), 2,
      "O coeficiente angular 'a' determina o grau de inclinação da reta.", 1],
    [quizIds[7], "Para qual valor de x a função f(x) = x² − 4 se anula?",
      "Zeros de uma função são os valores que tornam f(x) = 0.",
      JSON.stringify(["x = ±1", "x = ±2", "x = ±4", "x = ±16"]), 1,
      "x² − 4 = 0 → x² = 4 → x = ±2.", 2],
    [quizIds[7], "Qual é o domínio da função f(x) = 1/(x − 3)?",
      "O domínio é o conjunto de valores de x para os quais a função existe.",
      JSON.stringify(["Todo R", "R − {3}", "x > 3", "x < 3"]), 1,
      "O denominador não pode ser zero: x − 3 ≠ 0 → x ≠ 3. Domínio = R − {3}.", 3],
    [quizIds[7], "Crescimento exponencial é representado por qual tipo de função?",
      "Funções exponenciais aparecem em crescimento populacional, juros compostos, etc.",
      JSON.stringify(["f(x) = ax + b", "f(x) = ax²", "f(x) = aˣ (a > 0, a ≠ 1)", "f(x) = log(x)"]), 2,
      "Função exponencial: f(x) = aˣ. A variável está no expoente.", 4],
    // Quiz 9: Geometria Plana
    [quizIds[8], "Qual é a área de um quadrado de lado 5 cm?",
      "A área de um quadrado é calculada pelo quadrado do lado.",
      JSON.stringify(["10 cm²", "20 cm²", "25 cm²", "50 cm²"]), 2,
      "Área = lado² = 5² = 25 cm².", 0],
    [quizIds[8], "Qual é a soma dos ângulos internos de qualquer triângulo?",
      "Triângulos têm uma propriedade fundamental sobre seus ângulos.",
      JSON.stringify(["90°", "180°", "270°", "360°"]), 1,
      "A soma dos ângulos internos de um triângulo é sempre 180°.", 1],
    [quizIds[8], "Qual é a área de um círculo com raio 4 cm? (π ≈ 3,14)",
      "A fórmula da área do círculo envolve o raio e o número π.",
      JSON.stringify(["12,56 cm²", "25,12 cm²", "50,24 cm²", "100,48 cm²"]), 2,
      "Área = π × r² = 3,14 × 4² = 3,14 × 16 = 50,24 cm².", 2],
    [quizIds[8], "Um retângulo tem base 8 cm e altura 5 cm. Qual é sua área?",
      "A área do retângulo é base multiplicada pela altura.",
      JSON.stringify(["13 cm²", "26 cm²", "40 cm²", "64 cm²"]), 2,
      "Área = base × altura = 8 × 5 = 40 cm².", 3],
    [quizIds[8], "O que é um ângulo obtuso?",
      "Os ângulos são classificados conforme sua medida.",
      JSON.stringify(["Menor que 90°", "Igual a 90°", "Entre 90° e 180°", "Igual a 180°"]), 2,
      "Agudo < 90°; Reto = 90°; Obtuso: entre 90° e 180°; Raso = 180°.", 4],
    [quizIds[8], "Dois ângulos são suplementares quando a soma é:",
      "Pares de ângulos têm relações especiais.",
      JSON.stringify(["45°", "90°", "180°", "360°"]), 2,
      "Suplementares somam 180°. Complementares somam 90°.", 5],
    [quizIds[8], "Qual é o perímetro de um triângulo equilátero de lado 6 cm?",
      "Equilátero: todos os lados iguais.",
      JSON.stringify(["12 cm", "18 cm", "24 cm", "36 cm"]), 1,
      "Perímetro = 3 × lado = 3 × 6 = 18 cm.", 6],
    [quizIds[8], "Um trapézio tem bases 6 cm e 10 cm e altura 4 cm. Qual é sua área?",
      "A fórmula da área do trapézio usa as duas bases e a altura.",
      JSON.stringify(["16 cm²", "24 cm²", "32 cm²", "40 cm²"]), 2,
      "Área = ((B + b) × h) / 2 = ((10 + 6) × 4) / 2 = 64 / 2 = 32 cm².", 7],
    // Quiz 10: Programação Básica
    [quizIds[9], "O que é uma variável em programação?",
      "Variáveis são o conceito mais fundamental de qualquer linguagem.",
      JSON.stringify(["Um tipo de loop", "Um espaço na memória para armazenar dados", "Um operador lógico", "Uma função matemática"]), 1,
      "Variável: identificador que referencia um espaço de memória onde um valor é guardado.", 0],
    [quizIds[9], "Qual tipo de dado armazena texto?",
      "Cada tipo de dado é adequado para um tipo de informação.",
      JSON.stringify(["int", "float", "bool", "string"]), 3,
      "string (ou char[]) armazena sequências de caracteres como palavras e frases.", 1],
    [quizIds[9], "O que faz a estrutura while?",
      "Estruturas de repetição são fundamentais para automatizar tarefas.",
      JSON.stringify(["Declara variáveis", "Define funções", "Repete um bloco enquanto a condição for verdadeira", "Importa módulos"]), 2,
      "while: repete o bloco de código enquanto a condição avaliada for verdadeira.", 2],
    [quizIds[9], "Para que servem os comentários no código?",
      "Boas práticas de programação incluem documentar o código.",
      JSON.stringify(["São instruções executadas primeiro", "São ignorados pelo compilador e servem para documentar", "Definem o tipo de variável", "Criam atalhos de teclado"]), 1,
      "Comentários não são executados — ajudam outros desenvolvedores (e você mesmo) a entender o código.", 3],
    [quizIds[9], "Qual é o resultado de 10 % 3 na maioria das linguagens?",
      "O operador módulo (%) retorna o resto da divisão inteira.",
      JSON.stringify(["3", "1", "0", "3,33"]), 1,
      "10 ÷ 3 = 3 com resto 1. O operador % retorna esse resto.", 4],
    [quizIds[9], "Qual a diferença entre = e == na maioria das linguagens?",
      "Confundir esses operadores é um erro muito comum para iniciantes.",
      JSON.stringify(["Nenhuma diferença", "= atribui valor; == compara igualdade", "== atribui; = compara", "Ambos fazem atribuição"]), 1,
      "= (atribuição): define o valor de uma variável. == (comparação): verifica se dois valores são iguais.", 5],
    [quizIds[9], "O que é uma função (ou procedimento)?",
      "Funções permitem organizar e reutilizar código.",
      JSON.stringify(["Um tipo de variável numérica", "Um bloco de código nomeado e reutilizável", "Um tipo de dado", "Um operador condicional"]), 1,
      "Função: bloco de instruções com nome próprio que pode ser chamado várias vezes no programa.", 6],
    [quizIds[9], "O que é um algoritmo?",
      "Algoritmos são a base do pensamento computacional.",
      JSON.stringify(["Uma linguagem de programação específica", "Um componente de hardware", "Uma sequência finita de passos para resolver um problema", "Um banco de dados"]), 2,
      "Algoritmo: sequência ordenada, finita e não ambígua de instruções que resolve um problema.", 7],
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

  console.log("\nBanco populado com sucesso!\n");

}

seed();
