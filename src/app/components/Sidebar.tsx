import { Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  FileText,
  Trophy,
  Award,
  BarChart3,
  User,
  LogOut,
  Target,
  Star,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  userRole?: 'student' | 'teacher';
}

export function Sidebar({ userRole = 'student' }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = user?.role ?? userRole;

  const studentMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Quizzes', path: '/quizzes' },
    { icon: Target, label: 'Missões', path: '/missions' },
    { icon: Trophy, label: 'Ranking', path: '/ranking' },
    { icon: Award, label: 'Conquistas', path: '/achievements' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: User, label: 'Perfil', path: '/profile' },
    { icon: Star, label: 'Avaliar', path: '/feedback' },
  ];

  const teacherMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard' },
    { icon: User, label: 'Usuários', path: '/teacher/users' },
    { icon: FileText, label: 'Quizzes', path: '/teacher/quizzes' },
    { icon: FileText, label: 'Questões', path: '/teacher/questions' },
    { icon: BarChart3, label: 'Relatórios', path: '/teacher/reports' },
    { icon: Trophy, label: 'Ranking', path: '/ranking' },
    { icon: Star, label: 'Avaliações', path: '/teacher/feedbacks' },
  ];

  const menu = role === 'teacher' ? teacherMenu : studentMenu;

  const displayName = user?.apelido || user?.name?.split(' ')[0] || 'Usuário';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl mb-1">QuizTech</h1>
        <p className="text-sm text-sidebar-foreground/70">Aprenda Jogando</p>
      </div>

      {user && (
        <div className="mb-6 p-3 bg-sidebar-accent rounded-lg flex items-center gap-3">
          <span className="text-2xl">{user.avatar}</span>
          <div className="overflow-hidden">
            <p className="text-sm truncate leading-tight">{displayName}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {role === 'teacher' ? 'Professor' : `Nv. ${user.level} · ${user.xp} XP`}
            </p>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent text-sidebar-foreground/90'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/90 mt-auto w-full text-left"
      >
        <LogOut size={20} />
        <span>Sair</span>
      </button>
    </aside>
  );
}
