export interface User {
  id: string;
  name: string;
  apelido?: string;
  email: string;
  role: 'student' | 'teacher';
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  streak: number;
  totalQuizzes: number;
  totalCorrectAnswers: number;
  bestStreak: number;
  favoriteCategory: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  questionsCount: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  progress: number;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  questionsCount: number;
  timeLimit: number;
  xpReward: number;
}

export interface Question {
  id: string;
  quizId: string;
  context: string;
  question: string;
  alternatives: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  xpReward: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xpRequired?: number;
  unlockedAt?: string;
  category?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  coinReward: number;
  badgeReward?: string;
  status: 'in_progress' | 'completed';
  type: 'daily' | 'weekly';
}

export interface RankingEntry {
  position: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  xpEarned: number;
  date: string;
}

export const currentUser: User = {
  id: '1',
  name: 'Ana Silva',
  apelido: 'Ana',
  email: 'ana.silva@email.com',
  role: 'student',
  avatar: '👩‍🎓',
  level: 12,
  xp: 2850,
  xpToNextLevel: 3000,
  coins: 450,
  streak: 5,
  totalQuizzes: 24,
  totalCorrectAnswers: 185,
  bestStreak: 12,
  favoriteCategory: 'Programação',
};

export const categories: Category[] = [
  {
    id: 'math',
    name: 'Matemática',
    icon: '📐',
    color: 'bg-blue-500',
    questionsCount: 450,
    difficulty: 'Médio',
    progress: 65,
  },
  {
    id: 'computing',
    name: 'Informática',
    icon: '💻',
    color: 'bg-purple-500',
    questionsCount: 320,
    difficulty: 'Fácil',
    progress: 80,
  },
  {
    id: 'programming',
    name: 'Programação',
    icon: '⌨️',
    color: 'bg-green-500',
    questionsCount: 280,
    difficulty: 'Difícil',
    progress: 45,
  },
  {
    id: 'networks',
    name: 'Redes',
    icon: '🌐',
    color: 'bg-orange-500',
    questionsCount: 200,
    difficulty: 'Médio',
    progress: 55,
  },
  {
    id: 'enem',
    name: 'ENEM',
    icon: '📚',
    color: 'bg-red-500',
    questionsCount: 600,
    difficulty: 'Médio',
    progress: 70,
  },
];

export const quizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Álgebra Básica',
    category: 'Matemática',
    difficulty: 'Fácil',
    questionsCount: 10,
    timeLimit: 600,
    xpReward: 100,
  },
  {
    id: 'quiz-2',
    title: 'Geometria Plana',
    category: 'Matemática',
    difficulty: 'Médio',
    questionsCount: 15,
    timeLimit: 900,
    xpReward: 200,
  },
  {
    id: 'quiz-3',
    title: 'JavaScript Fundamentals',
    category: 'Programação',
    difficulty: 'Fácil',
    questionsCount: 12,
    timeLimit: 720,
    xpReward: 120,
  },
  {
    id: 'quiz-4',
    title: 'React Avançado',
    category: 'Programação',
    difficulty: 'Difícil',
    questionsCount: 20,
    timeLimit: 1200,
    xpReward: 300,
  },
  {
    id: 'quiz-5',
    title: 'Protocolos de Rede',
    category: 'Redes',
    difficulty: 'Médio',
    questionsCount: 15,
    timeLimit: 900,
    xpReward: 200,
  },
];

