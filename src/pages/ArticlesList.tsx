// src/pages/ArticlesList.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCard } from "@/components/ArticleCard";
import matter from "gray-matter";

// Оновлюємо тип, додаємо опціональне поле image
export type Article = {
  slug: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'pro';
  category: string;
  xp: number;
  image?: string; // <-- ДОДАНО ЦЕЙ РЯДОК
};

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articleModules = import.meta.glob('/src/articles/*.md', { as: 'raw' });
        
        const loadedArticles = await Promise.all(
          Object.entries(articleModules).map(async ([path, loader]) => {
            const slug = path.split('/').pop()?.replace('.md', '') || '';
            const fileContent = await loader();
            const { data } = matter(fileContent);
            
            return {
              slug,
              title: data.title || 'Без назви',
              description: data.description || '',
              difficulty: data.difficulty || 'beginner',
              category: data.category || 'Загальне',
              xp: data.xp || 0,
              image: data.image || undefined, // <-- ДОДАНО ЦЕЙ РЯДОК
            } as Article;
          })
        );
        
        setArticles(loadedArticles);
      } catch (error) {
        console.error("Помилка під час завантаження статей:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="bg-transparent border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-wider">База знань</CardTitle>
          <p className="text-foreground/70">Ваш шлях від новачка до профі. Вивчайте, практикуйтесь та заробляйте XP.</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Завантаження статей...</p>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <p>Не знайдено жодної статті. Переконайтесь, що вони є у папці /src/articles.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}