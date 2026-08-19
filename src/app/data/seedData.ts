// Initial seed data for localStorage — 61 students + 3 IFSC teachers + 2 demo accounts
// Feedbacks for 37/61 students (60%), mostly 4★

export interface SeedUser {
  id: string;
  name: string;
  apelido: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  streak: number;
  totalQuizzes: number;
}

export interface SeedFeedback {
  userId: string;
  rating: number;
  comment: string;
  updatedAt: string;
}

// XP/level tiers based on engagement
const TIERS = {
  '5': { level: 3, xp: 680, xpToNextLevel: 750, coins: 85, streak: 3, totalQuizzes: 10 },
  '4': { level: 2, xp: 330, xpToNextLevel: 500, coins: 40, streak: 1, totalQuizzes: 4  },
  '3': { level: 1, xp: 120, xpToNextLevel: 250, coins: 18, streak: 1, totalQuizzes: 2  },
  '2': { level: 1, xp: 45,  xpToNextLevel: 250, coins: 8,  streak: 0, totalQuizzes: 1  },
  '1': { level: 1, xp: 20,  xpToNextLevel: 250, coins: 5,  streak: 0, totalQuizzes: 1  },
  '0': { level: 1, xp: 0,   xpToNextLevel: 250, coins: 0,  streak: 0, totalQuizzes: 0  },
};

