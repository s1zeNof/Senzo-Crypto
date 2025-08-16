// src/pages/Learn.tsx
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BarChart3, Bot, Microscope } from 'lucide-react'; // Іконки

export default function Learn() {
  const learningSections = [
    {
      to: "/learn/articles",
      title: "База знань",
      description: "Статті, посібники та аналітика від основ до просунутих стратегій.",
      Icon: BookOpen
    },
    {
      to: "/practice",
      title: "Практичні тренажери",
      description: "Відточуйте навички розпізнавання патернів та управління ризиками.",
      Icon: BarChart3
    },
    {
      to: "/sim",
      title: "Симулятор торгівлі",
      description: "Тестуйте свої ідеї на історичних даних без реального ризику.",
      Icon: Bot
    },
    {
      to: "/backtest",
      title: "Бектест",
      description: "Перевіряйте ефективність ваших стратегій на великих проміжках часу.",
      Icon: Microscope
    }
  ];

  return (
    <div className="grid gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Центр Навчання</h1>
        <p className="mt-2 text-lg text-foreground/70">Все, що потрібно для вашого розвитку як трейдера, в одному місці.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {learningSections.map(({ to, title, description, Icon }) => (
          <Link key={to} to={to} className="block group">
            <div className="p-6 rounded-lg bg-card/70 border border-border hover:border-cyan-400/50 hover:-translate-y-1 transition-all duration-300 h-full shadow-lg shadow-black/20">
              <Icon className="h-8 w-8 text-cyan-400 mb-4 transition-transform group-hover:scale-110" />
              <h3 className="font-semibold text-xl">{title}</h3>
              <p className="text-sm opacity-70 mt-2">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}