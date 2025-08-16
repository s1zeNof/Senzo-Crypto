// src/pages/RiskTrainer.tsx
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Типи для стану форми та сценарію
type RiskFormState = {
  balance: string;
  riskPercent: string;
  entryPrice: string;
  stopLossPrice: string;
};

type Scenario = {
  id: number;
  balance: number;
  riskPercent: number;
  asset: string;
  entryPrice: number;
  stopLossPrice: number;
  correctPositionSize: number;
};

// Генератор сценаріїв
const generateScenarios = (): Scenario[] => {
  return [
    { id: 1, balance: 1000, riskPercent: 1, asset: 'BTC', entryPrice: 65000, stopLossPrice: 64000, correctPositionSize: 0.01 },
    { id: 2, balance: 5000, riskPercent: 2, asset: 'ETH', entryPrice: 3500, stopLossPrice: 3450, correctPositionSize: 2 },
    { id: 3, balance: 2500, riskPercent: 0.5, asset: 'SOL', entryPrice: 150, stopLossPrice: 148, correctPositionSize: 6.25 },
    { id: 4, balance: 10000, riskPercent: 1.5, asset: 'ADA', entryPrice: 0.45, stopLossPrice: 0.43, correctPositionSize: 7500 },
    { id: 5, balance: 750, riskPercent: 3, asset: 'DOGE', entryPrice: 0.15, stopLossPrice: 0.145, correctPositionSize: 4500 },
  ];
};

export default function RiskTrainer() {
  const [scenarios] = useState<Scenario[]>(generateScenarios);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const currentScenario = scenarios[currentScenarioIndex];

  const { balance, riskPercent, entryPrice, stopLossPrice } = useMemo(() => ({
    balance: currentScenario.balance,
    riskPercent: currentScenario.riskPercent,
    entryPrice: currentScenario.entryPrice,
    stopLossPrice: currentScenario.stopLossPrice
  }), [currentScenario]);

  const riskAmount = useMemo(() => (balance * riskPercent) / 100, [balance, riskPercent]);
  const priceDiff = useMemo(() => Math.abs(entryPrice - stopLossPrice), [entryPrice, stopLossPrice]);
  
  const handleCheckAnswer = () => {
    const userAnswerFloat = parseFloat(userAnswer);
    if (isNaN(userAnswerFloat)) {
      setFeedback({ message: "Будь ласка, введіть числове значення.", isCorrect: false });
      return;
    }

    const isCorrect = Math.abs(userAnswerFloat - currentScenario.correctPositionSize) < 0.01;

    if (isCorrect) {
      setFeedback({ message: "Правильно! Чудове розуміння ризику.", isCorrect: true });
    } else {
      setFeedback({
        message: `Невірно. Правильний розмір позиції: ${currentScenario.correctPositionSize.toFixed(4)}. Спробуйте ще раз!`,
        isCorrect: false,
      });
    }
  };

  const handleNextScenario = () => {
    setCurrentScenarioIndex((prevIndex) => (prevIndex + 1) % scenarios.length);
    setUserAnswer("");
    setFeedback(null);
  };
  
  return (
    <div className="max-w-2xl mx-auto grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Trainer v1</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground/80">
            Розрахуйте правильний розмір позиції на основі даних сценарію.
          </p>
          
          <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
            <h4 className="font-semibold">Сценарій #{currentScenario.id}: {currentScenario.asset}/USDT</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><strong>Баланс:</strong> ${balance.toLocaleString()}</p>
              <p><strong>Ризик на угоду:</strong> {riskPercent}% (${riskAmount.toFixed(2)})</p>
              <p><strong>Ціна входу:</strong> ${entryPrice.toLocaleString()}</p>
              <p><strong>Ціна Stop-Loss:</strong> ${stopLossPrice.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="positionSize" className="text-sm font-medium">Ваш розрахунок розміру позиції:</label>
            <input
              id="positionSize"
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={`Введіть розмір позиції в ${currentScenario.asset}`}
              className="w-full rounded-md border border-border bg-muted/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
          </div>

          <div className="flex gap-3 items-center">
            <Button onClick={handleCheckAnswer} disabled={!userAnswer}>Перевірити</Button>
            {feedback && (
              <Button onClick={handleNextScenario} variant="secondary">Наступний сценарій</Button>
            )}
          </div>
          
          {feedback && (
            <div className={cn(
              "p-3 rounded-md text-sm",
              feedback.isCorrect ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
            )}>
              {feedback.message}
            </div>
          )}

          <details className="pt-4">
            <summary className="text-xs text-foreground/60 cursor-pointer">Показати формулу</summary>
            <div className="mt-2 p-3 rounded-md bg-muted/30 text-xs text-foreground/70">
              <p><strong>Ризик в USDT</strong> = (Баланс * % Ризику) / 100</p>
              <p><strong>Різниця в ціні</strong> = |Ціна входу - Ціна Stop-Loss|</p>
              <p><strong>Розмір позиції</strong> = Ризик в USDT / Різниця в ціні</p>
              <p className="mt-2"><strong>Приклад:</strong> (${riskAmount.toFixed(2)}) / ${priceDiff.toFixed(2)} = {currentScenario.correctPositionSize.toFixed(4)} {currentScenario.asset}</p>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}