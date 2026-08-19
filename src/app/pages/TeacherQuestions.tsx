import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { questions } from '../data/mockData';
import { Edit2, Trash2, Plus } from 'lucide-react';

export function TeacherQuestions() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">Gerenciar Questões</h1>
              <p className="text-muted-foreground">Adicione e edite questões para os quizzes</p>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="mr-2" size={20} />
              Nova Questão
            </Button>
          </div>

          {showCreateForm && (
            <Card className="mb-6">
              <h2 className="text-2xl mb-4">Criar Nova Questão</h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Quiz</label>
                  <select className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Álgebra Básica</option>
                    <option>Geometria Plana</option>
                    <option>JavaScript Fundamentals</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Contextualização</label>
                  <textarea
                    rows={4}
                    placeholder="Digite o contexto da questão..."
                    className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block mb-2">Enunciado</label>
                  <textarea
                    rows={3}
                    placeholder="Digite a pergunta..."
                    className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Alternativa A</label>
                    <input
                      type="text"
                      placeholder="Opção A"
                      className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Alternativa B</label>
                    <input
                      type="text"
                      placeholder="Opção B"
                      className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Alternativa C</label>
                    <input
                      type="text"
                      placeholder="Opção C"
                      className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Alternativa D</label>
                    <input
                      type="text"
                      placeholder="Opção D"
                      className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Alternativa E</label>
                    <input
                      type="text"
                      placeholder="Opção E"
                      className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Resposta Correta</label>
                    <select className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                      <option>D</option>
                      <option>E</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Explicação da Resposta</label>
                  <textarea
                    rows={3}
                    placeholder="Explique por que a resposta está correta..."
                    className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
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
                    <label className="block mb-2">XP Recompensa</label>
                    <input
                      type="number"
                      placeholder="10"
                      className="w-full px-4 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button>Criar Questão</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <h2 className="text-2xl mb-6">Lista de Questões</h2>
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="border border-border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          question.difficulty === 'Fácil' ? 'bg-success/20 text-success' :
                          question.difficulty === 'Médio' ? 'bg-warning/20 text-warning' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {question.difficulty}
                        </span>
                        <span className="text-sm text-muted-foreground">{question.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{question.context}</p>
                      <p className="mb-2">{question.question}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 hover:bg-muted rounded-lg text-primary">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg text-destructive">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {question.alternatives.map((alt) => (
                      <div
                        key={alt.id}
                        className={`p-2 rounded border ${
                          alt.id === question.correctAnswer
                            ? 'border-success bg-success/10'
                            : 'border-border'
                        }`}
                      >
                        <span className="font-medium">{alt.id.toUpperCase()}.</span> {alt.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
