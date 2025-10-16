import { Users, Swords, Trophy, Zap, Wallet, User, Clock, TrendingUp, Gift, Download, FileText, ExternalLink, Check, Plus, MessageSquare, ShoppingCart, ArrowLeft } from "@/lib/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[url('/assets/bg-grid.svg')] bg-cover bg-center py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Welcome to LastChaos
            </h1>
            <p className="text-xl text-text-soft mb-8 max-w-2xl mx-auto">
              Experience the legendary MMORPG with enhanced features, active community, and epic adventures.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-gradient-to-r from-primary to-primary-dark px-6 py-3 rounded-md text-black font-medium hover:opacity-90 transition">
                <Link href="/auth/register">Start Playing</Link>
              </button>
              <button className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition">
                <Link href="/downloads">Download Client</Link>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <svg className="h-12 w-12 mx-auto mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              <h3 className="text-3xl font-bold text-primary">10,000+</h3>
              <p className="text-text-soft">Active Players</p>
            </div>
            <div className="text-center">
              <Swords className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-primary">50+</h3>
              <p className="text-text-soft">Epic Dungeons</p>
            </div>
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-primary">100+</h3>
              <p className="text-text-soft">Achievements</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-primary">24/7</h3>
              <p className="text-text-soft">Server Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>Update v{i}.0 Released</CardTitle>
                  <CardDescription>Posted 2 days ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Check out the latest updates and improvements to the game...
                  </p>
                  <Button asChild variant="link" className="mt-4 px-0">
                    <Link href={`/news/${i}`}>Read More →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose LastChaos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center border border-primary/20 rounded-lg p-6 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)] transition">
              <div className="text-5xl mb-4">⚔️</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Epic Battles</h3>
              <p className="text-text-soft">
                Engage in massive PvP battles and conquer challenging dungeons
              </p>
            </div>
            <div className="text-center border border-primary/20 rounded-lg p-6 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)] transition">
              <div className="text-5xl mb-4">🏰</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Guild System</h3>
              <p className="text-text-soft">
                Build your empire with friends and dominate the realm
              </p>
            </div>
            <div className="text-center border border-primary/20 rounded-lg p-6 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)] transition">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Vast World</h3>
              <p className="text-text-soft">
                Explore diverse lands filled with mysteries and treasures
              </p>
            </div>
            <div className="text-center border border-primary/20 rounded-lg p-6 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)] transition">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Rich Rewards</h3>
              <p className="text-text-soft">
                Earn legendary items and powerful gear through your adventures
              </p>
            </div>
            <div className="text-center border border-primary/20 rounded-lg p-6 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)] transition">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Active Community</h3>
              <p className="text-text-soft">
                Join a vibrant community of players from around the world
              </p>
            </div>
            <div className="text-center border border-primary/20 rounded-lg p-6 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)] transition">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">24/7 Uptime</h3>
              <p className="text-text-soft">
                Reliable servers with constant updates and active moderation
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
