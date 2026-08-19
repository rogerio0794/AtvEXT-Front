import { createBrowserRouter } from 'react-router';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Missions } from './pages/Missions';
import { QuizSelection } from './pages/QuizSelection';
import { Quiz } from './pages/Quiz';
import { QuizResult } from './pages/QuizResult';
import { Ranking } from './pages/Ranking';
import { Achievements } from './pages/Achievements';
import { Profile } from './pages/Profile';
import { Reports } from './pages/Reports';
import { GamificationDemo } from './pages/GamificationDemo';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { TeacherUsers } from './pages/TeacherUsers';
import { TeacherQuizzes } from './pages/TeacherQuizzes';
import { TeacherQuestions } from './pages/TeacherQuestions';
import { TeacherReports } from './pages/TeacherReports';
import { Feedback } from './pages/Feedback';
import { TeacherFeedbacks } from './pages/TeacherFeedbacks';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/missions',
    Component: Missions,
  },
  {
    path: '/quizzes',
    Component: QuizSelection,
  },
  {
    path: '/quiz/:id',
    Component: Quiz,
  },
  {
    path: '/quiz/:id/result',
    Component: QuizResult,
  },
  {
    path: '/ranking',
    Component: Ranking,
  },
  {
    path: '/achievements',
    Component: Achievements,
  },
  {
    path: '/profile',
    Component: Profile,
  },
  {
    path: '/reports',
    Component: Reports,
  },
  {
    path: '/demo',
    Component: GamificationDemo,
  },
  {
    path: '/teacher/dashboard',
    Component: TeacherDashboard,
  },
  {
    path: '/teacher/users',
    Component: TeacherUsers,
  },
  {
    path: '/teacher/quizzes',
    Component: TeacherQuizzes,
  },
  {
    path: '/teacher/questions',
    Component: TeacherQuestions,
  },
  {
    path: '/teacher/reports',
    Component: TeacherReports,
  },
  {
    path: '/feedback',
    Component: Feedback,
  },
  {
    path: '/teacher/feedbacks',
    Component: TeacherFeedbacks,
  },
]);
