"use client";
import { Users, Swords, Trophy, Zap, Wallet, User, Clock, TrendingUp, Gift, Download, FileText, ExternalLink, Check, Plus, MessageSquare, ShoppingCart, ArrowLeft } from "@/lib/icons";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data
const characterRankings = Array.from({ length: 100 }, (_, i) => ({
  rank: i + 1,
  character_name: `Player${i + 1}`,
  level: 150 - i,
  class: ["Titan", "Mage", "Healer", "Rogue"][i % 4],
  guild_name: i % 3 === 0 ? `Guild${Math.floor(i / 3) + 1}` : undefined,
  exp: 1000000 - i * 1000,
}));

const guildRankings = Array.from({ length: 50 }, (_, i) => ({
  rank: i + 1,
  guild_name: `Guild${i + 1}`,
  level: 50 - i,
  members_count: 50 - i,
  master_name: `Master${i + 1}`,
}));

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<"characters" | "guilds">("characters");

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Rankings</h1>
        <p className="text-text-soft">
          See who tops the leaderboards
        </p>
      </div>

      {/* Warning Banner */}
      <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-md mb-6">
        ⚠ Game database not connected — showing mock data for demonstration
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "characters" ? "default" : "outline"}
          onClick={() => setActiveTab("characters")}
        >
          Characters
        </Button>
        <Button
          variant={activeTab === "guilds" ? "default" : "outline"}
          onClick={() => setActiveTab("guilds")}
        >
          Guilds
        </Button>
      </div>

      {activeTab === "characters" && (
        <Card>
          <CardHeader>
            <CardTitle>Top 100 Characters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20 bg-primary/10">
                    <th className="text-left py-3 px-4 text-primary">Rank</th>
                    <th className="text-left py-3 px-4 text-primary">Character</th>
                    <th className="text-left py-3 px-4 text-primary">Level</th>
                    <th className="text-left py-3 px-4 text-primary">Class</th>
                    <th className="text-left py-3 px-4 text-primary">Guild</th>
                    <th className="text-left py-3 px-4 text-primary">Experience</th>
                  </tr>
                </thead>
                <tbody>
                  {characterRankings.slice(0, 20).map((char) => (
                    <tr key={char.rank} className="border-b border-primary/20 hover:bg-primary/5">
                      <td className={`py-3 px-4 font-bold ${char.rank <= 3 ? "text-primary drop-shadow-[0_0_10px_rgba(234,209,159,0.5)]" : ""}`}>
                        #{char.rank}
                      </td>
                      <td className="py-3 px-4">{char.character_name}</td>
                      <td className="py-3 px-4">{char.level}</td>
                      <td className="py-3 px-4">{char.class}</td>
                      <td className="py-3 px-4">{char.guild_name || "-"}</td>
                      <td className="py-3 px-4">{char.exp.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "guilds" && (
        <Card>
          <CardHeader>
            <CardTitle>Top 50 Guilds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20 bg-primary/10">
                    <th className="text-left py-3 px-4 text-primary">Rank</th>
                    <th className="text-left py-3 px-4 text-primary">Guild Name</th>
                    <th className="text-left py-3 px-4 text-primary">Level</th>
                    <th className="text-left py-3 px-4 text-primary">Members</th>
                    <th className="text-left py-3 px-4 text-primary">Guild Master</th>
                  </tr>
                </thead>
                <tbody>
                  {guildRankings.slice(0, 20).map((guild) => (
                    <tr key={guild.rank} className="border-b border-primary/20 hover:bg-primary/5">
                      <td className={`py-3 px-4 font-bold ${guild.rank <= 3 ? "text-primary drop-shadow-[0_0_10px_rgba(234,209,159,0.5)]" : ""}`}>
                        #{guild.rank}
                      </td>
                      <td className="py-3 px-4">{guild.guild_name}</td>
                      <td className="py-3 px-4">{guild.level}</td>
                      <td className="py-3 px-4">{guild.members_count}</td>
                      <td className="py-3 px-4">{guild.master_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