// [id_offset, name, apelido, email, avatar, tier]
// id = String(10 + index)  (so index 0 → '10', index 60 → '70')
// tier = '5'|'4'|'3'|'2'|'1'|'0'  (matches feedbackPool order from seed.js)
const RAW_STUDENTS: [string, string, string, string, string][] = [
  // ── GROUP 1 (0-17) ──
  ['Ana Carolina Silva',        'Ana Carolina',   'ana.carolina@gmail.com',        '👩‍🎓', '5'],
  ['Bruno Henrique Santos',     'Bruno',          'bruno.henrique@gmail.com',       '👨‍🎓', '5'],
  ['sixSeven',                  'sixSeven',       'sixseven@gmail.com',             '🎮',   '5'],
  ['Camila Ferreira Oliveira',  'Camila',         'camila.ferreira@gmail.com',      '👩‍💻', '0'],
  ['Diego Alves Costa',         'Diego',          'diego.alves@hotmail.com',        '👨‍💻', '5'],
  ['zeBotijão Nascimento',      'zeBotijão',      'zebotijao@gmail.com',            '🦝',   '5'],
  ['Eduarda Lima Martins',      'Eduarda',        'eduarda.lima@gmail.com',         '👩‍🎓', '5'],
  ['Felipe Rodrigues Neto',     'Felipe',         'felipe.rodrigues@gmail.com',     '👨‍🎓', '0'],
  ['juninhoDoPneu',             'juninhoDoPneu',  'juninhopneu@gmail.com',          '🚗',   '4'],
  ['Gabriela Nascimento Cruz',  'Gabi',           'gabriela.nascimento@hotmail.com','👩‍💻', '4'],
  ['Henrique Souza Alves',      'Henrique',       'henrique.souza@gmail.com',       '👨‍💻', '4'],
  ['DestroyerBR',               'DestroyerBR',    'destroyerbr@gmail.com',          '💥',   '0'],
  ['Isabela Carvalho Pinto',    'Isabela',        'isabela.carvalho@gmail.com',     '👩‍🎓', '4'],
  ['João Pedro Mendes',         'João Pedro',     'joao.pedro@gmail.com',           '👨‍🎓', '4'],
  ['Patolino123',               'Patolino123',    'patolino123@hotmail.com',        '🦆',   '4'],
  ['Larissa Rocha Pereira',     'Larissa',        'larissa.rocha@gmail.com',        '👩‍💻', '0'],
  ['Matheus Barbosa Lima',      'Matheus',        'matheus.barbosa@gmail.com',      '👨‍💻', '4'],
  ['RobocopZika',               'RobocopZika',    'robocopzika@gmail.com',          '🤖',   '4'],
  // ── GROUP 2 (18-42) ──
  ['Natalia Cunha Freitas',     'Nati',           'natalia.cunha@gmail.com',        '👩‍🎓', '4'],
  ['Otávio Pinto Marques',      'Otávio',         'otavio.pinto@hotmail.com',       '👨‍🎓', '0'],
  ['TiaoTrator',                'TiaoTrator',     'tiaotrator@gmail.com',           '🚜',   '4'],
  ['Priscila Melo Teixeira',    'Pri',            'priscila.melo@gmail.com',        '👩‍💻', '4'],
  ['Rafael Batista Santos',     'Rafael',         'rafael.batista@gmail.com',       '👨‍💻', '4'],
  ['BatatinhaNerd',             'BatatinhaNerd',  'batatinhanerd@gmail.com',        '🥔',   '0'],
  ['Sabrina Castro Moreira',    'Sabrina',        'sabrina.castro@hotmail.com',     '👩‍🎓', '4'],
  ['Thiago Nunes Cardoso',      'Thiago',         'thiago.nunes@gmail.com',         '👨‍🎓', '4'],
  ['SorveteFrito',              'SorveteFrito',   'sorvetefrito@gmail.com',         '🍦',   '4'],
  ['Valentina Moreira Dias',    'Val',            'valentina.moreira@gmail.com',    '👩‍💻', '0'],
  ['Wellington Araújo Lima',    'Wellington',     'wellington.araujo@gmail.com',    '👨‍💻', '4'],
  ['XavierDaGaláxia',          'XavierDaGaláxia','xavirgalaxia@hotmail.com',       '🌌',   '0'],
  ['Yasmin Cardoso Costa',      'Yasmin',         'yasmin.cardoso@gmail.com',       '👩‍🎓', '4'],
  ['Amanda Freitas Ribeiro',    'Amanda',         'amanda.freitas@gmail.com',       '👩‍💻', '4'],
  ['MascaradoBR',               'MascaradoBR',    'mascaradobr@gmail.com',          '🎭',   '0'],
  ['Lucas Monteiro Gomes',      'Lucas',          'lucas.monteiro@gmail.com',       '👨‍💻', '4'],
  ['Vitória Ribeiro Machado',   'Vitória',        'vitoria.ribeiro@hotmail.com',    '👩‍🎓', '0'],
  ['ZéMarmitex',                'ZéMarmitex',     'zemarmitex@gmail.com',           '🍱',   '4'],
  ['Guilherme Lemos Vieira',    'Guilherme',      'guilherme.lemos@gmail.com',      '👨‍🎓', '0'],
  ['Fernanda Correia Souza',    'Fê',             'fernanda.correia@gmail.com',     '👩‍💻', '4'],
  ['CabroEstressado',           'CabroEstressado','cabroestressado@gmail.com',      '😤',   '3'],
  ['Paulo Henrique Dias',       'Paulo',          'paulo.henrique@hotmail.com',     '👨‍💻', '0'],
  ['Leticia Marques Silva',     'Leticia',        'leticia.marques@gmail.com',      '👩‍🎓', '3'],
  ['DomingoSeco',               'DomingoSeco',    'domingoseco@gmail.com',          '☀️',   '0'],
  ['Leonardo Castro Borges',    'Leo',            'leonardo.castro@gmail.com',      '👨‍🎓', '3'],
  // ── GROUP 3 (43-60) ──
  ['Marina Fonseca Azevedo',    'Marina',         'marina.fonseca@gmail.com',       '👩‍💻', '3'],
  ['Carlos Eduardo Vieira',     'Carlão',         'carlos.vieira@hotmail.com',      '👨‍💻', '0'],
  ['Bianca Tavares Rocha',      'Bianca',         'bianca.tavares@gmail.com',       '👩‍🎓', '3'],
  ['PitombaDaLua',              'PitombaDaLua',   'pitombalua@gmail.com',           '🌙',   '0'],
  ['Rodrigo Machado Costa',     'Rodrigo',        'rodrigo.machado@gmail.com',      '👨‍🎓', '3'],
  ['Talita Gomes Ferreira',     'Talita',         'talita.gomes@gmail.com',         '👩‍💻', '0'],
  ['Vinicius Azevedo Santos',   'Vini',           'vinicius.azevedo@hotmail.com',   '👨‍💻', '3'],
  ['NinjaDoPix',                'NinjaDoPix',     'ninjadopix@gmail.com',           '🥷',   '0'],
  ['Renata Campos Lima',        'Renata',         'renata.campos@gmail.com',        '👩‍🎓', '2'],
  ['André Ferraz Oliveira',     'André',          'andre.ferraz@gmail.com',         '👨‍🎓', '0'],
  ['Claudia Borges Melo',       'Claudia',        'claudia.borges@gmail.com',       '👩‍💻', '2'],
  ['GatoGordinhoBR',            'GatoGordinhoBR', 'gatogordinho@hotmail.com',       '🐱',   '0'],
  ['Marcelo Batista Cruz',      'Marcelo',        'marcelo.batista@gmail.com',      '👨‍💻', '0'],
  ['Aline Moura Pinto',         'Aline',          'aline.moura@gmail.com',          '👩‍🎓', '1'],
  ['Fabio Cavalcanti Neto',     'Fabio',          'fabio.cavalcanti@gmail.com',     '👨‍🎓', '0'],
  ['TocinhoDaSorte',            'TocinhoDaSorte', 'tocinhoda@gmail.com',            '🐷',   '0'],
  ['Luciana Queiroz Alves',     'Lu',             'luciana.queiroz@hotmail.com',    '👩‍💻', '0'],
  ['Tiago Andrade Mendes',      'Tiago',          'tiago.andrade@gmail.com',        '👨‍💻', '0'],
];

