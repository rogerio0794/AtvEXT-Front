import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function Reports() {
  const categoryData = [
    { category: 'Matemática', acertos: 75 },
    { category: 'Programação', acertos: 85 },
    { category: 'Redes', acertos: 70 },
    { category: 'Informática', acertos: 90 },
    { category: 'ENEM', acertos: 65 },
  ];

  const evolutionData = [
    { mes: 'Jan', xp: 500 },
    { mes: 'Fev', xp: 800 },
    { mes: 'Mar', xp: 1200 },
    { mes: 'Abr', xp: 2000 },
    { mes: 'Mai', xp: 2850 },
  ];

  const radarData = [
    { skill: 'Matemática', value: 75 },
    { skill: 'Programação', value: 85 },
    { skill: 'Redes', value: 70 },
    { skill: 'Informática', value: 90 },
    { skill: 'ENEM', value: 65 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="student" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Relatórios de Desempenho</h1>
            <p className="text-muted-foreground">Acompanhe sua evolução e identifique pontos de melhoria</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <p className="text-sm opacity-90 mb-1">Total de Quizzes</p>
              <h2 className="text-4xl">24</h2>
            </Card>

            <Card className="text-center bg-gradient-to-br from-success to-success/80 text-success-foreground">
              <p className="text-sm opacity-90 mb-1">Média de Acertos</p>
              <h2 className="text-4xl">77%</h2>
            </Card>

            <Card className="text-center bg-gradient-to-br from-warning to-warning/80 text-warning-foreground">
              <p className="text-sm opacity-90 mb-1">XP Total</p>
              <h2 className="text-4xl">2850</h2>
            </Card>

            <Card className="text-center bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
              <p className="text-sm opacity-90 mb-1">Ranking</p>
              <h2 className="text-4xl">4º</h2>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <h2 className="text-2xl mb-6">Acertos por Categoria</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart key="cat-bar" data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="acertos" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h2 className="text-2xl mb-6">Evolução de XP</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart key="evolution-line" data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="xp" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-2xl mb-6">Radar de Habilidades</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart key="skills-radar" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis />
                  <Radar name="Desempenho" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h2 className="text-2xl mb-6">Análise Detalhada</h2>
              <div className="space-y-4">
                {categoryData.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between mb-2">
                      <span>{item.category}</span>
                      <span className={`${
                        item.acertos >= 80 ? 'text-success' :
                        item.acertos >= 60 ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {item.acertos}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.acertos >= 80 ? 'bg-success' :
                          item.acertos >= 60 ? 'bg-warning' :
                          'bg-destructive'
                        }`}
                        style={{ width: `${item.acertos}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