export const questions: Question[] = [
  {
    id: 'q1',
    quizId: 'quiz-1',
    context: 'Em uma empresa de tecnologia, a equipe de desenvolvimento precisa calcular o tempo total gasto em um projeto. Cada desenvolvedor trabalhou 8 horas por dia durante 5 dias. A equipe possui 6 desenvolvedores.',
    question: 'Qual foi o total de horas trabalhadas pela equipe no projeto?',
    alternatives: [
      { id: 'a', text: '240 horas' },
      { id: 'b', text: '180 horas' },
      { id: 'c', text: '200 horas' },
      { id: 'd', text: '300 horas' },
      { id: 'e', text: '250 horas' },
    ],
    correctAnswer: 'a',
    explanation: 'Total de horas = 6 desenvolvedores × 8 horas/dia × 5 dias = 240 horas. Cada desenvolvedor trabalhou 40 horas (8×5), multiplicando por 6 desenvolvedores temos 240 horas totais.',
    category: 'Matemática',
    difficulty: 'Fácil',
    xpReward: 10,
  },
  {
    id: 'q2',
    quizId: 'quiz-1',
    context: 'Uma loja online oferece desconto progressivo: 10% para compras acima de R$ 100, 15% para compras acima de R$ 200 e 20% para compras acima de R$ 300.',
    question: 'Se um cliente compra produtos no valor total de R$ 350, quanto ele pagará após o desconto?',
    alternatives: [
      { id: 'a', text: 'R$ 280,00' },
      { id: 'b', text: 'R$ 297,50' },
      { id: 'c', text: 'R$ 315,00' },
      { id: 'd', text: 'R$ 262,50' },
      { id: 'e', text: 'R$ 300,00' },
    ],
    correctAnswer: 'a',
    explanation: 'Como a compra é de R$ 350 (acima de R$ 300), o desconto aplicado é de 20%. Cálculo: 350 × 0,20 = 70 (desconto). Valor final: 350 - 70 = R$ 280,00.',
    category: 'Matemática',
    difficulty: 'Fácil',
    xpReward: 10,
  },
  {
    id: 'q3',
    quizId: 'quiz-3',
    context: 'Em JavaScript, existem diferentes formas de declarar variáveis. As palavras-chave var, let e const possuem comportamentos distintos em relação ao escopo e reatribuição.',
    question: 'Qual é a principal diferença entre let e const?',
    alternatives: [
      { id: 'a', text: 'let é usado para números e const para strings' },
      { id: 'b', text: 'const não permite reatribuição, let permite' },
      { id: 'c', text: 'let tem escopo global, const tem escopo local' },
      { id: 'd', text: 'const é mais rápido que let' },
      { id: 'e', text: 'Não há diferença entre eles' },
    ],
    correctAnswer: 'b',
    explanation: 'A principal diferença é que variáveis declaradas com const não podem ser reatribuídas após a inicialização, enquanto variáveis let podem ter seu valor alterado. Ambas possuem escopo de bloco.',
    category: 'Programação',
    difficulty: 'Fácil',
    xpReward: 10,
  },
];

export const achievements: Achievement[] = [
  {
    id: 'first-quiz',
    title: 'Primeiro Quiz',
    description: 'Concluiu o primeiro quiz',
    icon: '🥉',
    unlocked: true,
    unlockedAt: '2026-05-15',
    category: 'Iniciante',
  },
  {
    id: 'dedicated-beginner',
    title: 'Iniciante Dedicado',
    description: 'Concluiu 10 quizzes',
    icon: '📚',
    unlocked: true,
    unlockedAt: '2026-05-20',
    category: 'Progresso',
  },
  {
    id: 'perfect-sequence',
    title: 'Sequência Impecável',
    description: 'Acertou 10 questões consecutivas',
    icon: '⚡',
    unlocked: true,
    unlockedAt: '2026-05-22',
    category: 'Desempenho',
  },
  {
    id: 'math-master',
    title: 'Mestre da Matemática',
    description: 'Obteve 90% de aproveitamento em Matemática',
    icon: '📐',
    unlocked: false,
    category: 'Categoria',
  },
  {
    id: 'network-master',
    title: 'Mestre das Redes',
    description: 'Obteve 90% de aproveitamento em Redes de Computadores',
    icon: '🌐',
    unlocked: false,
    category: 'Categoria',
  },
  {
    id: 'junior-programmer',
    title: 'Programador Júnior',
    description: 'Concluiu 20 quizzes de Programação',
    icon: '💻',
    unlocked: false,
    category: 'Categoria',
  },
  {
    id: 'it-legend',
    title: 'Lenda da Informática',
    description: 'Alcançou nível máximo na categoria Informática',
    icon: '🏆',
    unlocked: false,
    category: 'Elite',
  },
  {
    id: 'ranking-king',
    title: 'Rei do Ranking',
    description: 'Permaneceu em primeiro lugar durante uma semana',
    icon: '👑',
    unlocked: false,
    category: 'Elite',
  },
  {
    id: 'xp-1000',
    title: '1000 XP',
    description: 'Alcance 1000 pontos de experiência',
    icon: '⭐',
    unlocked: true,
    unlockedAt: '2026-05-25',
    category: 'Progresso',
  },
  {
    id: 'xp-5000',
    title: '5000 XP',
    description: 'Alcance 5000 pontos de experiência',
    icon: '🌟',
    unlocked: false,
    category: 'Progresso',
  },
];

