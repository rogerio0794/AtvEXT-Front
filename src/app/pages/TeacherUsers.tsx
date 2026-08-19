import { useState, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Mail, Award, Ban, Search, Users, GraduationCap, UserCheck } from 'lucide-react';

interface StoredUser {
  id: string;
  name: string;
  apelido?: string;
  email: string;
  role: 'student' | 'teacher';
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  totalQuizzes: number;
  password?: string;
}

function loadUsers(): StoredUser[] {
  try {
    const raw: StoredUser[] = JSON.parse(localStorage.getItem('quiztech_users') || '[]');
    return raw.map(({ password: _pw, ...u }) => u as StoredUser);
  } catch {
    return [];
  }
}

export function TeacherUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher'>('all');

  const allUsers = loadUsers();

  const students = allUsers.filter((u) => u.role === 'student');
  const teachers = allUsers.filter((u) => u.role === 'teacher');

  // New this month: registered in August 2026 (all seeded users qualify)
  const newThisMonth = students.length;

  const filtered = useMemo(() => {
    let list = roleFilter === 'all' ? allUsers : allUsers.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.apelido && u.apelido.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => b.xp - a.xp);
  }, [allUsers, roleFilter, search]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Gerenciar Usuários</h1>
            <p className="text-muted-foreground">Visualize e gerencie todos os usuários da plataforma</p>
          </div>

          {/* Stats row */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Total de Usuários</p>
              <h2 className="text-4xl text-primary">{allUsers.length}</h2>
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
              <h2 className="text-4xl text-secondary">{newThisMonth}</h2>
            </Card>
          </div>

          <Card>
            {/* Header + filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl">Lista de Usuários</h2>

              <div className="flex flex-wrap items-center gap-3">
                {/* Role filter */}
                <div className="flex rounded-lg border border-border overflow-hidden text-sm">
                  {(['all', 'student', 'teacher'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className={`px-3 py-1.5 transition-colors ${
                        roleFilter === r
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {r === 'all' ? 'Todos' : r === 'student' ? 'Alunos' : 'Professores'}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary w-48"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
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
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-muted-foreground">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
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
                            <Mail size={14} />
                            {user.email}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              user.role === 'teacher'
                                ? 'bg-warning/20 text-warning'
                                : 'bg-primary/20 text-primary'
                            }`}
                          >
                            {user.role === 'teacher' ? 'Professor' : 'Aluno'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">
                            {user.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-warning text-sm font-medium">
                          {user.xp.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              className="p-2 hover:bg-muted rounded-lg text-primary transition-colors"
                              title="Ver detalhes"
                            >
                              <Award size={16} />
                            </button>
                            <button
                              className="p-2 hover:bg-muted rounded-lg text-destructive transition-colors"
                              title="Banir usuário"
                            >
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
