import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Clock, FileText, Award, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

interface ApiQuiz {
  id: number;
  title: string;
  description: string | null;
  category_name: string;
  category_icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  total_questions: number;
  xp_reward: number;
  coin_reward: number;
  time_limit: number;
  lastAttempt: { score: number; completed_at: string } | null;
}

const DIFF_LABEL: Record<string, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };
const DIFF_CLASS: Record<string, string> = {
  easy: 'bg-success/20 text-success',
  medium: 'bg-warning/20 text-warning',
  hard: 'bg-destructive/20 text-destructive',
};

export function QuizSelection() {
  const [quizzes, setQuizzes] = useState<ApiQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    api.get<{ quizzes: ApiQuiz[] }>('/api/quizzes?limit=50')
      .then(({ quizzes: q }) => setQuizzes(q))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() =>
    [...new Set(quizzes.map((q) => q.category_name))].sort(),
    [quizzes]
  );

  const filtered = useMemo(() => quizzes.filter((q) => {
    const catOk = selectedCategory === 'all' || q.category_name === selectedCategory;
    const diffOk = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return catOk && diffOk;
  }), [quizzes, selectedCategory, selectedDifficulty]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="student" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Escolha seu Quiz</h1>
            <p className="text-muted-foreground">Selecione um quiz e comece a aprender</p>
          </div>

          <Card className="mb-8">
            <h2 className="text-xl mb-4">Filtros</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm">Categoria</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Todas</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm">Dificuldade</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Todas</option>
                  <option value="easy">Fácil</option>
                  <option value="medium">Médio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => { setSelectedCategory('all'); setSelectedDifficulty('all'); }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </Card>

          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center py-16 text-muted-foreground gap-3">
              <AlertCircle className="w-10 h-10 text-destructive/60" />
              <p className="text-sm">Não foi possível carregar os quizzes.</p>
              <p className="text-xs text-destructive/70">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((quiz) => (
                <Card key={quiz.id} className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl flex-1 leading-snug">{quiz.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs ml-2 shrink-0 ${DIFF_CLASS[quiz.difficulty]}`}>
                        {DIFF_LABEL[quiz.difficulty]}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">
                      {quiz.category_icon} {quiz.category_name}
                    </p>
                    {quiz.description && (
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{quiz.description}</p>
                    )}

                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText size={15} />
                        <span>{quiz.total_questions} questões</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={15} />
                        <span>{quiz.time_limit} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-warning">
                        <Award size={15} />
                        <span>{quiz.xp_reward} XP</span>
                      </div>
                    </div>

                    {quiz.lastAttempt && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-success">
                        <CheckCircle2 size={13} />
                        <span>Última nota: {quiz.lastAttempt.score}%</span>
                      </div>
                    )}
                  </div>

                  <Link to={`/quiz/${quiz.id}`} className="mt-4">
                    <Button className="w-full">
                      {quiz.lastAttempt ? 'Refazer Quiz' : 'Iniciar Quiz'}
                    </Button>
                  </Link>
                </Card>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">Nenhum quiz encontrado com os filtros selecionados.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
