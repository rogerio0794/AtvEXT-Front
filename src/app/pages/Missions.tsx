import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { currentUser, dailyMissions } from '../data/mockData';
import { Flame, Target, Trophy, Coins, Zap, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router';

export function Missions() {
  const completedMissions = dailyMissions.filter(m => m.status === 'completed').length;
  const totalXpAvailable = dailyMissions
    .filter(m => m.status === 'in_progress')
    .reduce((sum, m) => sum + m.xpReward, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="student" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Missões Diárias</h1>
            <p className="text-muted-foreground">Complete missões e ganhe recompensas incríveis</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-success to-success/80 text-success-foreground text-center">
              <Target className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm opacity-90 mb-1">Missões Concluídas Hoje</p>
              <h2 className="text-4xl">{completedMissions}/{dailyMissions.length}</h2>
            </Card>

            <Card className="bg-gradient-to-br from-warning to-warning/80 text-warning-foreground text-center">
              <Trophy className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm opacity-90 mb-1">XP Disponível</p>
              <h2 className="text-4xl">{totalXpAvailable}</h2>
            </Card>

            <Card className="bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground text-center">
              <Flame className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm opacity-90 mb-1">Sequência</p>
              <h2 className="text-4xl">{currentUser.streak} dias</h2>
              <p className="text-xs opacity-90 mt-1">Continue estudando!</p>
            </Card>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl">Missões de Hoje</h2>
            <div className="flex items-center gap-2 text-warning">
              <Coins size={20} />
              <span className="font-medium">{currentUser.coins}</span>
              <span className="text-sm text-muted-foreground">moedas</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {dailyMissions.map((mission) => {
              const isCompleted = mission.status === 'completed';
              const progressPercentage = (mission.progress / mission.target) * 100;

              return (
                <Card key={mission.id} className={`${isCompleted ? 'border-success border-2 bg-success/5' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg">{mission.title}</h3>
                        {isCompleted && <CheckCircle2 className="text-success" size={20} />}
                      </div>
                      <p className="text-sm text-muted-foreground">{mission.description}</p>
                    </div>
                    {!isCompleted && (
                      <div className="ml-4 bg-muted px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock size={14} className="text-muted-foreground" />
                        <span className="text-xs">Hoje</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progresso</span>
                      <span>
                        {mission.progress} / {mission.target}
                      </span>
                    </div>
                    <ProgressBar
                      value={mission.progress}
                      max={mission.target}
                      color={isCompleted ? 'success' : 'primary'}
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-warning">
                      <Zap size={16} />
                      <span className="text-sm">+{mission.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-warning">
                      <Coins size={16} />
                      <span className="text-sm">+{mission.coinReward} moedas</span>
                    </div>
                    {mission.badgeReward && (
                      <div className="ml-auto text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                        🏅 {mission.badgeReward}
                      </div>
                    )}
                  </div>

                  {isCompleted && (
                    <div className="mt-3 text-center text-sm text-success font-medium">
                      ✓ Missão Concluída!
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-center">
            <h3 className="text-xl mb-2">🔥 Mantenha sua Sequência!</h3>
            <p className="opacity-90 mb-4">
              Você está estudando há {currentUser.streak} dias consecutivos. Seu recorde é de {currentUser.bestStreak} dias!
            </p>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    i < currentUser.streak ? 'bg-warning' : 'bg-white/20'
                  }`}
                >
                  {i < currentUser.streak ? '🔥' : '⭕'}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
