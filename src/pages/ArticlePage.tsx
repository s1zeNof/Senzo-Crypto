// src/pages/ArticlePage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ArticleData = {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'pro';
  category: string;
  xp: number;
  image?: string;
  content: string;
};

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const module = await import(`../articles/${slug}.md?raw`);
        const { data, content } = matter(module.default);
        setArticle({ ...(data as Omit<ArticleData, 'content'>), content });
      } catch (error) {
        console.error("Failed to load article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return <div className="text-center p-10">Завантаження статті...</div>;
  }

  if (!article) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold">Помилка 404</h2>
        <p>Статтю не знайдено.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/learn/articles">Повернутись до списку</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/learn/articles" className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary mb-6">
        <ArrowLeft size={16} />
        Повернутись до всіх статей
      </Link>
      
      <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary hover:prose-a:opacity-80 prose-strong:text-foreground prose-blockquote:border-primary/50 prose-code:text-primary/90 prose-code:bg-muted/80 prose-code:p-1 prose-code:rounded-md">
        
        {article.image && (
          <div className="aspect-video rounded-lg overflow-hidden mb-8 border border-border">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover"/>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-lg text-foreground/70 !mt-2">{article.description}</p>
        <div className="flex items-center gap-4 my-6 text-sm border-y border-border/50 py-3">
          <span>Складність: <span className="font-semibold">{article.difficulty}</span></span>
          <span className="text-foreground/50">|</span>
          <span>Категорія: <span className="font-semibold">{article.category}</span></span>
          <span className="text-foreground/50">|</span>
          <span>Нагорода: <span className="font-semibold text-primary">{article.xp} XP</span></span>
        </div>
        
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}