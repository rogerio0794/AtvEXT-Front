import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Mail, Award, Ban, Search, Users, GraduationCap, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface ApiUser {
  id: number;
  name: string;
  apelido?: string | null;
  email: string;
  role: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  created_at: string;
}

export function TeacherUsers() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher'>('all');

  useEffect(() => {
    api.get<{ users: ApiUser[]; total: number }>('/api/users?limit=200')
      .then(({ users: list }) => setUsers(list))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const students = users.filter((u) => u.role === 'student');
  const teachers = users.filter((u) => u.role === 'teacher');

  const filtered = useMemo(() => {
    let list = roleFilter === 'all' ? users : users.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.apelido ?? '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.xp - a.xp);
  }, [users, roleFilter, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar userRole="teacher" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar userRole="teacher" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-destructive/60" />
            <p className="text-sm">Não foi possível carregar os usuários.</p>
            <p className="text-xs mt-1">Verifique se o servidor está rodando em localhost:3001</p>
            <p className="text-xs text-destructive/70 mt-1">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Gerenciar Usuários</h1>
            <p className="text-muted-foreground">Visualize e gerencie todos os usuários da plataforma</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Total de Usuários</p>
              <h2 className="text-4xl text-primary">{users.length}</h2>
            </Card>
            <Card className="text-center">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 text-success" />
              <p className="text-sm text-muted-foreground mb-1">Alunos</p>
              <h2 className="text-4xl text-success">{students.length}</h2>
            </Card>
            <Card className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-warning" />
              <p className="text-sm text-muted-foreground mb-1">Professores</p>
              <h2 className="text-4xl text-warning">{teachers.length}</h2>
            </Card>
            <Card className="text-center">
              <UserCheck className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <p className="text-sm text-muted-foreground mb-1">Cadastrados em Ago/26</p>
              <h2 className="text-4xl text-secondary">{students.length}</h2>
            </Card>
          </div>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl">Lista de Usuários</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex rounded-lg border border-border overflow-hidden text-sm">
                  {(['all', 'student', 'teacher'] as const).map((r) => (
                    <button key={r} onClick={() => setRoleFilter(r)}
                      className={`px-3 py-1.5 transition-colors ${roleFilter === r ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      {r === 'all' ? 'Todos' : r === 'student' ? 'Alunos' : 'Professores'}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary w-48"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-sm text-muted-foreground">
                    <th className="text-left py-3 px-4">Usuário</th>
                    <th className="text-left py-3 px-4">E-mail</th>
                    <th className="text-center py-3 px-4">Perfil</th>
                    <th className="text-center py-3 px-4">Nível</th>
                    <th className="text-center py-3 px-4">XP</th>
                    <th className="text-center py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Nenhum usuário encontrado</td></tr>
                  ) : (
                    filtered.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{user.avatar}</span>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              {user.apelido && user.apelido !== user.name.split(' ')[0] && (
                                <p className="text-xs text-muted-foreground">{user.apelido}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Mail size={14} />{user.email}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            user.role === 'teacher' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                          }`}>
                            {user.role === 'teacher' ? 'Professor' : 'Aluno'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">{user.level}</span>
                        </td>
                        <td className="py-3 px-4 text-center text-warning text-sm font-medium">
                          {user.xp.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <button className="p-2 hover:bg-muted rounded-lg text-primary transition-colors" title="Ver detalhes">
                              <Award size={16} />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg text-destructive transition-colors" title="Banir usuário">
                              <Ban size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filtered.length > 0 && (
              <p className="text-xs text-muted-foreground text-right mt-4">
                {filtered.length} usuário{filtered.length !== 1 ? 's' : ''} exibido{filtered.length !== 1 ? 's' : ''}
              </p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
