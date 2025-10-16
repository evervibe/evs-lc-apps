'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface VoteSite {
  id: string;
  name: string;
  url: string;
  canVote: boolean;
  nextVoteTime: number;
  cooldown: number;
}

export default function VotePage() {
  const { data: session } = useSession();
  const [sites, setSites] = useState<VoteSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchVoteSites();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchVoteSites = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/voting');
      const data = await res.json();
      
      if (data.success) {
        setSites(data.sites);
      }
    } catch (error) {
      console.error('Failed to fetch vote sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (siteId: string) => {
    if (!session) {
      alert('Please login to vote');
      return;
    }

    setVoting(siteId);
    try {
      const res = await fetch('/api/voting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId }),
      });

      const data = await res.json();
      
      if (data.success) {
        // Open voting site in new tab
        window.open(data.redirectUrl, '_blank');
        
        // Show success message
        alert(`Vote recorded! You received: ${data.rewards.coins} coins, ${data.rewards.exp} exp`);
        
        // Refresh vote status
        await fetchVoteSites();
      } else {
        alert('Vote failed: ' + data.error);
      }
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to process vote');
    } finally {
      setVoting(null);
    }
  };

  const formatTimeRemaining = (nextVoteTime: number): string => {
    const now = Date.now();
    const diff = nextVoteTime - now;
    
    if (diff <= 0) return 'Available';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-accent">
            Vote for Rewards
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Support our server by voting on top server lists. Earn rewards for each vote!
          </p>
        </div>

        {!session ? (
          <div className="max-w-md mx-auto p-8 rounded-lg border border-foreground/10 bg-foreground/5 text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
            <p className="text-foreground/70 mb-6">
              You need to be logged in to vote and earn rewards.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Login to Vote
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Loading vote sites...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Vote Sites */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {sites.map(site => (
                <div
                  key={site.id}
                  className="p-6 rounded-lg border border-foreground/10 bg-foreground/5"
                >
                  <h3 className="text-xl font-semibold mb-4">{site.name}</h3>
                  
                  <div className="mb-4">
                    <div className="text-sm text-foreground/60 mb-2">
                      Cooldown: {site.cooldown / 3600}h
                    </div>
                    {!site.canVote && (
                      <div className="text-sm text-foreground/60">
                        Next vote: {formatTimeRemaining(site.nextVoteTime)}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleVote(site.id)}
                    disabled={!site.canVote || voting === site.id}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      site.canVote && voting !== site.id
                        ? 'bg-accent text-background hover:opacity-90'
                        : 'bg-foreground/10 text-foreground/40 cursor-not-allowed'
                    }`}
                  >
                    {voting === site.id ? 'Processing...' : site.canVote ? 'Vote Now' : 'On Cooldown'}
                  </button>
                </div>
              ))}
            </div>

            {/* Rewards Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-foreground/10 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-semibold mb-2 text-accent">Coins</h3>
                <p className="text-foreground/60 text-sm">
                  Earn 10 coins per vote to spend in the shop
                </p>
              </div>
              <div className="p-6 rounded-lg border border-foreground/10 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="text-3xl mb-3">⭐</div>
                <h3 className="text-lg font-semibold mb-2 text-accent">Experience</h3>
                <p className="text-foreground/60 text-sm">
                  Get 1,000 bonus EXP to level up faster
                </p>
              </div>
              <div className="p-6 rounded-lg border border-foreground/10 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="text-lg font-semibold mb-2 text-accent">Support</h3>
                <p className="text-foreground/60 text-sm">
                  Help us grow by increasing our server ranking
                </p>
              </div>
            </div>
          </>
        )}

        {/* Info Section */}
        <div className="mt-12 p-8 rounded-lg border border-accent/30 bg-accent/5">
          <h3 className="text-2xl font-bold mb-4 text-accent">How Voting Works</h3>
          <div className="space-y-3 text-foreground/70">
            <p>1. Click &quot;Vote Now&quot; on any available site</p>
            <p>2. You&apos;ll be redirected to the voting site in a new tab</p>
            <p>3. Complete the voting process on their website</p>
            <p>4. Your rewards will be automatically added to your account</p>
            <p>5. Each site has a cooldown period before you can vote again</p>
          </div>
        </div>
      </div>
    </div>
  );
}
