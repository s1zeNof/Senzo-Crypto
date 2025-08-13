// src/components/practice/PatternLab.tsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChartComponent from './ChartComponent';
import { fetchKlineData } from '@/services/klineService'; // Імпортуємо наш сервіс
import { CandlestickData } from 'lightweight-charts';

export const PatternLab = () => {
  // Стан для даних, завантаження та помилок
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect для завантаження даних при монтуванні компонента
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      const data = await fetchKlineData('BTCUSDT', '1d', 150); // Запитуємо 150 денних свічок для BTC
      
      if (data.length > 0) {
        setChartData(data);
      } else {
        setError('Не вдалося завантажити дані для графіка.');
      }
      setIsLoading(false);
    };

    loadData();
  }, []); // Пустий масив залежностей означає, що ефект виконається 1 раз

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Лабораторія Патернів</CardTitle>
        <CardDescription>
          Навчіться визначати та малювати ключові рівні підтримки/опору та трендові лінії на реальному графіку BTC/USDT.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* TODO: Тут будуть кнопки для вибору інструментів */}
        
        {/* Умовний рендеринг */}
        {isLoading && <div className="h-[500px] flex items-center justify-center">Завантаження даних...</div>}
        {error && <div className="h-[500px] flex items-center justify-center text-red-500">{error}</div>}
        {!isLoading && !error && chartData.length > 0 && (
          <ChartComponent data={chartData} />
        )}
      </CardContent>
    </Card>
  );
};