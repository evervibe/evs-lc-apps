"use client";
import { Users, Swords, Trophy, Zap, Wallet, User, Clock, TrendingUp, Gift, Download, FileText, ExternalLink, Check, Plus, MessageSquare, ShoppingCart, ArrowLeft } from "@/lib/icons";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


const voteSites = [
  {
    id: 1,
    name: "TopMMORPG",
    url: "https://example.com/vote1",
    reward_cash: 50,
    cooldown_hours: 24,
    can_vote: true,
    next_vote_at: null,
  },
  {
    id: 2,
    name: "MMOList",
    url: "https://example.com/vote2",
    reward_cash: 30,
    cooldown_hours: 12,
    can_vote: false,
    next_vote_at: "2024-01-16T10:30:00",
  },
  {
    id: 3,
    name: "GameVote",
    url: "https://example.com/vote3",
    reward_cash: 40,
    cooldown_hours: 24,
    can_vote: true,
    next_vote_at: null,
  },
  {
    id: 4,
    name: "RPGVotes",
    url: "https://example.com/vote4",
    reward_cash: 25,
    cooldown_hours: 6,
    can_vote: false,
    next_vote_at: "2024-01-15T20:00:00",
  },
];

export default function VotePage() {
  const handleVote = (site: any) => {
    // TODO: Track vote and open URL
    window.open(site.url, "_blank");
  };

  const getTimeUntilNextVote = (nextVoteAt: string | null) => {
    if (!nextVoteAt) return null;
    const now = new Date();
    const next = new Date(nextVoteAt);
    const diff = next.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Vote for Rewards</h1>
        <p className="text-muted-foreground">
          Support the server by voting on top lists and earn cash rewards
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Click on a vote site button below</p>
            <p>2. Complete the voting process on the external site</p>
            <p>3. Receive your cash reward automatically</p>
            <p>4. Each site has a cooldown period before you can vote again</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {voteSites.map((site) => (
          <Card key={site.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{site.name}</CardTitle>
                {site.can_vote ? (
                  <span className="flex items-center text-sm text-green-500">
                    <Check className="h-4 w-4 mr-1" />
                    Available
                  </span>
                ) : (
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    On Cooldown
                  </span>
                )}
              </div>
              <CardDescription>
                Cooldown: {site.cooldown_hours} hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    +{site.reward_cash} Cash
                  </p>
                  {!site.can_vote && site.next_vote_at && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Next vote in: {getTimeUntilNextVote(site.next_vote_at)}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleVote(site)}
                  disabled={!site.can_vote}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Vote Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Vote History</CardTitle>
          <CardDescription>Your recent votes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Voted on TopMMORPG</span>
              <div className="text-right">
                <span className="text-green-500">+50 Cash</span>
                <p className="text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Voted on GameVote</span>
              <div className="text-right">
                <span className="text-green-500">+40 Cash</span>
                <p className="text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Voted on RPGVotes</span>
              <div className="text-right">
                <span className="text-green-500">+25 Cash</span>
                <p className="text-muted-foreground">8 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