export const SEED_STUDENTS: SeedUser[] = RAW_STUDENTS.map(([name, apelido, email, avatar, tier], idx) => ({
  id: String(10 + idx),
  name,
  apelido,
  email,
  password: 'senha123',
  role: 'student',
  avatar,
  ...TIERS[tier as keyof typeof TIERS],
}));

export const SEED_TEACHERS: SeedUser[] = [
  {
    id: '3', name: 'Rogério Pereira Junior', apelido: 'Rogério',
    email: 'rogerio.pereira@ifsc.edu.br', password: 'ifsc@2026',
    role: 'teacher', avatar: '👨‍🏫',
    level: 1, xp: 0, xpToNextLevel: 250, coins: 0, streak: 0, totalQuizzes: 0,
  },
  {
    id: '4', name: 'Marcos Moecke', apelido: 'Marcos',
    email: 'marcos.moecke@ifsc.edu.br', password: 'ifsc@2026',
    role: 'teacher', avatar: '👨‍🏫',
    level: 1, xp: 0, xpToNextLevel: 250, coins: 0, streak: 0, totalQuizzes: 0,
  },
  {
    id: '5', name: 'Alberto Torresini', apelido: 'Alberto',
    email: 'torresini.ederson@ifsc.edu.br', password: 'ifsc@2026',
    role: 'teacher', avatar: '👨‍🏫',
    level: 1, xp: 0, xpToNextLevel: 250, coins: 0, streak: 0, totalQuizzes: 0,
  },
];

