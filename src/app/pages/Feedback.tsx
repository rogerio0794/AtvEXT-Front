import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Star, Send, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface ApiFeedback {
  id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  updated_at: string;
}

const STAR_LABELS = ['', 'Ruim', 'Regular', 'Bom', 'Muito Bom', 'Excelente'];
const STAR_COLORS = ['', 'text-destructive', 'text-orange-400', 'text-warning', 'text-yellow-400', 'text-success'];

export function Feedback() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [existing, setExisting] = useState<ApiFeedback | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get<{ feedback: ApiFeedback | null }>('/api/feedbacks/mine')
      .then(({ feedback }) => {
        if (feedback) {
          setExisting(feedback);
          setRating(feedback.rating);
          setComment(feedback.comment ?? '');
        }
      })
      .catch(() => {})
      .finally(() => setLoadingFeedback(false));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !user) return;
    setSaving(true);
    try {
      const res = await api.post<{ feedback: ApiFeedback }>('/api/feedbacks', {
        rating,
        comment: comment.trim() || undefined,
      });
      setExisting(res.feedback);
      setSubmitted(true);
      setEditing(false);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      // silently fail — user sees the form still
    } finally {
      setSaving(false);
    }
  };

  const activeRating = hovered || rating;
  const isUpdate = !!existing && !editing;

  if (loadingFeedback) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar userRole="student" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (isUpdate) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar userRole="student" />
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl mb-2">Avaliação da Plataforma</h1>
              <p className="text-muted-foreground">Sua opinião nos ajuda a melhorar</p>
            </div>

            <Card className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl mb-1">Obrigado pelo seu feedback!</h2>
                <p className="text-muted-foreground text-sm">
                  Avaliado em {new Date(existing!.updated_at).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={36}
                    className={s <= existing!.rating ? 'text-warning fill-warning' : 'text-muted-foreground/30'}
                  />
                ))}
              </div>
              <p className={`text-lg mb-4 ${STAR_COLORS[existing!.rating]}`}>
                {STAR_LABELS[existing!.rating]}
              </p>

              {existing!.comment && (
                <div className="bg-muted rounded-lg p-4 text-left mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Seu comentário:</p>
                  <p className="text-foreground">{existing!.comment}</p>
                </div>
              )}

              <Button variant="outline" onClick={() => setEditing(true)} className="flex items-center gap-2 mx-auto">
                <RefreshCw size={16} />
                Atualizar avaliação
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="student" />

      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Avaliação da Plataforma</h1>
            <p className="text-muted-foreground">
              {editing ? 'Atualize sua avaliação' : 'Sua opinião nos ajuda a melhorar o QuizTech'}
            </p>
          </div>

          {submitted && (
            <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-lg flex items-center gap-3 text-success">
              <CheckCircle size={20} />
              <span>{existing ? 'Avaliação atualizada com sucesso!' : 'Avaliação enviada! Obrigado pelo feedback.'}</span>
            </div>
          )}

          <Card>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-center">
                <p className="text-lg mb-6">Como você avalia o QuizTech?</p>
                <div className="flex justify-center gap-2 mb-3" onMouseLeave={() => setHovered(0)}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHovered(s)}
                      className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                      aria-label={`${s} estrela${s > 1 ? 's' : ''}`}
                    >
                      <Star size={48} className={`transition-colors ${
                        s <= activeRating ? 'text-warning fill-warning drop-shadow-sm' : 'text-muted-foreground/30 hover:text-muted-foreground/60'
                      }`} />
                    </button>
                  ))}
                </div>
                <p className={`text-base h-6 transition-all ${activeRating ? STAR_COLORS[activeRating] : 'text-transparent'}`}>
                  {activeRating ? STAR_LABELS[activeRating] : '.'}
                </p>
              </div>

              {rating > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">O que você mais gosta? (opcional)</p>
                  <div className="flex flex-wrap gap-2">
                    {['Design', 'Quizzes', 'Gamificação', 'Conteúdo', 'Facilidade de uso', 'Missões', 'Ranking'].map((tag) => (
                      <button key={tag} type="button"
                        onClick={() => { const m = `${tag} `; if (!comment.includes(m)) setComment((c) => c ? `${c}${m}` : m); }}
                        className="px-3 py-1 rounded-full border border-border text-sm hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm mb-2">
                  Comentário <span className="text-muted-foreground">(opcional)</span>
                </label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte mais sobre sua experiência, sugestões de melhoria..."
                  maxLength={1000} rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                />
                <p className="text-xs text-muted-foreground text-right mt-1">{comment.length}/1000</p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={!rating || saving} className="flex items-center gap-2">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {editing ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
                </Button>
                {editing && (
                  <Button type="button" variant="outline"
                    onClick={() => { setEditing(false); setRating(existing!.rating); setComment(existing!.comment ?? ''); }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card className="mt-6 bg-primary/5 border-primary/20">
            <h3 className="text-base mb-3 text-primary">Por que sua avaliação importa?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Nos ajuda a priorizar melhorias nas áreas mais importantes para você</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Feedbacks são lidos pelos professores e equipe de desenvolvimento</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Você pode atualizar sua avaliação a qualquer momento</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
