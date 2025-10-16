import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'News & Updates - LastChaos',
  description: 'Stay up to date with the latest news, events, and updates from LastChaos.',
};

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  category: 'news' | 'event' | 'update';
  excerpt: string;
  content: string;
}

export default function NewsPage() {
  // Dummy news articles as placeholders
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'Grand Opening - Welcome to LastChaos!',
      date: '2025-01-15',
      category: 'news',
      excerpt: 'We are excited to announce the grand opening of our LastChaos server! Join us for exclusive launch rewards.',
      content: 'Welcome to LastChaos! After months of development and testing, we are thrilled to officially launch our server...'
    },
    {
      id: 2,
      title: 'Double EXP Weekend Event',
      date: '2025-01-20',
      category: 'event',
      excerpt: 'This weekend enjoy 2x EXP boost! Level up faster and reach new heights in your adventure.',
      content: 'Get ready for an epic weekend! Starting Friday at 00:00 until Sunday 23:59, all players will receive a 2x EXP boost...'
    },
    {
      id: 3,
      title: 'Version 1.2 Update - New Dungeon Released',
      date: '2025-01-25',
      category: 'update',
      excerpt: 'Explore the new Forgotten Temple dungeon with challenging bosses and exclusive rewards!',
      content: 'We are excited to release Version 1.2 featuring the Forgotten Temple, a challenging new dungeon with epic loot...'
    },
    {
      id: 4,
      title: 'Guild War Tournament Announcement',
      date: '2025-02-01',
      category: 'event',
      excerpt: 'Register your guild for the upcoming Guild War Tournament! Amazing prizes await the victors.',
      content: 'Calling all guilds! The first Guild War Tournament is coming next month. Prove your guild\'s strength...'
    },
    {
      id: 5,
      title: 'Valentine\'s Day Special Event',
      date: '2025-02-10',
      category: 'event',
      excerpt: 'Celebrate Valentine\'s Day with special quests, exclusive items, and romantic rewards!',
      content: 'Love is in the air! Join us for our Valentine\'s Day celebration with special themed quests and items...'
    },
    {
      id: 6,
      title: 'Server Maintenance - Performance Improvements',
      date: '2025-02-15',
      category: 'update',
      excerpt: 'Scheduled maintenance to improve server performance and stability. Downtime: 2 hours.',
      content: 'We will be performing server maintenance to optimize performance and fix several bugs...'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news':
        return 'bg-primary/20 text-primary';
      case 'event':
        return 'bg-accent/20 text-accent';
      case 'update':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-foreground/20 text-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-accent">
            News & Updates
          </h1>
          <p className="text-foreground/70 text-lg">
            Stay informed about the latest events, updates, and announcements
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="px-6 py-2 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-all">
            All
          </button>
          <button className="px-6 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-all">
            News
          </button>
          <button className="px-6 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-all">
            Events
          </button>
          <button className="px-6 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-all">
            Updates
          </button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <article 
              key={article.id}
              className="p-6 rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 hover:border-accent/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
                <span className="text-sm text-foreground/60">
                  {formatDate(article.date)}
                </span>
              </div>
              
              <h2 className="text-xl font-bold mb-3 text-accent">
                {article.title}
              </h2>
              
              <p className="text-foreground/70 mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <Link 
                href={`/news/${article.id}`}
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Read More 
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-12 flex justify-center gap-2">
          <button className="px-4 py-2 rounded-lg bg-primary text-white font-medium">
            1
          </button>
          <button className="px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-all">
            2
          </button>
          <button className="px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-all">
            3
          </button>
        </div>

        {/* Subscribe Section */}
        <div className="mt-16 p-8 rounded-lg border border-accent/30 bg-accent/5 text-center">
          <h3 className="text-2xl font-bold mb-3 text-accent">
            Stay Updated
          </h3>
          <p className="text-foreground/70 mb-6">
            Join our Discord community to get instant notifications about new updates and events!
          </p>
          <a
            href="https://discord.gg/lastchaos"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Discord
          </a>
        </div>
      </div>
    </div>
  );
}
