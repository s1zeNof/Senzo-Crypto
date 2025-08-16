// src/pages/CandlesTrainer.tsx
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CANDLE_PATTERNS, CandlePattern } from "@/data/candlePatterns";

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export default function CandlesTrainer() {
  const totalRounds = 10;

  const [patterns, setPatterns] = useState<CandlePattern[]>(() => shuffleArray(CANDLE_PATTERNS));
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean; selectedId: string; } | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const currentPattern = useMemo(() => patterns[currentPatternIndex], [patterns, currentPatternIndex]);

  const options = useMemo(() => {
    if (!currentPattern) return [];
    const correct = currentPattern;
    const wrong = shuffleArray(patterns.filter(p => p.id !== correct.id)).slice(0, 3);
    return shuffleArray([correct, ...wrong]);
  }, [currentPattern, patterns]);

  const handleAnswerClick = (selected: CandlePattern) => {
    if (feedback) return;
    const isCorrect = selected.id === currentPattern.id;
    if (isCorrect) setScore(s => s + 1);
    setFeedback({
      message: isCorrect ? "Правильно!" : `Невірно. Це «${currentPattern.name}».`,
      isCorrect,
      selectedId: selected.id,
    });
  };

  const handleNextRound = () => {
    if (round < totalRounds) {
      setRound(r => r + 1);
      setCurrentPatternIndex(i => (i + 1) % patterns.length);
      setFeedback(null);
    } else {
      alert(`Тренажер завершено! Результат: ${score} з ${totalRounds}`);
      setCurrentPatternIndex(0);
      setScore(0);
      setRound(1);
      setPatterns(shuffleArray(CANDLE_PATTERNS));
      setFeedback(null);
    }
  };

  if (!currentPattern) return <div>Завантаження тренажера…</div>;

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <Card className="overflow-hidden shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold tracking-wider">Candles Trainer</CardTitle>
            <div className="font-mono text-sm text-foreground/70">
              Раунд: {round}/{totalRounds} | Рахунок: {score}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <p className="text-base text-foreground/80">
            Визначте свічковий патерн, що зображений нижче.
          </p>

          <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-muted/30 p-6">
            <img
              src={currentPattern.imageUrl}
              alt={`Патерн: ${currentPattern.name}`}
              loading="lazy"
              className="max-h-64 w-auto select-none opacity-0 [animation:fadeIn_.5s_ease-out_.05s_forwards]"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.map(option => (
              <Button
                key={option.id}
                onClick={() => handleAnswerClick(option)}
                variant="outline"
                size="lg"
                disabled={!!feedback}
                className={cn(
                  "py-5 text-base transition-all duration-300",
                  feedback && currentPattern.id === option.id && 'border-green-400/50 bg-green-500/20 text-white',
                  feedback && feedback.selectedId === option.id && !feedback.isCorrect && 'border-red-400/50 bg-red-500/20 text-white'
                )}
              >
                {option.name}
              </Button>
            ))}
          </div>

          {feedback && (
            <div
              className={cn(
                "space-y-2 rounded-lg p-4 text-left transition-opacity duration-500",
                feedback.isCorrect ? "bg-green-500/10" : "bg-red-500/10"
              )}
            >
              <h4 className={cn("font-bold", feedback.isCorrect ? "text-green-400" : "text-red-400")}>
                {feedback.message}
              </h4>
              <p className="text-sm text-foreground/80">{currentPattern.description}</p>
              <Button onClick={handleNextRound} className="mt-2 w-full">
                {round === totalRounds ? "Завершити та почати знову" : "Наступний патерн"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* keyframes для легкого fade-in зображень */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
      `}</style>
    </div>
  );
}