export const ranking: RankingEntry[] = [
  {
    position: 1,
    userId: '2',
    name: 'Carlos Eduardo',
    avatar: '👨‍💻',
    xp: 5200,
    level: 18,
  },
  {
    position: 2,
    userId: '3',
    name: 'Maria Santos',
    avatar: '👩‍🔬',
    xp: 4850,
    level: 17,
  },
  {
    position: 3,
    userId: '4',
    name: 'João Pedro',
    avatar: '👨‍🎓',
    xp: 4500,
    level: 16,
  },
  {
    position: 4,
    userId: '1',
    name: 'Ana Silva',
    avatar: '👩‍🎓',
    xp: 2850,
    level: 12,
  },
  {
    position: 5,
    userId: '5',
    name: 'Lucas Oliveira',
    avatar: '👨‍💼',
    xp: 2600,
    level: 11,
  },
];

export const quizResults: QuizResult[] = [
  {
    quizId: 'quiz-1',
    score: 80,
    correctAnswers: 8,
    wrongAnswers: 2,
    timeSpent: 420,
    xpEarned: 80,
    date: '2026-05-25',
  },
  {
    quizId: 'quiz-3',
    score: 90,
    correctAnswers: 11,
    wrongAnswers: 1,
    timeSpent: 580,
    xpEarned: 110,
    date: '2026-05-28',
  },
];

export const teacherStats = {
  totalStudents: 156,
  totalQuizzes: 48,
  totalQuestions: 842,
  averageScore: 76.5,
};

export const dailyMissions: Mission[] = [
  {
    id: 'daily-math',
    title: 'Matemático do Dia',
    description: 'Resolva 5 questões de Matemática',
    progress: 3,
    target: 5,
    xpReward: 50,
    coinReward: 20,
    status: 'in_progress',
    type: 'daily',
  },
  {
    id: 'daily-sequence',
    title: 'Sequência Perfeita',
    description: 'Acerte 3 questões consecutivas',
    progress: 2,
    target: 3,
    xpReward: 75,
    coinReward: 25,
    badgeReward: 'Medalha Especial',
    status: 'in_progress',
    type: 'daily',
  },
  {
    id: 'daily-perfect',
    title: 'Sem Erros',
    description: 'Conclua um quiz inteiro sem errar nenhuma questão',
    progress: 0,
    target: 1,
    xpReward: 150,
    coinReward: 50,
    badgeReward: 'Badge Exclusivo',
    status: 'in_progress',
    type: 'daily',
  },
  {
    id: 'daily-hard',
    title: 'Desafio Difícil',
    description: 'Resolva uma questão classificada como Difícil',
    progress: 1,
    target: 1,
    xpReward: 100,
    coinReward: 30,
    status: 'completed',
    type: 'daily',
  },
  {
    id: 'daily-study',
    title: 'Estudante Dedicado',
    description: 'Complete 2 quizzes hoje',
    progress: 1,
    target: 2,
    xpReward: 80,
    coinReward: 35,
    status: 'in_progress',
    type: 'daily',
  },
];
