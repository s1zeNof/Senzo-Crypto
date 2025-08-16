// src/data/candlePatterns.ts
export type CandlePattern = {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  description: string;
  imageUrl: string; // Прямий URL до SVG/зображення (Commons Special:FilePath)
};

// Хелпер для побудови стабільних URL із Commons (без редиректів)
// Приклад: commons("Hammer-candlestick.svg")
const commons = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;

export const CANDLE_PATTERNS: CandlePattern[] = [
  // --- NEUTRAL / DOJI FAMILY ---
  {
    id: 'doji',
    name: 'Доджі',
    type: 'neutral',
    description: 'Нерішучість ринку: ціна відкриття ≈ ціні закриття.',
    imageUrl: commons('Candle_doji_neutral.svg'),
  },
  {
    id: 'long-legged-doji',
    name: 'Довгоногий доджі',
    type: 'neutral',
    description: 'Довгі тіні свідчать про сильну волатильність і відсутність переваги сторін.',
    imageUrl: commons('Long-legged-doji.svg'),
  },
  {
    id: 'dragonfly-doji',
    name: 'Доджі «Стрекоза»',
    type: 'neutral',
    description: 'Довгий нижній хвіст; можливий розворот угору внизу тренду.',
    imageUrl: commons('Dragonfly-doji.svg'),
  },
  {
    id: 'gravestone-doji',
    name: 'Доджі «Надгробок»',
    type: 'neutral',
    description: 'Довгий верхній хвіст; можливий розворот донизу на вершинах.',
    imageUrl: commons('Gravestone-doji.svg'),
  },

  // --- SINGLE-CANDLE REVERSALS ---
  {
    id: 'hammer',
    name: 'Молот',
    type: 'bullish',
    description: 'Бичачий розворот: довга нижня тінь після падіння.',
    imageUrl: commons('Hammer-candlestick.svg'),
  },
  {
    id: 'inverted-hammer',
    name: 'Перевернутий молот',
    type: 'bullish',
    description: 'Розворот внизу: довга верхня тінь і невелике тіло.',
    imageUrl: commons('Inverted-hammer.svg'),
  },
  {
    id: 'hanging-man',
    name: 'Повішений',
    type: 'bearish',
    description: 'Ведмежий розворот на вершинах, схожий на «Молот», але вгору по тренду.',
    imageUrl: commons('Hanging-man.svg'),
  },
  {
    id: 'shooting-star',
    name: 'Падаюча зірка',
    type: 'bearish',
    description: 'Довга верхня тінь на хаях; сигнал до можливого відкату/розвороту вниз.',
    imageUrl: commons('Shooting-star.svg'),
  },
  {
    id: 'spinning-top',
    name: 'Спінінг-топ (веретено)',
    type: 'neutral',
    description: 'Невелике тіло з тінями в обидва боки: баланс сил, пауза перед рухом.',
    imageUrl: commons('Spinning-top.svg'),
  },
  {
    id: 'marubozu',
    name: 'Марубозу',
    type: 'neutral',
    description: 'Свічка без тіней: сильний імпульс у бік кольору тіла (контекст критичний).',
    imageUrl: commons('Marubozu.svg'),
  },

  // --- TWO-CANDLE PATTERNS ---
  {
    id: 'bullish-engulfing',
    name: 'Бичаче поглинання',
    type: 'bullish',
    description: 'Велика зелена свічка повністю поглинає тіло попередньої червоної.',
    imageUrl: commons('Engulfing-bullish-line.svg'),
  },
  {
    id: 'bearish-engulfing',
    name: 'Ведмеже поглинання',
    type: 'bearish',
    description: 'Велика червона свічка повністю поглинає тіло попередньої зеленої.',
    imageUrl: commons('Engulfing-bearish-line.svg'),
  },
  {
    id: 'bullish-harami',
    name: 'Бичаче харамі',
    type: 'bullish',
    description: 'Маленьке зелене тіло всередині попередньої великої червоної свічки.',
    imageUrl: commons('Bullish-harami.svg'),
  },
  {
    id: 'bearish-harami',
    name: 'Ведмеже харамі',
    type: 'bearish',
    description: 'Маленьке червоне тіло всередині попередньої великої зеленої свічки.',
    imageUrl: commons('Bearish-harami.svg'),
  },
  {
    id: 'piercing-line',
    name: 'Проникаюча лінія (Piercing Line)',
    type: 'bullish',
    description: 'Після падіння зелена свічка закривається вище середини попередньої червоної.',
    imageUrl: commons('Piercing-line.svg'),
  },
  {
    id: 'dark-cloud-cover',
    name: 'Темна хмара (Dark Cloud Cover)',
    type: 'bearish',
    description: 'Після росту червона свічка закривається нижче середини попередньої зеленої.',
    imageUrl: commons('Dark-cloud-cover.svg'),
  },

  // --- THREE-CANDLE PATTERNS ---
  {
    id: 'morning-star',
    name: 'Ранкова зірка',
    type: 'bullish',
    description: 'Три-свічковий розворот угору після падіння (тіло–мале тіло–сильне зростання).',
    imageUrl: commons('Morning-star.svg'),
  },
  {
    id: 'evening-star',
    name: 'Вечірня зірка',
    type: 'bearish',
    description: 'Три-свічковий розворот донизу після росту (тіло–мале тіло–сильне падіння).',
    imageUrl: commons('Evening-star.svg'),
  },
  {
    id: 'three-white-soldiers',
    name: 'Три білі солдати',
    type: 'bullish',
    description: 'Три послідовні довгі зелені свічки — сильний бичачий розворот/продовження.',
    imageUrl: commons('Three-white-soldiers.svg'),
  },
  {
    id: 'three-black-crows',
    name: 'Три чорні ворони',
    type: 'bearish',
    description: 'Три послідовні довгі червоні свічки — сильний ведмежий розворот/продовження.',
    imageUrl: commons('Three-black-crows.svg'),
  },

  // --- EVENING/MORNING WITH DOJI VARIANTS ---
  {
    id: 'morning-doji-star',
    name: 'Ранкова зірка з доджі',
    type: 'bullish',
    description: 'Варіація «Ранкової зірки», де центральна свічка — доджі.',
    imageUrl: commons('Morning-doji-star.svg'),
  },
  {
    id: 'evening-doji-star',
    name: 'Вечірня зірка з доджі',
    type: 'bearish',
    description: 'Варіація «Вечірньої зірки», де центральна свічка — доджі.',
    imageUrl: commons('Evening-doji-star.svg'),
  },
];

export const PATTERN_LABELS: Record<string, string> = {
  'bullish-engulfing': 'Бичаче поглинання',
  'bearish-engulfing': 'Ведмеже поглинання',
  'hammer': 'Молот',
  'shooting-star': 'Падаюча зірка',
  'doji': 'Доджі',
};