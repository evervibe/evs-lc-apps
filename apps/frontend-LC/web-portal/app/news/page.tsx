import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data - replace with API call
const newsArticles = [
  {
    id: 1,
    title: "Major Update v3.0 Released",
    excerpt: "New dungeons, improved balance, and exciting features await!",
    published_at: "2024-01-15",
    category: "Update",
  },
  {
    id: 2,
    title: "Double XP Weekend Incoming",
    excerpt: "Get ready for massive exp gains this weekend!",
    published_at: "2024-01-14",
    category: "Event",
  },
  {
    id: 3,
    title: "New PvP Season Starts",
    excerpt: "Compete for glory and exclusive rewards in the new season.",
    published_at: "2024-01-13",
    category: "PvP",
  },
  {
    id: 4,
    title: "Server Maintenance Scheduled",
    excerpt: "Brief maintenance on January 20th for improvements.",
    published_at: "2024-01-12",
    category: "Maintenance",
  },
  {
    id: 5,
    title: "Community Spotlight: Top Guilds",
    excerpt: "Celebrating the most active guilds of the month!",
    published_at: "2024-01-11",
    category: "Community",
  },
  {
    id: 6,
    title: "New Item Shop Additions",
    excerpt: "Check out the latest cosmetics and convenience items.",
    published_at: "2024-01-10",
    category: "Shop",
  },
];

export default function NewsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Latest News</h1>
        <p className="text-muted-foreground">
          Stay up to date with the latest updates, events, and announcements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/10 rounded">
                  {article.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(article.published_at).toLocaleDateString()}
                </span>
              </div>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>{article.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="link" className="px-0">
                <Link href={`/news/${article.id}`}>Read More →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-12 flex justify-center gap-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
