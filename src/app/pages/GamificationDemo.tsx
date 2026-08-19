import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { dailyMissions, currentUser, achievements } from '../data/mockData';
import { Sparkles, CheckCircle2, Clock, Coins, Zap } from 'lucide-react';

export function GamificationDemo() {
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    type: 'achievement' | 'mission' | 'levelUp';
    title: string;
    message: string;
    icon?: string;
  }>>([]);

  const addNotification = (type: 'achievement' | 'mission' | 'levelUp') => {
    const notificationExamples = {
      achievement: {
        title: '🏅 Conquista desbloqueada!',
        message: 'Mestre da Matemática',
        icon: '🏅',
      },
      mission: {
        title: '🎯 Missão concluída!',
        message: '+50 XP e +20 moedas',
        icon: '🎯',
      },
      levelUp: {
        title: '⭐ Parabéns!',
        message: 'Você alcançou o nível 8',
        icon: '⭐',
      },
    };

    const newNotification = {
      id: Date.now(),
      type,
      ...notificationExamples[type],
    };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="student" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-warning" />
              <h1 className="text-3xl">Sistema de Gamificação - Demo</h1>
            </div>
            <p className="text-muted-foreground">
              Demonstração de todos os componentes gamificados do QuizTech
            </p>
          </div>

          <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
            {notifications.map((notification) => {
              const colors = {
                achievement: 'from-warning to-warning/80',
                mission: 'from-success to-success/80',
                levelUp: 'from-primary to-primary/80',
              };

              return (
                <Card key={notification.id} className={`bg-gradient-to-r ${colors[notification.type]} text-white shadow-lg`}>
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{notification.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{notification.title}</h4>
                      <p className="text-sm opacity-90">{notification.message}</p>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="hover:bg-white/20 rounded-lg p-1 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="mb-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <h2 className="text-2xl mb-4">Teste as Notificações</h2>
            <p className="mb-4 opacity-90">
              Clique nos botões abaixo para visualizar as notificações gamificadas em ação:
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => addNotification('achievement')}
                className="!bg-warning !text-warning-foreground"
              >
                🏅 Simular Conquista
              </Button>
              <Button
                onClick={() => addNotification('mission')}
                className="!bg-success !text-success-foreground"
              >
                🎯 Simular Missão
              </Button>
              <Button
                onClick={() => addNotification('levelUp')}
                className="!bg-secondary !text-secondary-foreground"
              >
                ⭐ Simular Level Up
              </Button>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-2xl mb-4">Estatísticas do Usuário</h2>
              <Card>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Nível Atual</span>
                    <span className="text-2xl text-primary font-bold">
                      {currentUser.level}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>XP Total</span>
                      <span>{currentUser.xp} / {currentUser.xpToNextLevel}</span>
                    </div>
                    <ProgressBar value={currentUser.xp} max={currentUser.xpToNextLevel} color="primary" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Moedas</span>
                    <div className="flex items-center gap-2">
                      <Coins size={20} className="text-warning" />
                      <span className="text-warning font-medium">{currentUser.coins}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sequência</span>
                    <span className="flex items-center gap-1">
                      🔥 {currentUser.streak} dias
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conquistas</span>
                    <span>
                      {achievements.filter(a => a.unlocked).length} / {achievements.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Categoria Favorita</span>
                    <span>{currentUser.favoriteCategory}</span>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl mb-4">Componente de Moedas</h2>
              <Card>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tamanho Pequeno</p>
                    <div className="flex items-center gap-2">
                      <Coins size={16} className="text-warning" />
                      <span className="text-sm text-warning font-medium">450</span>
                      <span className="text-sm text-muted-foreground">moedas</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tamanho Médio</p>
                    <div className="flex items-center gap-2">
                      <Coins size={20} className="text-warning" />
                      <span className="text-base text-warning font-medium">1,250</span>
                      <span className="text-sm text-muted-foreground">moedas</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tamanho Grande</p>
                    <div className="flex items-center gap-2">
                      <Coins size={24} className="text-warning" />
                      <span className="text-xl text-warning font-medium">5,780</span>
                      <span className="text-sm text-muted-foreground">moedas</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl mb-4">Cards de Missões</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {dailyMissions.slice(0, 4).map((mission) => {
                const isCompleted = mission.status === 'completed';

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
          </div>

          <div className="mb-8">
            <h2 className="text-2xl mb-4">Barras de Progresso</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="mb-2">Progresso Primary</h3>
                <ProgressBar value={65} max={100} color="primary" showLabel />
              </Card>
              <Card>
                <h3 className="mb-2">Progresso Success</h3>
                <ProgressBar value={80} max={100} color="success" showLabel />
              </Card>
              <Card>
                <h3 className="mb-2">Progresso Warning</h3>
                <ProgressBar value={45} max={100} color="warning" showLabel />
              </Card>
              <Card>
                <h3 className="mb-2">Progresso Danger</h3>
                <ProgressBar value={25} max={100} color="danger" showLabel />
              </Card>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl mb-4">Conquistas - Preview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {achievements.slice(0, 3).map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`text-center ${
                    achievement.unlocked
                      ? 'border-success border-2 bg-gradient-to-br from-success/5 to-success/10'
                      : 'opacity-60 grayscale'
                  }`}
                >
                  <div className="text-6xl mb-4">{achievement.icon}</div>
                  <h3 className="text-xl mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {achievement.description}
                  </p>
                  {achievement.unlocked ? (
                    <span className="inline-block px-4 py-2 bg-success text-success-foreground rounded-full text-sm">
                      ✓ Desbloqueada
                    </span>
                  ) : (
                    <span className="inline-block px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm">
                      🔒 Bloqueada
                    </span>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-to-br from-warning to-warning/80 text-warning-foreground text-center">
            <h2 className="text-2xl mb-4">🎮 Sistema de Gamificação Completo!</h2>
            <p className="mb-6 opacity-90">
              Todos os componentes de gamificação foram implementados e estão prontos para uso.
              Navegue pelas páginas Missões, Conquistas e Perfil para ver tudo em ação!
            </p>
            <div className="flex justify-center gap-4">
              <a href="/missions">
                <Button className="!bg-white !text-warning">
                  Ver Missões
                </Button>
              </a>
              <a href="/achievements">
                <Button className="!bg-white !text-warning">
                  Ver Conquistas
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
