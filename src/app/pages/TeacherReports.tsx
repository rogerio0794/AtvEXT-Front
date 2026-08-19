import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function TeacherReports() {
  const categoryPerformance = [
    { category: 'Matemática', media: 75, alunos: 142 },
    { category: 'Programação', media: 82, alunos: 98 },
    { category: 'Redes', media: 68, alunos: 75 },
    { category: 'Informática', media: 85, alunos: 121 },
    { category: 'ENEM', media: 71, alunos: 156 },
  ];

  const monthlyProgress = [
    { mes: 'Jan', media: 70 },
    { mes: 'Fev', media: 72 },
    { mes: 'Mar', media: 74 },
    { mes: 'Abr', media: 75 },
    { mes: 'Mai', media: 77 },
  ];

  const difficultyData = [
    { name: 'Fácil', value: 85, color: '#22c55e' },
    { name: 'Médio', value: 72, color: '#fbbf24' },
    { name: 'Difícil', value: 58, color: '#ef4444' },
  ];

  const topStudents = [
    { name: 'Carlos Eduardo', xp: 5200, quizzes: 48 },
    { name: 'Maria Santos', xp: 4850, quizzes: 45 },
    { name: 'João Pedro', xp: 4500, quizzes: 42 },
    { name: 'Ana Silva', xp: 2850, quizzes: 24 },
    { name: 'Lucas Oliveira', xp: 2600, quizzes: 22 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Relatórios e Análises</h1>
            <p className="text-muted-foreground">Acompanhe o desempenho geral dos alunos</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <p className="text-sm opacity-90 mb-1">Média Geral</p>
              <h2 className="text-4xl">76.5%</h2>
            </Card>

            <Card className="text-center bg-gradient-to-br from-success to-success/80 text-success-foreground">
              <p className="text-sm opacity-90 mb-1">Taxa de Aprovação</p>
              <h2 className="text-4xl">88%</h2>
            </Card>

            <Card className="text-center bg-gradient-to-br from-warning to-warning/80 text-warning-foreground">
              <p className="text-sm opacity-90 mb-1">Quizzes Completos</p>
              <h2 className="text-4xl">3.842</h2>
            </Card>

            <Card className="text-center bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
              <p className="text-sm opacity-90 mb-1">Engajamento</p>
              <h2 className="text-4xl">92%</h2>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <h2 className="text-2xl mb-6">Desempenho por Categoria</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart key="cat-perf-bar" data={categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="media" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h2 className="text-2xl mb-6">Evolução Mensal da Média</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart key="monthly-prog-line" data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="media" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h2 className="text-2xl mb-6">Acertos por Dificuldade</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart key="difficulty-pie">
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h2 className="text-2xl mb-6">Top 5 Estudantes</h2>
              <div className="space-y-3">
                {topStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-warning text-warning-foreground' :
                        index === 1 ? 'bg-muted-foreground text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-primary text-primary-foreground'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p>{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.quizzes} quizzes completos</p>
                      </div>
                    </div>
                    <span className="text-warning">{student.xp} XP</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h2 className="text-2xl mb-6">Análise Detalhada por Categoria</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Categoria</th>
                    <th className="text-center py-3 px-4">Média de Acertos</th>
                    <th className="text-center py-3 px-4">Alunos Ativos</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryPerformance.map((cat) => (
                    <tr key={cat.category} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{cat.category}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          cat.media >= 80 ? 'bg-success/20 text-success' :
                          cat.media >= 60 ? 'bg-warning/20 text-warning' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {cat.media}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">{cat.alunos}</td>
                      <td className="py-3 px-4 text-center">
                        {cat.media >= 75 ? '✓ Excelente' :
                         cat.media >= 60 ? '⚠ Atenção' :
                         '✗ Crítico'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
