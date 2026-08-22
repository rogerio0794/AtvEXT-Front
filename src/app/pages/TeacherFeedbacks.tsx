import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Star, MessageSquare, TrendingUp, Users, Filter, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface ApiFeedback {
  id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  updated_at: string;
  user_name: string;
  user_apelido: string | null;
  user_avatar: string;
  user_level: number;
}

interface ApiStats {
  total: number;
  avg_rating: number;
  stars5: number;
  stars4: number;
  stars3: number;
  stars2: number;
  stars1: number;
}

const STAR_LABELS = ['', 'Ruim', 'Regular', 'Bom', 'Muito Bom', 'Excelente'];
const STAR_COLORS = ['', 'text-destructive', 'text-orange-400', 'text-warning', 'text-yellow-400', 'text-success'];
const STAR_BG    = ['', 'bg-destructive/10', 'bg-orange-400/10', 'bg-warning/10', 'bg-yellow-400/10', 'bg-success/10'];

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={14}
          className={s <= value ? 'text-warning fill-warning' : 'text-muted-foreground/20'}
        />
      ))}
    </div>
  );
}

export function TeacherFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<ApiFeedback[]>([]);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [onlyComments, setOnlyComments] = useState(false);

  useEffect(() => {
    api.get<{ feedbacks: ApiFeedback[]; stats: ApiStats }>('/api/feedbacks?limit=200')
      .then(({ feedbacks: fb, stats: st }) => {
        setFeedbacks(fb);
        setStats(st);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...feedbacks];
    if (filterRating !== null) list = list.filter((f) => f.rating === filterRating);
    if (onlyComments) list = list.filter((f) => f.comment?.trim());
    return list;
  }, [feedbacks, filterRating, onlyComments]);

  const total = stats?.total ?? 0;
  const avgRating = stats?.avg_rating ?? 0;
  const withComment = feedbacks.filter((f) => f.comment?.trim()).length;
  const satisfaction = total > 0 ? Math.round((feedbacks.filter((f) => f.rating >= 4).length / total) * 100) : 0;

  const dist = [5,4,3,2,1].map((s) => ({
    star: s,
    count: stats ? (stats as unknown as Record<string, number>)[`stars${s}`] ?? 0 : 0,
    pct: total > 0 ? ((stats ? (stats as unknown as Record<string, number>)[`stars${s}`] ?? 0 : 0) / total) * 100 : 0,
  }));

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
            <p className="text-sm">Não foi possível carregar as avaliações.</p>
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
            <h1 className="text-3xl mb-2">Avaliações da Plataforma</h1>
            <p className="text-muted-foreground">Feedback dos alunos sobre sua experiência no QuizTech</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center bg-gradient-to-br from-warning to-warning/70 text-warning-foreground">
              <div className="flex justify-center mb-2"><Star className="w-10 h-10 fill-current" /></div>
              <h2 className="text-4xl mb-1">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</h2>
              <p className="text-sm opacity-90">Média geral</p>
            </Card>
            <Card className="text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <Users className="w-10 h-10 mx-auto mb-2" />
              <h2 className="text-4xl mb-1">{total}</h2>
              <p className="text-sm opacity-90">Avaliações</p>
            </Card>
            <Card className="text-center bg-gradient-to-br from-success to-success/80 text-success-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-2" />
              <h2 className="text-4xl mb-1">{withComment}</h2>
              <p className="text-sm opacity-90">Com comentários</p>
            </Card>
            <Card className="text-center bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
              <TrendingUp className="w-10 h-10 mx-auto mb-2" />
              <h2 className="text-4xl mb-1">{satisfaction}%</h2>
              <p className="text-sm opacity-90">Satisfação (4-5★)</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-1">
              <h2 className="text-xl mb-5">Distribuição de Notas</h2>
              <div className="space-y-3">
                {dist.map(({ star, count, pct }) => (
                  <div key={star} className="flex items-center gap-3">
                    <button
                      onClick={() => setFilterRating(filterRating === star ? null : star)}
                      className={`flex items-center gap-1 min-w-[52px] transition-opacity ${filterRating !== null && filterRating !== star ? 'opacity-40' : ''}`}
                    >
                      <span className="text-sm w-3">{star}</span>
                      <Star size={13} className="text-warning fill-warning" />
                    </button>
                    <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${
                        star === 5 ? 'bg-success' : star === 4 ? 'bg-yellow-400' : star === 3 ? 'bg-warning' : star === 2 ? 'bg-orange-400' : 'bg-destructive'
                      }`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
              {total > 0 && (
                <div className="mt-5 pt-4 border-t border-border text-center">
                  <div className="flex justify-center gap-1 mb-1">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={18}
                        className={s <= Math.round(avgRating) ? 'text-warning fill-warning' : 'text-muted-foreground/30'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{avgRating.toFixed(1)} de 5.0</p>
                </div>
              )}
            </Card>

            <Card className="md:col-span-2">
              <h2 className="text-xl mb-5">Destaques Recentes</h2>
              {feedbacks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma avaliação recebida ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {feedbacks.filter((f) => f.comment?.trim()).sort((a, b) => b.rating - a.rating).slice(0, 3).map((f) => (
                    <div key={f.id} className={`p-3 rounded-lg ${STAR_BG[f.rating]}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{f.user_avatar}</span>
                          <span className="text-sm">{f.user_apelido || f.user_name.split(' ')[0]}</span>
                        </div>
                        <StarRow value={f.rating} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{f.comment}</p>
                    </div>
                  ))}
                  {feedbacks.filter((f) => f.comment?.trim()).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum comentário ainda</p>
                  )}
                </div>
              )}
            </Card>
          </div>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl">Todas as Avaliações</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Filter size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filtrar:</span>
                </div>
                <div className="flex gap-1">
                  {[5,4,3,2,1].map((s) => (
                    <button key={s} onClick={() => setFilterRating(filterRating === s ? null : s)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                        filterRating === s ? 'border-warning bg-warning/10 text-warning' : 'border-border hover:border-warning/50'
                      }`}
                    >
                      {s}<Star size={10} className={filterRating === s ? 'fill-warning text-warning' : ''} />
                    </button>
                  ))}
                </div>
                <button onClick={() => setOnlyComments(!onlyComments)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border transition-colors ${
                    onlyComments ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <MessageSquare size={11} /> Com comentário
                </button>
                {(filterRating !== null || onlyComments) && (
                  <button onClick={() => { setFilterRating(null); setOnlyComments(false); }}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Nenhuma avaliação encontrada com esses filtros</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((f) => (
                  <div key={f.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{f.user_avatar}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm">
                              {f.user_name}
                              {f.user_apelido && f.user_apelido !== f.user_name.split(' ')[0] && (
                                <span className="text-muted-foreground ml-1 font-normal">({f.user_apelido})</span>
                              )}
                            </p>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              Nv. {f.user_level}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(f.updated_at).toLocaleDateString('pt-BR', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StarRow value={f.rating} />
                        <span className={`text-xs ${STAR_COLORS[f.rating]}`}>{STAR_LABELS[f.rating]}</span>
                      </div>
                    </div>
                    {f.comment?.trim() && (
                      <div className="mt-3 pl-12 pr-2">
                        <p className="text-sm text-muted-foreground leading-relaxed">"{f.comment.trim()}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {filtered.length > 0 && (
              <p className="text-xs text-muted-foreground text-right mt-4">
                {filtered.length} avaliação{filtered.length !== 1 ? 'ões' : ''} {filterRating || onlyComments ? 'filtradas' : 'no total'}
              </p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
