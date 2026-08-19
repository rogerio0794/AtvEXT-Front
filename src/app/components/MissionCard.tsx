import { ProgressBar } from './ProgressBar';
import { Card } from './Card';
import { CheckCircle2, Clock, Coins, Zap } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  coinReward: number;
  badgeReward?: string;
  status: 'in_progress' | 'completed';
  type: 'daily' | 'weekly';
}

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const isCompleted = mission.status === 'completed';

  return (
    <Card className={`${isCompleted ? 'border-success border-2 bg-success/5' : ''}`}>
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
}
