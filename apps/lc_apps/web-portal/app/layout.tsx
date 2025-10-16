import { Users, Swords, Trophy, Zap, Wallet, User, Clock, TrendingUp, Gift, Download, FileText, ExternalLink, Check, Plus, MessageSquare, ShoppingCart, ArrowLeft } from "@/lib/icons";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "LastChaos - Epic MMORPG Experience",
  description: "Join the legendary LastChaos MMORPG. Experience epic battles, build guilds, and conquer the world with thousands of active players.",
  keywords: "LastChaos, MMORPG, MMO, online game, RPG, multiplayer",
  manifest: "/manifest.json",
  openGraph: {
    title: "LastChaos - Epic MMORPG Experience",
    description: "Join the legendary LastChaos MMORPG. Experience epic battles, build guilds, and conquer the world.",
    type: "website",
    siteName: "LastChaos",
  },
  twitter: {
    card: "summary_large_image",
    title: "LastChaos - Epic MMORPG Experience",
    description: "Join the legendary LastChaos MMORPG. Experience epic battles, build guilds, and conquer the world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
