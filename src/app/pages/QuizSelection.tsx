import { useState } from 'react';
import { Link } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { quizzes } from '../data/mockData';
import { Clock, FileText, Award } from 'lucide-react';

export function QuizSelection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredQuizzes = quizzes.filter(quiz => {
    const categoryMatch = selectedCategory === 'all' || quiz.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

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
                  <option value="Matemática">Matemática</option>
                  <option value="Programação">Programação</option>
                  <option value="Redes">Redes</option>
                  <option value="Informática">Informática</option>
                  <option value="ENEM">ENEM</option>
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
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl flex-1">{quiz.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ml-2 ${
                      quiz.difficulty === 'Fácil' ? 'bg-success/20 text-success' :
                      quiz.difficulty === 'Médio' ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{quiz.category}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText size={16} />
                      <span>{quiz.questionsCount} questões</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={16} />
                      <span>{Math.floor(quiz.timeLimit / 60)} minutos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-warning">
                      <Award size={16} />
                      <span>{quiz.xpReward} XP</span>
                    </div>
                  </div>
                </div>

                <Link to={`/quiz/${quiz.id}`} className="mt-4">
                  <Button className="w-full">Iniciar Quiz</Button>
                </Link>
              </Card>
            ))}
          </div>

          {filteredQuizzes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum quiz encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
