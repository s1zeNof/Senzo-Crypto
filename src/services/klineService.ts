// src/services/klineService.ts

import { CandlestickData, UTCTimestamp } from 'lightweight-charts';

// Тип даних, який повертає API Binance
type BinanceKline = [
  number, // Open time
  string, // Open
  string, // High
  string, // Low
  string, // Close
  string, // Volume
  number, // Close time
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string  // Ignore
];

// Функція, яка робить запит і перетворює дані
export const fetchKlineData = async (
  symbol: string = 'BTCUSDT',
  interval: string = '1d', // 1d - денні свічки
  limit: number = 100 // Кількість свічок
): Promise<CandlestickData[]> => {
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BinanceKline[] = await response.json();

    // Перетворюємо дані з формату Binance у формат lightweight-charts
    const formattedData: CandlestickData[] = data.map(kline => ({
      time: (kline[0] / 1000) as UTCTimestamp, // Binance дає мілісекунди, нам потрібні секунди
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
    }));

    return formattedData;
  } catch (error) {
    console.error("Failed to fetch kline data:", error);
    // Повертаємо порожній масив у випадку помилки
    return [];
  }
};