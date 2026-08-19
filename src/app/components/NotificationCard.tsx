import { X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationCardProps {
  type: 'achievement' | 'mission' | 'levelUp';
  title: string;
  message: string;
  icon?: string;
  onClose?: () => void;
}

export function NotificationCard({ type, title, message, icon, onClose }: NotificationCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const colors = {
    achievement: 'from-warning to-warning/80',
    mission: 'from-success to-success/80',
    levelUp: 'from-primary to-primary/80',
  };

  const icons = {
    achievement: '🏅',
    mission: '🎯',
    levelUp: '⭐',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`bg-gradient-to-r ${colors[type]} text-white rounded-xl p-4 shadow-lg max-w-sm`}
        >
          <div className="flex items-start gap-3">
            <div className="text-4xl">{icon || icons[type]}</div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">{title}</h4>
              <p className="text-sm opacity-90">{message}</p>
            </div>
            {onClose && (
              <button
                onClick={handleClose}
                className="hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
