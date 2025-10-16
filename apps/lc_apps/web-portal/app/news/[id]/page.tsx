import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Mock data - replace with API call
  const article = {
    id: parseInt(id),
    title: "Major Update v3.0 Released",
    content: `
      <h2>Welcome to Update 3.0!</h2>
      <p>We're excited to announce the release of our biggest update yet. This update brings numerous improvements, new content, and bug fixes that will enhance your gaming experience.</p>
      
      <h3>New Features</h3>
      <ul>
        <li>Three new challenging dungeons</li>
        <li>Improved character balance across all classes</li>
        <li>Enhanced guild system with new features</li>
        <li>New PvP arena with exciting rewards</li>
      </ul>
      
      <h3>Bug Fixes</h3>
      <ul>
        <li>Fixed critical issues with item duplication</li>
        <li>Resolved lag issues in high-traffic areas</li>
        <li>Corrected skill tooltips for clarity</li>
      </ul>
      
      <p>Thank you for your continued support and feedback. We look forward to seeing you in-game!</p>
    `,
    published_at: "2024-01-15",
    author_name: "Game Master",
    category: "Update",
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/news">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Link>
      </Button>

      <article className="max-w-3xl">
        <div className="mb-4">
          <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/10 rounded">
            {article.category}
          </span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
          <span>By {article.author_name}</span>
          <span>•</span>
          <span>{new Date(article.published_at).toLocaleDateString()}</span>
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
}
