import Link from "next/link";
import { Facebook, Twitter, Youtube, Twitch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">LastChaos</h3>
            <p className="text-sm text-muted-foreground">
              Experience the ultimate MMORPG adventure in the world of LastChaos.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-primary">
                  News
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="text-muted-foreground hover:text-primary">
                  Rankings
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-muted-foreground hover:text-primary">
                  Downloads
                </Link>
              </li>
              <li>
                <Link href="/support/tickets" className="text-muted-foreground hover:text-primary">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vote" className="text-muted-foreground hover:text-primary">
                  Vote for Rewards
                </Link>
              </li>
              <li>
                <Link href="/market" className="text-muted-foreground hover:text-primary">
                  Item Shop
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Discord
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitch className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LastChaos. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
