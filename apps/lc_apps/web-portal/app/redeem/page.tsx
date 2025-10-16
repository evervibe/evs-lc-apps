"use client";
import { Users, Swords, Trophy, Zap, Wallet, User, Clock, TrendingUp, Gift, Download, FileText, ExternalLink, Check, Plus, MessageSquare, ShoppingCart, ArrowLeft } from "@/lib/icons";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // TODO: Implement actual API call
      // const response = await apiClient.post("/redeem/code", { code });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      if (code.toUpperCase() === "WELCOME2024") {
        setMessage({
          type: "success",
          text: "Code redeemed successfully! You received 100 Cash.",
        });
        setCode("");
      } else {
        setMessage({
          type: "error",
          text: "Invalid or expired code. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const redeemHistory = [
    {
      code: "WELCOME2024",
      reward: "100 Cash",
      redeemed_at: "2024-01-15 14:30",
    },
    {
      code: "EVENT100",
      reward: "Experience Boost x1",
      redeemed_at: "2024-01-10 10:15",
    },
    {
      code: "NEWPLAYER",
      reward: "Health Potion x50",
      redeemed_at: "2024-01-05 18:45",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Redeem Code</h1>
        <p className="text-muted-foreground">
          Enter promotional codes to receive rewards
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Enter Code</CardTitle>
            <CardDescription>
              Codes are case-insensitive and can only be used once per account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRedeem} className="space-y-4">
              {message && (
                <div
                  className={`px-4 py-2 rounded-md text-sm ${
                    message.type === "success"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter your code here"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !code}>
                  <Gift className="h-4 w-4 mr-2" />
                  {loading ? "Redeeming..." : "Redeem"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Codes</CardTitle>
            <CardDescription>
              Currently available promotional codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono font-bold">WELCOME2024</p>
                    <p className="text-sm text-muted-foreground">100 Cash reward</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCode("WELCOME2024");
                    }}
                  >
                    Use Code
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Check our social media and events for more codes!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redeem History</CardTitle>
            <CardDescription>Your previously redeemed codes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {redeemHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-mono font-semibold">{item.code}</p>
                    <p className="text-muted-foreground">{item.reward}</p>
                  </div>
                  <p className="text-muted-foreground">{item.redeemed_at}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
