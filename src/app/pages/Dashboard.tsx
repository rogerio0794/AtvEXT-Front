import { Link } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { categories } from '../data/mockData';
import { Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const displayUser = user ?? { name: 'Aluno', apelido: undefined, level: 1, xp: 0, xpToNextLevel: 250, avatar: '🎓', coins: 0, streak: 0 };
  const greeting = displayUser.apelido || displayUser.name.split(' ')[0];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole={user?.role ?? 'student'} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">Olá, {greeting}! 👋</h1>
              <p className="text-muted-foreground">Continue sua jornada de aprendizado</p>
            </div>
            <Link to="/demo">
              <button className="px-4 py-2 bg-warning text-warning-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                ✨ Ver Sistema de Gamificação
              </button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-warning to-warning/80 text-warning-foreground">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90">Nível Atual</p>
                  <h2 className="text-4xl">{displayUser.level}</h2>
                </div>
                <div className="text-6xl">{displayUser.avatar}</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>XP: {displayUser.xp}</span>
                  <span>{displayUser.xpToNextLevel}</span>
                </div>
                <ProgressBar
                  value={displayUser.xp}
                  max={displayUser.xpToNextLevel}
                  color="warning"
                />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-success to-success/80 text-success-foreground">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Total XP</p>
                  <h2 className="text-3xl">{displayUser.xp}</h2>
                </div>
              </div>
              <p className="text-sm opacity-90">Continue completando quizzes para ganhar mais XP!</p>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <div className="mb-2">
                <p className="text-sm opacity-90">Próximo Nível</p>
                <h2 className="text-3xl">Nível {displayUser.level + 1}</h2>
              </div>
              <p className="text-sm opacity-90">
                Faltam {displayUser.xpToNextLevel - displayUser.xp} XP
              </p>
            </Card>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl mb-4">Categorias</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/quizzes?category=${category.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-xl">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.questionsCount} questões</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dificuldade:</span>
                      <span className={`
                        ${category.difficulty === 'Fácil' ? 'text-success' : ''}
                        ${category.difficulty === 'Médio' ? 'text-warning' : ''}
                        ${category.difficulty === 'Difícil' ? 'text-destructive' : ''}
                      `}>
                        {category.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progresso</span>
                      <span>{category.progress}%</span>
                    </div>
                    <ProgressBar value={category.progress} color="success" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
