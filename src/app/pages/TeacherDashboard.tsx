import { Link } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { teacherStats } from '../data/mockData';
import { Users, FileText, HelpCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function TeacherDashboard() {
  const performanceData = [
    { category: 'Matemática', media: 75 },
    { category: 'Programação', media: 82 },
    { category: 'Redes', media: 68 },
    { category: 'Informática', media: 85 },
    { category: 'ENEM', media: 71 },
  ];

  const monthlyData = [
    { mes: 'Jan', alunos: 120 },
    { mes: 'Fev', alunos: 135 },
    { mes: 'Mar', alunos: 142 },
    { mes: 'Abr', alunos: 150 },
    { mes: 'Mai', alunos: 156 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Dashboard do Professor</h1>
            <p className="text-muted-foreground">Gerencie sua plataforma e acompanhe o desempenho dos alunos</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <Users className="w-12 h-12 mb-2" />
              <p className="text-sm opacity-90 mb-1">Total de Alunos</p>
              <h2 className="text-4xl">{teacherStats.totalStudents}</h2>
            </Card>

            <Card className="bg-gradient-to-br from-success to-success/80 text-success-foreground">
              <FileText className="w-12 h-12 mb-2" />
              <p className="text-sm opacity-90 mb-1">Total de Quizzes</p>
              <h2 className="text-4xl">{teacherStats.totalQuizzes}</h2>
            </Card>

            <Card className="bg-gradient-to-br from-warning to-warning/80 text-warning-foreground">
              <HelpCircle className="w-12 h-12 mb-2" />
              <p className="text-sm opacity-90 mb-1">Total de Questões</p>
              <h2 className="text-4xl">{teacherStats.totalQuestions}</h2>
            </Card>

            <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
              <TrendingUp className="w-12 h-12 mb-2" />
              <p className="text-sm opacity-90 mb-1">Média Geral</p>
              <h2 className="text-4xl">{teacherStats.averageScore}%</h2>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <h2 className="text-2xl mb-6">Média de Acertos por Categoria</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart key="performance-bar" data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="media" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h2 className="text-2xl mb-6">Crescimento de Alunos</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart key="monthly-line" data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="alunos" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/teacher/users">
              <Card hover className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl mb-2">Gerenciar Usuários</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize e gerencie todos os usuários da plataforma
                </p>
              </Card>
            </Link>

            <Link to="/teacher/quizzes">
              <Card hover className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-success" />
                <h3 className="text-xl mb-2">Gerenciar Quizzes</h3>
                <p className="text-sm text-muted-foreground">
                  Crie, edite e exclua quizzes
                </p>
              </Card>
            </Link>

            <Link to="/teacher/questions">
              <Card hover className="text-center">
                <HelpCircle className="w-16 h-16 mx-auto mb-4 text-warning" />
                <h3 className="text-xl mb-2">Gerenciar Questões</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione e edite questões nos quizzes
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
