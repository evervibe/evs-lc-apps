'use client';

import { useState, useEffect } from 'react';

interface RankingEntry {
  rank: number;
  characterName?: string;
  guildName?: string;
  level: number;
  job?: number;
  jobName?: string;
  memberCount?: number;
  score: number;
  totalScore?: number;
}

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<'level' | 'pvp' | 'guild'>('level');
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    fetchRankings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/rankings?type=${activeTab}&limit=100`);
      const data = await res.json();
      
      if (data.success) {
        setRankings(data.rankings);
        setIsMock(data.mock || false);
      }
    } catch (error) {
      console.error('Failed to fetch rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'level' as const, name: 'Players', icon: '👤' },
    { id: 'guild' as const, name: 'Guilds', icon: '⚔️' },
    { id: 'pvp' as const, name: 'PVP', icon: '🏆' },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-primary font-serif">
            Rankings
          </h1>
          <p className="text-text-soft text-lg max-w-2xl mx-auto">
            Compete with the best players and guilds. Climb the ladder and earn your place among legends.
          </p>
        </div>

        {/* Mock Warning */}
        {isMock && (
          <div className="mb-8 p-4 bg-primary/10 border border-primary/30 rounded-lg text-center">
            <p className="text-primary text-sm">
              ⚠️ Game database not connected - showing mock data for demonstration
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-8 border-b border-primary/20">
          <div className="flex gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-text-soft hover:text-foreground'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-card rounded-lg border border-primary/20 overflow-hidden shadow-[0_2px_8px_rgba(234,209,159,0.1)]">
          {loading ? (
            <div className="p-12 text-center">
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
                <span>Loading rankings...</span>
              </div>
            </div>
          ) : rankings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-foreground/60">No rankings available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary/10 border-b border-primary/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary">
                      {activeTab === 'guild' ? 'Guild' : 'Character'}
                    </th>
                    {activeTab !== 'guild' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary">
                          Class
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary">
                          Guild
                        </th>
                      </>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary">
                      Level
                    </th>
                    {activeTab === 'guild' && (
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary">
                        Members
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary">
                      {activeTab === 'pvp' ? 'Kills' : 'Score'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {rankings.map(entry => (
                    <tr
                      key={entry.rank}
                      className="hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`font-bold ${
                            entry.rank === 1
                              ? 'text-primary drop-shadow-[0_0_10px_rgba(234,209,159,0.6)]'
                              : entry.rank === 2
                              ? 'text-text-soft'
                              : entry.rank === 3
                              ? 'text-primary-dark'
                              : 'text-foreground'
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {activeTab === 'guild' ? entry.guildName : entry.characterName}
                      </td>
                      {activeTab !== 'guild' && (
                        <>
                          <td className="px-4 py-3 text-sm text-text-soft">
                            {entry.jobName || 'Unknown'}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground/70">
                            {entry.guildName || '-'}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-3 text-accent font-semibold">
                        {entry.level}
                      </td>
                      {activeTab === 'guild' && (
                        <td className="px-4 py-3 text-foreground/70">
                          {entry.memberCount || 0}
                        </td>
                      )}
                      <td className="px-4 py-3 text-foreground/70">
                        {(entry.totalScore || entry.score).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h3 className="text-lg font-semibold mb-3 text-accent">Real-Time Updates</h3>
            <p className="text-foreground/60 text-sm">
              Rankings are updated in real-time based on character progress and achievements.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h3 className="text-lg font-semibold mb-3 text-accent">Fair Competition</h3>
            <p className="text-foreground/60 text-sm">
              All rankings are calculated using official game server data to ensure fairness.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h3 className="text-lg font-semibold mb-3 text-accent">Earn Recognition</h3>
            <p className="text-foreground/60 text-sm">
              Top players and guilds receive special badges and recognition in the community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
