import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { questions } from '../data/mockData';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [showFeedback, setShowFeedback] = useState(false);

  const quizQuestions = questions.filter(q => q.quizId === id);
  const currentQuestion = quizQuestions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer) {
      setAnswers({ ...answers, [currentQuestionIndex]: selectedAnswer });
      setShowFeedback(true);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setShowFeedback(false);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] || null);
    }
  };

  const handleFinishQuiz = () => {
    navigate(`/quiz/${id}/result`, {
      state: {
        answers,
        questions: quizQuestions,
        timeSpent: 600 - timeLeft
      }
    });
  };

  if (!currentQuestion) {
    return <div>Quiz não encontrado</div>;
  }

  if (showFeedback) {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card className={`${isCorrect ? 'border-success' : 'border-destructive'} border-4`}>
            <div className={`text-center mb-6 ${isCorrect ? 'text-success' : 'text-destructive'}`}>
              <h2 className="text-3xl mb-2">{isCorrect ? '✓ Correto!' : '✗ Incorreto'}</h2>
              <p className="text-xl">+{isCorrect ? currentQuestion.xpReward : 0} XP</p>
            </div>

            <div className="bg-muted p-6 rounded-lg mb-6">
              <h3 className="text-lg mb-2">Explicação:</h3>
              <p className="text-muted-foreground">{currentQuestion.explanation}</p>
            </div>

            <div className="text-center">
              <Button onClick={handleNextQuestion} size="lg">
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
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
            <div className="flex items-center gap-2 text-destructive">
              <Clock size={24} />
              <span className="text-xl">{formatTime(timeLeft)}</span>
            </div>
            <span className="text-muted-foreground">
              Questão {currentQuestionIndex + 1} de {quizQuestions.length}
            </span>
          </div>
          <Button variant="danger" onClick={handleFinishQuiz}>
            Finalizar Quiz
          </Button>
        </div>

        <div className="mb-6">
          <ProgressBar
            value={currentQuestionIndex + 1}
            max={quizQuestions.length}
            color="primary"
          />
        </div>

        <Card className="mb-6">
          <div className="bg-muted p-6 rounded-lg mb-6">
            <h3 className="text-sm text-muted-foreground mb-2">Contextualização</h3>
            <p className="leading-relaxed">{currentQuestion.context}</p>
          </div>

          <h2 className="text-xl mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.alternatives.map((alt) => (
              <button
                key={alt.id}
                onClick={() => handleAnswerSelect(alt.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === alt.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="inline-block w-8 h-8 rounded-full bg-primary text-primary-foreground text-center leading-8 mr-3">
                  {alt.id.toUpperCase()}
                </span>
                {alt.text}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="mr-2" />
              Anterior
            </Button>

            <Button
              onClick={handleConfirmAnswer}
              disabled={!selectedAnswer}
              className="flex-1"
            >
              Confirmar Resposta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
