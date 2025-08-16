// src/pages/Practice.tsx
import { Link } from "react-router-dom";

export default function Practice() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Link to="/practice/risk-trainer" className="rounded-lg bg-card p-4 hover:bg-muted/50 transition-colors block">
        <h3 className="mb-2 font-semibold">Risk Trainer</h3>
        <p className="text-sm opacity-70">Відпрацюйте розрахунок розміру позиції та управління ризиками в різних сценаріях.</p>
        <div className="mt-4 text-xs text-cyan-400">Перейти до тренажера →</div>
      </Link>
      <Link to="/practice/candles-trainer" className="rounded-lg bg-card p-4 hover:bg-muted/50 transition-colors block">
        <h3 className="mb-2 font-semibold">Candles Trainer</h3>
        <p className="text-sm opacity-70">Навчіться швидко розпізнавати ключові свічкові патерни в ізоляції.</p>
        <div className="mt-4 text-xs text-cyan-400">Перейти до тренажера →</div>
      </Link>
      <Link to="/practice/candles-context" className="rounded-lg bg-card p-4 hover:bg-muted/50 transition-colors block md:col-span-2">
        <h3 className="mb-2 font-semibold">Candles Trainer (в контексті) ✨</h3>
        <p className="text-sm opacity-70">Новий тренажер! Знаходьте патерни на реальному графіку BTCUSDT, щоб розуміти ринковий контекст.</p>
        <div className="mt-4 text-xs text-cyan-400">Перейти до тренажера →</div>
      </Link>
    </div>
  );
}