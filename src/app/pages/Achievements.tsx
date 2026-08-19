import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { achievements } from '../data/mockData';
import { Lock } from 'lucide-react';

export function Achievements() {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="student" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Conquistas</h1>
            <p className="text-muted-foreground">
              {unlockedCount} de {achievements.length} conquistas desbloqueadas
            </p>
          </div>

          <Card className="mb-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <div className="text-center">
              <h2 className="text-2xl mb-2">Progresso de Conquistas</h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-64 h-4 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning transition-all duration-300"
                    style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                  />
                </div>
                <span>{Math.round((unlockedCount / achievements.length) * 100)}%</span>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`text-center ${
                  achievement.unlocked
                    ? 'border-success border-2'
                    : 'opacity-60 grayscale'
                }`}
              >
                <div className="text-6xl mb-4">
                  {achievement.unlocked ? achievement.icon : <Lock className="w-16 h-16 mx-auto text-muted-foreground" />}
                </div>
                <h3 className="text-xl mb-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {achievement.description}
                </p>
                {achievement.unlocked ? (
                  <span className="inline-block px-4 py-2 bg-success text-success-foreground rounded-full text-sm">
                    ✓ Desbloqueada
                  </span>
                ) : (
                  <div>
                    <span className="inline-block px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm">
                      🔒 Bloqueada
                    </span>
                    {achievement.xpRequired && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Requer {achievement.xpRequired} XP
                      </p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
