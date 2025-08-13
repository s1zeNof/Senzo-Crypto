// src/data/patterns.ts

export interface CandlePattern {
  id: string;
  name: string;
  imageUrl: string;
  type: 'bullish' | 'bearish' | 'neutral';
}

export const candlePatterns: CandlePattern[] = [
  {
    id: 'bullish-engulfing',
    name: 'Бичаче поглинання',
    imageUrl: '/patterns/bullish-engulfing.png', // Вам треба буде додати ці картинки
    type: 'bullish',
  },
  {
    id: 'bearish-engulfing',
    name: 'Ведмеже поглинання',
    imageUrl: '/patterns/bearish-engulfing.png',
    type: 'bearish',
  },
  {
    id: 'doji',
    name: 'Доджі',
    imageUrl: '/patterns/doji.png',
    type: 'neutral',
  },
  {
    id: 'hammer',
    name: 'Молот',
    imageUrl: '/patterns/hammer.png',
    type: 'bullish',
  },
];

export const getRandomPattern = (excludeId?: string): CandlePattern => {
  const filteredPatterns = excludeId
    ? candlePatterns.filter(p => p.id !== excludeId)
    : candlePatterns;
  const randomIndex = Math.floor(Math.random() * filteredPatterns.length);
  return filteredPatterns[randomIndex];
};

export const generateOptions = (correctPattern: CandlePattern): CandlePattern[] => {
  const options: CandlePattern[] = [correctPattern];
  while (options.length < 4) {
    const randomPattern = getRandomPattern();
    if (!options.some(opt => opt.id === randomPattern.id)) {
      options.push(randomPattern);
    }
  }
  return options.sort(() => Math.random() - 0.5);
};