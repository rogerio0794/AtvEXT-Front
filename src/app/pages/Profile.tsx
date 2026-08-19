import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { quizResults } from '../data/mockData';
import { Mail, User, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Profile() {
  const { user, updateUser } = useAuth();
  const displayUser = user ?? { name: '', apelido: '', email: '', avatar: '🎓', level: 1, xp: 0, coins: 0 };

  const [name, setName] = useState(displayUser.name);
  const [apelido, setApelido] = useState(displayUser.apelido ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, apelido: apelido || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole={user?.role ?? 'student'} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Meu Perfil</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="text-center">
                <div className="text-8xl mb-4">{displayUser.avatar}</div>
                <h2 className="text-2xl mb-1">{apelido || displayUser.name.split(' ')[0]}</h2>
                <p className="text-sm text-muted-foreground mb-1">{displayUser.name}</p>
                <p className="text-muted-foreground mb-4">{displayUser.email}</p>
                <div className="flex justify-center gap-4 mb-4">
                  <div>
                    <p className="text-3xl text-primary">Nv. {displayUser.level}</p>
                    <p className="text-sm text-muted-foreground">Nível</p>
                  </div>
                  <div>
                    <p className="text-3xl text-warning">{displayUser.xp}</p>
                    <p className="text-sm text-muted-foreground">XP</p>
                  </div>
                </div>
                <Button className="w-full">Alterar Avatar</Button>
              </Card>

              <Card className="mt-6">
                <h3 className="text-lg mb-4">Estatísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quizzes Completos</span>
                    <span>{quizResults.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Média de Acertos</span>
                    <span>85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conquistas</span>
                    <span>3/6</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
              <Card>
                <h2 className="text-2xl mb-6">Informações Pessoais</h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <Input
                    label="Nome Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User size={20} />}
                  />
                  <Input
                    label="Apelido"
                    placeholder="Como prefere ser chamado(a)"
                    value={apelido}
                    onChange={(e) => setApelido(e.target.value)}
                    icon={<Tag size={20} />}
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    defaultValue={displayUser.email}
                    icon={<Mail size={20} />}
                    disabled
                  />
                  <div className="flex gap-4 items-center">
                    <Button type="submit">Salvar Alterações</Button>
                    {saved && <span className="text-success text-sm">✓ Salvo com sucesso!</span>}
                  </div>
                </form>
              </Card>

              <Card>
                <h2 className="text-2xl mb-6">Alterar Senha</h2>
                <div className="space-y-4">
                  <Input
                    label="Senha Atual"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Input
                    label="Nova Senha"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Input
                    label="Confirmar Nova Senha"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Button>Atualizar Senha</Button>
                </div>
              </Card>

              <Card>
                <h2 className="text-2xl mb-6">Histórico de Quizzes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Data</th>
                        <th className="text-left py-3 px-4">Quiz</th>
                        <th className="text-center py-3 px-4">Nota</th>
                        <th className="text-center py-3 px-4">XP Ganho</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.map((result, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{result.date}</td>
                          <td className="py-3 px-4">Quiz {result.quizId}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              result.score >= 70 ? 'bg-success/20 text-success' :
                              result.score >= 50 ? 'bg-warning/20 text-warning' :
                              'bg-destructive/20 text-destructive'
                            }`}>
                              {result.score}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-warning">
                            +{result.xpEarned} XP
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
