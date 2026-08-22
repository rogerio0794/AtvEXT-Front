import { useLocation, useNavigate, Link } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Trophy, Target, Clock, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, questions, timeSpent } = location.state || {};

  if (!questions || !answers) {
    navigate('/quizzes');
    return null;
  }

  const correctAnswers = questions.filter((q: any, index: number) =>
    answers[index] === q.correct_alternative
  ).length;

  const wrongAnswers = questions.length - correctAnswers;
  const score = Math.round((correctAnswers / questions.length) * 100);
  const quizXp = location.state?.quiz?.xp_reward ?? 0;
  const xpEarned = quizXp > 0
    ? Math.round((correctAnswers / questions.length) * quizXp)
    : correctAnswers * 10;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const pieData = [
    { name: 'Corretas', value: correctAnswers, color: '#22c55e' },
    { name: 'Erradas', value: wrongAnswers, color: '#ef4444' },
  ];

  const barData = [
    { name: 'Acertos', value: correctAnswers },
    { name: 'Erros', value: wrongAnswers },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {score >= 70 ? '🎉' : score >= 50 ? '😊' : '😔'}
          </div>
          <h1 className="text-4xl mb-2">Quiz Finalizado!</h1>
          <p className="text-xl text-muted-foreground">
            {score >= 70 ? 'Parabéns! Excelente desempenho!' :
             score >= 50 ? 'Bom trabalho! Continue praticando!' :
             'Não desanime! Tente novamente!'}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm opacity-90 mb-1">Nota</p>
            <h2 className="text-4xl">{score}%</h2>
          </Card>

          <Card className="text-center bg-gradient-to-br from-success to-success/80 text-success-foreground">
            <Target className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm opacity-90 mb-1">Acertos</p>
            <h2 className="text-4xl">{correctAnswers}</h2>
          </Card>

          <Card className="text-center bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground">
            <Target className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm opacity-90 mb-1">Erros</p>
            <h2 className="text-4xl">{wrongAnswers}</h2>
          </Card>

          <Card className="text-center bg-gradient-to-br from-warning to-warning/80 text-warning-foreground">
            <Zap className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm opacity-90 mb-1">XP Ganho</p>
            <h2 className="text-4xl">{xpEarned}</h2>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl mb-4">Desempenho</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-xl mb-4">Distribuição</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground" />
              <span>Tempo gasto: {formatTime(timeSpent)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-warning" />
              <span>Total de XP: {xpEarned}</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-2)}>
            Refazer Quiz
          </Button>
          <Link to="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
