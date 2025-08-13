// src/components/practice/CandlesTrainer.tsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { candlePatterns, getRandomPattern, generateOptions, CandlePattern } from '@/data/patterns';
import { cn } from '@/lib/utils';

export const CandlesTrainer = () => {
  const [currentPattern, setCurrentPattern] = useState<CandlePattern | null>(null);
  const [options, setOptions] = useState<CandlePattern[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const loadNextQuestion = () => {
    const pattern = getRandomPattern(currentPattern?.id);
    setCurrentPattern(pattern);
    setOptions(generateOptions(pattern));
    setSelectedOptionId(null);
  };

  useEffect(() => {
    loadNextQuestion();
  }, []);

  const handleOptionClick = (optionId: string) => {
    if (selectedOptionId) return;
    const correct = optionId === currentPattern?.id;
    setSelectedOptionId(optionId);
    setScore(prev => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
  };

  if (!currentPattern) {
    return <Card className="w-full max-w-md"><CardHeader><CardTitle>Завантаження...</CardTitle></CardHeader></Card>;
  }

  const winRate = score.total > 0 ? ((score.correct / score.total) * 100).toFixed(1) : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Тренажер Патернів</CardTitle>
            <CardDescription>Вгадайте назву патерну.</CardDescription>
          </div>
          <div className="text-right">
             <div className="font-mono text-lg">{score.correct} / {score.total}</div>
             <div className="text-sm text-gray-400">Winrate: {winRate}%</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        <div className="bg-gray-200 p-4 rounded-lg">
          <img src={currentPattern.imageUrl} alt="Свічковий патерн" className="h-48 w-auto" />
        </div>
        <div className="w-full grid grid-cols-2 gap-4">
          {options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className={cn(
                "h-16 text-md",
                selectedOptionId && option.id === currentPattern.id && "bg-green-500/20 border-green-500",
                selectedOptionId === option.id && option.id !== currentPattern.id && "bg-red-500/20 border-red-500"
              )}
              onClick={() => handleOptionClick(option.id)}
              disabled={!!selectedOptionId}
            >
              {option.name}
            </Button>
          ))}
        </div>
        {selectedOptionId && (
          <Button onClick={loadNextQuestion} className="w-full mt-4">
            Наступний патерн
          </Button>
        )}
      </CardContent>
    </Card>
  );
};