"use client";
import { Users, Swords, Trophy, Zap, Wallet, User, Clock, TrendingUp, Gift, Download, FileText, ExternalLink, Check, Plus, MessageSquare, ShoppingCart, ArrowLeft } from "@/lib/icons";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function DashboardPage() {
  // Mock data
  const userData = {
    username: "Player123",
    email: "player@example.com",
    cash: 1250,
    created_at: "2024-01-01",
    last_login: "2024-01-15",
  };

  const gameAccounts = [
    {
      id: 1,
      account_name: "MainAccount",
      characters: 5,
      last_login: "2024-01-15",
    },
    {
      id: 2,
      account_name: "AltAccount",
      characters: 2,
      last_login: "2024-01-10",
    },
  ];

  const recentActivity = [
    { action: "Purchased Health Potion x100", date: "2024-01-15 14:30" },
    { action: "Redeemed code: WELCOME2024", date: "2024-01-14 10:15" },
    { action: "Voted on TopList", date: "2024-01-13 18:45" },
    { action: "Account created", date: "2024-01-01 12:00" },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userData.username}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.cash}</div>
            <p className="text-xs text-muted-foreground">Available for purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Game Accounts</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gameAccounts.length}</div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(userData.created_at).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">Registration date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Login</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(userData.last_login).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">Last activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Accounts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Game Accounts</CardTitle>
          <CardDescription>Your in-game accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gameAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{account.account_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {account.characters} characters
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last login</p>
                  <p className="text-sm font-medium">
                    {new Date(account.last_login).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-sm">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
