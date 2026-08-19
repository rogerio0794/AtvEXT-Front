import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { ranking, currentUser } from '../data/mockData';
import { Trophy, Medal, Award } from 'lucide-react';

export function Ranking() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="student" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Ranking Geral</h1>
            <p className="text-muted-foreground">Veja sua posição entre os melhores estudantes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {ranking.slice(0, 3).map((entry, index) => {
              const icons = [Trophy, Medal, Award];
              const colors = ['text-warning', 'text-muted-foreground', 'text-orange-600'];
              const Icon = icons[index];

              return (
                <Card
                  key={entry.userId}
                  className={`text-center ${
                    index === 0 ? 'bg-gradient-to-br from-warning to-warning/80 text-warning-foreground' : ''
                  }`}
                >
                  <div className={`text-5xl mb-4 ${index === 0 ? '' : colors[index]}`}>
                    <Icon className="w-16 h-16 mx-auto" />
                  </div>
                  <div className="text-4xl mb-2">{entry.avatar}</div>
                  <h3 className="text-xl mb-1">{entry.name}</h3>
                  <p className={`text-sm mb-3 ${index === 0 ? 'opacity-90' : 'text-muted-foreground'}`}>
                    {entry.position}º Lugar
                  </p>
                  <div className="flex justify-center gap-4">
                    <div>
                      <p className={`text-2xl ${index === 0 ? '' : 'text-foreground'}`}>{entry.xp}</p>
                      <p className={`text-xs ${index === 0 ? 'opacity-90' : 'text-muted-foreground'}`}>XP</p>
                    </div>
                    <div>
                      <p className={`text-2xl ${index === 0 ? '' : 'text-foreground'}`}>Nv. {entry.level}</p>
                      <p className={`text-xs ${index === 0 ? 'opacity-90' : 'text-muted-foreground'}`}>Nível</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card>
            <h2 className="text-2xl mb-6">Classificação Completa</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Posição</th>
                    <th className="text-left py-3 px-4">Estudante</th>
                    <th className="text-center py-3 px-4">Nível</th>
                    <th className="text-center py-3 px-4">XP</th>
                    <th className="text-center py-3 px-4">Medalha</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((entry) => {
                    const isCurrentUser = entry.userId === currentUser.id;

                    return (
                      <tr
                        key={entry.userId}
                        className={`border-b border-border ${
                          isCurrentUser ? 'bg-primary/10' : 'hover:bg-muted/50'
                        }`}
                      >
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            entry.position <= 3 ? 'bg-warning text-warning-foreground' : 'bg-muted'
                          }`}>
                            {entry.position}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{entry.avatar}</span>
                            <div>
                              <p>{entry.name}</p>
                              {isCurrentUser && (
                                <p className="text-xs text-primary">Você</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full">
                            {entry.level}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-warning">{entry.xp}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {entry.position === 1 && <Trophy className="w-6 h-6 mx-auto text-warning" />}
                          {entry.position === 2 && <Medal className="w-6 h-6 mx-auto text-muted-foreground" />}
                          {entry.position === 3 && <Award className="w-6 h-6 mx-auto text-orange-600" />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
