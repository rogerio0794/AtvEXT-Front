import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { quizzes } from '../data/mockData';
import { Edit2, Trash2, Plus } from 'lucide-react';

export function TeacherQuizzes() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">Gerenciar Quizzes</h1>
              <p className="text-muted-foreground">Crie e gerencie os quizzes da plataforma</p>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="mr-2" size={20} />
              Novo Quiz
            </Button>
          </div>

          {showCreateForm && (
            <Card className="mb-6">
              <h2 className="text-2xl mb-4">Criar Novo Quiz</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Título</label>
                  <input
                    type="text"
                    placeholder="Nome do quiz"
                    className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block mb-2">Categoria</label>
                  <select className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Matemática</option>
                    <option>Programação</option>
                    <option>Redes</option>
                    <option>Informática</option>
                    <option>ENEM</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Dificuldade</label>
                  <select className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Fácil</option>
                    <option>Médio</option>
                    <option>Difícil</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Número de Questões</label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block mb-2">Tempo Limite (minutos)</label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block mb-2">XP Recompensa</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <Button>Criar Quiz</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </Card>
          )}

          <Card>
            <h2 className="text-2xl mb-6">Lista de Quizzes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Título</th>
                    <th className="text-left py-3 px-4">Categoria</th>
                    <th className="text-center py-3 px-4">Dificuldade</th>
                    <th className="text-center py-3 px-4">Questões</th>
                    <th className="text-center py-3 px-4">XP</th>
                    <th className="text-center py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{quiz.title}</td>
                      <td className="py-3 px-4">{quiz.category}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          quiz.difficulty === 'Fácil' ? 'bg-success/20 text-success' :
                          quiz.difficulty === 'Médio' ? 'bg-warning/20 text-warning' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {quiz.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">{quiz.questionsCount}</td>
                      <td className="py-3 px-4 text-center text-warning">{quiz.xpReward}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button className="p-2 hover:bg-muted rounded-lg text-primary">
                            <Edit2 size={18} />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg text-destructive">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