// Feedback pool matches seed.js order exactly
// [rating, comment|null, updatedAt]
const FEEDBACK_POOL: [number, string | null, string][] = [
  [5, 'Simplesmente incrível! Uso todo dia',                             '2026-08-18T15:15:00.000Z'],
  [5, 'Adorei! O sistema de XP vicia demais',                           '2026-08-18T15:30:00.000Z'],
  [5, 'Melhor plataforma de estudos que já usei',                       '2026-08-18T15:45:00.000Z'],
  [5, 'O ranking é muito competitivo e divertido',                      '2026-08-18T15:50:00.000Z'],
  [5, 'Os quizzes são desafiadores, amei muito!',                       '2026-08-18T16:00:00.000Z'],
  [5, 'Perfeito para estudar de forma divertida!',                      '2026-08-18T16:10:00.000Z'],
  [4, 'Gostei muito da plataforma!',                                    '2026-08-18T16:20:00.000Z'],
  [4, 'Legal, bem divertido de usar',                                   '2026-08-18T16:30:00.000Z'],
  [4, 'As missões diárias são animadas',                                '2026-08-18T16:40:00.000Z'],
  [4, 'O sistema de gamificação é sensacional',                         '2026-08-18T16:50:00.000Z'],
  [4, 'Interface bem intuitiva e fácil de usar',                        '2026-08-18T17:00:00.000Z'],
  [4, 'Muito bom, recomendo para todos!',                               '2026-08-18T17:10:00.000Z'],
  [4, 'Ótima plataforma para estudar para o ENEM',                     '2026-08-18T17:20:00.000Z'],
  [4, 'Bem feito! Parabéns aos desenvolvedores',                        '2026-08-18T17:30:00.000Z'],
  [4, 'Gostei bastante, fácil de usar',                                 '2026-08-18T17:40:00.000Z'],
  [4, 'O sistema de conquistas é bacana',                               '2026-08-18T17:50:00.000Z'],
  [4, 'Muito útil! Já aprendi bastante aqui',                           '2026-08-18T18:00:00.000Z'],
  [4, null,                                                             '2026-08-18T18:10:00.000Z'],
  [4, 'Quero mais questões de programação!',                            '2026-08-18T18:20:00.000Z'],
  [4, 'Bem intuitivo e divertido',                                      '2026-08-18T18:30:00.000Z'],
  [4, 'O sistema de XP me motiva a continuar',                         '2026-08-18T18:40:00.000Z'],
  [4, null,                                                             '2026-08-18T18:50:00.000Z'],
  [4, 'Gostei bastante, continua assim!',                               '2026-08-18T19:00:00.000Z'],
  [4, 'As conquistas me motivam a não parar de estudar',               '2026-08-18T19:10:00.000Z'],
  [4, 'Legal! O ranking me faz querer estudar mais',                   '2026-08-18T19:20:00.000Z'],
  [4, 'Muito bom para revisar o conteúdo da escola',                   '2026-08-18T19:30:00.000Z'],
  [4, null,                                                             '2026-08-18T19:40:00.000Z'],
  [3, 'Poderia ter mais questões em cada quiz',                         '2026-08-18T20:00:00.000Z'],
  [3, 'Falta mais animações nas respostas',                             '2026-08-18T20:15:00.000Z'],
  [3, 'As perguntas poderiam ser mais engraçadas para engajamento',    '2026-08-18T20:30:00.000Z'],
  [3, 'Poderia ter mais categorias de quiz',                            '2026-08-19T14:50:00.000Z'],
  [3, 'Bom, o visual poderia ser mais chamativo',                       '2026-08-19T15:10:00.000Z'],
  [3, 'Bom, mas poderia ter mais conteúdo',                             '2026-08-19T15:30:00.000Z'],
  [3, 'Tem potencial, poderia ter mais questões difíceis',              '2026-08-19T15:50:00.000Z'],
  [2, 'Precisa melhorar bastante ainda',                                '2026-08-19T16:10:00.000Z'],
  [2, 'Achei um pouco simples, esperava mais',                          '2026-08-19T16:30:00.000Z'],
  [1, 'Não me engajou muito, poderia ser mais dinâmico',               '2026-08-19T16:50:00.000Z'],
];

// Indices of students (0-based) that receive a feedback (same as seed.js)
const FEEDBACK_INDICES = new Set([
  0,1,2,4,5,6,8,9,10,12,13,14,16,17,18,20,21,22,24,25,26,28,30,31,
  33,35,37,38,40,42,43,45,47,49,51,53,56,
]);

export const SEED_FEEDBACKS: SeedFeedback[] = [];
let fbIdx = 0;
for (let i = 0; i < RAW_STUDENTS.length; i++) {
  if (FEEDBACK_INDICES.has(i)) {
    const [rating, comment, updatedAt] = FEEDBACK_POOL[fbIdx++];
    SEED_FEEDBACKS.push({
      userId: String(10 + i),
      rating,
      comment: comment ?? '',
      updatedAt,
    });
  }
}
