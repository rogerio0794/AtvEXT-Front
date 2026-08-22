import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { api } from '../lib/api';
import { Clock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

interface ApiQuestion {
  id: number;
  quiz_id: number;
  text: string;
  context: string | null;
  alternatives: string[];
  correct_alternative: number;
  explanation: string | null;
  order_index: number;
}

interface ApiQuiz {
  id: number;
  title: string;
  xp_reward: number;
  coin_reward: number;
  time_limit: number;
  total_questions: number;
}

const LABELS = ['A', 'B', 'C', 'D', 'E'];

export function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<ApiQuiz | null>(null);
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.get<{ quiz: ApiQuiz; questions: ApiQuestion[] }>(`/api/quizzes/${id}`)
      .then(({ quiz: q, questions: qs }) => {
        setQuiz(q);
        setQuestions(qs);
        setTimeLeft(q.time_limit * 60);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!quiz || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleFinishQuiz(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [quiz]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const currentQuestion = questions[currentIndex];
  const totalTime = quiz ? quiz.time_limit * 60 : 600;

  const handleFinishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigate(`/quiz/${id}/result`, {
      state: { answers, questions, timeSpent: totalTime - timeLeft, quiz },
    });
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: selectedAnswer }));
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinishQuiz();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <AlertCircle className="w-12 h-12 text-destructive/60" />
        <p>{error || 'Quiz não encontrado'}</p>
        <Button variant="outline" onClick={() => navigate('/quizzes')}>Voltar</Button>
      </div>
    );
  }

  if (showFeedback) {
    const isCorrect = selectedAnswer === currentQuestion.correct_alternative;
    const xpPerQuestion = quiz ? Math.round(quiz.xp_reward / questions.length) : 10;

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card className={`${isCorrect ? 'border-success' : 'border-destructive'} border-4`}>
            <div className={`text-center mb-6 ${isCorrect ? 'text-success' : 'text-destructive'}`}>
              <h2 className="text-3xl mb-2">{isCorrect ? '✓ Correto!' : '✗ Incorreto'}</h2>
              <p className="text-xl">+{isCorrect ? xpPerQuestion : 0} XP</p>
            </div>

            {!isCorrect && (
              <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-lg text-sm">
                <span className="text-success font-medium">Resposta correta: </span>
                <span>{LABELS[currentQuestion.correct_alternative]}. {currentQuestion.alternatives[currentQuestion.correct_alternative]}</span>
              </div>
            )}

            {currentQuestion.explanation && (
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h3 className="text-lg mb-2">Explicação:</h3>
                <p className="text-muted-foreground">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="text-center">
              <Button onClick={handleNextQuestion} size="lg">
                {currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
                <ChevronRight className="ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${timeLeft < 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
              <Clock size={20} />
              <span className="text-xl tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <span className="text-muted-foreground text-sm">
              {quiz?.title} · Questão {currentIndex + 1} de {questions.length}
            </span>
          </div>
          <Button variant="danger" onClick={handleFinishQuiz}>Finalizar</Button>
        </div>

        <div className="mb-6">
          <ProgressBar value={currentIndex + 1} max={questions.length} color="primary" />
        </div>

        <Card className="mb-6">
          {currentQuestion.context && (
            <div className="bg-muted p-4 rounded-lg mb-5">
              <h3 className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Contexto</h3>
              <p className="text-sm leading-relaxed">{currentQuestion.context}</p>
            </div>
          )}

          <h2 className="text-xl mb-6">{currentQuestion.text}</h2>

          <div className="space-y-3">
            {currentQuestion.alternatives.map((alt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === idx
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium mr-3">
                  {LABELS[idx]}
                </span>
                {alt}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <Button
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === null}
              className="w-full"
              size="lg"
            >
              Confirmar Resposta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
