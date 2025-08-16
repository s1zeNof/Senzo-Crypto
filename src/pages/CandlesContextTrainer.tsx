// src/pages/CandlesContextTrainer.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { ISeriesApi, CandlestickData, Time, IChartApi, SeriesMarker } from "lightweight-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PATTERN_LABELS } from "@/data/candlePatterns";

/* ----------------------- типи ----------------------- */
type Kline = {
  time: number; open: number; high: number; low: number; close: number;
};

type Question = {
  index: number; // індекс таргетної свічки (або правої з пари)
  patternId: keyof typeof PATTERN_LABELS;
};

/* ----------------------- utils ----------------------- */
// DEV → /binance-api (проксі у vite.config.ts), PROD → пряма на Binance
const binanceUrl = (symbol: string, interval: string, limit = 750) => {
  const base = import.meta.env.DEV ? "/binance-api" : "https://api.binance.com";
  return `${base}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
};

const toCandles = (klines: any[]): Kline[] =>
  klines.map(k => ({
    time: Math.floor(k[0] / 1000),
    open: +k[1], high: +k[2], low: +k[3], close: +k[4],
  }));

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

const pickDistractors = (correct: string) =>
  shuffle(Object.keys(PATTERN_LABELS).filter(x => x !== correct)).slice(0, 3);

/* ----------------------- базові детектори ----------------------- */
const body  = (c: Kline) => Math.abs(c.close - c.open);
const range = (c: Kline) => c.high - c.low;
const green = (c: Kline) => c.close > c.open;
const red   = (c: Kline) => c.open  > c.close;

function isDoji(c: Kline) {
  const r = range(c);
  if (r === 0) return false;
  return body(c) / r <= 0.1;
}
function isBullishEngulfing(prev: Kline, cur: Kline) {
  if (!red(prev) || !green(cur)) return false;
  const prevMin = Math.min(prev.open, prev.close);
  const prevMax = Math.max(prev.open, prev.close);
  const curMin  = Math.min(cur.open, cur.close);
  const curMax  = Math.max(cur.open, cur.close);
  return curMin <= prevMin && curMax >= prevMax && body(cur) >= body(prev) * 0.9;
}
function isBearishEngulfing(prev: Kline, cur: Kline) {
  if (!green(prev) || !red(cur)) return false;
  const prevMin = Math.min(prev.open, prev.close);
  const prevMax = Math.max(prev.open, prev.close);
  const curMin  = Math.min(cur.open, cur.close);
  const curMax  = Math.max(cur.open, cur.close);
  return curMin <= prevMin && curMax >= prevMax && body(cur) >= body(prev) * 0.9;
}
function isHammer(c: Kline) {
  const b = body(c); if (range(c) === 0) return false;
  const upper = c.high - Math.max(c.open, c.close);
  const lower = Math.min(c.open, c.close) - c.low;
  return lower >= 2 * b && upper <= b;
}
function isShootingStar(c: Kline) {
  const b = body(c); if (range(c) === 0) return false;
  const upper = c.high - Math.max(c.open, c.close);
  const lower = Math.min(c.open, c.close) - c.low;
  return upper >= 2 * b && lower <= b;
}

/* ----------------------- компонент ----------------------- */
export default function CandlesContextTrainer() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartApi = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [candles, setCandles] = useState<Kline[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; selectedId: string } | null>(null);
  const [score, setScore] = useState(0);
  const totalRounds = 10;

  // 1) init chart (динамічний імпорт, щоб уникнути ESM-глюків)
  useEffect(() => {
    let chart: IChartApi | null = null;
    let mounted = true;

    (async () => {
      if (!chartRef.current) return;

      try {
        const { createChart } = await import("lightweight-charts");
        chart = createChart(chartRef.current, {
          height: 320,
          layout: { background: { color: 'transparent' }, textColor: '#a1a1aa' },
          grid: { vertLines: { color: 'rgba(148,163,184,.12)' }, horzLines: { color: 'rgba(148,163,184,.12)' } },
          rightPriceScale: { borderColor: 'rgba(148,163,184,.2)' },
          timeScale: { borderColor: 'rgba(148,163,184,.2)' },
          crosshair: { mode: 0 },
        });
        chartApi.current = chart;

        // @ts-expect-error — у рантаймі метод точно існує
        seriesRef.current = chart.addCandlestickSeries({
          upColor: '#16a34a', downColor: '#ef4444',
          wickUpColor: '#16a34a', wickDownColor: '#ef4444',
          borderVisible: false,
        });
      } catch (e) {
        console.error('Chart init error', e);
        if (mounted) setStatus('error');
      }
    })();

    return () => {
      mounted = false;
      try { chart?.remove(); } catch {/* ignore */}
      chartApi.current = null;
      seriesRef.current = null;
    };
  }, []);

  // 2) fetch даних (з AbortController)
  useEffect(() => {
    const ac = new AbortController();
    setStatus('loading');

    (async () => {
      try {
        const res = await fetch(binanceUrl("BTCUSDT", "1h", 750), { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const c = toCandles(raw);
        setCandles(c);

        // Одразу віддати у серію
        if (seriesRef.current) {
          const data: CandlestickData[] = c.map(k => ({
            time: k.time as Time, open: k.open, high: k.high, low: k.low, close: k.close,
          }));
          seriesRef.current.setData(data);
        }
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          console.error('Fetch klines failed', e);
          setStatus('error');
        }
      }
    })();

    return () => ac.abort();
  }, []);

  // 3) знайти реальні входження патернів і сформувати питання
  useEffect(() => {
    if (candles.length === 0) return;

    const qs: Question[] = [];
    for (let i = 1; i < candles.length; i++) {
      const p = candles[i - 1], c = candles[i];
      if (isBullishEngulfing(p, c)) qs.push({ index: i, patternId: 'bullish-engulfing' });
      else if (isBearishEngulfing(p, c)) qs.push({ index: i, patternId: 'bearish-engulfing' });
      else if (isHammer(c))          qs.push({ index: i, patternId: 'hammer' });
      else if (isShootingStar(c))    qs.push({ index: i, patternId: 'shooting-star' });
      else if (isDoji(c))            qs.push({ index: i, patternId: 'doji' });
    }

    if (qs.length === 0) { setStatus('error'); return; }

    setQuestions(shuffle(qs).slice(0, 50));
    setQIndex(0);
    setFeedback(null);
    setScore(0);
    setStatus('ready');
  }, [candles]);

  const currentQuestion = questions[qIndex];

  // 4) налаштувати видимий діапазон і маркер на таргетній свічці
  useEffect(() => {
    if (!chartApi.current || !seriesRef.current || !currentQuestion || candles.length === 0) return;

    const i = currentQuestion.index;
    const from = Math.max(0, i - 20);
    const to   = Math.min(candles.length - 1, i + 10);

    chartApi.current.timeScale().setVisibleRange({
      from: candles[from].time as Time,
      to:   candles[to].time as Time,
    });

    // Маркер на таргетній свічці
    const markers: SeriesMarker<Time>[] = [
      { time: candles[i].time as Time, position: 'aboveBar', color: '#22d3ee', shape: 'circle', text: '' }
    ];
    try {
      // @ts-expect-error типи маркерів у lib інколи лагають
      seriesRef.current.setMarkers(markers);
    } catch {/* ignore */}
  }, [currentQuestion, candles]);

  // 5) варіанти відповіді
  const options = useMemo(() => {
    if (!currentQuestion) return [];
    const correct = currentQuestion.patternId;
    const distractors = pickDistractors(correct);
    return shuffle([correct, ...distractors]) as (keyof typeof PATTERN_LABELS)[];
  }, [currentQuestion]);

  // 6) логіка відповіді/наступного питання
  const onAnswer = (id: keyof typeof PATTERN_LABELS) => {
    if (!currentQuestion || feedback) return;
    const isCorrect = id === currentQuestion.patternId;
    setFeedback({ isCorrect, selectedId: id });
    if (isCorrect) setScore(s => s + 1);
  };

  const next = () => {
    if (qIndex + 1 < Math.min(totalRounds, questions.length)) {
      setQIndex(qIndex + 1);
      setFeedback(null);
    } else {
      alert(`Готово! Результат: ${score} з ${Math.min(totalRounds, questions.length)}`);
      setQIndex(0);
      setFeedback(null);
      setScore(0);
      setQuestions(shuffle(questions));
    }
  };

  /* ----------------------- UI ----------------------- */
  if (status === 'loading') {
    return <div className="p-10 text-center">Завантаження реальних ринкових даних…</div>;
  }
  if (status === 'error') {
    return (
      <div className="mx-auto max-w-2xl rounded-lg bg-red-500/10 p-10 text-center">
        <h3 className="font-bold text-red-400">Помилка завантаження даних</h3>
        <p className="mt-2 text-sm">
          Не вдалося отримати свічки. Перевір мережу/проксі. У DEV повинен працювати шлях <code>/binance-api</code>
          (див. <code>vite.config.ts</code>), у продакшені — пряма до Binance.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <Card className="overflow-hidden shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-xl font-bold tracking-wider">Candles Trainer (контекст)</CardTitle>
            <div className="font-mono text-sm text-foreground/70">
              Раунд: {Math.min(qIndex + 1, totalRounds)}/{Math.min(totalRounds, questions.length)} | Рахунок: {score}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-base text-foreground/80">
            Вкажіть патерн на реальному фрагменті графіка (Binance BTCUSDT 1h). Точка з маркером — таргетна свічка.
          </p>

          <div className="rounded-xl border border-border bg-muted/30 p-2">
            <div ref={chartRef} className="h-[320px] w-full" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.map(opt => (
              <Button
                key={opt}
                onClick={() => onAnswer(opt)}
                variant="outline"
                size="lg"
                disabled={!!feedback}
                className={cn(
                  "py-5 text-base transition-all duration-300",
                  feedback && currentQuestion?.patternId === opt && "border-green-400/50 bg-green-500/20 text-white",
                  feedback && feedback.selectedId === opt && !feedback.isCorrect && "border-red-400/50 bg-red-500/20 text-white"
                )}
              >
                {PATTERN_LABELS[opt]}
              </Button>
            ))}
          </div>

          {feedback && currentQuestion && (
            <div
              className={cn(
                "rounded-lg p-4 text-left transition-opacity duration-500",
                feedback.isCorrect ? "bg-green-500/10" : "bg-red-500/10"
              )}
            >
              <h4 className={cn("font-bold", feedback.isCorrect ? "text-green-400" : "text-red-400")}>
                {feedback.isCorrect ? "Правильно!" : "Невірно."}
              </h4>
              <p className="text-sm text-foreground/80">
                Правильна відповідь: <b>{PATTERN_LABELS[currentQuestion.patternId]}</b>. Оцінюй контекст — попередні свічки та місце в русі.
              </p>
              <Button onClick={next} className="mt-2 w-full">
                Наступний
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
