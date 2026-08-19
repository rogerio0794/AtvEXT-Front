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


const RAW_STUDENTS: [string, string, string, string, string][] = [
  // ── GROUP 1 (0-17) ──
  ['Ana Carolina Silva',        'Ana Carolina',   'ana.carolina@gmail.com',        '👩‍🎓', '5']]

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
