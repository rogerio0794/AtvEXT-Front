import { Link } from 'react-router';
import { Button } from '../components/Button';
import { Trophy, Target, Zap } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-white">
          <h1 className="text-3xl">QuizTech</h1>
          <p className="text-sm opacity-90">Aprenda Jogando</p>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="outline" className="!text-white !border-white hover:!bg-white hover:!text-primary">
              Entrar
            </Button>
          </Link>
          <Link to="/register">
            <Button className="!bg-white !text-primary hover:!bg-opacity-90">
              Criar Conta
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center text-white mb-16">
          <h2 className="text-5xl mb-6">Aprenda de Forma Divertida e Gamificada</h2>
          <p className="text-xl mb-8 opacity-90">
            Estude Matemática, Programação, Redes e muito mais através de quizzes interativos
          </p>
          <Link to="/register">
            <Button size="lg" className="!bg-warning !text-warning-foreground hover:!bg-opacity-90">
              Começar Agora
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <Target className="w-12 h-12 mb-4" />
            <h3 className="text-xl mb-2">Aprendizado Focado</h3>
            <p className="opacity-90">Escolha entre Matemática, Programação, Redes e ENEM</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <Trophy className="w-12 h-12 mb-4" />
            <h3 className="text-xl mb-2">Sistema de Ranking</h3>
            <p className="opacity-90">Compete com outros estudantes e alcance o topo</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <Zap className="w-12 h-12 mb-4" />
            <h3 className="text-xl mb-2">Ganhe XP</h3>
            <p className="opacity-90">Suba de nível e desbloqueie conquistas</p>
          </div>
        </div>
      </div>

      <footer className="bg-black/20 text-white py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2026 QuizTech. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
