import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Swords, Trophy, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/20 to-background py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Welcome to LastChaos
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the ultimate MMORPG adventure. Join thousands of players in epic battles,
              conquer dungeons, and become a legend.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/register">Start Playing</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/downloads">Download Client</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold">10,000+</h3>
              <p className="text-muted-foreground">Active Players</p>
            </div>
            <div className="text-center">
              <Swords className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold">50+</h3>
              <p className="text-muted-foreground">Epic Dungeons</p>
            </div>
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold">100+</h3>
              <p className="text-muted-foreground">Achievements</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold">24/7</h3>
              <p className="text-muted-foreground">Server Uptime</p>
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
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Active Community</h3>
              <p className="text-muted-foreground">
                Join a vibrant community of players from around the world
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Swords className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Epic Battles</h3>
              <p className="text-muted-foreground">
                Engage in massive PvP battles and conquer challenging dungeons
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Play</h3>
              <p className="text-muted-foreground">
                Balanced gameplay with regular updates and active moderation
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
