// src/components/ArticleCard.tsx
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Book, Brain, ShieldCheck, BarChart2, Star, CheckCircle2 } from 'lucide-react';
import type { Article } from '@/pages/ArticlesList';

const difficultyStyles = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  pro: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Теханаліз": <BarChart2 className="h-4 w-4" />,
  "Патерни": <Book className="h-4 w-4" />,
  "Психологія": <Brain className="h-4 w-4" />,
  "Ризик-менеджмент": <ShieldCheck className="h-4 w-4" />,
};

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { slug, title, description, difficulty, category, xp, image } = article;
  const isCompleted = false;

  return (
    <Link to={`/learn/articles/${slug}`} className="block group">
      <Card className="h-full flex flex-col bg-card/70 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-md shadow-black/20 overflow-hidden">
        {image && (
          <div className="aspect-video overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <div className={cn("text-xs font-semibold px-2 py-1 rounded-full border", difficultyStyles[difficulty])}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </div>
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <Star className="h-4 w-4 text-yellow-500/70" /> { (Math.random() * (5 - 4.5) + 4.5).toFixed(1) }
              </div>
            )}
          </div>
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-foreground/80">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-xs text-foreground/60 border-t border-border/50 pt-3 mt-auto">
          <div className="flex items-center gap-2">
            {categoryIcons[category] || <Book className="h-4 w-4" />}
            <span>{category}</span>
          </div>
          <span>{xp} XP</span>
        </CardFooter>
      </Card>
    </Link>
  );
}