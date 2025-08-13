// src/components/practice/RiskTrainer.tsx

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export const RiskTrainer = () => {
  // --- Стан для полів вводу. ВИКОРИСТОВУЄМО РЯДКИ для Input'ів ---
  const [accountBalanceStr, setAccountBalanceStr] = useState<string>('10000');
  const [entryPriceStr, setEntryPriceStr] = useState<string>('');
  const [stopLossPriceStr, setStopLossPriceStr] = useState<string>('');
  
  // --- Слайдер працює з числами, тому його стан залишаємо як number ---
  const [riskPercentage, setRiskPercentage] = useState<number>(1);

  // --- ПЕРЕТВОРЮЄМО РЯДКИ В ЧИСЛА ТУТ, ПЕРЕД РОЗРАХУНКАМИ ---
  const accountBalance = parseFloat(accountBalanceStr) || 0;
  const entryPrice = parseFloat(entryPriceStr) || 0;
  const stopLossPrice = parseFloat(stopLossPriceStr) || 0;

  // --- Розрахунки (тепер вони працюють з чистими числами) ---
  const riskAmount = (accountBalance * riskPercentage) / 100;
  const distanceToStop = entryPrice > 0 && stopLossPrice > 0 ? entryPrice - stopLossPrice : 0;
  const positionSize = distanceToStop > 0 ? riskAmount / distanceToStop : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Тренажер Ризик-Менеджменту</CardTitle>
        <CardDescription>Розрахуйте розмір позиції на основі вашого ризику.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="balance">Баланс рахунку ($)</Label>
            <Input
              id="balance"
              type="number"
              value={accountBalanceStr} // Тепер тут завжди рядок
              onChange={(e) => setAccountBalanceStr(e.target.value)} // І в стан ми кладемо рядок
              placeholder="10000"
            />
          </div>

          <div>
            <Label htmlFor="risk">Ризик на угоду (%)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="risk"
                min={0.1}
                max={5}
                step={0.1}
                value={[riskPercentage]}
                onValueChange={(value) => setRiskPercentage(value[0])}
              />
              <span className="font-mono text-lg w-20 text-center">{riskPercentage.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entry">Ціна входу</Label>
              <Input
                id="entry"
                type="number"
                value={entryPriceStr} // Тепер тут завжди рядок
                onChange={(e) => setEntryPriceStr(e.target.value)} // І в стан ми кладемо рядок
                placeholder="50000"
              />
            </div>
            <div>
              <Label htmlFor="stoploss">Ціна Stop Loss</Label>
              <Input
                id="stoploss"
                type="number"
                value={stopLossPriceStr} // Тепер тут завжди рядок
                onChange={(e) => setStopLossPriceStr(e.target.value)} // І в стан ми кладемо рядок
                placeholder="49500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold">Результати розрахунку:</h3>
          <div className="p-4 bg-gray-800/50 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Максимальний ризик:</span>
              <span className="font-bold text-lg text-red-400">${riskAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Розмір позиції (в одиницях активу):</span>
              <span className="font-bold text-lg text-cyan-400">{positionSize.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Вартість позиції:</span>
              <span className="font-bold text-lg text-white">${(positionSize * entryPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};